/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Project
 *
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>;
/**
 * Model Environment
 *
 */
export type Environment = $Result.DefaultSelection<Prisma.$EnvironmentPayload>;
/**
 * Model ApiCall
 *
 */
export type ApiCall = $Result.DefaultSelection<Prisma.$ApiCallPayload>;
/**
 * Model AlertRule
 *
 */
export type AlertRule = $Result.DefaultSelection<Prisma.$AlertRulePayload>;
/**
 * Model AuditLog
 *
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number },
  ): $Utils.JsPromise<R>;

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(
    command: Prisma.InputJsonObject,
  ): Prisma.PrismaPromise<Prisma.JsonObject>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.environment`: Exposes CRUD operations for the **Environment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Environments
   * const environments = await prisma.environment.findMany()
   * ```
   */
  get environment(): Prisma.EnvironmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiCall`: Exposes CRUD operations for the **ApiCall** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ApiCalls
   * const apiCalls = await prisma.apiCall.findMany()
   * ```
   */
  get apiCall(): Prisma.ApiCallDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alertRule`: Exposes CRUD operations for the **AlertRule** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AlertRules
   * const alertRules = await prisma.alertRule.findMany()
   * ```
   */
  get alertRule(): Prisma.AlertRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AuditLogs
   * const auditLogs = await prisma.auditLog.findMany()
   * ```
   */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends bigint
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Project: 'Project';
    Environment: 'Environment';
    ApiCall: 'ApiCall';
    AlertRule: 'AlertRule';
    AuditLog: 'AuditLog';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'user'
        | 'project'
        | 'environment'
        | 'apiCall'
        | 'alertRule'
        | 'auditLog';
      txIsolationLevel: never;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>;
        fields: Prisma.ProjectFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[];
          };
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>;
          };
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProject>;
          };
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProjectGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.ProjectFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.ProjectAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>;
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number;
          };
        };
      };
      Environment: {
        payload: Prisma.$EnvironmentPayload<ExtArgs>;
        fields: Prisma.EnvironmentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.EnvironmentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.EnvironmentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          findFirst: {
            args: Prisma.EnvironmentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.EnvironmentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          findMany: {
            args: Prisma.EnvironmentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[];
          };
          create: {
            args: Prisma.EnvironmentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          createMany: {
            args: Prisma.EnvironmentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.EnvironmentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          update: {
            args: Prisma.EnvironmentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          deleteMany: {
            args: Prisma.EnvironmentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.EnvironmentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.EnvironmentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>;
          };
          aggregate: {
            args: Prisma.EnvironmentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateEnvironment>;
          };
          groupBy: {
            args: Prisma.EnvironmentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<EnvironmentGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.EnvironmentFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.EnvironmentAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.EnvironmentCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<EnvironmentCountAggregateOutputType>
              | number;
          };
        };
      };
      ApiCall: {
        payload: Prisma.$ApiCallPayload<ExtArgs>;
        fields: Prisma.ApiCallFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ApiCallFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ApiCallFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          findFirst: {
            args: Prisma.ApiCallFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ApiCallFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          findMany: {
            args: Prisma.ApiCallFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>[];
          };
          create: {
            args: Prisma.ApiCallCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          createMany: {
            args: Prisma.ApiCallCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.ApiCallDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          update: {
            args: Prisma.ApiCallUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          deleteMany: {
            args: Prisma.ApiCallDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ApiCallUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ApiCallUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ApiCallPayload>;
          };
          aggregate: {
            args: Prisma.ApiCallAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateApiCall>;
          };
          groupBy: {
            args: Prisma.ApiCallGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ApiCallGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.ApiCallFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.ApiCallAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.ApiCallCountArgs<ExtArgs>;
            result: $Utils.Optional<ApiCallCountAggregateOutputType> | number;
          };
        };
      };
      AlertRule: {
        payload: Prisma.$AlertRulePayload<ExtArgs>;
        fields: Prisma.AlertRuleFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AlertRuleFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AlertRuleFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          findFirst: {
            args: Prisma.AlertRuleFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AlertRuleFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          findMany: {
            args: Prisma.AlertRuleFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>[];
          };
          create: {
            args: Prisma.AlertRuleCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          createMany: {
            args: Prisma.AlertRuleCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.AlertRuleDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          update: {
            args: Prisma.AlertRuleUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          deleteMany: {
            args: Prisma.AlertRuleDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AlertRuleUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.AlertRuleUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AlertRulePayload>;
          };
          aggregate: {
            args: Prisma.AlertRuleAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAlertRule>;
          };
          groupBy: {
            args: Prisma.AlertRuleGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AlertRuleGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.AlertRuleFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.AlertRuleAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.AlertRuleCountArgs<ExtArgs>;
            result: $Utils.Optional<AlertRuleCountAggregateOutputType> | number;
          };
        };
      };
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>;
        fields: Prisma.AuditLogFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
          };
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAuditLog>;
          };
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AuditLogGroupByOutputType>[];
          };
          findRaw: {
            args: Prisma.AuditLogFindRawArgs<ExtArgs>;
            result: JsonObject;
          };
          aggregateRaw: {
            args: Prisma.AuditLogAggregateRawArgs<ExtArgs>;
            result: JsonObject;
          };
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>;
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject;
          result: Prisma.JsonObject;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    project?: ProjectOmit;
    environment?: EnvironmentOmit;
    apiCall?: ApiCallOmit;
    alertRule?: AlertRuleOmit;
    auditLog?: AuditLogOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number;
    apiCalls: number;
    alertRules: number;
    auditLogs: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs;
    apiCalls?: boolean | UserCountOutputTypeCountApiCallsArgs;
    alertRules?: boolean | UserCountOutputTypeCountAlertRulesArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ApiCallWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAlertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput;
  };

  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    apiCalls: number;
    environments: number;
    alertRules: number;
    auditLogs: number;
  };

  export type ProjectCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    apiCalls?: boolean | ProjectCountOutputTypeCountApiCallsArgs;
    environments?: boolean | ProjectCountOutputTypeCountEnvironmentsArgs;
    alertRules?: boolean | ProjectCountOutputTypeCountAlertRulesArgs;
    auditLogs?: boolean | ProjectCountOutputTypeCountAuditLogsArgs;
  };

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountApiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ApiCallWhereInput;
  };

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountEnvironmentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EnvironmentWhereInput;
  };

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountAlertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
  };

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountAuditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput;
  };

  /**
   * Count Type EnvironmentCountOutputType
   */

  export type EnvironmentCountOutputType = {
    apiCalls: number;
  };

  export type EnvironmentCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    apiCalls?: boolean | EnvironmentCountOutputTypeCountApiCallsArgs;
  };

  // Custom InputTypes
  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EnvironmentCountOutputType
     */
    select?: EnvironmentCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeCountApiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ApiCallWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    sdkToken: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    sdkToken: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    name: number;
    sdkToken: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    sdkToken?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    sdkToken?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    sdkToken?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserWhereInput;
    orderBy?:
      | UserOrderByWithAggregationInput
      | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    name: string | null;
    sdkToken: string;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      sdkToken?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      projects?: boolean | User$projectsArgs<ExtArgs>;
      apiCalls?: boolean | User$apiCallsArgs<ExtArgs>;
      alertRules?: boolean | User$alertRulesArgs<ExtArgs>;
      auditLogs?: boolean | User$auditLogsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    name?: boolean;
    sdkToken?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UserOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'email'
    | 'password'
    | 'name'
    | 'sdkToken'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['user']
  >;
  export type UserInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    projects?: boolean | User$projectsArgs<ExtArgs>;
    apiCalls?: boolean | User$apiCallsArgs<ExtArgs>;
    alertRules?: boolean | User$alertRulesArgs<ExtArgs>;
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $UserPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'User';
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[];
      apiCalls: Prisma.$ApiCallPayload<ExtArgs>[];
      alertRules: Prisma.$AlertRulePayload<ExtArgs>[];
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        password: string;
        name: string | null;
        sdkToken: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
    $Result.GetResult<Prisma.$UserPayload, S>;

  type UserCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['User'];
      meta: { name: 'User' };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAggregateRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetUserGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    projects<T extends User$projectsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$projectsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    apiCalls<T extends User$apiCallsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$apiCallsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ApiCallPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    alertRules<T extends User$alertRulesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$alertRulesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AlertRulePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$auditLogsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AuditLogPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly password: FieldRef<'User', 'String'>;
    readonly name: FieldRef<'User', 'String'>;
    readonly sdkToken: FieldRef<'User', 'String'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly updatedAt: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User create
   */
  export type UserCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
  };

  /**
   * User update
   */
  export type UserUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User findRaw
   */
  export type UserFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * User.projects
   */
  export type User$projectsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    where?: ProjectWhereInput;
    orderBy?:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[];
    cursor?: ProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
  };

  /**
   * User.apiCalls
   */
  export type User$apiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    where?: ApiCallWhereInput;
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    cursor?: ApiCallWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * User.alertRules
   */
  export type User$alertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    where?: AlertRuleWhereInput;
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    cursor?: AlertRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    where?: AuditLogWhereInput;
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    cursor?: AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
  };

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null;
    _min: ProjectMinAggregateOutputType | null;
    _max: ProjectMaxAggregateOutputType | null;
  };

  export type ProjectMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    slug: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProjectMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    slug: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProjectCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    slug: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ProjectMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    slug?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProjectMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    slug?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProjectCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    slug?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ProjectAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Projects
     **/
    _count?: true | ProjectCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectMaxAggregateInputType;
  };

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
    [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>;
  };

  export type ProjectGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectWhereInput;
    orderBy?:
      | ProjectOrderByWithAggregationInput
      | ProjectOrderByWithAggregationInput[];
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum;
    having?: ProjectScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectCountAggregateInputType | true;
    _min?: ProjectMinAggregateInputType;
    _max?: ProjectMaxAggregateInputType;
  };

  export type ProjectGroupByOutputType = {
    id: string;
    name: string;
    description: string | null;
    slug: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ProjectCountAggregateOutputType | null;
    _min: ProjectMinAggregateOutputType | null;
    _max: ProjectMaxAggregateOutputType | null;
  };

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProjectGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProjectGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>;
        }
      >
    >;

  export type ProjectSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      slug?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      apiCalls?: boolean | Project$apiCallsArgs<ExtArgs>;
      environments?: boolean | Project$environmentsArgs<ExtArgs>;
      alertRules?: boolean | Project$alertRulesArgs<ExtArgs>;
      auditLogs?: boolean | Project$auditLogsArgs<ExtArgs>;
      _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['project']
  >;

  export type ProjectSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    slug?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ProjectOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'name'
    | 'description'
    | 'slug'
    | 'userId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['project']
  >;
  export type ProjectInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    apiCalls?: boolean | Project$apiCallsArgs<ExtArgs>;
    environments?: boolean | Project$environmentsArgs<ExtArgs>;
    alertRules?: boolean | Project$alertRulesArgs<ExtArgs>;
    auditLogs?: boolean | Project$auditLogsArgs<ExtArgs>;
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $ProjectPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Project';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      apiCalls: Prisma.$ApiCallPayload<ExtArgs>[];
      environments: Prisma.$EnvironmentPayload<ExtArgs>[];
      alertRules: Prisma.$AlertRulePayload<ExtArgs>[];
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        description: string | null;
        slug: string | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['project']
    >;
    composites: {};
  };

  type ProjectGetPayload<
    S extends boolean | null | undefined | ProjectDefaultArgs,
  > = $Result.GetResult<Prisma.$ProjectPayload, S>;

  type ProjectCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectCountAggregateInputType | true;
  };

  export interface ProjectDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Project'];
      meta: { name: 'Project' };
    };
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(
      args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(
      args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     *
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectFindManyArgs>(
      args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     *
     */
    create<T extends ProjectCreateArgs>(
      args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectCreateManyArgs>(
      args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     *
     */
    delete<T extends ProjectDeleteArgs>(
      args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectUpdateArgs>(
      args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectDeleteManyArgs>(
      args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectUpdateManyArgs>(
      args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(
      args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Projects that matches the filter.
     * @param {ProjectFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const project = await prisma.project.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProjectFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a Project.
     * @param {ProjectAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const project = await prisma.project.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: ProjectAggregateRawArgs,
    ): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
     **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectAggregateArgs>(
      args: Subset<T, ProjectAggregateArgs>,
    ): Prisma.PrismaPromise<GetProjectAggregateType<T>>;

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetProjectGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Project model
     */
    readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    apiCalls<T extends Project$apiCallsArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$apiCallsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ApiCallPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    environments<T extends Project$environmentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$environmentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$EnvironmentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    alertRules<T extends Project$alertRulesArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$alertRulesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AlertRulePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    auditLogs<T extends Project$auditLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$auditLogsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AuditLogPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<'Project', 'String'>;
    readonly name: FieldRef<'Project', 'String'>;
    readonly description: FieldRef<'Project', 'String'>;
    readonly slug: FieldRef<'Project', 'String'>;
    readonly userId: FieldRef<'Project', 'String'>;
    readonly createdAt: FieldRef<'Project', 'DateTime'>;
    readonly updatedAt: FieldRef<'Project', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput;
  };

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput;
  };

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
  };

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
  };

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number;
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[];
  };

  /**
   * Project create
   */
  export type ProjectCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>;
  };

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[];
  };

  /**
   * Project update
   */
  export type ProjectUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>;
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput;
  };

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>;
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput;
    /**
     * Limit how many Projects to update.
     */
    limit?: number;
  };

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput;
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>;
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>;
  };

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput;
  };

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput;
    /**
     * Limit how many Projects to delete.
     */
    limit?: number;
  };

  /**
   * Project findRaw
   */
  export type ProjectFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * Project aggregateRaw
   */
  export type ProjectAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * Project.apiCalls
   */
  export type Project$apiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    where?: ApiCallWhereInput;
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    cursor?: ApiCallWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * Project.environments
   */
  export type Project$environmentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    where?: EnvironmentWhereInput;
    orderBy?:
      | EnvironmentOrderByWithRelationInput
      | EnvironmentOrderByWithRelationInput[];
    cursor?: EnvironmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[];
  };

  /**
   * Project.alertRules
   */
  export type Project$alertRulesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    where?: AlertRuleWhereInput;
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    cursor?: AlertRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * Project.auditLogs
   */
  export type Project$auditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    where?: AuditLogWhereInput;
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    cursor?: AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
  };

  /**
   * Model Environment
   */

  export type AggregateEnvironment = {
    _count: EnvironmentCountAggregateOutputType | null;
    _min: EnvironmentMinAggregateOutputType | null;
    _max: EnvironmentMaxAggregateOutputType | null;
  };

  export type EnvironmentMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    label: string | null;
    color: string | null;
    projectId: string | null;
    createdAt: Date | null;
  };

  export type EnvironmentMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    label: string | null;
    color: string | null;
    projectId: string | null;
    createdAt: Date | null;
  };

  export type EnvironmentCountAggregateOutputType = {
    id: number;
    name: number;
    label: number;
    color: number;
    projectId: number;
    createdAt: number;
    _all: number;
  };

  export type EnvironmentMinAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    color?: true;
    projectId?: true;
    createdAt?: true;
  };

  export type EnvironmentMaxAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    color?: true;
    projectId?: true;
    createdAt?: true;
  };

  export type EnvironmentCountAggregateInputType = {
    id?: true;
    name?: true;
    label?: true;
    color?: true;
    projectId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type EnvironmentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Environment to aggregate.
     */
    where?: EnvironmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Environments to fetch.
     */
    orderBy?:
      | EnvironmentOrderByWithRelationInput
      | EnvironmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EnvironmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Environments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Environments
     **/
    _count?: true | EnvironmentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EnvironmentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EnvironmentMaxAggregateInputType;
  };

  export type GetEnvironmentAggregateType<T extends EnvironmentAggregateArgs> =
    {
      [P in keyof T & keyof AggregateEnvironment]: P extends '_count' | 'count'
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateEnvironment[P]>
        : GetScalarType<T[P], AggregateEnvironment[P]>;
    };

  export type EnvironmentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EnvironmentWhereInput;
    orderBy?:
      | EnvironmentOrderByWithAggregationInput
      | EnvironmentOrderByWithAggregationInput[];
    by: EnvironmentScalarFieldEnum[] | EnvironmentScalarFieldEnum;
    having?: EnvironmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EnvironmentCountAggregateInputType | true;
    _min?: EnvironmentMinAggregateInputType;
    _max?: EnvironmentMaxAggregateInputType;
  };

  export type EnvironmentGroupByOutputType = {
    id: string;
    name: string;
    label: string;
    color: string;
    projectId: string;
    createdAt: Date;
    _count: EnvironmentCountAggregateOutputType | null;
    _min: EnvironmentMinAggregateOutputType | null;
    _max: EnvironmentMaxAggregateOutputType | null;
  };

  type GetEnvironmentGroupByPayload<T extends EnvironmentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<EnvironmentGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof EnvironmentGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>
            : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>;
        }
      >
    >;

  export type EnvironmentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      label?: boolean;
      color?: boolean;
      projectId?: boolean;
      createdAt?: boolean;
      project?: boolean | ProjectDefaultArgs<ExtArgs>;
      apiCalls?: boolean | Environment$apiCallsArgs<ExtArgs>;
      _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['environment']
  >;

  export type EnvironmentSelectScalar = {
    id?: boolean;
    name?: boolean;
    label?: boolean;
    color?: boolean;
    projectId?: boolean;
    createdAt?: boolean;
  };

  export type EnvironmentOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'name' | 'label' | 'color' | 'projectId' | 'createdAt',
    ExtArgs['result']['environment']
  >;
  export type EnvironmentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>;
    apiCalls?: boolean | Environment$apiCallsArgs<ExtArgs>;
    _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $EnvironmentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Environment';
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>;
      apiCalls: Prisma.$ApiCallPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        label: string;
        color: string;
        projectId: string;
        createdAt: Date;
      },
      ExtArgs['result']['environment']
    >;
    composites: {};
  };

  type EnvironmentGetPayload<
    S extends boolean | null | undefined | EnvironmentDefaultArgs,
  > = $Result.GetResult<Prisma.$EnvironmentPayload, S>;

  type EnvironmentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    EnvironmentFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: EnvironmentCountAggregateInputType | true;
  };

  export interface EnvironmentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Environment'];
      meta: { name: 'Environment' };
    };
    /**
     * Find zero or one Environment that matches the filter.
     * @param {EnvironmentFindUniqueArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnvironmentFindUniqueArgs>(
      args: SelectSubset<T, EnvironmentFindUniqueArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Environment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnvironmentFindUniqueOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnvironmentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EnvironmentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Environment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnvironmentFindFirstArgs>(
      args?: SelectSubset<T, EnvironmentFindFirstArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Environment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnvironmentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EnvironmentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Environments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Environments
     * const environments = await prisma.environment.findMany()
     *
     * // Get first 10 Environments
     * const environments = await prisma.environment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const environmentWithIdOnly = await prisma.environment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EnvironmentFindManyArgs>(
      args?: SelectSubset<T, EnvironmentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Environment.
     * @param {EnvironmentCreateArgs} args - Arguments to create a Environment.
     * @example
     * // Create one Environment
     * const Environment = await prisma.environment.create({
     *   data: {
     *     // ... data to create a Environment
     *   }
     * })
     *
     */
    create<T extends EnvironmentCreateArgs>(
      args: SelectSubset<T, EnvironmentCreateArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Environments.
     * @param {EnvironmentCreateManyArgs} args - Arguments to create many Environments.
     * @example
     * // Create many Environments
     * const environment = await prisma.environment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EnvironmentCreateManyArgs>(
      args?: SelectSubset<T, EnvironmentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a Environment.
     * @param {EnvironmentDeleteArgs} args - Arguments to delete one Environment.
     * @example
     * // Delete one Environment
     * const Environment = await prisma.environment.delete({
     *   where: {
     *     // ... filter to delete one Environment
     *   }
     * })
     *
     */
    delete<T extends EnvironmentDeleteArgs>(
      args: SelectSubset<T, EnvironmentDeleteArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Environment.
     * @param {EnvironmentUpdateArgs} args - Arguments to update one Environment.
     * @example
     * // Update one Environment
     * const environment = await prisma.environment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EnvironmentUpdateArgs>(
      args: SelectSubset<T, EnvironmentUpdateArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Environments.
     * @param {EnvironmentDeleteManyArgs} args - Arguments to filter Environments to delete.
     * @example
     * // Delete a few Environments
     * const { count } = await prisma.environment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EnvironmentDeleteManyArgs>(
      args?: SelectSubset<T, EnvironmentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Environments
     * const environment = await prisma.environment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EnvironmentUpdateManyArgs>(
      args: SelectSubset<T, EnvironmentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Environment.
     * @param {EnvironmentUpsertArgs} args - Arguments to update or create a Environment.
     * @example
     * // Update or create a Environment
     * const environment = await prisma.environment.upsert({
     *   create: {
     *     // ... data to create a Environment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Environment we want to update
     *   }
     * })
     */
    upsert<T extends EnvironmentUpsertArgs>(
      args: SelectSubset<T, EnvironmentUpsertArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Environments that matches the filter.
     * @param {EnvironmentFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const environment = await prisma.environment.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: EnvironmentFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a Environment.
     * @param {EnvironmentAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const environment = await prisma.environment.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: EnvironmentAggregateRawArgs,
    ): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentCountArgs} args - Arguments to filter Environments to count.
     * @example
     * // Count the number of Environments
     * const count = await prisma.environment.count({
     *   where: {
     *     // ... the filter for the Environments we want to count
     *   }
     * })
     **/
    count<T extends EnvironmentCountArgs>(
      args?: Subset<T, EnvironmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnvironmentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EnvironmentAggregateArgs>(
      args: Subset<T, EnvironmentAggregateArgs>,
    ): Prisma.PrismaPromise<GetEnvironmentAggregateType<T>>;

    /**
     * Group by Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EnvironmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnvironmentGroupByArgs['orderBy'] }
        : { orderBy?: EnvironmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, EnvironmentGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetEnvironmentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Environment model
     */
    readonly fields: EnvironmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Environment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnvironmentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    apiCalls<T extends Environment$apiCallsArgs<ExtArgs> = {}>(
      args?: Subset<T, Environment$apiCallsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ApiCallPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Environment model
   */
  interface EnvironmentFieldRefs {
    readonly id: FieldRef<'Environment', 'String'>;
    readonly name: FieldRef<'Environment', 'String'>;
    readonly label: FieldRef<'Environment', 'String'>;
    readonly color: FieldRef<'Environment', 'String'>;
    readonly projectId: FieldRef<'Environment', 'String'>;
    readonly createdAt: FieldRef<'Environment', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Environment findUnique
   */
  export type EnvironmentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput;
  };

  /**
   * Environment findUniqueOrThrow
   */
  export type EnvironmentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput;
  };

  /**
   * Environment findFirst
   */
  export type EnvironmentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Environments to fetch.
     */
    orderBy?:
      | EnvironmentOrderByWithRelationInput
      | EnvironmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Environments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[];
  };

  /**
   * Environment findFirstOrThrow
   */
  export type EnvironmentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Environments to fetch.
     */
    orderBy?:
      | EnvironmentOrderByWithRelationInput
      | EnvironmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Environments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[];
  };

  /**
   * Environment findMany
   */
  export type EnvironmentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter, which Environments to fetch.
     */
    where?: EnvironmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Environments to fetch.
     */
    orderBy?:
      | EnvironmentOrderByWithRelationInput
      | EnvironmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Environments.
     */
    cursor?: EnvironmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Environments.
     */
    skip?: number;
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[];
  };

  /**
   * Environment create
   */
  export type EnvironmentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Environment.
     */
    data: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>;
  };

  /**
   * Environment createMany
   */
  export type EnvironmentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Environments.
     */
    data: EnvironmentCreateManyInput | EnvironmentCreateManyInput[];
  };

  /**
   * Environment update
   */
  export type EnvironmentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Environment.
     */
    data: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>;
    /**
     * Choose, which Environment to update.
     */
    where: EnvironmentWhereUniqueInput;
  };

  /**
   * Environment updateMany
   */
  export type EnvironmentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Environments.
     */
    data: XOR<
      EnvironmentUpdateManyMutationInput,
      EnvironmentUncheckedUpdateManyInput
    >;
    /**
     * Filter which Environments to update
     */
    where?: EnvironmentWhereInput;
    /**
     * Limit how many Environments to update.
     */
    limit?: number;
  };

  /**
   * Environment upsert
   */
  export type EnvironmentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Environment to update in case it exists.
     */
    where: EnvironmentWhereUniqueInput;
    /**
     * In case the Environment found by the `where` argument doesn't exist, create a new Environment with this data.
     */
    create: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>;
    /**
     * In case the Environment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>;
  };

  /**
   * Environment delete
   */
  export type EnvironmentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    /**
     * Filter which Environment to delete.
     */
    where: EnvironmentWhereUniqueInput;
  };

  /**
   * Environment deleteMany
   */
  export type EnvironmentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Environments to delete
     */
    where?: EnvironmentWhereInput;
    /**
     * Limit how many Environments to delete.
     */
    limit?: number;
  };

  /**
   * Environment findRaw
   */
  export type EnvironmentFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * Environment aggregateRaw
   */
  export type EnvironmentAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * Environment.apiCalls
   */
  export type Environment$apiCallsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    where?: ApiCallWhereInput;
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    cursor?: ApiCallWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * Environment without action
   */
  export type EnvironmentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
  };

  /**
   * Model ApiCall
   */

  export type AggregateApiCall = {
    _count: ApiCallCountAggregateOutputType | null;
    _avg: ApiCallAvgAggregateOutputType | null;
    _sum: ApiCallSumAggregateOutputType | null;
    _min: ApiCallMinAggregateOutputType | null;
    _max: ApiCallMaxAggregateOutputType | null;
  };

  export type ApiCallAvgAggregateOutputType = {
    statusCode: number | null;
    responseSize: number | null;
    latency: number | null;
  };

  export type ApiCallSumAggregateOutputType = {
    statusCode: number | null;
    responseSize: number | null;
    latency: number | null;
  };

  export type ApiCallMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    environmentId: string | null;
    method: string | null;
    url: string | null;
    host: string | null;
    path: string | null;
    statusCode: number | null;
    statusText: string | null;
    responseSize: number | null;
    latency: number | null;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string | null;
    sdkVersion: string | null;
    hostname: string | null;
    createdAt: Date | null;
  };

  export type ApiCallMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    environmentId: string | null;
    method: string | null;
    url: string | null;
    host: string | null;
    path: string | null;
    statusCode: number | null;
    statusText: string | null;
    responseSize: number | null;
    latency: number | null;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string | null;
    sdkVersion: string | null;
    hostname: string | null;
    createdAt: Date | null;
  };

  export type ApiCallCountAggregateOutputType = {
    id: number;
    projectId: number;
    userId: number;
    environmentId: number;
    method: number;
    url: number;
    host: number;
    path: number;
    requestHeaders: number;
    requestBody: number;
    queryParams: number;
    statusCode: number;
    statusText: number;
    responseHeaders: number;
    responseBody: number;
    responseSize: number;
    latency: number;
    startedAt: number;
    endedAt: number;
    status: number;
    sdkVersion: number;
    hostname: number;
    createdAt: number;
    _all: number;
  };

  export type ApiCallAvgAggregateInputType = {
    statusCode?: true;
    responseSize?: true;
    latency?: true;
  };

  export type ApiCallSumAggregateInputType = {
    statusCode?: true;
    responseSize?: true;
    latency?: true;
  };

  export type ApiCallMinAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    environmentId?: true;
    method?: true;
    url?: true;
    host?: true;
    path?: true;
    statusCode?: true;
    statusText?: true;
    responseSize?: true;
    latency?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
    sdkVersion?: true;
    hostname?: true;
    createdAt?: true;
  };

  export type ApiCallMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    environmentId?: true;
    method?: true;
    url?: true;
    host?: true;
    path?: true;
    statusCode?: true;
    statusText?: true;
    responseSize?: true;
    latency?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
    sdkVersion?: true;
    hostname?: true;
    createdAt?: true;
  };

  export type ApiCallCountAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    environmentId?: true;
    method?: true;
    url?: true;
    host?: true;
    path?: true;
    requestHeaders?: true;
    requestBody?: true;
    queryParams?: true;
    statusCode?: true;
    statusText?: true;
    responseHeaders?: true;
    responseBody?: true;
    responseSize?: true;
    latency?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
    sdkVersion?: true;
    hostname?: true;
    createdAt?: true;
    _all?: true;
  };

  export type ApiCallAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ApiCall to aggregate.
     */
    where?: ApiCallWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ApiCalls to fetch.
     */
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ApiCallWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ApiCalls from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ApiCalls.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ApiCalls
     **/
    _count?: true | ApiCallCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ApiCallAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ApiCallSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ApiCallMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ApiCallMaxAggregateInputType;
  };

  export type GetApiCallAggregateType<T extends ApiCallAggregateArgs> = {
    [P in keyof T & keyof AggregateApiCall]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiCall[P]>
      : GetScalarType<T[P], AggregateApiCall[P]>;
  };

  export type ApiCallGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ApiCallWhereInput;
    orderBy?:
      | ApiCallOrderByWithAggregationInput
      | ApiCallOrderByWithAggregationInput[];
    by: ApiCallScalarFieldEnum[] | ApiCallScalarFieldEnum;
    having?: ApiCallScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ApiCallCountAggregateInputType | true;
    _avg?: ApiCallAvgAggregateInputType;
    _sum?: ApiCallSumAggregateInputType;
    _min?: ApiCallMinAggregateInputType;
    _max?: ApiCallMaxAggregateInputType;
  };

  export type ApiCallGroupByOutputType = {
    id: string;
    projectId: string;
    userId: string;
    environmentId: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders: JsonValue | null;
    requestBody: JsonValue | null;
    queryParams: JsonValue | null;
    statusCode: number | null;
    statusText: string | null;
    responseHeaders: JsonValue | null;
    responseBody: JsonValue | null;
    responseSize: number | null;
    latency: number;
    startedAt: Date;
    endedAt: Date;
    status: string;
    sdkVersion: string | null;
    hostname: string | null;
    createdAt: Date;
    _count: ApiCallCountAggregateOutputType | null;
    _avg: ApiCallAvgAggregateOutputType | null;
    _sum: ApiCallSumAggregateOutputType | null;
    _min: ApiCallMinAggregateOutputType | null;
    _max: ApiCallMaxAggregateOutputType | null;
  };

  type GetApiCallGroupByPayload<T extends ApiCallGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ApiCallGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ApiCallGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiCallGroupByOutputType[P]>
            : GetScalarType<T[P], ApiCallGroupByOutputType[P]>;
        }
      >
    >;

  export type ApiCallSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      projectId?: boolean;
      userId?: boolean;
      environmentId?: boolean;
      method?: boolean;
      url?: boolean;
      host?: boolean;
      path?: boolean;
      requestHeaders?: boolean;
      requestBody?: boolean;
      queryParams?: boolean;
      statusCode?: boolean;
      statusText?: boolean;
      responseHeaders?: boolean;
      responseBody?: boolean;
      responseSize?: boolean;
      latency?: boolean;
      startedAt?: boolean;
      endedAt?: boolean;
      status?: boolean;
      sdkVersion?: boolean;
      hostname?: boolean;
      createdAt?: boolean;
      project?: boolean | ProjectDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      environment?: boolean | ApiCall$environmentArgs<ExtArgs>;
    },
    ExtArgs['result']['apiCall']
  >;

  export type ApiCallSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    environmentId?: boolean;
    method?: boolean;
    url?: boolean;
    host?: boolean;
    path?: boolean;
    requestHeaders?: boolean;
    requestBody?: boolean;
    queryParams?: boolean;
    statusCode?: boolean;
    statusText?: boolean;
    responseHeaders?: boolean;
    responseBody?: boolean;
    responseSize?: boolean;
    latency?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    status?: boolean;
    sdkVersion?: boolean;
    hostname?: boolean;
    createdAt?: boolean;
  };

  export type ApiCallOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'projectId'
    | 'userId'
    | 'environmentId'
    | 'method'
    | 'url'
    | 'host'
    | 'path'
    | 'requestHeaders'
    | 'requestBody'
    | 'queryParams'
    | 'statusCode'
    | 'statusText'
    | 'responseHeaders'
    | 'responseBody'
    | 'responseSize'
    | 'latency'
    | 'startedAt'
    | 'endedAt'
    | 'status'
    | 'sdkVersion'
    | 'hostname'
    | 'createdAt',
    ExtArgs['result']['apiCall']
  >;
  export type ApiCallInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
    environment?: boolean | ApiCall$environmentArgs<ExtArgs>;
  };

  export type $ApiCallPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ApiCall';
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>;
      user: Prisma.$UserPayload<ExtArgs>;
      environment: Prisma.$EnvironmentPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        projectId: string;
        userId: string;
        environmentId: string | null;
        method: string;
        url: string;
        host: string;
        path: string;
        requestHeaders: Prisma.JsonValue | null;
        requestBody: Prisma.JsonValue | null;
        queryParams: Prisma.JsonValue | null;
        statusCode: number | null;
        statusText: string | null;
        responseHeaders: Prisma.JsonValue | null;
        responseBody: Prisma.JsonValue | null;
        responseSize: number | null;
        latency: number;
        startedAt: Date;
        endedAt: Date;
        status: string;
        sdkVersion: string | null;
        hostname: string | null;
        createdAt: Date;
      },
      ExtArgs['result']['apiCall']
    >;
    composites: {};
  };

  type ApiCallGetPayload<
    S extends boolean | null | undefined | ApiCallDefaultArgs,
  > = $Result.GetResult<Prisma.$ApiCallPayload, S>;

  type ApiCallCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ApiCallFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ApiCallCountAggregateInputType | true;
  };

  export interface ApiCallDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ApiCall'];
      meta: { name: 'ApiCall' };
    };
    /**
     * Find zero or one ApiCall that matches the filter.
     * @param {ApiCallFindUniqueArgs} args - Arguments to find a ApiCall
     * @example
     * // Get one ApiCall
     * const apiCall = await prisma.apiCall.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiCallFindUniqueArgs>(
      args: SelectSubset<T, ApiCallFindUniqueArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one ApiCall that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiCallFindUniqueOrThrowArgs} args - Arguments to find a ApiCall
     * @example
     * // Get one ApiCall
     * const apiCall = await prisma.apiCall.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiCallFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ApiCallFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ApiCall that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallFindFirstArgs} args - Arguments to find a ApiCall
     * @example
     * // Get one ApiCall
     * const apiCall = await prisma.apiCall.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiCallFindFirstArgs>(
      args?: SelectSubset<T, ApiCallFindFirstArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ApiCall that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallFindFirstOrThrowArgs} args - Arguments to find a ApiCall
     * @example
     * // Get one ApiCall
     * const apiCall = await prisma.apiCall.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiCallFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ApiCallFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ApiCalls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiCalls
     * const apiCalls = await prisma.apiCall.findMany()
     *
     * // Get first 10 ApiCalls
     * const apiCalls = await prisma.apiCall.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const apiCallWithIdOnly = await prisma.apiCall.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ApiCallFindManyArgs>(
      args?: SelectSubset<T, ApiCallFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a ApiCall.
     * @param {ApiCallCreateArgs} args - Arguments to create a ApiCall.
     * @example
     * // Create one ApiCall
     * const ApiCall = await prisma.apiCall.create({
     *   data: {
     *     // ... data to create a ApiCall
     *   }
     * })
     *
     */
    create<T extends ApiCallCreateArgs>(
      args: SelectSubset<T, ApiCallCreateArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many ApiCalls.
     * @param {ApiCallCreateManyArgs} args - Arguments to create many ApiCalls.
     * @example
     * // Create many ApiCalls
     * const apiCall = await prisma.apiCall.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ApiCallCreateManyArgs>(
      args?: SelectSubset<T, ApiCallCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a ApiCall.
     * @param {ApiCallDeleteArgs} args - Arguments to delete one ApiCall.
     * @example
     * // Delete one ApiCall
     * const ApiCall = await prisma.apiCall.delete({
     *   where: {
     *     // ... filter to delete one ApiCall
     *   }
     * })
     *
     */
    delete<T extends ApiCallDeleteArgs>(
      args: SelectSubset<T, ApiCallDeleteArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one ApiCall.
     * @param {ApiCallUpdateArgs} args - Arguments to update one ApiCall.
     * @example
     * // Update one ApiCall
     * const apiCall = await prisma.apiCall.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ApiCallUpdateArgs>(
      args: SelectSubset<T, ApiCallUpdateArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more ApiCalls.
     * @param {ApiCallDeleteManyArgs} args - Arguments to filter ApiCalls to delete.
     * @example
     * // Delete a few ApiCalls
     * const { count } = await prisma.apiCall.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ApiCallDeleteManyArgs>(
      args?: SelectSubset<T, ApiCallDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ApiCalls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiCalls
     * const apiCall = await prisma.apiCall.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ApiCallUpdateManyArgs>(
      args: SelectSubset<T, ApiCallUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one ApiCall.
     * @param {ApiCallUpsertArgs} args - Arguments to update or create a ApiCall.
     * @example
     * // Update or create a ApiCall
     * const apiCall = await prisma.apiCall.upsert({
     *   create: {
     *     // ... data to create a ApiCall
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiCall we want to update
     *   }
     * })
     */
    upsert<T extends ApiCallUpsertArgs>(
      args: SelectSubset<T, ApiCallUpsertArgs<ExtArgs>>,
    ): Prisma__ApiCallClient<
      $Result.GetResult<
        Prisma.$ApiCallPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ApiCalls that matches the filter.
     * @param {ApiCallFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const apiCall = await prisma.apiCall.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ApiCallFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a ApiCall.
     * @param {ApiCallAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const apiCall = await prisma.apiCall.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: ApiCallAggregateRawArgs,
    ): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of ApiCalls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallCountArgs} args - Arguments to filter ApiCalls to count.
     * @example
     * // Count the number of ApiCalls
     * const count = await prisma.apiCall.count({
     *   where: {
     *     // ... the filter for the ApiCalls we want to count
     *   }
     * })
     **/
    count<T extends ApiCallCountArgs>(
      args?: Subset<T, ApiCallCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiCallCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ApiCall.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ApiCallAggregateArgs>(
      args: Subset<T, ApiCallAggregateArgs>,
    ): Prisma.PrismaPromise<GetApiCallAggregateType<T>>;

    /**
     * Group by ApiCall.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCallGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ApiCallGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiCallGroupByArgs['orderBy'] }
        : { orderBy?: ApiCallGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ApiCallGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetApiCallGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ApiCall model
     */
    readonly fields: ApiCallFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiCall.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiCallClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    environment<T extends ApiCall$environmentArgs<ExtArgs> = {}>(
      args?: Subset<T, ApiCall$environmentArgs<ExtArgs>>,
    ): Prisma__EnvironmentClient<
      $Result.GetResult<
        Prisma.$EnvironmentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ApiCall model
   */
  interface ApiCallFieldRefs {
    readonly id: FieldRef<'ApiCall', 'String'>;
    readonly projectId: FieldRef<'ApiCall', 'String'>;
    readonly userId: FieldRef<'ApiCall', 'String'>;
    readonly environmentId: FieldRef<'ApiCall', 'String'>;
    readonly method: FieldRef<'ApiCall', 'String'>;
    readonly url: FieldRef<'ApiCall', 'String'>;
    readonly host: FieldRef<'ApiCall', 'String'>;
    readonly path: FieldRef<'ApiCall', 'String'>;
    readonly requestHeaders: FieldRef<'ApiCall', 'Json'>;
    readonly requestBody: FieldRef<'ApiCall', 'Json'>;
    readonly queryParams: FieldRef<'ApiCall', 'Json'>;
    readonly statusCode: FieldRef<'ApiCall', 'Int'>;
    readonly statusText: FieldRef<'ApiCall', 'String'>;
    readonly responseHeaders: FieldRef<'ApiCall', 'Json'>;
    readonly responseBody: FieldRef<'ApiCall', 'Json'>;
    readonly responseSize: FieldRef<'ApiCall', 'Int'>;
    readonly latency: FieldRef<'ApiCall', 'Int'>;
    readonly startedAt: FieldRef<'ApiCall', 'DateTime'>;
    readonly endedAt: FieldRef<'ApiCall', 'DateTime'>;
    readonly status: FieldRef<'ApiCall', 'String'>;
    readonly sdkVersion: FieldRef<'ApiCall', 'String'>;
    readonly hostname: FieldRef<'ApiCall', 'String'>;
    readonly createdAt: FieldRef<'ApiCall', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * ApiCall findUnique
   */
  export type ApiCallFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter, which ApiCall to fetch.
     */
    where: ApiCallWhereUniqueInput;
  };

  /**
   * ApiCall findUniqueOrThrow
   */
  export type ApiCallFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter, which ApiCall to fetch.
     */
    where: ApiCallWhereUniqueInput;
  };

  /**
   * ApiCall findFirst
   */
  export type ApiCallFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter, which ApiCall to fetch.
     */
    where?: ApiCallWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ApiCalls to fetch.
     */
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ApiCalls.
     */
    cursor?: ApiCallWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ApiCalls from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ApiCalls.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ApiCalls.
     */
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * ApiCall findFirstOrThrow
   */
  export type ApiCallFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter, which ApiCall to fetch.
     */
    where?: ApiCallWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ApiCalls to fetch.
     */
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ApiCalls.
     */
    cursor?: ApiCallWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ApiCalls from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ApiCalls.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ApiCalls.
     */
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * ApiCall findMany
   */
  export type ApiCallFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter, which ApiCalls to fetch.
     */
    where?: ApiCallWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ApiCalls to fetch.
     */
    orderBy?:
      | ApiCallOrderByWithRelationInput
      | ApiCallOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ApiCalls.
     */
    cursor?: ApiCallWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ApiCalls from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ApiCalls.
     */
    skip?: number;
    distinct?: ApiCallScalarFieldEnum | ApiCallScalarFieldEnum[];
  };

  /**
   * ApiCall create
   */
  export type ApiCallCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * The data needed to create a ApiCall.
     */
    data: XOR<ApiCallCreateInput, ApiCallUncheckedCreateInput>;
  };

  /**
   * ApiCall createMany
   */
  export type ApiCallCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ApiCalls.
     */
    data: ApiCallCreateManyInput | ApiCallCreateManyInput[];
  };

  /**
   * ApiCall update
   */
  export type ApiCallUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * The data needed to update a ApiCall.
     */
    data: XOR<ApiCallUpdateInput, ApiCallUncheckedUpdateInput>;
    /**
     * Choose, which ApiCall to update.
     */
    where: ApiCallWhereUniqueInput;
  };

  /**
   * ApiCall updateMany
   */
  export type ApiCallUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ApiCalls.
     */
    data: XOR<ApiCallUpdateManyMutationInput, ApiCallUncheckedUpdateManyInput>;
    /**
     * Filter which ApiCalls to update
     */
    where?: ApiCallWhereInput;
    /**
     * Limit how many ApiCalls to update.
     */
    limit?: number;
  };

  /**
   * ApiCall upsert
   */
  export type ApiCallUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * The filter to search for the ApiCall to update in case it exists.
     */
    where: ApiCallWhereUniqueInput;
    /**
     * In case the ApiCall found by the `where` argument doesn't exist, create a new ApiCall with this data.
     */
    create: XOR<ApiCallCreateInput, ApiCallUncheckedCreateInput>;
    /**
     * In case the ApiCall was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiCallUpdateInput, ApiCallUncheckedUpdateInput>;
  };

  /**
   * ApiCall delete
   */
  export type ApiCallDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
    /**
     * Filter which ApiCall to delete.
     */
    where: ApiCallWhereUniqueInput;
  };

  /**
   * ApiCall deleteMany
   */
  export type ApiCallDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ApiCalls to delete
     */
    where?: ApiCallWhereInput;
    /**
     * Limit how many ApiCalls to delete.
     */
    limit?: number;
  };

  /**
   * ApiCall findRaw
   */
  export type ApiCallFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * ApiCall aggregateRaw
   */
  export type ApiCallAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * ApiCall.environment
   */
  export type ApiCall$environmentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null;
    where?: EnvironmentWhereInput;
  };

  /**
   * ApiCall without action
   */
  export type ApiCallDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ApiCall
     */
    select?: ApiCallSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ApiCall
     */
    omit?: ApiCallOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiCallInclude<ExtArgs> | null;
  };

  /**
   * Model AlertRule
   */

  export type AggregateAlertRule = {
    _count: AlertRuleCountAggregateOutputType | null;
    _avg: AlertRuleAvgAggregateOutputType | null;
    _sum: AlertRuleSumAggregateOutputType | null;
    _min: AlertRuleMinAggregateOutputType | null;
    _max: AlertRuleMaxAggregateOutputType | null;
  };

  export type AlertRuleAvgAggregateOutputType = {
    threshold: number | null;
    windowMin: number | null;
  };

  export type AlertRuleSumAggregateOutputType = {
    threshold: number | null;
    windowMin: number | null;
  };

  export type AlertRuleMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    name: string | null;
    metric: string | null;
    operator: string | null;
    threshold: number | null;
    windowMin: number | null;
    enabled: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AlertRuleMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    name: string | null;
    metric: string | null;
    operator: string | null;
    threshold: number | null;
    windowMin: number | null;
    enabled: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AlertRuleCountAggregateOutputType = {
    id: number;
    projectId: number;
    userId: number;
    name: number;
    metric: number;
    operator: number;
    threshold: number;
    windowMin: number;
    enabled: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AlertRuleAvgAggregateInputType = {
    threshold?: true;
    windowMin?: true;
  };

  export type AlertRuleSumAggregateInputType = {
    threshold?: true;
    windowMin?: true;
  };

  export type AlertRuleMinAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    name?: true;
    metric?: true;
    operator?: true;
    threshold?: true;
    windowMin?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AlertRuleMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    name?: true;
    metric?: true;
    operator?: true;
    threshold?: true;
    windowMin?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AlertRuleCountAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    name?: true;
    metric?: true;
    operator?: true;
    threshold?: true;
    windowMin?: true;
    enabled?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AlertRuleAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AlertRule to aggregate.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AlertRules
     **/
    _count?: true | AlertRuleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AlertRuleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AlertRuleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AlertRuleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AlertRuleMaxAggregateInputType;
  };

  export type GetAlertRuleAggregateType<T extends AlertRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateAlertRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlertRule[P]>
      : GetScalarType<T[P], AggregateAlertRule[P]>;
  };

  export type AlertRuleGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AlertRuleWhereInput;
    orderBy?:
      | AlertRuleOrderByWithAggregationInput
      | AlertRuleOrderByWithAggregationInput[];
    by: AlertRuleScalarFieldEnum[] | AlertRuleScalarFieldEnum;
    having?: AlertRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AlertRuleCountAggregateInputType | true;
    _avg?: AlertRuleAvgAggregateInputType;
    _sum?: AlertRuleSumAggregateInputType;
    _min?: AlertRuleMinAggregateInputType;
    _max?: AlertRuleMaxAggregateInputType;
  };

  export type AlertRuleGroupByOutputType = {
    id: string;
    projectId: string;
    userId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AlertRuleCountAggregateOutputType | null;
    _avg: AlertRuleAvgAggregateOutputType | null;
    _sum: AlertRuleSumAggregateOutputType | null;
    _min: AlertRuleMinAggregateOutputType | null;
    _max: AlertRuleMaxAggregateOutputType | null;
  };

  type GetAlertRuleGroupByPayload<T extends AlertRuleGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AlertRuleGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AlertRuleGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertRuleGroupByOutputType[P]>
            : GetScalarType<T[P], AlertRuleGroupByOutputType[P]>;
        }
      >
    >;

  export type AlertRuleSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      projectId?: boolean;
      userId?: boolean;
      name?: boolean;
      metric?: boolean;
      operator?: boolean;
      threshold?: boolean;
      windowMin?: boolean;
      enabled?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      project?: boolean | ProjectDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['alertRule']
  >;

  export type AlertRuleSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    name?: boolean;
    metric?: boolean;
    operator?: boolean;
    threshold?: boolean;
    windowMin?: boolean;
    enabled?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AlertRuleOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'projectId'
    | 'userId'
    | 'name'
    | 'metric'
    | 'operator'
    | 'threshold'
    | 'windowMin'
    | 'enabled'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['alertRule']
  >;
  export type AlertRuleInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $AlertRulePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AlertRule';
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>;
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        projectId: string;
        userId: string;
        name: string;
        metric: string;
        operator: string;
        threshold: number;
        windowMin: number;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['alertRule']
    >;
    composites: {};
  };

  type AlertRuleGetPayload<
    S extends boolean | null | undefined | AlertRuleDefaultArgs,
  > = $Result.GetResult<Prisma.$AlertRulePayload, S>;

  type AlertRuleCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    AlertRuleFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: AlertRuleCountAggregateInputType | true;
  };

  export interface AlertRuleDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AlertRule'];
      meta: { name: 'AlertRule' };
    };
    /**
     * Find zero or one AlertRule that matches the filter.
     * @param {AlertRuleFindUniqueArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertRuleFindUniqueArgs>(
      args: SelectSubset<T, AlertRuleFindUniqueArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AlertRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlertRuleFindUniqueOrThrowArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertRuleFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AlertRuleFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AlertRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindFirstArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertRuleFindFirstArgs>(
      args?: SelectSubset<T, AlertRuleFindFirstArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AlertRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindFirstOrThrowArgs} args - Arguments to find a AlertRule
     * @example
     * // Get one AlertRule
     * const alertRule = await prisma.alertRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertRuleFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AlertRuleFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AlertRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlertRules
     * const alertRules = await prisma.alertRule.findMany()
     *
     * // Get first 10 AlertRules
     * const alertRules = await prisma.alertRule.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const alertRuleWithIdOnly = await prisma.alertRule.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AlertRuleFindManyArgs>(
      args?: SelectSubset<T, AlertRuleFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a AlertRule.
     * @param {AlertRuleCreateArgs} args - Arguments to create a AlertRule.
     * @example
     * // Create one AlertRule
     * const AlertRule = await prisma.alertRule.create({
     *   data: {
     *     // ... data to create a AlertRule
     *   }
     * })
     *
     */
    create<T extends AlertRuleCreateArgs>(
      args: SelectSubset<T, AlertRuleCreateArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AlertRules.
     * @param {AlertRuleCreateManyArgs} args - Arguments to create many AlertRules.
     * @example
     * // Create many AlertRules
     * const alertRule = await prisma.alertRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AlertRuleCreateManyArgs>(
      args?: SelectSubset<T, AlertRuleCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AlertRule.
     * @param {AlertRuleDeleteArgs} args - Arguments to delete one AlertRule.
     * @example
     * // Delete one AlertRule
     * const AlertRule = await prisma.alertRule.delete({
     *   where: {
     *     // ... filter to delete one AlertRule
     *   }
     * })
     *
     */
    delete<T extends AlertRuleDeleteArgs>(
      args: SelectSubset<T, AlertRuleDeleteArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AlertRule.
     * @param {AlertRuleUpdateArgs} args - Arguments to update one AlertRule.
     * @example
     * // Update one AlertRule
     * const alertRule = await prisma.alertRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AlertRuleUpdateArgs>(
      args: SelectSubset<T, AlertRuleUpdateArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AlertRules.
     * @param {AlertRuleDeleteManyArgs} args - Arguments to filter AlertRules to delete.
     * @example
     * // Delete a few AlertRules
     * const { count } = await prisma.alertRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AlertRuleDeleteManyArgs>(
      args?: SelectSubset<T, AlertRuleDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AlertRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlertRules
     * const alertRule = await prisma.alertRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AlertRuleUpdateManyArgs>(
      args: SelectSubset<T, AlertRuleUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AlertRule.
     * @param {AlertRuleUpsertArgs} args - Arguments to update or create a AlertRule.
     * @example
     * // Update or create a AlertRule
     * const alertRule = await prisma.alertRule.upsert({
     *   create: {
     *     // ... data to create a AlertRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlertRule we want to update
     *   }
     * })
     */
    upsert<T extends AlertRuleUpsertArgs>(
      args: SelectSubset<T, AlertRuleUpsertArgs<ExtArgs>>,
    ): Prisma__AlertRuleClient<
      $Result.GetResult<
        Prisma.$AlertRulePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AlertRules that matches the filter.
     * @param {AlertRuleFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const alertRule = await prisma.alertRule.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AlertRuleFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a AlertRule.
     * @param {AlertRuleAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const alertRule = await prisma.alertRule.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AlertRuleAggregateRawArgs,
    ): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of AlertRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleCountArgs} args - Arguments to filter AlertRules to count.
     * @example
     * // Count the number of AlertRules
     * const count = await prisma.alertRule.count({
     *   where: {
     *     // ... the filter for the AlertRules we want to count
     *   }
     * })
     **/
    count<T extends AlertRuleCountArgs>(
      args?: Subset<T, AlertRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertRuleCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AlertRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AlertRuleAggregateArgs>(
      args: Subset<T, AlertRuleAggregateArgs>,
    ): Prisma.PrismaPromise<GetAlertRuleAggregateType<T>>;

    /**
     * Group by AlertRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AlertRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertRuleGroupByArgs['orderBy'] }
        : { orderBy?: AlertRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AlertRuleGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetAlertRuleGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AlertRule model
     */
    readonly fields: AlertRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlertRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertRuleClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AlertRule model
   */
  interface AlertRuleFieldRefs {
    readonly id: FieldRef<'AlertRule', 'String'>;
    readonly projectId: FieldRef<'AlertRule', 'String'>;
    readonly userId: FieldRef<'AlertRule', 'String'>;
    readonly name: FieldRef<'AlertRule', 'String'>;
    readonly metric: FieldRef<'AlertRule', 'String'>;
    readonly operator: FieldRef<'AlertRule', 'String'>;
    readonly threshold: FieldRef<'AlertRule', 'Float'>;
    readonly windowMin: FieldRef<'AlertRule', 'Int'>;
    readonly enabled: FieldRef<'AlertRule', 'Boolean'>;
    readonly createdAt: FieldRef<'AlertRule', 'DateTime'>;
    readonly updatedAt: FieldRef<'AlertRule', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * AlertRule findUnique
   */
  export type AlertRuleFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule findUniqueOrThrow
   */
  export type AlertRuleFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule findFirst
   */
  export type AlertRuleFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AlertRules.
     */
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule findFirstOrThrow
   */
  export type AlertRuleFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRule to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AlertRules.
     */
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule findMany
   */
  export type AlertRuleFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter, which AlertRules to fetch.
     */
    where?: AlertRuleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AlertRules to fetch.
     */
    orderBy?:
      | AlertRuleOrderByWithRelationInput
      | AlertRuleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AlertRules.
     */
    cursor?: AlertRuleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AlertRules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AlertRules.
     */
    skip?: number;
    distinct?: AlertRuleScalarFieldEnum | AlertRuleScalarFieldEnum[];
  };

  /**
   * AlertRule create
   */
  export type AlertRuleCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The data needed to create a AlertRule.
     */
    data: XOR<AlertRuleCreateInput, AlertRuleUncheckedCreateInput>;
  };

  /**
   * AlertRule createMany
   */
  export type AlertRuleCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AlertRules.
     */
    data: AlertRuleCreateManyInput | AlertRuleCreateManyInput[];
  };

  /**
   * AlertRule update
   */
  export type AlertRuleUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The data needed to update a AlertRule.
     */
    data: XOR<AlertRuleUpdateInput, AlertRuleUncheckedUpdateInput>;
    /**
     * Choose, which AlertRule to update.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule updateMany
   */
  export type AlertRuleUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AlertRules.
     */
    data: XOR<
      AlertRuleUpdateManyMutationInput,
      AlertRuleUncheckedUpdateManyInput
    >;
    /**
     * Filter which AlertRules to update
     */
    where?: AlertRuleWhereInput;
    /**
     * Limit how many AlertRules to update.
     */
    limit?: number;
  };

  /**
   * AlertRule upsert
   */
  export type AlertRuleUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * The filter to search for the AlertRule to update in case it exists.
     */
    where: AlertRuleWhereUniqueInput;
    /**
     * In case the AlertRule found by the `where` argument doesn't exist, create a new AlertRule with this data.
     */
    create: XOR<AlertRuleCreateInput, AlertRuleUncheckedCreateInput>;
    /**
     * In case the AlertRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertRuleUpdateInput, AlertRuleUncheckedUpdateInput>;
  };

  /**
   * AlertRule delete
   */
  export type AlertRuleDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
    /**
     * Filter which AlertRule to delete.
     */
    where: AlertRuleWhereUniqueInput;
  };

  /**
   * AlertRule deleteMany
   */
  export type AlertRuleDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AlertRules to delete
     */
    where?: AlertRuleWhereInput;
    /**
     * Limit how many AlertRules to delete.
     */
    limit?: number;
  };

  /**
   * AlertRule findRaw
   */
  export type AlertRuleFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * AlertRule aggregateRaw
   */
  export type AlertRuleAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * AlertRule without action
   */
  export type AlertRuleDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AlertRule
     */
    select?: AlertRuleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AlertRule
     */
    omit?: AlertRuleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertRuleInclude<ExtArgs> | null;
  };

  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
  };

  export type AuditLogMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    projectId: string | null;
    action: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
  };

  export type AuditLogMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    projectId: string | null;
    action: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
  };

  export type AuditLogCountAggregateOutputType = {
    id: number;
    userId: number;
    projectId: number;
    action: number;
    detail: number;
    ipAddress: number;
    userAgent: number;
    createdAt: number;
    _all: number;
  };

  export type AuditLogMinAggregateInputType = {
    id?: true;
    userId?: true;
    projectId?: true;
    action?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
  };

  export type AuditLogMaxAggregateInputType = {
    id?: true;
    userId?: true;
    projectId?: true;
    action?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
  };

  export type AuditLogCountAggregateInputType = {
    id?: true;
    userId?: true;
    projectId?: true;
    action?: true;
    detail?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
    _all?: true;
  };

  export type AuditLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AuditLogs
     **/
    _count?: true | AuditLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AuditLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AuditLogMaxAggregateInputType;
  };

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>;
  };

  export type AuditLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput;
    orderBy?:
      | AuditLogOrderByWithAggregationInput
      | AuditLogOrderByWithAggregationInput[];
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum;
    having?: AuditLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuditLogCountAggregateInputType | true;
    _min?: AuditLogMinAggregateInputType;
    _max?: AuditLogMaxAggregateInputType;
  };

  export type AuditLogGroupByOutputType = {
    id: string;
    userId: string;
    projectId: string | null;
    action: string;
    detail: JsonValue | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
  };

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AuditLogGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AuditLogGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>;
        }
      >
    >;

  export type AuditLogSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      projectId?: boolean;
      action?: boolean;
      detail?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      project?: boolean | AuditLog$projectArgs<ExtArgs>;
    },
    ExtArgs['result']['auditLog']
  >;

  export type AuditLogSelectScalar = {
    id?: boolean;
    userId?: boolean;
    projectId?: boolean;
    action?: boolean;
    detail?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    createdAt?: boolean;
  };

  export type AuditLogOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'projectId'
    | 'action'
    | 'detail'
    | 'ipAddress'
    | 'userAgent'
    | 'createdAt',
    ExtArgs['result']['auditLog']
  >;
  export type AuditLogInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    project?: boolean | AuditLog$projectArgs<ExtArgs>;
  };

  export type $AuditLogPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AuditLog';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      project: Prisma.$ProjectPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        projectId: string | null;
        action: string;
        detail: Prisma.JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
      },
      ExtArgs['result']['auditLog']
    >;
    composites: {};
  };

  type AuditLogGetPayload<
    S extends boolean | null | undefined | AuditLogDefaultArgs,
  > = $Result.GetResult<Prisma.$AuditLogPayload, S>;

  type AuditLogCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AuditLogCountAggregateInputType | true;
  };

  export interface AuditLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'];
      meta: { name: 'AuditLog' };
    };
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(
      args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(
      args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     *
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AuditLogFindManyArgs>(
      args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     *
     */
    create<T extends AuditLogCreateArgs>(
      args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AuditLogCreateManyArgs>(
      args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     *
     */
    delete<T extends AuditLogDeleteArgs>(
      args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AuditLogUpdateArgs>(
      args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(
      args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AuditLogUpdateManyArgs>(
      args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(
      args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>,
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AuditLogs that matches the filter.
     * @param {AuditLogFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const auditLog = await prisma.auditLog.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AuditLogFindRawArgs): Prisma.PrismaPromise<JsonObject>;

    /**
     * Perform aggregation operations on a AuditLog.
     * @param {AuditLogAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const auditLog = await prisma.auditLog.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AuditLogAggregateRawArgs,
    ): Prisma.PrismaPromise<JsonObject>;

    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
     **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AuditLogAggregateArgs>(
      args: Subset<T, AuditLogAggregateArgs>,
    ): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>;

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetAuditLogGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AuditLog model
     */
    readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    project<T extends AuditLog$projectArgs<ExtArgs> = {}>(
      args?: Subset<T, AuditLog$projectArgs<ExtArgs>>,
    ): Prisma__ProjectClient<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<'AuditLog', 'String'>;
    readonly userId: FieldRef<'AuditLog', 'String'>;
    readonly projectId: FieldRef<'AuditLog', 'String'>;
    readonly action: FieldRef<'AuditLog', 'String'>;
    readonly detail: FieldRef<'AuditLog', 'Json'>;
    readonly ipAddress: FieldRef<'AuditLog', 'String'>;
    readonly userAgent: FieldRef<'AuditLog', 'String'>;
    readonly createdAt: FieldRef<'AuditLog', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>;
  };

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[];
  };

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>;
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<
      AuditLogUpdateManyMutationInput,
      AuditLogUncheckedUpdateManyInput
    >;
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput;
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number;
  };

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput;
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>;
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>;
  };

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput;
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number;
  };

  /**
   * AuditLog findRaw
   */
  export type AuditLogFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * AuditLog aggregateRaw
   */
  export type AuditLogAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue;
  };

  /**
   * AuditLog.project
   */
  export type AuditLog$projectArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null;
    where?: ProjectWhereInput;
  };

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id';
    email: 'email';
    password: 'password';
    name: 'name';
    sdkToken: 'sdkToken';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type UserScalarFieldEnum =
    (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const ProjectScalarFieldEnum: {
    id: 'id';
    name: 'name';
    description: 'description';
    slug: 'slug';
    userId: 'userId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ProjectScalarFieldEnum =
    (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];

  export const EnvironmentScalarFieldEnum: {
    id: 'id';
    name: 'name';
    label: 'label';
    color: 'color';
    projectId: 'projectId';
    createdAt: 'createdAt';
  };

  export type EnvironmentScalarFieldEnum =
    (typeof EnvironmentScalarFieldEnum)[keyof typeof EnvironmentScalarFieldEnum];

  export const ApiCallScalarFieldEnum: {
    id: 'id';
    projectId: 'projectId';
    userId: 'userId';
    environmentId: 'environmentId';
    method: 'method';
    url: 'url';
    host: 'host';
    path: 'path';
    requestHeaders: 'requestHeaders';
    requestBody: 'requestBody';
    queryParams: 'queryParams';
    statusCode: 'statusCode';
    statusText: 'statusText';
    responseHeaders: 'responseHeaders';
    responseBody: 'responseBody';
    responseSize: 'responseSize';
    latency: 'latency';
    startedAt: 'startedAt';
    endedAt: 'endedAt';
    status: 'status';
    sdkVersion: 'sdkVersion';
    hostname: 'hostname';
    createdAt: 'createdAt';
  };

  export type ApiCallScalarFieldEnum =
    (typeof ApiCallScalarFieldEnum)[keyof typeof ApiCallScalarFieldEnum];

  export const AlertRuleScalarFieldEnum: {
    id: 'id';
    projectId: 'projectId';
    userId: 'userId';
    name: 'name';
    metric: 'metric';
    operator: 'operator';
    threshold: 'threshold';
    windowMin: 'windowMin';
    enabled: 'enabled';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type AlertRuleScalarFieldEnum =
    (typeof AlertRuleScalarFieldEnum)[keyof typeof AlertRuleScalarFieldEnum];

  export const AuditLogScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    projectId: 'projectId';
    action: 'action';
    detail: 'detail';
    ipAddress: 'ipAddress';
    userAgent: 'userAgent';
    createdAt: 'createdAt';
  };

  export type AuditLogScalarFieldEnum =
    (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    email?: StringFilter<'User'> | string;
    password?: StringFilter<'User'> | string;
    name?: StringNullableFilter<'User'> | string | null;
    sdkToken?: StringFilter<'User'> | string;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    updatedAt?: DateTimeFilter<'User'> | Date | string;
    projects?: ProjectListRelationFilter;
    apiCalls?: ApiCallListRelationFilter;
    alertRules?: AlertRuleListRelationFilter;
    auditLogs?: AuditLogListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    sdkToken?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    projects?: ProjectOrderByRelationAggregateInput;
    apiCalls?: ApiCallOrderByRelationAggregateInput;
    alertRules?: AlertRuleOrderByRelationAggregateInput;
    auditLogs?: AuditLogOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      sdkToken?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      password?: StringFilter<'User'> | string;
      name?: StringNullableFilter<'User'> | string | null;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      projects?: ProjectListRelationFilter;
      apiCalls?: ApiCallListRelationFilter;
      alertRules?: AlertRuleListRelationFilter;
      auditLogs?: AuditLogListRelationFilter;
    },
    'id' | 'email' | 'sdkToken'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    sdkToken?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    email?: StringWithAggregatesFilter<'User'> | string;
    password?: StringWithAggregatesFilter<'User'> | string;
    name?: StringNullableWithAggregatesFilter<'User'> | string | null;
    sdkToken?: StringWithAggregatesFilter<'User'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
  };

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[];
    OR?: ProjectWhereInput[];
    NOT?: ProjectWhereInput | ProjectWhereInput[];
    id?: StringFilter<'Project'> | string;
    name?: StringFilter<'Project'> | string;
    description?: StringNullableFilter<'Project'> | string | null;
    slug?: StringNullableFilter<'Project'> | string | null;
    userId?: StringFilter<'Project'> | string;
    createdAt?: DateTimeFilter<'Project'> | Date | string;
    updatedAt?: DateTimeFilter<'Project'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    apiCalls?: ApiCallListRelationFilter;
    environments?: EnvironmentListRelationFilter;
    alertRules?: AlertRuleListRelationFilter;
    auditLogs?: AuditLogListRelationFilter;
  };

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    slug?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    apiCalls?: ApiCallOrderByRelationAggregateInput;
    environments?: EnvironmentOrderByRelationAggregateInput;
    alertRules?: AlertRuleOrderByRelationAggregateInput;
    auditLogs?: AuditLogOrderByRelationAggregateInput;
  };

  export type ProjectWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ProjectWhereInput | ProjectWhereInput[];
      OR?: ProjectWhereInput[];
      NOT?: ProjectWhereInput | ProjectWhereInput[];
      name?: StringFilter<'Project'> | string;
      description?: StringNullableFilter<'Project'> | string | null;
      slug?: StringNullableFilter<'Project'> | string | null;
      userId?: StringFilter<'Project'> | string;
      createdAt?: DateTimeFilter<'Project'> | Date | string;
      updatedAt?: DateTimeFilter<'Project'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      apiCalls?: ApiCallListRelationFilter;
      environments?: EnvironmentListRelationFilter;
      alertRules?: AlertRuleListRelationFilter;
      auditLogs?: AuditLogListRelationFilter;
    },
    'id'
  >;

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    slug?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ProjectCountOrderByAggregateInput;
    _max?: ProjectMaxOrderByAggregateInput;
    _min?: ProjectMinOrderByAggregateInput;
  };

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?:
      | ProjectScalarWhereWithAggregatesInput
      | ProjectScalarWhereWithAggregatesInput[];
    OR?: ProjectScalarWhereWithAggregatesInput[];
    NOT?:
      | ProjectScalarWhereWithAggregatesInput
      | ProjectScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Project'> | string;
    name?: StringWithAggregatesFilter<'Project'> | string;
    description?: StringNullableWithAggregatesFilter<'Project'> | string | null;
    slug?: StringNullableWithAggregatesFilter<'Project'> | string | null;
    userId?: StringWithAggregatesFilter<'Project'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Project'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Project'> | Date | string;
  };

  export type EnvironmentWhereInput = {
    AND?: EnvironmentWhereInput | EnvironmentWhereInput[];
    OR?: EnvironmentWhereInput[];
    NOT?: EnvironmentWhereInput | EnvironmentWhereInput[];
    id?: StringFilter<'Environment'> | string;
    name?: StringFilter<'Environment'> | string;
    label?: StringFilter<'Environment'> | string;
    color?: StringFilter<'Environment'> | string;
    projectId?: StringFilter<'Environment'> | string;
    createdAt?: DateTimeFilter<'Environment'> | Date | string;
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
    apiCalls?: ApiCallListRelationFilter;
  };

  export type EnvironmentOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    label?: SortOrder;
    color?: SortOrder;
    projectId?: SortOrder;
    createdAt?: SortOrder;
    project?: ProjectOrderByWithRelationInput;
    apiCalls?: ApiCallOrderByRelationAggregateInput;
  };

  export type EnvironmentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: EnvironmentWhereInput | EnvironmentWhereInput[];
      OR?: EnvironmentWhereInput[];
      NOT?: EnvironmentWhereInput | EnvironmentWhereInput[];
      name?: StringFilter<'Environment'> | string;
      label?: StringFilter<'Environment'> | string;
      color?: StringFilter<'Environment'> | string;
      projectId?: StringFilter<'Environment'> | string;
      createdAt?: DateTimeFilter<'Environment'> | Date | string;
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
      apiCalls?: ApiCallListRelationFilter;
    },
    'id'
  >;

  export type EnvironmentOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    label?: SortOrder;
    color?: SortOrder;
    projectId?: SortOrder;
    createdAt?: SortOrder;
    _count?: EnvironmentCountOrderByAggregateInput;
    _max?: EnvironmentMaxOrderByAggregateInput;
    _min?: EnvironmentMinOrderByAggregateInput;
  };

  export type EnvironmentScalarWhereWithAggregatesInput = {
    AND?:
      | EnvironmentScalarWhereWithAggregatesInput
      | EnvironmentScalarWhereWithAggregatesInput[];
    OR?: EnvironmentScalarWhereWithAggregatesInput[];
    NOT?:
      | EnvironmentScalarWhereWithAggregatesInput
      | EnvironmentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Environment'> | string;
    name?: StringWithAggregatesFilter<'Environment'> | string;
    label?: StringWithAggregatesFilter<'Environment'> | string;
    color?: StringWithAggregatesFilter<'Environment'> | string;
    projectId?: StringWithAggregatesFilter<'Environment'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Environment'> | Date | string;
  };

  export type ApiCallWhereInput = {
    AND?: ApiCallWhereInput | ApiCallWhereInput[];
    OR?: ApiCallWhereInput[];
    NOT?: ApiCallWhereInput | ApiCallWhereInput[];
    id?: StringFilter<'ApiCall'> | string;
    projectId?: StringFilter<'ApiCall'> | string;
    userId?: StringFilter<'ApiCall'> | string;
    environmentId?: StringNullableFilter<'ApiCall'> | string | null;
    method?: StringFilter<'ApiCall'> | string;
    url?: StringFilter<'ApiCall'> | string;
    host?: StringFilter<'ApiCall'> | string;
    path?: StringFilter<'ApiCall'> | string;
    requestHeaders?: JsonNullableFilter<'ApiCall'>;
    requestBody?: JsonNullableFilter<'ApiCall'>;
    queryParams?: JsonNullableFilter<'ApiCall'>;
    statusCode?: IntNullableFilter<'ApiCall'> | number | null;
    statusText?: StringNullableFilter<'ApiCall'> | string | null;
    responseHeaders?: JsonNullableFilter<'ApiCall'>;
    responseBody?: JsonNullableFilter<'ApiCall'>;
    responseSize?: IntNullableFilter<'ApiCall'> | number | null;
    latency?: IntFilter<'ApiCall'> | number;
    startedAt?: DateTimeFilter<'ApiCall'> | Date | string;
    endedAt?: DateTimeFilter<'ApiCall'> | Date | string;
    status?: StringFilter<'ApiCall'> | string;
    sdkVersion?: StringNullableFilter<'ApiCall'> | string | null;
    hostname?: StringNullableFilter<'ApiCall'> | string | null;
    createdAt?: DateTimeFilter<'ApiCall'> | Date | string;
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    environment?: XOR<
      EnvironmentNullableScalarRelationFilter,
      EnvironmentWhereInput
    > | null;
  };

  export type ApiCallOrderByWithRelationInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    environmentId?: SortOrder;
    method?: SortOrder;
    url?: SortOrder;
    host?: SortOrder;
    path?: SortOrder;
    requestHeaders?: SortOrder;
    requestBody?: SortOrder;
    queryParams?: SortOrder;
    statusCode?: SortOrder;
    statusText?: SortOrder;
    responseHeaders?: SortOrder;
    responseBody?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
    startedAt?: SortOrder;
    endedAt?: SortOrder;
    status?: SortOrder;
    sdkVersion?: SortOrder;
    hostname?: SortOrder;
    createdAt?: SortOrder;
    project?: ProjectOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
    environment?: EnvironmentOrderByWithRelationInput;
  };

  export type ApiCallWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ApiCallWhereInput | ApiCallWhereInput[];
      OR?: ApiCallWhereInput[];
      NOT?: ApiCallWhereInput | ApiCallWhereInput[];
      projectId?: StringFilter<'ApiCall'> | string;
      userId?: StringFilter<'ApiCall'> | string;
      environmentId?: StringNullableFilter<'ApiCall'> | string | null;
      method?: StringFilter<'ApiCall'> | string;
      url?: StringFilter<'ApiCall'> | string;
      host?: StringFilter<'ApiCall'> | string;
      path?: StringFilter<'ApiCall'> | string;
      requestHeaders?: JsonNullableFilter<'ApiCall'>;
      requestBody?: JsonNullableFilter<'ApiCall'>;
      queryParams?: JsonNullableFilter<'ApiCall'>;
      statusCode?: IntNullableFilter<'ApiCall'> | number | null;
      statusText?: StringNullableFilter<'ApiCall'> | string | null;
      responseHeaders?: JsonNullableFilter<'ApiCall'>;
      responseBody?: JsonNullableFilter<'ApiCall'>;
      responseSize?: IntNullableFilter<'ApiCall'> | number | null;
      latency?: IntFilter<'ApiCall'> | number;
      startedAt?: DateTimeFilter<'ApiCall'> | Date | string;
      endedAt?: DateTimeFilter<'ApiCall'> | Date | string;
      status?: StringFilter<'ApiCall'> | string;
      sdkVersion?: StringNullableFilter<'ApiCall'> | string | null;
      hostname?: StringNullableFilter<'ApiCall'> | string | null;
      createdAt?: DateTimeFilter<'ApiCall'> | Date | string;
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      environment?: XOR<
        EnvironmentNullableScalarRelationFilter,
        EnvironmentWhereInput
      > | null;
    },
    'id'
  >;

  export type ApiCallOrderByWithAggregationInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    environmentId?: SortOrder;
    method?: SortOrder;
    url?: SortOrder;
    host?: SortOrder;
    path?: SortOrder;
    requestHeaders?: SortOrder;
    requestBody?: SortOrder;
    queryParams?: SortOrder;
    statusCode?: SortOrder;
    statusText?: SortOrder;
    responseHeaders?: SortOrder;
    responseBody?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
    startedAt?: SortOrder;
    endedAt?: SortOrder;
    status?: SortOrder;
    sdkVersion?: SortOrder;
    hostname?: SortOrder;
    createdAt?: SortOrder;
    _count?: ApiCallCountOrderByAggregateInput;
    _avg?: ApiCallAvgOrderByAggregateInput;
    _max?: ApiCallMaxOrderByAggregateInput;
    _min?: ApiCallMinOrderByAggregateInput;
    _sum?: ApiCallSumOrderByAggregateInput;
  };

  export type ApiCallScalarWhereWithAggregatesInput = {
    AND?:
      | ApiCallScalarWhereWithAggregatesInput
      | ApiCallScalarWhereWithAggregatesInput[];
    OR?: ApiCallScalarWhereWithAggregatesInput[];
    NOT?:
      | ApiCallScalarWhereWithAggregatesInput
      | ApiCallScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ApiCall'> | string;
    projectId?: StringWithAggregatesFilter<'ApiCall'> | string;
    userId?: StringWithAggregatesFilter<'ApiCall'> | string;
    environmentId?:
      | StringNullableWithAggregatesFilter<'ApiCall'>
      | string
      | null;
    method?: StringWithAggregatesFilter<'ApiCall'> | string;
    url?: StringWithAggregatesFilter<'ApiCall'> | string;
    host?: StringWithAggregatesFilter<'ApiCall'> | string;
    path?: StringWithAggregatesFilter<'ApiCall'> | string;
    requestHeaders?: JsonNullableWithAggregatesFilter<'ApiCall'>;
    requestBody?: JsonNullableWithAggregatesFilter<'ApiCall'>;
    queryParams?: JsonNullableWithAggregatesFilter<'ApiCall'>;
    statusCode?: IntNullableWithAggregatesFilter<'ApiCall'> | number | null;
    statusText?: StringNullableWithAggregatesFilter<'ApiCall'> | string | null;
    responseHeaders?: JsonNullableWithAggregatesFilter<'ApiCall'>;
    responseBody?: JsonNullableWithAggregatesFilter<'ApiCall'>;
    responseSize?: IntNullableWithAggregatesFilter<'ApiCall'> | number | null;
    latency?: IntWithAggregatesFilter<'ApiCall'> | number;
    startedAt?: DateTimeWithAggregatesFilter<'ApiCall'> | Date | string;
    endedAt?: DateTimeWithAggregatesFilter<'ApiCall'> | Date | string;
    status?: StringWithAggregatesFilter<'ApiCall'> | string;
    sdkVersion?: StringNullableWithAggregatesFilter<'ApiCall'> | string | null;
    hostname?: StringNullableWithAggregatesFilter<'ApiCall'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'ApiCall'> | Date | string;
  };

  export type AlertRuleWhereInput = {
    AND?: AlertRuleWhereInput | AlertRuleWhereInput[];
    OR?: AlertRuleWhereInput[];
    NOT?: AlertRuleWhereInput | AlertRuleWhereInput[];
    id?: StringFilter<'AlertRule'> | string;
    projectId?: StringFilter<'AlertRule'> | string;
    userId?: StringFilter<'AlertRule'> | string;
    name?: StringFilter<'AlertRule'> | string;
    metric?: StringFilter<'AlertRule'> | string;
    operator?: StringFilter<'AlertRule'> | string;
    threshold?: FloatFilter<'AlertRule'> | number;
    windowMin?: IntFilter<'AlertRule'> | number;
    enabled?: BoolFilter<'AlertRule'> | boolean;
    createdAt?: DateTimeFilter<'AlertRule'> | Date | string;
    updatedAt?: DateTimeFilter<'AlertRule'> | Date | string;
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type AlertRuleOrderByWithRelationInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    metric?: SortOrder;
    operator?: SortOrder;
    threshold?: SortOrder;
    windowMin?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    project?: ProjectOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };

  export type AlertRuleWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AlertRuleWhereInput | AlertRuleWhereInput[];
      OR?: AlertRuleWhereInput[];
      NOT?: AlertRuleWhereInput | AlertRuleWhereInput[];
      projectId?: StringFilter<'AlertRule'> | string;
      userId?: StringFilter<'AlertRule'> | string;
      name?: StringFilter<'AlertRule'> | string;
      metric?: StringFilter<'AlertRule'> | string;
      operator?: StringFilter<'AlertRule'> | string;
      threshold?: FloatFilter<'AlertRule'> | number;
      windowMin?: IntFilter<'AlertRule'> | number;
      enabled?: BoolFilter<'AlertRule'> | boolean;
      createdAt?: DateTimeFilter<'AlertRule'> | Date | string;
      updatedAt?: DateTimeFilter<'AlertRule'> | Date | string;
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type AlertRuleOrderByWithAggregationInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    metric?: SortOrder;
    operator?: SortOrder;
    threshold?: SortOrder;
    windowMin?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AlertRuleCountOrderByAggregateInput;
    _avg?: AlertRuleAvgOrderByAggregateInput;
    _max?: AlertRuleMaxOrderByAggregateInput;
    _min?: AlertRuleMinOrderByAggregateInput;
    _sum?: AlertRuleSumOrderByAggregateInput;
  };

  export type AlertRuleScalarWhereWithAggregatesInput = {
    AND?:
      | AlertRuleScalarWhereWithAggregatesInput
      | AlertRuleScalarWhereWithAggregatesInput[];
    OR?: AlertRuleScalarWhereWithAggregatesInput[];
    NOT?:
      | AlertRuleScalarWhereWithAggregatesInput
      | AlertRuleScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AlertRule'> | string;
    projectId?: StringWithAggregatesFilter<'AlertRule'> | string;
    userId?: StringWithAggregatesFilter<'AlertRule'> | string;
    name?: StringWithAggregatesFilter<'AlertRule'> | string;
    metric?: StringWithAggregatesFilter<'AlertRule'> | string;
    operator?: StringWithAggregatesFilter<'AlertRule'> | string;
    threshold?: FloatWithAggregatesFilter<'AlertRule'> | number;
    windowMin?: IntWithAggregatesFilter<'AlertRule'> | number;
    enabled?: BoolWithAggregatesFilter<'AlertRule'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'AlertRule'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'AlertRule'> | Date | string;
  };

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[];
    OR?: AuditLogWhereInput[];
    NOT?: AuditLogWhereInput | AuditLogWhereInput[];
    id?: StringFilter<'AuditLog'> | string;
    userId?: StringFilter<'AuditLog'> | string;
    projectId?: StringNullableFilter<'AuditLog'> | string | null;
    action?: StringFilter<'AuditLog'> | string;
    detail?: JsonNullableFilter<'AuditLog'>;
    ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableFilter<'AuditLog'> | string | null;
    createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    project?: XOR<
      ProjectNullableScalarRelationFilter,
      ProjectWhereInput
    > | null;
  };

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    projectId?: SortOrder;
    action?: SortOrder;
    detail?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    project?: ProjectOrderByWithRelationInput;
  };

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AuditLogWhereInput | AuditLogWhereInput[];
      OR?: AuditLogWhereInput[];
      NOT?: AuditLogWhereInput | AuditLogWhereInput[];
      userId?: StringFilter<'AuditLog'> | string;
      projectId?: StringNullableFilter<'AuditLog'> | string | null;
      action?: StringFilter<'AuditLog'> | string;
      detail?: JsonNullableFilter<'AuditLog'>;
      ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
      userAgent?: StringNullableFilter<'AuditLog'> | string | null;
      createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      project?: XOR<
        ProjectNullableScalarRelationFilter,
        ProjectWhereInput
      > | null;
    },
    'id'
  >;

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    projectId?: SortOrder;
    action?: SortOrder;
    detail?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
    _count?: AuditLogCountOrderByAggregateInput;
    _max?: AuditLogMaxOrderByAggregateInput;
    _min?: AuditLogMinOrderByAggregateInput;
  };

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?:
      | AuditLogScalarWhereWithAggregatesInput
      | AuditLogScalarWhereWithAggregatesInput[];
    OR?: AuditLogScalarWhereWithAggregatesInput[];
    NOT?:
      | AuditLogScalarWhereWithAggregatesInput
      | AuditLogScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AuditLog'> | string;
    userId?: StringWithAggregatesFilter<'AuditLog'> | string;
    projectId?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    action?: StringWithAggregatesFilter<'AuditLog'> | string;
    detail?: JsonNullableWithAggregatesFilter<'AuditLog'>;
    ipAddress?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'AuditLog'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProjectCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProjectsInput;
    apiCalls?: ApiCallCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentUncheckedCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUncheckedUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectCreateManyInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProjectUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProjectUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EnvironmentCreateInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    createdAt?: Date | string;
    project: ProjectCreateNestedOneWithoutEnvironmentsInput;
    apiCalls?: ApiCallCreateNestedManyWithoutEnvironmentInput;
  };

  export type EnvironmentUncheckedCreateInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    projectId: string;
    createdAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutEnvironmentInput;
  };

  export type EnvironmentUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutEnvironmentsNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutEnvironmentNestedInput;
  };

  export type EnvironmentUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    projectId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutEnvironmentNestedInput;
  };

  export type EnvironmentCreateManyInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    projectId: string;
    createdAt?: Date | string;
  };

  export type EnvironmentUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EnvironmentUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    projectId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallCreateInput = {
    id?: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
    project: ProjectCreateNestedOneWithoutApiCallsInput;
    user: UserCreateNestedOneWithoutApiCallsInput;
    environment?: EnvironmentCreateNestedOneWithoutApiCallsInput;
  };

  export type ApiCallUncheckedCreateInput = {
    id?: string;
    projectId: string;
    userId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallUpdateInput = {
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutApiCallsNestedInput;
    user?: UserUpdateOneRequiredWithoutApiCallsNestedInput;
    environment?: EnvironmentUpdateOneWithoutApiCallsNestedInput;
  };

  export type ApiCallUncheckedUpdateInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallCreateManyInput = {
    id?: string;
    projectId: string;
    userId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallUpdateManyMutationInput = {
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallUncheckedUpdateManyInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleCreateInput = {
    id?: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: ProjectCreateNestedOneWithoutAlertRulesInput;
    user: UserCreateNestedOneWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateInput = {
    id?: string;
    projectId: string;
    userId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutAlertRulesNestedInput;
    user?: UserUpdateOneRequiredWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleCreateManyInput = {
    id?: string;
    projectId: string;
    userId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUncheckedUpdateManyInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogCreateInput = {
    id?: string;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutAuditLogsInput;
    project?: ProjectCreateNestedOneWithoutAuditLogsInput;
  };

  export type AuditLogUncheckedCreateInput = {
    id?: string;
    userId: string;
    projectId?: string | null;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type AuditLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput;
    project?: ProjectUpdateOneWithoutAuditLogsNestedInput;
  };

  export type AuditLogUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    projectId?: NullableStringFieldUpdateOperationsInput | string | null;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogCreateManyInput = {
    id?: string;
    userId: string;
    projectId?: string | null;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type AuditLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    projectId?: NullableStringFieldUpdateOperationsInput | string | null;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
    isSet?: boolean;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput;
    some?: ProjectWhereInput;
    none?: ProjectWhereInput;
  };

  export type ApiCallListRelationFilter = {
    every?: ApiCallWhereInput;
    some?: ApiCallWhereInput;
    none?: ApiCallWhereInput;
  };

  export type AlertRuleListRelationFilter = {
    every?: AlertRuleWhereInput;
    some?: AlertRuleWhereInput;
    none?: AlertRuleWhereInput;
  };

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput;
    some?: AuditLogWhereInput;
    none?: AuditLogWhereInput;
  };

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ApiCallOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AlertRuleOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    sdkToken?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    sdkToken?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    sdkToken?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
    isSet?: boolean;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type EnvironmentListRelationFilter = {
    every?: EnvironmentWhereInput;
    some?: EnvironmentWhereInput;
    none?: EnvironmentWhereInput;
  };

  export type EnvironmentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    slug?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    slug?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    slug?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput;
    isNot?: ProjectWhereInput;
  };

  export type EnvironmentCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    label?: SortOrder;
    color?: SortOrder;
    projectId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnvironmentMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    label?: SortOrder;
    color?: SortOrder;
    projectId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnvironmentMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    label?: SortOrder;
    color?: SortOrder;
    projectId?: SortOrder;
    createdAt?: SortOrder;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    isSet?: boolean;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type EnvironmentNullableScalarRelationFilter = {
    is?: EnvironmentWhereInput | null;
    isNot?: EnvironmentWhereInput | null;
  };

  export type ApiCallCountOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    environmentId?: SortOrder;
    method?: SortOrder;
    url?: SortOrder;
    host?: SortOrder;
    path?: SortOrder;
    requestHeaders?: SortOrder;
    requestBody?: SortOrder;
    queryParams?: SortOrder;
    statusCode?: SortOrder;
    statusText?: SortOrder;
    responseHeaders?: SortOrder;
    responseBody?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
    startedAt?: SortOrder;
    endedAt?: SortOrder;
    status?: SortOrder;
    sdkVersion?: SortOrder;
    hostname?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ApiCallAvgOrderByAggregateInput = {
    statusCode?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
  };

  export type ApiCallMaxOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    environmentId?: SortOrder;
    method?: SortOrder;
    url?: SortOrder;
    host?: SortOrder;
    path?: SortOrder;
    statusCode?: SortOrder;
    statusText?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
    startedAt?: SortOrder;
    endedAt?: SortOrder;
    status?: SortOrder;
    sdkVersion?: SortOrder;
    hostname?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ApiCallMinOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    environmentId?: SortOrder;
    method?: SortOrder;
    url?: SortOrder;
    host?: SortOrder;
    path?: SortOrder;
    statusCode?: SortOrder;
    statusText?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
    startedAt?: SortOrder;
    endedAt?: SortOrder;
    status?: SortOrder;
    sdkVersion?: SortOrder;
    hostname?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ApiCallSumOrderByAggregateInput = {
    statusCode?: SortOrder;
    responseSize?: SortOrder;
    latency?: SortOrder;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
    isSet?: boolean;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
    isSet?: boolean;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type AlertRuleCountOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    metric?: SortOrder;
    operator?: SortOrder;
    threshold?: SortOrder;
    windowMin?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleAvgOrderByAggregateInput = {
    threshold?: SortOrder;
    windowMin?: SortOrder;
  };

  export type AlertRuleMaxOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    metric?: SortOrder;
    operator?: SortOrder;
    threshold?: SortOrder;
    windowMin?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleMinOrderByAggregateInput = {
    id?: SortOrder;
    projectId?: SortOrder;
    userId?: SortOrder;
    name?: SortOrder;
    metric?: SortOrder;
    operator?: SortOrder;
    threshold?: SortOrder;
    windowMin?: SortOrder;
    enabled?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AlertRuleSumOrderByAggregateInput = {
    threshold?: SortOrder;
    windowMin?: SortOrder;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type ProjectNullableScalarRelationFilter = {
    is?: ProjectWhereInput | null;
    isNot?: ProjectWhereInput | null;
  };

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    projectId?: SortOrder;
    action?: SortOrder;
    detail?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
  };

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    projectId?: SortOrder;
    action?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
  };

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    projectId?: SortOrder;
    action?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ProjectCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ProjectCreateWithoutUserInput,
          ProjectUncheckedCreateWithoutUserInput
        >
      | ProjectCreateWithoutUserInput[]
      | ProjectUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ProjectCreateOrConnectWithoutUserInput
      | ProjectCreateOrConnectWithoutUserInput[];
    createMany?: ProjectCreateManyUserInputEnvelope;
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
  };

  export type ApiCallCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutUserInput,
          ApiCallUncheckedCreateWithoutUserInput
        >
      | ApiCallCreateWithoutUserInput[]
      | ApiCallUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutUserInput
      | ApiCallCreateOrConnectWithoutUserInput[];
    createMany?: ApiCallCreateManyUserInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type AlertRuleCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutUserInput,
          AlertRuleUncheckedCreateWithoutUserInput
        >
      | AlertRuleCreateWithoutUserInput[]
      | AlertRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutUserInput
      | AlertRuleCreateOrConnectWithoutUserInput[];
    createMany?: AlertRuleCreateManyUserInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ProjectCreateWithoutUserInput,
          ProjectUncheckedCreateWithoutUserInput
        >
      | ProjectCreateWithoutUserInput[]
      | ProjectUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ProjectCreateOrConnectWithoutUserInput
      | ProjectCreateOrConnectWithoutUserInput[];
    createMany?: ProjectCreateManyUserInputEnvelope;
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
  };

  export type ApiCallUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutUserInput,
          ApiCallUncheckedCreateWithoutUserInput
        >
      | ApiCallCreateWithoutUserInput[]
      | ApiCallUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutUserInput
      | ApiCallCreateOrConnectWithoutUserInput[];
    createMany?: ApiCallCreateManyUserInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type AlertRuleUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutUserInput,
          AlertRuleUncheckedCreateWithoutUserInput
        >
      | AlertRuleCreateWithoutUserInput[]
      | AlertRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutUserInput
      | AlertRuleCreateOrConnectWithoutUserInput[];
    createMany?: AlertRuleCreateManyUserInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
    unset?: boolean;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type ProjectUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ProjectCreateWithoutUserInput,
          ProjectUncheckedCreateWithoutUserInput
        >
      | ProjectCreateWithoutUserInput[]
      | ProjectUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ProjectCreateOrConnectWithoutUserInput
      | ProjectCreateOrConnectWithoutUserInput[];
    upsert?:
      | ProjectUpsertWithWhereUniqueWithoutUserInput
      | ProjectUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ProjectCreateManyUserInputEnvelope;
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    update?:
      | ProjectUpdateWithWhereUniqueWithoutUserInput
      | ProjectUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ProjectUpdateManyWithWhereWithoutUserInput
      | ProjectUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
  };

  export type ApiCallUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutUserInput,
          ApiCallUncheckedCreateWithoutUserInput
        >
      | ApiCallCreateWithoutUserInput[]
      | ApiCallUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutUserInput
      | ApiCallCreateOrConnectWithoutUserInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutUserInput
      | ApiCallUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ApiCallCreateManyUserInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutUserInput
      | ApiCallUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutUserInput
      | ApiCallUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type AlertRuleUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutUserInput,
          AlertRuleUncheckedCreateWithoutUserInput
        >
      | AlertRuleCreateWithoutUserInput[]
      | AlertRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutUserInput
      | AlertRuleCreateOrConnectWithoutUserInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutUserInput
      | AlertRuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AlertRuleCreateManyUserInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutUserInput
      | AlertRuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutUserInput
      | AlertRuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutUserInput
      | AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutUserInput
      | AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutUserInput
      | AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ProjectCreateWithoutUserInput,
          ProjectUncheckedCreateWithoutUserInput
        >
      | ProjectCreateWithoutUserInput[]
      | ProjectUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ProjectCreateOrConnectWithoutUserInput
      | ProjectCreateOrConnectWithoutUserInput[];
    upsert?:
      | ProjectUpsertWithWhereUniqueWithoutUserInput
      | ProjectUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ProjectCreateManyUserInputEnvelope;
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[];
    update?:
      | ProjectUpdateWithWhereUniqueWithoutUserInput
      | ProjectUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ProjectUpdateManyWithWhereWithoutUserInput
      | ProjectUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
  };

  export type ApiCallUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutUserInput,
          ApiCallUncheckedCreateWithoutUserInput
        >
      | ApiCallCreateWithoutUserInput[]
      | ApiCallUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutUserInput
      | ApiCallCreateOrConnectWithoutUserInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutUserInput
      | ApiCallUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ApiCallCreateManyUserInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutUserInput
      | ApiCallUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutUserInput
      | ApiCallUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type AlertRuleUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutUserInput,
          AlertRuleUncheckedCreateWithoutUserInput
        >
      | AlertRuleCreateWithoutUserInput[]
      | AlertRuleUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutUserInput
      | AlertRuleCreateOrConnectWithoutUserInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutUserInput
      | AlertRuleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AlertRuleCreateManyUserInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutUserInput
      | AlertRuleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutUserInput
      | AlertRuleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutUserInput
      | AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutUserInput
      | AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutUserInput
      | AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<
      UserCreateWithoutProjectsInput,
      UserUncheckedCreateWithoutProjectsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput;
    connect?: UserWhereUniqueInput;
  };

  export type ApiCallCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutProjectInput,
          ApiCallUncheckedCreateWithoutProjectInput
        >
      | ApiCallCreateWithoutProjectInput[]
      | ApiCallUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutProjectInput
      | ApiCallCreateOrConnectWithoutProjectInput[];
    createMany?: ApiCallCreateManyProjectInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type EnvironmentCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          EnvironmentCreateWithoutProjectInput,
          EnvironmentUncheckedCreateWithoutProjectInput
        >
      | EnvironmentCreateWithoutProjectInput[]
      | EnvironmentUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | EnvironmentCreateOrConnectWithoutProjectInput
      | EnvironmentCreateOrConnectWithoutProjectInput[];
    createMany?: EnvironmentCreateManyProjectInputEnvelope;
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
  };

  export type AlertRuleCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutProjectInput,
          AlertRuleUncheckedCreateWithoutProjectInput
        >
      | AlertRuleCreateWithoutProjectInput[]
      | AlertRuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutProjectInput
      | AlertRuleCreateOrConnectWithoutProjectInput[];
    createMany?: AlertRuleCreateManyProjectInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type AuditLogCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutProjectInput,
          AuditLogUncheckedCreateWithoutProjectInput
        >
      | AuditLogCreateWithoutProjectInput[]
      | AuditLogUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutProjectInput
      | AuditLogCreateOrConnectWithoutProjectInput[];
    createMany?: AuditLogCreateManyProjectInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type ApiCallUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutProjectInput,
          ApiCallUncheckedCreateWithoutProjectInput
        >
      | ApiCallCreateWithoutProjectInput[]
      | ApiCallUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutProjectInput
      | ApiCallCreateOrConnectWithoutProjectInput[];
    createMany?: ApiCallCreateManyProjectInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type EnvironmentUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          EnvironmentCreateWithoutProjectInput,
          EnvironmentUncheckedCreateWithoutProjectInput
        >
      | EnvironmentCreateWithoutProjectInput[]
      | EnvironmentUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | EnvironmentCreateOrConnectWithoutProjectInput
      | EnvironmentCreateOrConnectWithoutProjectInput[];
    createMany?: EnvironmentCreateManyProjectInputEnvelope;
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
  };

  export type AlertRuleUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutProjectInput,
          AlertRuleUncheckedCreateWithoutProjectInput
        >
      | AlertRuleCreateWithoutProjectInput[]
      | AlertRuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutProjectInput
      | AlertRuleCreateOrConnectWithoutProjectInput[];
    createMany?: AlertRuleCreateManyProjectInputEnvelope;
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
  };

  export type AuditLogUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutProjectInput,
          AuditLogUncheckedCreateWithoutProjectInput
        >
      | AuditLogCreateWithoutProjectInput[]
      | AuditLogUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutProjectInput
      | AuditLogCreateOrConnectWithoutProjectInput[];
    createMany?: AuditLogCreateManyProjectInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<
      UserCreateWithoutProjectsInput,
      UserUncheckedCreateWithoutProjectsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput;
    upsert?: UserUpsertWithoutProjectsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutProjectsInput,
        UserUpdateWithoutProjectsInput
      >,
      UserUncheckedUpdateWithoutProjectsInput
    >;
  };

  export type ApiCallUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutProjectInput,
          ApiCallUncheckedCreateWithoutProjectInput
        >
      | ApiCallCreateWithoutProjectInput[]
      | ApiCallUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutProjectInput
      | ApiCallCreateOrConnectWithoutProjectInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutProjectInput
      | ApiCallUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: ApiCallCreateManyProjectInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutProjectInput
      | ApiCallUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutProjectInput
      | ApiCallUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type EnvironmentUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          EnvironmentCreateWithoutProjectInput,
          EnvironmentUncheckedCreateWithoutProjectInput
        >
      | EnvironmentCreateWithoutProjectInput[]
      | EnvironmentUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | EnvironmentCreateOrConnectWithoutProjectInput
      | EnvironmentCreateOrConnectWithoutProjectInput[];
    upsert?:
      | EnvironmentUpsertWithWhereUniqueWithoutProjectInput
      | EnvironmentUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: EnvironmentCreateManyProjectInputEnvelope;
    set?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    disconnect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    delete?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    update?:
      | EnvironmentUpdateWithWhereUniqueWithoutProjectInput
      | EnvironmentUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | EnvironmentUpdateManyWithWhereWithoutProjectInput
      | EnvironmentUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[];
  };

  export type AlertRuleUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutProjectInput,
          AlertRuleUncheckedCreateWithoutProjectInput
        >
      | AlertRuleCreateWithoutProjectInput[]
      | AlertRuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutProjectInput
      | AlertRuleCreateOrConnectWithoutProjectInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutProjectInput
      | AlertRuleUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: AlertRuleCreateManyProjectInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutProjectInput
      | AlertRuleUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutProjectInput
      | AlertRuleUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type AuditLogUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutProjectInput,
          AuditLogUncheckedCreateWithoutProjectInput
        >
      | AuditLogCreateWithoutProjectInput[]
      | AuditLogUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutProjectInput
      | AuditLogCreateOrConnectWithoutProjectInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutProjectInput
      | AuditLogUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: AuditLogCreateManyProjectInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutProjectInput
      | AuditLogUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutProjectInput
      | AuditLogUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type ApiCallUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutProjectInput,
          ApiCallUncheckedCreateWithoutProjectInput
        >
      | ApiCallCreateWithoutProjectInput[]
      | ApiCallUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutProjectInput
      | ApiCallCreateOrConnectWithoutProjectInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutProjectInput
      | ApiCallUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: ApiCallCreateManyProjectInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutProjectInput
      | ApiCallUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutProjectInput
      | ApiCallUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type EnvironmentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          EnvironmentCreateWithoutProjectInput,
          EnvironmentUncheckedCreateWithoutProjectInput
        >
      | EnvironmentCreateWithoutProjectInput[]
      | EnvironmentUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | EnvironmentCreateOrConnectWithoutProjectInput
      | EnvironmentCreateOrConnectWithoutProjectInput[];
    upsert?:
      | EnvironmentUpsertWithWhereUniqueWithoutProjectInput
      | EnvironmentUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: EnvironmentCreateManyProjectInputEnvelope;
    set?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    disconnect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    delete?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    connect?: EnvironmentWhereUniqueInput | EnvironmentWhereUniqueInput[];
    update?:
      | EnvironmentUpdateWithWhereUniqueWithoutProjectInput
      | EnvironmentUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | EnvironmentUpdateManyWithWhereWithoutProjectInput
      | EnvironmentUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[];
  };

  export type AlertRuleUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          AlertRuleCreateWithoutProjectInput,
          AlertRuleUncheckedCreateWithoutProjectInput
        >
      | AlertRuleCreateWithoutProjectInput[]
      | AlertRuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AlertRuleCreateOrConnectWithoutProjectInput
      | AlertRuleCreateOrConnectWithoutProjectInput[];
    upsert?:
      | AlertRuleUpsertWithWhereUniqueWithoutProjectInput
      | AlertRuleUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: AlertRuleCreateManyProjectInputEnvelope;
    set?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    disconnect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    delete?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    connect?: AlertRuleWhereUniqueInput | AlertRuleWhereUniqueInput[];
    update?:
      | AlertRuleUpdateWithWhereUniqueWithoutProjectInput
      | AlertRuleUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | AlertRuleUpdateManyWithWhereWithoutProjectInput
      | AlertRuleUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
  };

  export type AuditLogUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutProjectInput,
          AuditLogUncheckedCreateWithoutProjectInput
        >
      | AuditLogCreateWithoutProjectInput[]
      | AuditLogUncheckedCreateWithoutProjectInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutProjectInput
      | AuditLogCreateOrConnectWithoutProjectInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutProjectInput
      | AuditLogUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: AuditLogCreateManyProjectInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutProjectInput
      | AuditLogUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutProjectInput
      | AuditLogUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type ProjectCreateNestedOneWithoutEnvironmentsInput = {
    create?: XOR<
      ProjectCreateWithoutEnvironmentsInput,
      ProjectUncheckedCreateWithoutEnvironmentsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutEnvironmentsInput;
    connect?: ProjectWhereUniqueInput;
  };

  export type ApiCallCreateNestedManyWithoutEnvironmentInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutEnvironmentInput,
          ApiCallUncheckedCreateWithoutEnvironmentInput
        >
      | ApiCallCreateWithoutEnvironmentInput[]
      | ApiCallUncheckedCreateWithoutEnvironmentInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutEnvironmentInput
      | ApiCallCreateOrConnectWithoutEnvironmentInput[];
    createMany?: ApiCallCreateManyEnvironmentInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type ApiCallUncheckedCreateNestedManyWithoutEnvironmentInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutEnvironmentInput,
          ApiCallUncheckedCreateWithoutEnvironmentInput
        >
      | ApiCallCreateWithoutEnvironmentInput[]
      | ApiCallUncheckedCreateWithoutEnvironmentInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutEnvironmentInput
      | ApiCallCreateOrConnectWithoutEnvironmentInput[];
    createMany?: ApiCallCreateManyEnvironmentInputEnvelope;
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
  };

  export type ProjectUpdateOneRequiredWithoutEnvironmentsNestedInput = {
    create?: XOR<
      ProjectCreateWithoutEnvironmentsInput,
      ProjectUncheckedCreateWithoutEnvironmentsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutEnvironmentsInput;
    upsert?: ProjectUpsertWithoutEnvironmentsInput;
    connect?: ProjectWhereUniqueInput;
    update?: XOR<
      XOR<
        ProjectUpdateToOneWithWhereWithoutEnvironmentsInput,
        ProjectUpdateWithoutEnvironmentsInput
      >,
      ProjectUncheckedUpdateWithoutEnvironmentsInput
    >;
  };

  export type ApiCallUpdateManyWithoutEnvironmentNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutEnvironmentInput,
          ApiCallUncheckedCreateWithoutEnvironmentInput
        >
      | ApiCallCreateWithoutEnvironmentInput[]
      | ApiCallUncheckedCreateWithoutEnvironmentInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutEnvironmentInput
      | ApiCallCreateOrConnectWithoutEnvironmentInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutEnvironmentInput
      | ApiCallUpsertWithWhereUniqueWithoutEnvironmentInput[];
    createMany?: ApiCallCreateManyEnvironmentInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutEnvironmentInput
      | ApiCallUpdateWithWhereUniqueWithoutEnvironmentInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutEnvironmentInput
      | ApiCallUpdateManyWithWhereWithoutEnvironmentInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type ApiCallUncheckedUpdateManyWithoutEnvironmentNestedInput = {
    create?:
      | XOR<
          ApiCallCreateWithoutEnvironmentInput,
          ApiCallUncheckedCreateWithoutEnvironmentInput
        >
      | ApiCallCreateWithoutEnvironmentInput[]
      | ApiCallUncheckedCreateWithoutEnvironmentInput[];
    connectOrCreate?:
      | ApiCallCreateOrConnectWithoutEnvironmentInput
      | ApiCallCreateOrConnectWithoutEnvironmentInput[];
    upsert?:
      | ApiCallUpsertWithWhereUniqueWithoutEnvironmentInput
      | ApiCallUpsertWithWhereUniqueWithoutEnvironmentInput[];
    createMany?: ApiCallCreateManyEnvironmentInputEnvelope;
    set?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    disconnect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    delete?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    connect?: ApiCallWhereUniqueInput | ApiCallWhereUniqueInput[];
    update?:
      | ApiCallUpdateWithWhereUniqueWithoutEnvironmentInput
      | ApiCallUpdateWithWhereUniqueWithoutEnvironmentInput[];
    updateMany?:
      | ApiCallUpdateManyWithWhereWithoutEnvironmentInput
      | ApiCallUpdateManyWithWhereWithoutEnvironmentInput[];
    deleteMany?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
  };

  export type ProjectCreateNestedOneWithoutApiCallsInput = {
    create?: XOR<
      ProjectCreateWithoutApiCallsInput,
      ProjectUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutApiCallsInput;
    connect?: ProjectWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutApiCallsInput = {
    create?: XOR<
      UserCreateWithoutApiCallsInput,
      UserUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutApiCallsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnvironmentCreateNestedOneWithoutApiCallsInput = {
    create?: XOR<
      EnvironmentCreateWithoutApiCallsInput,
      EnvironmentUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: EnvironmentCreateOrConnectWithoutApiCallsInput;
    connect?: EnvironmentWhereUniqueInput;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
    unset?: boolean;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type ProjectUpdateOneRequiredWithoutApiCallsNestedInput = {
    create?: XOR<
      ProjectCreateWithoutApiCallsInput,
      ProjectUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutApiCallsInput;
    upsert?: ProjectUpsertWithoutApiCallsInput;
    connect?: ProjectWhereUniqueInput;
    update?: XOR<
      XOR<
        ProjectUpdateToOneWithWhereWithoutApiCallsInput,
        ProjectUpdateWithoutApiCallsInput
      >,
      ProjectUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutApiCallsNestedInput = {
    create?: XOR<
      UserCreateWithoutApiCallsInput,
      UserUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutApiCallsInput;
    upsert?: UserUpsertWithoutApiCallsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutApiCallsInput,
        UserUpdateWithoutApiCallsInput
      >,
      UserUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type EnvironmentUpdateOneWithoutApiCallsNestedInput = {
    create?: XOR<
      EnvironmentCreateWithoutApiCallsInput,
      EnvironmentUncheckedCreateWithoutApiCallsInput
    >;
    connectOrCreate?: EnvironmentCreateOrConnectWithoutApiCallsInput;
    upsert?: EnvironmentUpsertWithoutApiCallsInput;
    disconnect?: boolean;
    delete?: EnvironmentWhereInput | boolean;
    connect?: EnvironmentWhereUniqueInput;
    update?: XOR<
      XOR<
        EnvironmentUpdateToOneWithWhereWithoutApiCallsInput,
        EnvironmentUpdateWithoutApiCallsInput
      >,
      EnvironmentUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type ProjectCreateNestedOneWithoutAlertRulesInput = {
    create?: XOR<
      ProjectCreateWithoutAlertRulesInput,
      ProjectUncheckedCreateWithoutAlertRulesInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutAlertRulesInput;
    connect?: ProjectWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutAlertRulesInput = {
    create?: XOR<
      UserCreateWithoutAlertRulesInput,
      UserUncheckedCreateWithoutAlertRulesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAlertRulesInput;
    connect?: UserWhereUniqueInput;
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type ProjectUpdateOneRequiredWithoutAlertRulesNestedInput = {
    create?: XOR<
      ProjectCreateWithoutAlertRulesInput,
      ProjectUncheckedCreateWithoutAlertRulesInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutAlertRulesInput;
    upsert?: ProjectUpsertWithoutAlertRulesInput;
    connect?: ProjectWhereUniqueInput;
    update?: XOR<
      XOR<
        ProjectUpdateToOneWithWhereWithoutAlertRulesInput,
        ProjectUpdateWithoutAlertRulesInput
      >,
      ProjectUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type UserUpdateOneRequiredWithoutAlertRulesNestedInput = {
    create?: XOR<
      UserCreateWithoutAlertRulesInput,
      UserUncheckedCreateWithoutAlertRulesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAlertRulesInput;
    upsert?: UserUpsertWithoutAlertRulesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAlertRulesInput,
        UserUpdateWithoutAlertRulesInput
      >,
      UserUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput;
    connect?: UserWhereUniqueInput;
  };

  export type ProjectCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<
      ProjectCreateWithoutAuditLogsInput,
      ProjectUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutAuditLogsInput;
    connect?: ProjectWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: UserUpsertWithoutAuditLogsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAuditLogsInput,
        UserUpdateWithoutAuditLogsInput
      >,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type ProjectUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<
      ProjectCreateWithoutAuditLogsInput,
      ProjectUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: ProjectCreateOrConnectWithoutAuditLogsInput;
    upsert?: ProjectUpsertWithoutAuditLogsInput;
    disconnect?: boolean;
    delete?: ProjectWhereInput | boolean;
    connect?: ProjectWhereUniqueInput;
    update?: XOR<
      XOR<
        ProjectUpdateToOneWithWhereWithoutAuditLogsInput,
        ProjectUpdateWithoutAuditLogsInput
      >,
      ProjectUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
    isSet?: boolean;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
    isSet?: boolean;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    isSet?: boolean;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
    isSet?: boolean;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type ProjectCreateWithoutUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentUncheckedCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectCreateOrConnectWithoutUserInput = {
    where: ProjectWhereUniqueInput;
    create: XOR<
      ProjectCreateWithoutUserInput,
      ProjectUncheckedCreateWithoutUserInput
    >;
  };

  export type ProjectCreateManyUserInputEnvelope = {
    data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[];
  };

  export type ApiCallCreateWithoutUserInput = {
    id?: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
    project: ProjectCreateNestedOneWithoutApiCallsInput;
    environment?: EnvironmentCreateNestedOneWithoutApiCallsInput;
  };

  export type ApiCallUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallCreateOrConnectWithoutUserInput = {
    where: ApiCallWhereUniqueInput;
    create: XOR<
      ApiCallCreateWithoutUserInput,
      ApiCallUncheckedCreateWithoutUserInput
    >;
  };

  export type ApiCallCreateManyUserInputEnvelope = {
    data: ApiCallCreateManyUserInput | ApiCallCreateManyUserInput[];
  };

  export type AlertRuleCreateWithoutUserInput = {
    id?: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: ProjectCreateNestedOneWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleCreateOrConnectWithoutUserInput = {
    where: AlertRuleWhereUniqueInput;
    create: XOR<
      AlertRuleCreateWithoutUserInput,
      AlertRuleUncheckedCreateWithoutUserInput
    >;
  };

  export type AlertRuleCreateManyUserInputEnvelope = {
    data: AlertRuleCreateManyUserInput | AlertRuleCreateManyUserInput[];
  };

  export type AuditLogCreateWithoutUserInput = {
    id?: string;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    project?: ProjectCreateNestedOneWithoutAuditLogsInput;
  };

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId?: string | null;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    create: XOR<
      AuditLogCreateWithoutUserInput,
      AuditLogUncheckedCreateWithoutUserInput
    >;
  };

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[];
  };

  export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput;
    update: XOR<
      ProjectUpdateWithoutUserInput,
      ProjectUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ProjectCreateWithoutUserInput,
      ProjectUncheckedCreateWithoutUserInput
    >;
  };

  export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput;
    data: XOR<
      ProjectUpdateWithoutUserInput,
      ProjectUncheckedUpdateWithoutUserInput
    >;
  };

  export type ProjectUpdateManyWithWhereWithoutUserInput = {
    where: ProjectScalarWhereInput;
    data: XOR<
      ProjectUpdateManyMutationInput,
      ProjectUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
    OR?: ProjectScalarWhereInput[];
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[];
    id?: StringFilter<'Project'> | string;
    name?: StringFilter<'Project'> | string;
    description?: StringNullableFilter<'Project'> | string | null;
    slug?: StringNullableFilter<'Project'> | string | null;
    userId?: StringFilter<'Project'> | string;
    createdAt?: DateTimeFilter<'Project'> | Date | string;
    updatedAt?: DateTimeFilter<'Project'> | Date | string;
  };

  export type ApiCallUpsertWithWhereUniqueWithoutUserInput = {
    where: ApiCallWhereUniqueInput;
    update: XOR<
      ApiCallUpdateWithoutUserInput,
      ApiCallUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ApiCallCreateWithoutUserInput,
      ApiCallUncheckedCreateWithoutUserInput
    >;
  };

  export type ApiCallUpdateWithWhereUniqueWithoutUserInput = {
    where: ApiCallWhereUniqueInput;
    data: XOR<
      ApiCallUpdateWithoutUserInput,
      ApiCallUncheckedUpdateWithoutUserInput
    >;
  };

  export type ApiCallUpdateManyWithWhereWithoutUserInput = {
    where: ApiCallScalarWhereInput;
    data: XOR<
      ApiCallUpdateManyMutationInput,
      ApiCallUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type ApiCallScalarWhereInput = {
    AND?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
    OR?: ApiCallScalarWhereInput[];
    NOT?: ApiCallScalarWhereInput | ApiCallScalarWhereInput[];
    id?: StringFilter<'ApiCall'> | string;
    projectId?: StringFilter<'ApiCall'> | string;
    userId?: StringFilter<'ApiCall'> | string;
    environmentId?: StringNullableFilter<'ApiCall'> | string | null;
    method?: StringFilter<'ApiCall'> | string;
    url?: StringFilter<'ApiCall'> | string;
    host?: StringFilter<'ApiCall'> | string;
    path?: StringFilter<'ApiCall'> | string;
    requestHeaders?: JsonNullableFilter<'ApiCall'>;
    requestBody?: JsonNullableFilter<'ApiCall'>;
    queryParams?: JsonNullableFilter<'ApiCall'>;
    statusCode?: IntNullableFilter<'ApiCall'> | number | null;
    statusText?: StringNullableFilter<'ApiCall'> | string | null;
    responseHeaders?: JsonNullableFilter<'ApiCall'>;
    responseBody?: JsonNullableFilter<'ApiCall'>;
    responseSize?: IntNullableFilter<'ApiCall'> | number | null;
    latency?: IntFilter<'ApiCall'> | number;
    startedAt?: DateTimeFilter<'ApiCall'> | Date | string;
    endedAt?: DateTimeFilter<'ApiCall'> | Date | string;
    status?: StringFilter<'ApiCall'> | string;
    sdkVersion?: StringNullableFilter<'ApiCall'> | string | null;
    hostname?: StringNullableFilter<'ApiCall'> | string | null;
    createdAt?: DateTimeFilter<'ApiCall'> | Date | string;
  };

  export type AlertRuleUpsertWithWhereUniqueWithoutUserInput = {
    where: AlertRuleWhereUniqueInput;
    update: XOR<
      AlertRuleUpdateWithoutUserInput,
      AlertRuleUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AlertRuleCreateWithoutUserInput,
      AlertRuleUncheckedCreateWithoutUserInput
    >;
  };

  export type AlertRuleUpdateWithWhereUniqueWithoutUserInput = {
    where: AlertRuleWhereUniqueInput;
    data: XOR<
      AlertRuleUpdateWithoutUserInput,
      AlertRuleUncheckedUpdateWithoutUserInput
    >;
  };

  export type AlertRuleUpdateManyWithWhereWithoutUserInput = {
    where: AlertRuleScalarWhereInput;
    data: XOR<
      AlertRuleUpdateManyMutationInput,
      AlertRuleUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type AlertRuleScalarWhereInput = {
    AND?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
    OR?: AlertRuleScalarWhereInput[];
    NOT?: AlertRuleScalarWhereInput | AlertRuleScalarWhereInput[];
    id?: StringFilter<'AlertRule'> | string;
    projectId?: StringFilter<'AlertRule'> | string;
    userId?: StringFilter<'AlertRule'> | string;
    name?: StringFilter<'AlertRule'> | string;
    metric?: StringFilter<'AlertRule'> | string;
    operator?: StringFilter<'AlertRule'> | string;
    threshold?: FloatFilter<'AlertRule'> | number;
    windowMin?: IntFilter<'AlertRule'> | number;
    enabled?: BoolFilter<'AlertRule'> | boolean;
    createdAt?: DateTimeFilter<'AlertRule'> | Date | string;
    updatedAt?: DateTimeFilter<'AlertRule'> | Date | string;
  };

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    update: XOR<
      AuditLogUpdateWithoutUserInput,
      AuditLogUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AuditLogCreateWithoutUserInput,
      AuditLogUncheckedCreateWithoutUserInput
    >;
  };

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    data: XOR<
      AuditLogUpdateWithoutUserInput,
      AuditLogUncheckedUpdateWithoutUserInput
    >;
  };

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput;
    data: XOR<
      AuditLogUpdateManyMutationInput,
      AuditLogUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
    OR?: AuditLogScalarWhereInput[];
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
    id?: StringFilter<'AuditLog'> | string;
    userId?: StringFilter<'AuditLog'> | string;
    projectId?: StringNullableFilter<'AuditLog'> | string | null;
    action?: StringFilter<'AuditLog'> | string;
    detail?: JsonNullableFilter<'AuditLog'>;
    ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableFilter<'AuditLog'> | string | null;
    createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
  };

  export type UserCreateWithoutProjectsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutProjectsInput,
      UserUncheckedCreateWithoutProjectsInput
    >;
  };

  export type ApiCallCreateWithoutProjectInput = {
    id?: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutApiCallsInput;
    environment?: EnvironmentCreateNestedOneWithoutApiCallsInput;
  };

  export type ApiCallUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallCreateOrConnectWithoutProjectInput = {
    where: ApiCallWhereUniqueInput;
    create: XOR<
      ApiCallCreateWithoutProjectInput,
      ApiCallUncheckedCreateWithoutProjectInput
    >;
  };

  export type ApiCallCreateManyProjectInputEnvelope = {
    data: ApiCallCreateManyProjectInput | ApiCallCreateManyProjectInput[];
  };

  export type EnvironmentCreateWithoutProjectInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    createdAt?: Date | string;
    apiCalls?: ApiCallCreateNestedManyWithoutEnvironmentInput;
  };

  export type EnvironmentUncheckedCreateWithoutProjectInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    createdAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutEnvironmentInput;
  };

  export type EnvironmentCreateOrConnectWithoutProjectInput = {
    where: EnvironmentWhereUniqueInput;
    create: XOR<
      EnvironmentCreateWithoutProjectInput,
      EnvironmentUncheckedCreateWithoutProjectInput
    >;
  };

  export type EnvironmentCreateManyProjectInputEnvelope = {
    data:
      | EnvironmentCreateManyProjectInput
      | EnvironmentCreateManyProjectInput[];
  };

  export type AlertRuleCreateWithoutProjectInput = {
    id?: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutAlertRulesInput;
  };

  export type AlertRuleUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AlertRuleCreateOrConnectWithoutProjectInput = {
    where: AlertRuleWhereUniqueInput;
    create: XOR<
      AlertRuleCreateWithoutProjectInput,
      AlertRuleUncheckedCreateWithoutProjectInput
    >;
  };

  export type AlertRuleCreateManyProjectInputEnvelope = {
    data: AlertRuleCreateManyProjectInput | AlertRuleCreateManyProjectInput[];
  };

  export type AuditLogCreateWithoutProjectInput = {
    id?: string;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutAuditLogsInput;
  };

  export type AuditLogUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type AuditLogCreateOrConnectWithoutProjectInput = {
    where: AuditLogWhereUniqueInput;
    create: XOR<
      AuditLogCreateWithoutProjectInput,
      AuditLogUncheckedCreateWithoutProjectInput
    >;
  };

  export type AuditLogCreateManyProjectInputEnvelope = {
    data: AuditLogCreateManyProjectInput | AuditLogCreateManyProjectInput[];
  };

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<
      UserUpdateWithoutProjectsInput,
      UserUncheckedUpdateWithoutProjectsInput
    >;
    create: XOR<
      UserCreateWithoutProjectsInput,
      UserUncheckedCreateWithoutProjectsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutProjectsInput,
      UserUncheckedUpdateWithoutProjectsInput
    >;
  };

  export type UserUpdateWithoutProjectsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutProjectsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type ApiCallUpsertWithWhereUniqueWithoutProjectInput = {
    where: ApiCallWhereUniqueInput;
    update: XOR<
      ApiCallUpdateWithoutProjectInput,
      ApiCallUncheckedUpdateWithoutProjectInput
    >;
    create: XOR<
      ApiCallCreateWithoutProjectInput,
      ApiCallUncheckedCreateWithoutProjectInput
    >;
  };

  export type ApiCallUpdateWithWhereUniqueWithoutProjectInput = {
    where: ApiCallWhereUniqueInput;
    data: XOR<
      ApiCallUpdateWithoutProjectInput,
      ApiCallUncheckedUpdateWithoutProjectInput
    >;
  };

  export type ApiCallUpdateManyWithWhereWithoutProjectInput = {
    where: ApiCallScalarWhereInput;
    data: XOR<
      ApiCallUpdateManyMutationInput,
      ApiCallUncheckedUpdateManyWithoutProjectInput
    >;
  };

  export type EnvironmentUpsertWithWhereUniqueWithoutProjectInput = {
    where: EnvironmentWhereUniqueInput;
    update: XOR<
      EnvironmentUpdateWithoutProjectInput,
      EnvironmentUncheckedUpdateWithoutProjectInput
    >;
    create: XOR<
      EnvironmentCreateWithoutProjectInput,
      EnvironmentUncheckedCreateWithoutProjectInput
    >;
  };

  export type EnvironmentUpdateWithWhereUniqueWithoutProjectInput = {
    where: EnvironmentWhereUniqueInput;
    data: XOR<
      EnvironmentUpdateWithoutProjectInput,
      EnvironmentUncheckedUpdateWithoutProjectInput
    >;
  };

  export type EnvironmentUpdateManyWithWhereWithoutProjectInput = {
    where: EnvironmentScalarWhereInput;
    data: XOR<
      EnvironmentUpdateManyMutationInput,
      EnvironmentUncheckedUpdateManyWithoutProjectInput
    >;
  };

  export type EnvironmentScalarWhereInput = {
    AND?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[];
    OR?: EnvironmentScalarWhereInput[];
    NOT?: EnvironmentScalarWhereInput | EnvironmentScalarWhereInput[];
    id?: StringFilter<'Environment'> | string;
    name?: StringFilter<'Environment'> | string;
    label?: StringFilter<'Environment'> | string;
    color?: StringFilter<'Environment'> | string;
    projectId?: StringFilter<'Environment'> | string;
    createdAt?: DateTimeFilter<'Environment'> | Date | string;
  };

  export type AlertRuleUpsertWithWhereUniqueWithoutProjectInput = {
    where: AlertRuleWhereUniqueInput;
    update: XOR<
      AlertRuleUpdateWithoutProjectInput,
      AlertRuleUncheckedUpdateWithoutProjectInput
    >;
    create: XOR<
      AlertRuleCreateWithoutProjectInput,
      AlertRuleUncheckedCreateWithoutProjectInput
    >;
  };

  export type AlertRuleUpdateWithWhereUniqueWithoutProjectInput = {
    where: AlertRuleWhereUniqueInput;
    data: XOR<
      AlertRuleUpdateWithoutProjectInput,
      AlertRuleUncheckedUpdateWithoutProjectInput
    >;
  };

  export type AlertRuleUpdateManyWithWhereWithoutProjectInput = {
    where: AlertRuleScalarWhereInput;
    data: XOR<
      AlertRuleUpdateManyMutationInput,
      AlertRuleUncheckedUpdateManyWithoutProjectInput
    >;
  };

  export type AuditLogUpsertWithWhereUniqueWithoutProjectInput = {
    where: AuditLogWhereUniqueInput;
    update: XOR<
      AuditLogUpdateWithoutProjectInput,
      AuditLogUncheckedUpdateWithoutProjectInput
    >;
    create: XOR<
      AuditLogCreateWithoutProjectInput,
      AuditLogUncheckedCreateWithoutProjectInput
    >;
  };

  export type AuditLogUpdateWithWhereUniqueWithoutProjectInput = {
    where: AuditLogWhereUniqueInput;
    data: XOR<
      AuditLogUpdateWithoutProjectInput,
      AuditLogUncheckedUpdateWithoutProjectInput
    >;
  };

  export type AuditLogUpdateManyWithWhereWithoutProjectInput = {
    where: AuditLogScalarWhereInput;
    data: XOR<
      AuditLogUpdateManyMutationInput,
      AuditLogUncheckedUpdateManyWithoutProjectInput
    >;
  };

  export type ProjectCreateWithoutEnvironmentsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProjectsInput;
    apiCalls?: ApiCallCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateWithoutEnvironmentsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectCreateOrConnectWithoutEnvironmentsInput = {
    where: ProjectWhereUniqueInput;
    create: XOR<
      ProjectCreateWithoutEnvironmentsInput,
      ProjectUncheckedCreateWithoutEnvironmentsInput
    >;
  };

  export type ApiCallCreateWithoutEnvironmentInput = {
    id?: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
    project: ProjectCreateNestedOneWithoutApiCallsInput;
    user: UserCreateNestedOneWithoutApiCallsInput;
  };

  export type ApiCallUncheckedCreateWithoutEnvironmentInput = {
    id?: string;
    projectId: string;
    userId: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallCreateOrConnectWithoutEnvironmentInput = {
    where: ApiCallWhereUniqueInput;
    create: XOR<
      ApiCallCreateWithoutEnvironmentInput,
      ApiCallUncheckedCreateWithoutEnvironmentInput
    >;
  };

  export type ApiCallCreateManyEnvironmentInputEnvelope = {
    data:
      | ApiCallCreateManyEnvironmentInput
      | ApiCallCreateManyEnvironmentInput[];
  };

  export type ProjectUpsertWithoutEnvironmentsInput = {
    update: XOR<
      ProjectUpdateWithoutEnvironmentsInput,
      ProjectUncheckedUpdateWithoutEnvironmentsInput
    >;
    create: XOR<
      ProjectCreateWithoutEnvironmentsInput,
      ProjectUncheckedCreateWithoutEnvironmentsInput
    >;
    where?: ProjectWhereInput;
  };

  export type ProjectUpdateToOneWithWhereWithoutEnvironmentsInput = {
    where?: ProjectWhereInput;
    data: XOR<
      ProjectUpdateWithoutEnvironmentsInput,
      ProjectUncheckedUpdateWithoutEnvironmentsInput
    >;
  };

  export type ProjectUpdateWithoutEnvironmentsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateWithoutEnvironmentsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type ApiCallUpsertWithWhereUniqueWithoutEnvironmentInput = {
    where: ApiCallWhereUniqueInput;
    update: XOR<
      ApiCallUpdateWithoutEnvironmentInput,
      ApiCallUncheckedUpdateWithoutEnvironmentInput
    >;
    create: XOR<
      ApiCallCreateWithoutEnvironmentInput,
      ApiCallUncheckedCreateWithoutEnvironmentInput
    >;
  };

  export type ApiCallUpdateWithWhereUniqueWithoutEnvironmentInput = {
    where: ApiCallWhereUniqueInput;
    data: XOR<
      ApiCallUpdateWithoutEnvironmentInput,
      ApiCallUncheckedUpdateWithoutEnvironmentInput
    >;
  };

  export type ApiCallUpdateManyWithWhereWithoutEnvironmentInput = {
    where: ApiCallScalarWhereInput;
    data: XOR<
      ApiCallUpdateManyMutationInput,
      ApiCallUncheckedUpdateManyWithoutEnvironmentInput
    >;
  };

  export type ProjectCreateWithoutApiCallsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProjectsInput;
    environments?: EnvironmentCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateWithoutApiCallsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    environments?: EnvironmentUncheckedCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectCreateOrConnectWithoutApiCallsInput = {
    where: ProjectWhereUniqueInput;
    create: XOR<
      ProjectCreateWithoutApiCallsInput,
      ProjectUncheckedCreateWithoutApiCallsInput
    >;
  };

  export type UserCreateWithoutApiCallsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutApiCallsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutApiCallsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutApiCallsInput,
      UserUncheckedCreateWithoutApiCallsInput
    >;
  };

  export type EnvironmentCreateWithoutApiCallsInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    createdAt?: Date | string;
    project: ProjectCreateNestedOneWithoutEnvironmentsInput;
  };

  export type EnvironmentUncheckedCreateWithoutApiCallsInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    projectId: string;
    createdAt?: Date | string;
  };

  export type EnvironmentCreateOrConnectWithoutApiCallsInput = {
    where: EnvironmentWhereUniqueInput;
    create: XOR<
      EnvironmentCreateWithoutApiCallsInput,
      EnvironmentUncheckedCreateWithoutApiCallsInput
    >;
  };

  export type ProjectUpsertWithoutApiCallsInput = {
    update: XOR<
      ProjectUpdateWithoutApiCallsInput,
      ProjectUncheckedUpdateWithoutApiCallsInput
    >;
    create: XOR<
      ProjectCreateWithoutApiCallsInput,
      ProjectUncheckedCreateWithoutApiCallsInput
    >;
    where?: ProjectWhereInput;
  };

  export type ProjectUpdateToOneWithWhereWithoutApiCallsInput = {
    where?: ProjectWhereInput;
    data: XOR<
      ProjectUpdateWithoutApiCallsInput,
      ProjectUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type ProjectUpdateWithoutApiCallsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
    environments?: EnvironmentUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateWithoutApiCallsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    environments?: EnvironmentUncheckedUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type UserUpsertWithoutApiCallsInput = {
    update: XOR<
      UserUpdateWithoutApiCallsInput,
      UserUncheckedUpdateWithoutApiCallsInput
    >;
    create: XOR<
      UserCreateWithoutApiCallsInput,
      UserUncheckedCreateWithoutApiCallsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutApiCallsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutApiCallsInput,
      UserUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type UserUpdateWithoutApiCallsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutApiCallsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type EnvironmentUpsertWithoutApiCallsInput = {
    update: XOR<
      EnvironmentUpdateWithoutApiCallsInput,
      EnvironmentUncheckedUpdateWithoutApiCallsInput
    >;
    create: XOR<
      EnvironmentCreateWithoutApiCallsInput,
      EnvironmentUncheckedCreateWithoutApiCallsInput
    >;
    where?: EnvironmentWhereInput;
  };

  export type EnvironmentUpdateToOneWithWhereWithoutApiCallsInput = {
    where?: EnvironmentWhereInput;
    data: XOR<
      EnvironmentUpdateWithoutApiCallsInput,
      EnvironmentUncheckedUpdateWithoutApiCallsInput
    >;
  };

  export type EnvironmentUpdateWithoutApiCallsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutEnvironmentsNestedInput;
  };

  export type EnvironmentUncheckedUpdateWithoutApiCallsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    projectId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProjectCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProjectsInput;
    apiCalls?: ApiCallCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateWithoutAlertRulesInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentUncheckedCreateNestedManyWithoutProjectInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectCreateOrConnectWithoutAlertRulesInput = {
    where: ProjectWhereUniqueInput;
    create: XOR<
      ProjectCreateWithoutAlertRulesInput,
      ProjectUncheckedCreateWithoutAlertRulesInput
    >;
  };

  export type UserCreateWithoutAlertRulesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutAlertRulesInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutAlertRulesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAlertRulesInput,
      UserUncheckedCreateWithoutAlertRulesInput
    >;
  };

  export type ProjectUpsertWithoutAlertRulesInput = {
    update: XOR<
      ProjectUpdateWithoutAlertRulesInput,
      ProjectUncheckedUpdateWithoutAlertRulesInput
    >;
    create: XOR<
      ProjectCreateWithoutAlertRulesInput,
      ProjectUncheckedCreateWithoutAlertRulesInput
    >;
    where?: ProjectWhereInput;
  };

  export type ProjectUpdateToOneWithWhereWithoutAlertRulesInput = {
    where?: ProjectWhereInput;
    data: XOR<
      ProjectUpdateWithoutAlertRulesInput,
      ProjectUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type ProjectUpdateWithoutAlertRulesInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateWithoutAlertRulesInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUncheckedUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type UserUpsertWithoutAlertRulesInput = {
    update: XOR<
      UserUpdateWithoutAlertRulesInput,
      UserUncheckedUpdateWithoutAlertRulesInput
    >;
    create: XOR<
      UserCreateWithoutAlertRulesInput,
      UserUncheckedCreateWithoutAlertRulesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAlertRulesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAlertRulesInput,
      UserUncheckedUpdateWithoutAlertRulesInput
    >;
  };

  export type UserUpdateWithoutAlertRulesInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutAlertRulesInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    password: string;
    name?: string | null;
    sdkToken: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutUserInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
  };

  export type ProjectCreateWithoutAuditLogsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutProjectsInput;
    apiCalls?: ApiCallCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleCreateNestedManyWithoutProjectInput;
  };

  export type ProjectUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    apiCalls?: ApiCallUncheckedCreateNestedManyWithoutProjectInput;
    environments?: EnvironmentUncheckedCreateNestedManyWithoutProjectInput;
    alertRules?: AlertRuleUncheckedCreateNestedManyWithoutProjectInput;
  };

  export type ProjectCreateOrConnectWithoutAuditLogsInput = {
    where: ProjectWhereUniqueInput;
    create: XOR<
      ProjectCreateWithoutAuditLogsInput,
      ProjectUncheckedCreateWithoutAuditLogsInput
    >;
  };

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<
      UserUpdateWithoutAuditLogsInput,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
    create: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAuditLogsInput,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type UserUpdateWithoutAuditLogsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    sdkToken?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutUserNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type ProjectUpsertWithoutAuditLogsInput = {
    update: XOR<
      ProjectUpdateWithoutAuditLogsInput,
      ProjectUncheckedUpdateWithoutAuditLogsInput
    >;
    create: XOR<
      ProjectCreateWithoutAuditLogsInput,
      ProjectUncheckedCreateWithoutAuditLogsInput
    >;
    where?: ProjectWhereInput;
  };

  export type ProjectUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: ProjectWhereInput;
    data: XOR<
      ProjectUpdateWithoutAuditLogsInput,
      ProjectUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type ProjectUpdateWithoutAuditLogsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput;
    apiCalls?: ApiCallUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateWithoutAuditLogsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUncheckedUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectCreateManyUserInput = {
    id?: string;
    name: string;
    description?: string | null;
    slug?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ApiCallCreateManyUserInput = {
    id?: string;
    projectId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type AlertRuleCreateManyUserInput = {
    id?: string;
    projectId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AuditLogCreateManyUserInput = {
    id?: string;
    projectId?: string | null;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type ProjectUpdateWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutProjectNestedInput;
    environments?: EnvironmentUncheckedUpdateManyWithoutProjectNestedInput;
    alertRules?: AlertRuleUncheckedUpdateManyWithoutProjectNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutProjectNestedInput;
  };

  export type ProjectUncheckedUpdateManyWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    slug?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallUpdateWithoutUserInput = {
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutApiCallsNestedInput;
    environment?: EnvironmentUpdateOneWithoutApiCallsNestedInput;
  };

  export type ApiCallUncheckedUpdateWithoutUserInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallUncheckedUpdateManyWithoutUserInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUpdateWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateWithoutUserInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUncheckedUpdateManyWithoutUserInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUpdateWithoutUserInput = {
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneWithoutAuditLogsNestedInput;
  };

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    projectId?: NullableStringFieldUpdateOperationsInput | string | null;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    projectId?: NullableStringFieldUpdateOperationsInput | string | null;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallCreateManyProjectInput = {
    id?: string;
    userId: string;
    environmentId?: string | null;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type EnvironmentCreateManyProjectInput = {
    id?: string;
    name: string;
    label: string;
    color?: string;
    createdAt?: Date | string;
  };

  export type AlertRuleCreateManyProjectInput = {
    id?: string;
    userId: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    windowMin?: number;
    enabled?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AuditLogCreateManyProjectInput = {
    id?: string;
    userId: string;
    action: string;
    detail?: InputJsonValue | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallUpdateWithoutProjectInput = {
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutApiCallsNestedInput;
    environment?: EnvironmentUpdateOneWithoutApiCallsNestedInput;
  };

  export type ApiCallUncheckedUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallUncheckedUpdateManyWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    environmentId?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EnvironmentUpdateWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUpdateManyWithoutEnvironmentNestedInput;
  };

  export type EnvironmentUncheckedUpdateWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    apiCalls?: ApiCallUncheckedUpdateManyWithoutEnvironmentNestedInput;
  };

  export type EnvironmentUncheckedUpdateManyWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string;
    label?: StringFieldUpdateOperationsInput | string;
    color?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUpdateWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAlertRulesNestedInput;
  };

  export type AlertRuleUncheckedUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AlertRuleUncheckedUpdateManyWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    metric?: StringFieldUpdateOperationsInput | string;
    operator?: StringFieldUpdateOperationsInput | string;
    threshold?: FloatFieldUpdateOperationsInput | number;
    windowMin?: IntFieldUpdateOperationsInput | number;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUpdateWithoutProjectInput = {
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput;
  };

  export type AuditLogUncheckedUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateManyWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    detail?: InputJsonValue | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallCreateManyEnvironmentInput = {
    id?: string;
    projectId: string;
    userId: string;
    method: string;
    url: string;
    host: string;
    path: string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: number | null;
    statusText?: string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: number | null;
    latency: number;
    startedAt: Date | string;
    endedAt: Date | string;
    status?: string;
    sdkVersion?: string | null;
    hostname?: string | null;
    createdAt?: Date | string;
  };

  export type ApiCallUpdateWithoutEnvironmentInput = {
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    project?: ProjectUpdateOneRequiredWithoutApiCallsNestedInput;
    user?: UserUpdateOneRequiredWithoutApiCallsNestedInput;
  };

  export type ApiCallUncheckedUpdateWithoutEnvironmentInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ApiCallUncheckedUpdateManyWithoutEnvironmentInput = {
    projectId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    method?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    host?: StringFieldUpdateOperationsInput | string;
    path?: StringFieldUpdateOperationsInput | string;
    requestHeaders?: InputJsonValue | null;
    requestBody?: InputJsonValue | null;
    queryParams?: InputJsonValue | null;
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null;
    statusText?: NullableStringFieldUpdateOperationsInput | string | null;
    responseHeaders?: InputJsonValue | null;
    responseBody?: InputJsonValue | null;
    responseSize?: NullableIntFieldUpdateOperationsInput | number | null;
    latency?: IntFieldUpdateOperationsInput | number;
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: StringFieldUpdateOperationsInput | string;
    sdkVersion?: NullableStringFieldUpdateOperationsInput | string | null;
    hostname?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
