import {
  GqlModuleOptions,
  GraphQLModule,
  GraphQLTypesLoader,
} from '@nestjs/graphql';
import {
  buildSchema,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  isEnumType,
  isListType,
  isNonNullType,
  isObjectType,
} from 'graphql';

import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

import { printSchema } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';
import { DynamicModule } from '@nestjs/common';
import { ErrorResult } from '../graphql-types';

export interface GraphQLApiOptions {
  apiType: 'api';
  typePaths: string[];
  apiPath: string;
  debug: boolean;
  introspection: boolean;
  playground: boolean | any;
}

export function configureGraphQLModule(
  getOptions: () => GraphQLApiOptions,
): DynamicModule {
  return GraphQLModule.forRootAsync({
    useFactory: (typesLoader: GraphQLTypesLoader) => {
      return buildGraphQLOptions(typesLoader, getOptions());
    },
    inject: [GraphQLTypesLoader],
    imports: [],
  });
}
async function buildGraphQLOptions(
  typesLoader: GraphQLTypesLoader,
  options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
  return {
    path: '/' + options.apiPath,
    typeDefs: await buildTypeDefs(),
    resolvers: buildResolvers(),
    playground: options.playground || false,
    debug: options.debug || false,
    introspection: options.introspection,
    context: (req: any) => req,
    cors: {
      origin: 'https://analytics-app-aa.herokuapp.com',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
    },
    plugins: [],
  } as GqlModuleOptions;

  async function buildTypeDefs(): Promise<string> {
    const normalizedPaths = options.typePaths;
    const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);

    let schema = buildSchema(typeDefs);
    schema = generateListOptions(schema);
    return printSchema(schema);
  }

  function generateListOptions(
    typeDefsOrSchema: string | GraphQLSchema,
  ): GraphQLSchema {
    const schema =
      typeof typeDefsOrSchema === 'string'
        ? buildSchema(typeDefsOrSchema)
        : typeDefsOrSchema;
    const queryType = schema.getQueryType();
    if (!queryType) {
      return schema;
    }
    const objectTypes = Object.values(schema.getTypeMap()).filter(isObjectType);
    const allFields = objectTypes.reduce((fields, type) => {
      const typeFields = Object.values(type.getFields()).filter((f) =>
        resolveListQueryType(f.type),
      );
      return [...fields, ...typeFields];
    }, [] as Array<GraphQLField<any, any>>);
    const generatedTypes: GraphQLNamedType[] = [];

    for (const query of allFields) {
      const targetTypeName = resolveNonNullType(query.type)
        .toString()
        .replace(/List$/, '');
      const targetType = schema.getType(targetTypeName);
      if (targetType && isObjectType(targetType)) {
        const sortParameter = buildSortParameter(schema, targetType);
        const filterParameter = buildFilterParameter(schema, targetType);
        const existingListOptions = schema.getType(
          `${targetTypeName}ListOptions`,
        ) as GraphQLInputObjectType | null;

        const generatedListOptions = new GraphQLInputObjectType({
          name: `${targetTypeName}ListOptions`,
          fields: {
            skip: { type: GraphQLInt },
            take: { type: GraphQLInt },
            sort: { type: sortParameter },
            filter: { type: filterParameter },
            ...(existingListOptions ? existingListOptions.getFields() : {}),
          },
        });

        if (
          !query.args.find(
            (a) => a.type.toString() === `${targetTypeName}ListOptions`,
          )
        ) {
          query.args.push({
            name: 'options',
            type: generatedListOptions,
            description: null,
            defaultValue: null,
            extensions: null,
            astNode: null,
            deprecationReason: null,
          });
        }

        generatedTypes.push(filterParameter);
        generatedTypes.push(sortParameter);
        generatedTypes.push(generatedListOptions);
      }
    }
    return stitchSchemas({ subschemas: [schema], types: generatedTypes });
  }

  function resolveListQueryType(
    type: GraphQLOutputType,
  ): type is GraphQLObjectType {
    const innerType = resolveNonNullType(type);
    return (
      isObjectType(innerType) &&
      !!innerType.getInterfaces().find((i) => i.name === 'PaginatedList')
    );
  }

  function resolveNonNullType(type: GraphQLOutputType): GraphQLNamedType {
    if (isNonNullType(type)) {
      return type.ofType;
    }
    return type;
  }

  function buildResolvers() {
    const dummyResolveType = {
      __resolveType() {
        return null;
      },
    };

    const commonResolvers = {
      JSON: GraphQLJSON,
      DateTime: GraphQLDateTime,
      Node: dummyResolveType,
      PaginatedList: dummyResolveType,
      ErrorResult: {
        __resolveType(value: ErrorResult) {
          return value;
        },
      },
    };

    return commonResolvers;
  }

  function buildSortParameter(
    schema: GraphQLSchema,
    targetType: GraphQLObjectType,
  ) {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const SortOrder = schema.getType('SortOrder') as GraphQLEnumType;

    const sortableTypes = ['String', 'Int', 'Float', 'DateTime'];
    return new GraphQLInputObjectType({
      name: `${targetTypeName}SortParameter`,
      fields: fields
        .filter((field) =>
          sortableTypes.includes(resolveNonNullType(field.type).name),
        )
        .reduce((result, field) => {
          const fieldConfig: GraphQLInputFieldConfig = {
            type: SortOrder,
          };
          return {
            ...result,
            [field.name]: fieldConfig,
          };
        }, {} as GraphQLInputFieldConfigMap),
    });
  }

  function buildFilterParameter(
    schema: GraphQLSchema,
    targetType: GraphQLObjectType,
  ): GraphQLInputObjectType {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const {
      StringOperators,
      BooleanOperators,
      NumberOperators,
      DateOperators,
    } = getCommonTypes(schema);

    return new GraphQLInputObjectType({
      name: `${targetTypeName}FilterParameter`,
      fields: fields.reduce((result, field) => {
        const filterType = getFilterType(field);
        if (!filterType) {
          return result;
        }
        const fieldConfig: GraphQLInputFieldConfig = {
          type: filterType,
        };
        return {
          ...result,
          [field.name]: fieldConfig,
        };
      }, {} as GraphQLInputFieldConfigMap),
    });

    function getFilterType(
      field: GraphQLField<any, any>,
    ): GraphQLInputType | undefined {
      if (isListType(field.type)) {
        return;
      }
      const innerType = resolveNonNullType(field.type);
      if (isEnumType(innerType)) {
        return StringOperators;
      }
      switch (innerType.name) {
        case 'String':
          return StringOperators;
        case 'Boolean':
          return BooleanOperators;
        case 'Int':
        case 'Float':
          return NumberOperators;
        case 'DateTime':
          return DateOperators;
        default:
          return;
      }
    }
  }

  function getCommonTypes(schema: GraphQLSchema) {
    const SortOrder = schema.getType('SortOrder') as GraphQLEnumType | null;
    const StringOperators = schema.getType(
      'StringOperators',
    ) as GraphQLInputType | null;
    const BooleanOperators = schema.getType(
      'BooleanOperators',
    ) as GraphQLInputType | null;
    const NumberRange = schema.getType(
      'NumberRange',
    ) as GraphQLInputType | null;
    const NumberOperators = schema.getType(
      'NumberOperators',
    ) as GraphQLInputType | null;
    const DateRange = schema.getType('DateRange') as GraphQLInputType | null;
    const DateOperators = schema.getType(
      'DateOperators',
    ) as GraphQLInputType | null;
    if (
      !SortOrder ||
      !StringOperators ||
      !BooleanOperators ||
      !NumberRange ||
      !NumberOperators ||
      !DateRange ||
      !DateOperators
    ) {
      throw new Error(`A common type was not defined`);
    }
    return {
      SortOrder,
      StringOperators,
      BooleanOperators,
      NumberOperators,
      DateOperators,
    };
  }
}
