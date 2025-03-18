
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model PlanService
 * 
 */
export type PlanService = $Result.DefaultSelection<Prisma.$PlanServicePayload>
/**
 * Model CategoryService
 * 
 */
export type CategoryService = $Result.DefaultSelection<Prisma.$CategoryServicePayload>
/**
 * Model Price
 * 
 */
export type Price = $Result.DefaultSelection<Prisma.$PricePayload>
/**
 * Model Benefit
 * 
 */
export type Benefit = $Result.DefaultSelection<Prisma.$BenefitPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Blog
 * 
 */
export type Blog = $Result.DefaultSelection<Prisma.$BlogPayload>
/**
 * Model BlogCategory
 * 
 */
export type BlogCategory = $Result.DefaultSelection<Prisma.$BlogCategoryPayload>
/**
 * Model Pages
 * 
 */
export type Pages = $Result.DefaultSelection<Prisma.$PagesPayload>
/**
 * Model MetaTag
 * 
 */
export type MetaTag = $Result.DefaultSelection<Prisma.$MetaTagPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PlanStatus: {
  Draft: 'Draft',
  Active: 'Active',
  NonActive: 'NonActive'
};

export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus]


export const BlogStatus: {
  Published: 'Published',
  Takedown: 'Takedown',
  Draft: 'Draft'
};

export type BlogStatus = (typeof BlogStatus)[keyof typeof BlogStatus]


export const PlanType: {
  Standard: 'Standard',
  Premium: 'Premium'
};

export type PlanType = (typeof PlanType)[keyof typeof PlanType]


export const Currency: {
  IDR: 'IDR',
  SGR: 'SGR',
  MYR: 'MYR'
};

export type Currency = (typeof Currency)[keyof typeof Currency]

}

export type PlanStatus = $Enums.PlanStatus

export const PlanStatus: typeof $Enums.PlanStatus

export type BlogStatus = $Enums.BlogStatus

export const BlogStatus: typeof $Enums.BlogStatus

export type PlanType = $Enums.PlanType

export const PlanType: typeof $Enums.PlanType

export type Currency = $Enums.Currency

export const Currency: typeof $Enums.Currency

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PlanServices
 * const planServices = await prisma.planService.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more PlanServices
   * const planServices = await prisma.planService.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.planService`: Exposes CRUD operations for the **PlanService** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlanServices
    * const planServices = await prisma.planService.findMany()
    * ```
    */
  get planService(): Prisma.PlanServiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoryService`: Exposes CRUD operations for the **CategoryService** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CategoryServices
    * const categoryServices = await prisma.categoryService.findMany()
    * ```
    */
  get categoryService(): Prisma.CategoryServiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.price`: Exposes CRUD operations for the **Price** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Prices
    * const prices = await prisma.price.findMany()
    * ```
    */
  get price(): Prisma.PriceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.benefit`: Exposes CRUD operations for the **Benefit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Benefits
    * const benefits = await prisma.benefit.findMany()
    * ```
    */
  get benefit(): Prisma.BenefitDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.blog`: Exposes CRUD operations for the **Blog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Blogs
    * const blogs = await prisma.blog.findMany()
    * ```
    */
  get blog(): Prisma.BlogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.blogCategory`: Exposes CRUD operations for the **BlogCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BlogCategories
    * const blogCategories = await prisma.blogCategory.findMany()
    * ```
    */
  get blogCategory(): Prisma.BlogCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pages`: Exposes CRUD operations for the **Pages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pages
    * const pages = await prisma.pages.findMany()
    * ```
    */
  get pages(): Prisma.PagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metaTag`: Exposes CRUD operations for the **MetaTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MetaTags
    * const metaTags = await prisma.metaTag.findMany()
    * ```
    */
  get metaTag(): Prisma.MetaTagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.5.0
   * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

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
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
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
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    PlanService: 'PlanService',
    CategoryService: 'CategoryService',
    Price: 'Price',
    Benefit: 'Benefit',
    Role: 'Role',
    Blog: 'Blog',
    BlogCategory: 'BlogCategory',
    Pages: 'Pages',
    MetaTag: 'MetaTag',
    Order: 'Order'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "planService" | "categoryService" | "price" | "benefit" | "role" | "blog" | "blogCategory" | "pages" | "metaTag" | "order"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PlanService: {
        payload: Prisma.$PlanServicePayload<ExtArgs>
        fields: Prisma.PlanServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          findFirst: {
            args: Prisma.PlanServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          findMany: {
            args: Prisma.PlanServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>[]
          }
          create: {
            args: Prisma.PlanServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          createMany: {
            args: Prisma.PlanServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlanServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          update: {
            args: Prisma.PlanServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          deleteMany: {
            args: Prisma.PlanServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanServicePayload>
          }
          aggregate: {
            args: Prisma.PlanServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlanService>
          }
          groupBy: {
            args: Prisma.PlanServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanServiceCountArgs<ExtArgs>
            result: $Utils.Optional<PlanServiceCountAggregateOutputType> | number
          }
        }
      }
      CategoryService: {
        payload: Prisma.$CategoryServicePayload<ExtArgs>
        fields: Prisma.CategoryServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          findFirst: {
            args: Prisma.CategoryServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          findMany: {
            args: Prisma.CategoryServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>[]
          }
          create: {
            args: Prisma.CategoryServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          createMany: {
            args: Prisma.CategoryServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          update: {
            args: Prisma.CategoryServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          deleteMany: {
            args: Prisma.CategoryServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryServicePayload>
          }
          aggregate: {
            args: Prisma.CategoryServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoryService>
          }
          groupBy: {
            args: Prisma.CategoryServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryServiceCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryServiceCountAggregateOutputType> | number
          }
        }
      }
      Price: {
        payload: Prisma.$PricePayload<ExtArgs>
        fields: Prisma.PriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          findFirst: {
            args: Prisma.PriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          findMany: {
            args: Prisma.PriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>[]
          }
          create: {
            args: Prisma.PriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          createMany: {
            args: Prisma.PriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          update: {
            args: Prisma.PriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          deleteMany: {
            args: Prisma.PriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePayload>
          }
          aggregate: {
            args: Prisma.PriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrice>
          }
          groupBy: {
            args: Prisma.PriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriceCountArgs<ExtArgs>
            result: $Utils.Optional<PriceCountAggregateOutputType> | number
          }
        }
      }
      Benefit: {
        payload: Prisma.$BenefitPayload<ExtArgs>
        fields: Prisma.BenefitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BenefitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BenefitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          findFirst: {
            args: Prisma.BenefitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BenefitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          findMany: {
            args: Prisma.BenefitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>[]
          }
          create: {
            args: Prisma.BenefitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          createMany: {
            args: Prisma.BenefitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BenefitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          update: {
            args: Prisma.BenefitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          deleteMany: {
            args: Prisma.BenefitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BenefitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BenefitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BenefitPayload>
          }
          aggregate: {
            args: Prisma.BenefitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBenefit>
          }
          groupBy: {
            args: Prisma.BenefitGroupByArgs<ExtArgs>
            result: $Utils.Optional<BenefitGroupByOutputType>[]
          }
          count: {
            args: Prisma.BenefitCountArgs<ExtArgs>
            result: $Utils.Optional<BenefitCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Blog: {
        payload: Prisma.$BlogPayload<ExtArgs>
        fields: Prisma.BlogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          findFirst: {
            args: Prisma.BlogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          findMany: {
            args: Prisma.BlogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>[]
          }
          create: {
            args: Prisma.BlogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          createMany: {
            args: Prisma.BlogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          update: {
            args: Prisma.BlogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          deleteMany: {
            args: Prisma.BlogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogPayload>
          }
          aggregate: {
            args: Prisma.BlogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlog>
          }
          groupBy: {
            args: Prisma.BlogGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogCountArgs<ExtArgs>
            result: $Utils.Optional<BlogCountAggregateOutputType> | number
          }
        }
      }
      BlogCategory: {
        payload: Prisma.$BlogCategoryPayload<ExtArgs>
        fields: Prisma.BlogCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          findFirst: {
            args: Prisma.BlogCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          findMany: {
            args: Prisma.BlogCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>[]
          }
          create: {
            args: Prisma.BlogCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          createMany: {
            args: Prisma.BlogCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          update: {
            args: Prisma.BlogCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          deleteMany: {
            args: Prisma.BlogCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCategoryPayload>
          }
          aggregate: {
            args: Prisma.BlogCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogCategory>
          }
          groupBy: {
            args: Prisma.BlogCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<BlogCategoryCountAggregateOutputType> | number
          }
        }
      }
      Pages: {
        payload: Prisma.$PagesPayload<ExtArgs>
        fields: Prisma.PagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          findFirst: {
            args: Prisma.PagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          findMany: {
            args: Prisma.PagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>[]
          }
          create: {
            args: Prisma.PagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          createMany: {
            args: Prisma.PagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          update: {
            args: Prisma.PagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          deleteMany: {
            args: Prisma.PagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagesPayload>
          }
          aggregate: {
            args: Prisma.PagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePages>
          }
          groupBy: {
            args: Prisma.PagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<PagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.PagesCountArgs<ExtArgs>
            result: $Utils.Optional<PagesCountAggregateOutputType> | number
          }
        }
      }
      MetaTag: {
        payload: Prisma.$MetaTagPayload<ExtArgs>
        fields: Prisma.MetaTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetaTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetaTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          findFirst: {
            args: Prisma.MetaTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetaTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          findMany: {
            args: Prisma.MetaTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>[]
          }
          create: {
            args: Prisma.MetaTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          createMany: {
            args: Prisma.MetaTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MetaTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          update: {
            args: Prisma.MetaTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          deleteMany: {
            args: Prisma.MetaTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetaTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MetaTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaTagPayload>
          }
          aggregate: {
            args: Prisma.MetaTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetaTag>
          }
          groupBy: {
            args: Prisma.MetaTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetaTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetaTagCountArgs<ExtArgs>
            result: $Utils.Optional<MetaTagCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
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
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    planService?: PlanServiceOmit
    categoryService?: CategoryServiceOmit
    price?: PriceOmit
    benefit?: BenefitOmit
    role?: RoleOmit
    blog?: BlogOmit
    blogCategory?: BlogCategoryOmit
    pages?: PagesOmit
    metaTag?: MetaTagOmit
    order?: OrderOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
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
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PlanServiceCountOutputType
   */

  export type PlanServiceCountOutputType = {
    prices: number
    benefits: number
    orders: number
  }

  export type PlanServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | PlanServiceCountOutputTypeCountPricesArgs
    benefits?: boolean | PlanServiceCountOutputTypeCountBenefitsArgs
    orders?: boolean | PlanServiceCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * PlanServiceCountOutputType without action
   */
  export type PlanServiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanServiceCountOutputType
     */
    select?: PlanServiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanServiceCountOutputType without action
   */
  export type PlanServiceCountOutputTypeCountPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceWhereInput
  }

  /**
   * PlanServiceCountOutputType without action
   */
  export type PlanServiceCountOutputTypeCountBenefitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BenefitWhereInput
  }

  /**
   * PlanServiceCountOutputType without action
   */
  export type PlanServiceCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }


  /**
   * Count Type CategoryServiceCountOutputType
   */

  export type CategoryServiceCountOutputType = {
    plans: number
    orders: number
  }

  export type CategoryServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | CategoryServiceCountOutputTypeCountPlansArgs
    orders?: boolean | CategoryServiceCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * CategoryServiceCountOutputType without action
   */
  export type CategoryServiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryServiceCountOutputType
     */
    select?: CategoryServiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryServiceCountOutputType without action
   */
  export type CategoryServiceCountOutputTypeCountPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanServiceWhereInput
  }

  /**
   * CategoryServiceCountOutputType without action
   */
  export type CategoryServiceCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    blogs: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blogs?: boolean | RoleCountOutputTypeCountBlogsArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountBlogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlogWhereInput
  }


  /**
   * Count Type BlogCategoryCountOutputType
   */

  export type BlogCategoryCountOutputType = {
    blogs: number
  }

  export type BlogCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blogs?: boolean | BlogCategoryCountOutputTypeCountBlogsArgs
  }

  // Custom InputTypes
  /**
   * BlogCategoryCountOutputType without action
   */
  export type BlogCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategoryCountOutputType
     */
    select?: BlogCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogCategoryCountOutputType without action
   */
  export type BlogCategoryCountOutputTypeCountBlogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlogWhereInput
  }


  /**
   * Count Type PagesCountOutputType
   */

  export type PagesCountOutputType = {
    meta: number
  }

  export type PagesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta?: boolean | PagesCountOutputTypeCountMetaArgs
  }

  // Custom InputTypes
  /**
   * PagesCountOutputType without action
   */
  export type PagesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PagesCountOutputType
     */
    select?: PagesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PagesCountOutputType without action
   */
  export type PagesCountOutputTypeCountMetaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetaTagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PlanService
   */

  export type AggregatePlanService = {
    _count: PlanServiceCountAggregateOutputType | null
    _min: PlanServiceMinAggregateOutputType | null
    _max: PlanServiceMaxAggregateOutputType | null
  }

  export type PlanServiceMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.PlanType | null
    showPrice: boolean | null
    status: $Enums.PlanStatus | null
    options: string | null
    descriptions: string | null
    categoryId: string | null
  }

  export type PlanServiceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.PlanType | null
    showPrice: boolean | null
    status: $Enums.PlanStatus | null
    options: string | null
    descriptions: string | null
    categoryId: string | null
  }

  export type PlanServiceCountAggregateOutputType = {
    id: number
    name: number
    type: number
    showPrice: number
    status: number
    options: number
    descriptions: number
    categoryId: number
    _all: number
  }


  export type PlanServiceMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    showPrice?: true
    status?: true
    options?: true
    descriptions?: true
    categoryId?: true
  }

  export type PlanServiceMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    showPrice?: true
    status?: true
    options?: true
    descriptions?: true
    categoryId?: true
  }

  export type PlanServiceCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    showPrice?: true
    status?: true
    options?: true
    descriptions?: true
    categoryId?: true
    _all?: true
  }

  export type PlanServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanService to aggregate.
     */
    where?: PlanServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanServices to fetch.
     */
    orderBy?: PlanServiceOrderByWithRelationInput | PlanServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlanServices
    **/
    _count?: true | PlanServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanServiceMaxAggregateInputType
  }

  export type GetPlanServiceAggregateType<T extends PlanServiceAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanService[P]>
      : GetScalarType<T[P], AggregatePlanService[P]>
  }




  export type PlanServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanServiceWhereInput
    orderBy?: PlanServiceOrderByWithAggregationInput | PlanServiceOrderByWithAggregationInput[]
    by: PlanServiceScalarFieldEnum[] | PlanServiceScalarFieldEnum
    having?: PlanServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanServiceCountAggregateInputType | true
    _min?: PlanServiceMinAggregateInputType
    _max?: PlanServiceMaxAggregateInputType
  }

  export type PlanServiceGroupByOutputType = {
    id: string
    name: string
    type: $Enums.PlanType
    showPrice: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
    _count: PlanServiceCountAggregateOutputType | null
    _min: PlanServiceMinAggregateOutputType | null
    _max: PlanServiceMaxAggregateOutputType | null
  }

  type GetPlanServiceGroupByPayload<T extends PlanServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanServiceGroupByOutputType[P]>
            : GetScalarType<T[P], PlanServiceGroupByOutputType[P]>
        }
      >
    >


  export type PlanServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    showPrice?: boolean
    status?: boolean
    options?: boolean
    descriptions?: boolean
    categoryId?: boolean
    prices?: boolean | PlanService$pricesArgs<ExtArgs>
    benefits?: boolean | PlanService$benefitsArgs<ExtArgs>
    category?: boolean | CategoryServiceDefaultArgs<ExtArgs>
    orders?: boolean | PlanService$ordersArgs<ExtArgs>
    _count?: boolean | PlanServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["planService"]>



  export type PlanServiceSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    showPrice?: boolean
    status?: boolean
    options?: boolean
    descriptions?: boolean
    categoryId?: boolean
  }

  export type PlanServiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "showPrice" | "status" | "options" | "descriptions" | "categoryId", ExtArgs["result"]["planService"]>
  export type PlanServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | PlanService$pricesArgs<ExtArgs>
    benefits?: boolean | PlanService$benefitsArgs<ExtArgs>
    category?: boolean | CategoryServiceDefaultArgs<ExtArgs>
    orders?: boolean | PlanService$ordersArgs<ExtArgs>
    _count?: boolean | PlanServiceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PlanServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlanService"
    objects: {
      prices: Prisma.$PricePayload<ExtArgs>[]
      benefits: Prisma.$BenefitPayload<ExtArgs>[]
      category: Prisma.$CategoryServicePayload<ExtArgs>
      orders: Prisma.$OrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.PlanType
      showPrice: boolean
      status: $Enums.PlanStatus
      options: string
      descriptions: string
      categoryId: string
    }, ExtArgs["result"]["planService"]>
    composites: {}
  }

  type PlanServiceGetPayload<S extends boolean | null | undefined | PlanServiceDefaultArgs> = $Result.GetResult<Prisma.$PlanServicePayload, S>

  type PlanServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanServiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanServiceCountAggregateInputType | true
    }

  export interface PlanServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlanService'], meta: { name: 'PlanService' } }
    /**
     * Find zero or one PlanService that matches the filter.
     * @param {PlanServiceFindUniqueArgs} args - Arguments to find a PlanService
     * @example
     * // Get one PlanService
     * const planService = await prisma.planService.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanServiceFindUniqueArgs>(args: SelectSubset<T, PlanServiceFindUniqueArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlanService that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanServiceFindUniqueOrThrowArgs} args - Arguments to find a PlanService
     * @example
     * // Get one PlanService
     * const planService = await prisma.planService.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanService that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceFindFirstArgs} args - Arguments to find a PlanService
     * @example
     * // Get one PlanService
     * const planService = await prisma.planService.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanServiceFindFirstArgs>(args?: SelectSubset<T, PlanServiceFindFirstArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanService that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceFindFirstOrThrowArgs} args - Arguments to find a PlanService
     * @example
     * // Get one PlanService
     * const planService = await prisma.planService.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlanServices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlanServices
     * const planServices = await prisma.planService.findMany()
     * 
     * // Get first 10 PlanServices
     * const planServices = await prisma.planService.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planServiceWithIdOnly = await prisma.planService.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanServiceFindManyArgs>(args?: SelectSubset<T, PlanServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlanService.
     * @param {PlanServiceCreateArgs} args - Arguments to create a PlanService.
     * @example
     * // Create one PlanService
     * const PlanService = await prisma.planService.create({
     *   data: {
     *     // ... data to create a PlanService
     *   }
     * })
     * 
     */
    create<T extends PlanServiceCreateArgs>(args: SelectSubset<T, PlanServiceCreateArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlanServices.
     * @param {PlanServiceCreateManyArgs} args - Arguments to create many PlanServices.
     * @example
     * // Create many PlanServices
     * const planService = await prisma.planService.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanServiceCreateManyArgs>(args?: SelectSubset<T, PlanServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PlanService.
     * @param {PlanServiceDeleteArgs} args - Arguments to delete one PlanService.
     * @example
     * // Delete one PlanService
     * const PlanService = await prisma.planService.delete({
     *   where: {
     *     // ... filter to delete one PlanService
     *   }
     * })
     * 
     */
    delete<T extends PlanServiceDeleteArgs>(args: SelectSubset<T, PlanServiceDeleteArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlanService.
     * @param {PlanServiceUpdateArgs} args - Arguments to update one PlanService.
     * @example
     * // Update one PlanService
     * const planService = await prisma.planService.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanServiceUpdateArgs>(args: SelectSubset<T, PlanServiceUpdateArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlanServices.
     * @param {PlanServiceDeleteManyArgs} args - Arguments to filter PlanServices to delete.
     * @example
     * // Delete a few PlanServices
     * const { count } = await prisma.planService.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanServiceDeleteManyArgs>(args?: SelectSubset<T, PlanServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlanServices
     * const planService = await prisma.planService.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanServiceUpdateManyArgs>(args: SelectSubset<T, PlanServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PlanService.
     * @param {PlanServiceUpsertArgs} args - Arguments to update or create a PlanService.
     * @example
     * // Update or create a PlanService
     * const planService = await prisma.planService.upsert({
     *   create: {
     *     // ... data to create a PlanService
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlanService we want to update
     *   }
     * })
     */
    upsert<T extends PlanServiceUpsertArgs>(args: SelectSubset<T, PlanServiceUpsertArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlanServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceCountArgs} args - Arguments to filter PlanServices to count.
     * @example
     * // Count the number of PlanServices
     * const count = await prisma.planService.count({
     *   where: {
     *     // ... the filter for the PlanServices we want to count
     *   }
     * })
    **/
    count<T extends PlanServiceCountArgs>(
      args?: Subset<T, PlanServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlanService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlanServiceAggregateArgs>(args: Subset<T, PlanServiceAggregateArgs>): Prisma.PrismaPromise<GetPlanServiceAggregateType<T>>

    /**
     * Group by PlanService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanServiceGroupByArgs} args - Group by arguments.
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
      T extends PlanServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanServiceGroupByArgs['orderBy'] }
        : { orderBy?: PlanServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlanService model
   */
  readonly fields: PlanServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlanService.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prices<T extends PlanService$pricesArgs<ExtArgs> = {}>(args?: Subset<T, PlanService$pricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    benefits<T extends PlanService$benefitsArgs<ExtArgs> = {}>(args?: Subset<T, PlanService$benefitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    category<T extends CategoryServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryServiceDefaultArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    orders<T extends PlanService$ordersArgs<ExtArgs> = {}>(args?: Subset<T, PlanService$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlanService model
   */ 
  interface PlanServiceFieldRefs {
    readonly id: FieldRef<"PlanService", 'String'>
    readonly name: FieldRef<"PlanService", 'String'>
    readonly type: FieldRef<"PlanService", 'PlanType'>
    readonly showPrice: FieldRef<"PlanService", 'Boolean'>
    readonly status: FieldRef<"PlanService", 'PlanStatus'>
    readonly options: FieldRef<"PlanService", 'String'>
    readonly descriptions: FieldRef<"PlanService", 'String'>
    readonly categoryId: FieldRef<"PlanService", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PlanService findUnique
   */
  export type PlanServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter, which PlanService to fetch.
     */
    where: PlanServiceWhereUniqueInput
  }

  /**
   * PlanService findUniqueOrThrow
   */
  export type PlanServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter, which PlanService to fetch.
     */
    where: PlanServiceWhereUniqueInput
  }

  /**
   * PlanService findFirst
   */
  export type PlanServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter, which PlanService to fetch.
     */
    where?: PlanServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanServices to fetch.
     */
    orderBy?: PlanServiceOrderByWithRelationInput | PlanServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanServices.
     */
    cursor?: PlanServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanServices.
     */
    distinct?: PlanServiceScalarFieldEnum | PlanServiceScalarFieldEnum[]
  }

  /**
   * PlanService findFirstOrThrow
   */
  export type PlanServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter, which PlanService to fetch.
     */
    where?: PlanServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanServices to fetch.
     */
    orderBy?: PlanServiceOrderByWithRelationInput | PlanServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanServices.
     */
    cursor?: PlanServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanServices.
     */
    distinct?: PlanServiceScalarFieldEnum | PlanServiceScalarFieldEnum[]
  }

  /**
   * PlanService findMany
   */
  export type PlanServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter, which PlanServices to fetch.
     */
    where?: PlanServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanServices to fetch.
     */
    orderBy?: PlanServiceOrderByWithRelationInput | PlanServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlanServices.
     */
    cursor?: PlanServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanServices.
     */
    skip?: number
    distinct?: PlanServiceScalarFieldEnum | PlanServiceScalarFieldEnum[]
  }

  /**
   * PlanService create
   */
  export type PlanServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a PlanService.
     */
    data: XOR<PlanServiceCreateInput, PlanServiceUncheckedCreateInput>
  }

  /**
   * PlanService createMany
   */
  export type PlanServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlanServices.
     */
    data: PlanServiceCreateManyInput | PlanServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlanService update
   */
  export type PlanServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a PlanService.
     */
    data: XOR<PlanServiceUpdateInput, PlanServiceUncheckedUpdateInput>
    /**
     * Choose, which PlanService to update.
     */
    where: PlanServiceWhereUniqueInput
  }

  /**
   * PlanService updateMany
   */
  export type PlanServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlanServices.
     */
    data: XOR<PlanServiceUpdateManyMutationInput, PlanServiceUncheckedUpdateManyInput>
    /**
     * Filter which PlanServices to update
     */
    where?: PlanServiceWhereInput
    /**
     * Limit how many PlanServices to update.
     */
    limit?: number
  }

  /**
   * PlanService upsert
   */
  export type PlanServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the PlanService to update in case it exists.
     */
    where: PlanServiceWhereUniqueInput
    /**
     * In case the PlanService found by the `where` argument doesn't exist, create a new PlanService with this data.
     */
    create: XOR<PlanServiceCreateInput, PlanServiceUncheckedCreateInput>
    /**
     * In case the PlanService was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanServiceUpdateInput, PlanServiceUncheckedUpdateInput>
  }

  /**
   * PlanService delete
   */
  export type PlanServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    /**
     * Filter which PlanService to delete.
     */
    where: PlanServiceWhereUniqueInput
  }

  /**
   * PlanService deleteMany
   */
  export type PlanServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanServices to delete
     */
    where?: PlanServiceWhereInput
    /**
     * Limit how many PlanServices to delete.
     */
    limit?: number
  }

  /**
   * PlanService.prices
   */
  export type PlanService$pricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    where?: PriceWhereInput
    orderBy?: PriceOrderByWithRelationInput | PriceOrderByWithRelationInput[]
    cursor?: PriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PriceScalarFieldEnum | PriceScalarFieldEnum[]
  }

  /**
   * PlanService.benefits
   */
  export type PlanService$benefitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    where?: BenefitWhereInput
    orderBy?: BenefitOrderByWithRelationInput | BenefitOrderByWithRelationInput[]
    cursor?: BenefitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BenefitScalarFieldEnum | BenefitScalarFieldEnum[]
  }

  /**
   * PlanService.orders
   */
  export type PlanService$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * PlanService without action
   */
  export type PlanServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
  }


  /**
   * Model CategoryService
   */

  export type AggregateCategoryService = {
    _count: CategoryServiceCountAggregateOutputType | null
    _min: CategoryServiceMinAggregateOutputType | null
    _max: CategoryServiceMaxAggregateOutputType | null
  }

  export type CategoryServiceMinAggregateOutputType = {
    id: string | null
    name: string | null
    heading: string | null
    description: string | null
    status: $Enums.PlanStatus | null
    slug: string | null
  }

  export type CategoryServiceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    heading: string | null
    description: string | null
    status: $Enums.PlanStatus | null
    slug: string | null
  }

  export type CategoryServiceCountAggregateOutputType = {
    id: number
    name: number
    heading: number
    description: number
    status: number
    slug: number
    _all: number
  }


  export type CategoryServiceMinAggregateInputType = {
    id?: true
    name?: true
    heading?: true
    description?: true
    status?: true
    slug?: true
  }

  export type CategoryServiceMaxAggregateInputType = {
    id?: true
    name?: true
    heading?: true
    description?: true
    status?: true
    slug?: true
  }

  export type CategoryServiceCountAggregateInputType = {
    id?: true
    name?: true
    heading?: true
    description?: true
    status?: true
    slug?: true
    _all?: true
  }

  export type CategoryServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryService to aggregate.
     */
    where?: CategoryServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryServices to fetch.
     */
    orderBy?: CategoryServiceOrderByWithRelationInput | CategoryServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CategoryServices
    **/
    _count?: true | CategoryServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryServiceMaxAggregateInputType
  }

  export type GetCategoryServiceAggregateType<T extends CategoryServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoryService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoryService[P]>
      : GetScalarType<T[P], AggregateCategoryService[P]>
  }




  export type CategoryServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryServiceWhereInput
    orderBy?: CategoryServiceOrderByWithAggregationInput | CategoryServiceOrderByWithAggregationInput[]
    by: CategoryServiceScalarFieldEnum[] | CategoryServiceScalarFieldEnum
    having?: CategoryServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryServiceCountAggregateInputType | true
    _min?: CategoryServiceMinAggregateInputType
    _max?: CategoryServiceMaxAggregateInputType
  }

  export type CategoryServiceGroupByOutputType = {
    id: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    _count: CategoryServiceCountAggregateOutputType | null
    _min: CategoryServiceMinAggregateOutputType | null
    _max: CategoryServiceMaxAggregateOutputType | null
  }

  type GetCategoryServiceGroupByPayload<T extends CategoryServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryServiceGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryServiceGroupByOutputType[P]>
        }
      >
    >


  export type CategoryServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    heading?: boolean
    description?: boolean
    status?: boolean
    slug?: boolean
    plans?: boolean | CategoryService$plansArgs<ExtArgs>
    orders?: boolean | CategoryService$ordersArgs<ExtArgs>
    pages?: boolean | CategoryService$pagesArgs<ExtArgs>
    _count?: boolean | CategoryServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoryService"]>



  export type CategoryServiceSelectScalar = {
    id?: boolean
    name?: boolean
    heading?: boolean
    description?: boolean
    status?: boolean
    slug?: boolean
  }

  export type CategoryServiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "heading" | "description" | "status" | "slug", ExtArgs["result"]["categoryService"]>
  export type CategoryServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | CategoryService$plansArgs<ExtArgs>
    orders?: boolean | CategoryService$ordersArgs<ExtArgs>
    pages?: boolean | CategoryService$pagesArgs<ExtArgs>
    _count?: boolean | CategoryServiceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoryServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CategoryService"
    objects: {
      plans: Prisma.$PlanServicePayload<ExtArgs>[]
      orders: Prisma.$OrderPayload<ExtArgs>[]
      pages: Prisma.$PagesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      heading: string
      description: string
      status: $Enums.PlanStatus
      slug: string
    }, ExtArgs["result"]["categoryService"]>
    composites: {}
  }

  type CategoryServiceGetPayload<S extends boolean | null | undefined | CategoryServiceDefaultArgs> = $Result.GetResult<Prisma.$CategoryServicePayload, S>

  type CategoryServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryServiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryServiceCountAggregateInputType | true
    }

  export interface CategoryServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CategoryService'], meta: { name: 'CategoryService' } }
    /**
     * Find zero or one CategoryService that matches the filter.
     * @param {CategoryServiceFindUniqueArgs} args - Arguments to find a CategoryService
     * @example
     * // Get one CategoryService
     * const categoryService = await prisma.categoryService.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryServiceFindUniqueArgs>(args: SelectSubset<T, CategoryServiceFindUniqueArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CategoryService that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryServiceFindUniqueOrThrowArgs} args - Arguments to find a CategoryService
     * @example
     * // Get one CategoryService
     * const categoryService = await prisma.categoryService.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryService that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceFindFirstArgs} args - Arguments to find a CategoryService
     * @example
     * // Get one CategoryService
     * const categoryService = await prisma.categoryService.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryServiceFindFirstArgs>(args?: SelectSubset<T, CategoryServiceFindFirstArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryService that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceFindFirstOrThrowArgs} args - Arguments to find a CategoryService
     * @example
     * // Get one CategoryService
     * const categoryService = await prisma.categoryService.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CategoryServices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CategoryServices
     * const categoryServices = await prisma.categoryService.findMany()
     * 
     * // Get first 10 CategoryServices
     * const categoryServices = await prisma.categoryService.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryServiceWithIdOnly = await prisma.categoryService.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryServiceFindManyArgs>(args?: SelectSubset<T, CategoryServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CategoryService.
     * @param {CategoryServiceCreateArgs} args - Arguments to create a CategoryService.
     * @example
     * // Create one CategoryService
     * const CategoryService = await prisma.categoryService.create({
     *   data: {
     *     // ... data to create a CategoryService
     *   }
     * })
     * 
     */
    create<T extends CategoryServiceCreateArgs>(args: SelectSubset<T, CategoryServiceCreateArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CategoryServices.
     * @param {CategoryServiceCreateManyArgs} args - Arguments to create many CategoryServices.
     * @example
     * // Create many CategoryServices
     * const categoryService = await prisma.categoryService.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryServiceCreateManyArgs>(args?: SelectSubset<T, CategoryServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CategoryService.
     * @param {CategoryServiceDeleteArgs} args - Arguments to delete one CategoryService.
     * @example
     * // Delete one CategoryService
     * const CategoryService = await prisma.categoryService.delete({
     *   where: {
     *     // ... filter to delete one CategoryService
     *   }
     * })
     * 
     */
    delete<T extends CategoryServiceDeleteArgs>(args: SelectSubset<T, CategoryServiceDeleteArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CategoryService.
     * @param {CategoryServiceUpdateArgs} args - Arguments to update one CategoryService.
     * @example
     * // Update one CategoryService
     * const categoryService = await prisma.categoryService.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryServiceUpdateArgs>(args: SelectSubset<T, CategoryServiceUpdateArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CategoryServices.
     * @param {CategoryServiceDeleteManyArgs} args - Arguments to filter CategoryServices to delete.
     * @example
     * // Delete a few CategoryServices
     * const { count } = await prisma.categoryService.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryServiceDeleteManyArgs>(args?: SelectSubset<T, CategoryServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CategoryServices
     * const categoryService = await prisma.categoryService.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryServiceUpdateManyArgs>(args: SelectSubset<T, CategoryServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CategoryService.
     * @param {CategoryServiceUpsertArgs} args - Arguments to update or create a CategoryService.
     * @example
     * // Update or create a CategoryService
     * const categoryService = await prisma.categoryService.upsert({
     *   create: {
     *     // ... data to create a CategoryService
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CategoryService we want to update
     *   }
     * })
     */
    upsert<T extends CategoryServiceUpsertArgs>(args: SelectSubset<T, CategoryServiceUpsertArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CategoryServices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceCountArgs} args - Arguments to filter CategoryServices to count.
     * @example
     * // Count the number of CategoryServices
     * const count = await prisma.categoryService.count({
     *   where: {
     *     // ... the filter for the CategoryServices we want to count
     *   }
     * })
    **/
    count<T extends CategoryServiceCountArgs>(
      args?: Subset<T, CategoryServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CategoryService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoryServiceAggregateArgs>(args: Subset<T, CategoryServiceAggregateArgs>): Prisma.PrismaPromise<GetCategoryServiceAggregateType<T>>

    /**
     * Group by CategoryService.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryServiceGroupByArgs} args - Group by arguments.
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
      T extends CategoryServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryServiceGroupByArgs['orderBy'] }
        : { orderBy?: CategoryServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CategoryService model
   */
  readonly fields: CategoryServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CategoryService.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plans<T extends CategoryService$plansArgs<ExtArgs> = {}>(args?: Subset<T, CategoryService$plansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orders<T extends CategoryService$ordersArgs<ExtArgs> = {}>(args?: Subset<T, CategoryService$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pages<T extends CategoryService$pagesArgs<ExtArgs> = {}>(args?: Subset<T, CategoryService$pagesArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CategoryService model
   */ 
  interface CategoryServiceFieldRefs {
    readonly id: FieldRef<"CategoryService", 'String'>
    readonly name: FieldRef<"CategoryService", 'String'>
    readonly heading: FieldRef<"CategoryService", 'String'>
    readonly description: FieldRef<"CategoryService", 'String'>
    readonly status: FieldRef<"CategoryService", 'PlanStatus'>
    readonly slug: FieldRef<"CategoryService", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CategoryService findUnique
   */
  export type CategoryServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter, which CategoryService to fetch.
     */
    where: CategoryServiceWhereUniqueInput
  }

  /**
   * CategoryService findUniqueOrThrow
   */
  export type CategoryServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter, which CategoryService to fetch.
     */
    where: CategoryServiceWhereUniqueInput
  }

  /**
   * CategoryService findFirst
   */
  export type CategoryServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter, which CategoryService to fetch.
     */
    where?: CategoryServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryServices to fetch.
     */
    orderBy?: CategoryServiceOrderByWithRelationInput | CategoryServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryServices.
     */
    cursor?: CategoryServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryServices.
     */
    distinct?: CategoryServiceScalarFieldEnum | CategoryServiceScalarFieldEnum[]
  }

  /**
   * CategoryService findFirstOrThrow
   */
  export type CategoryServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter, which CategoryService to fetch.
     */
    where?: CategoryServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryServices to fetch.
     */
    orderBy?: CategoryServiceOrderByWithRelationInput | CategoryServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryServices.
     */
    cursor?: CategoryServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryServices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryServices.
     */
    distinct?: CategoryServiceScalarFieldEnum | CategoryServiceScalarFieldEnum[]
  }

  /**
   * CategoryService findMany
   */
  export type CategoryServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter, which CategoryServices to fetch.
     */
    where?: CategoryServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryServices to fetch.
     */
    orderBy?: CategoryServiceOrderByWithRelationInput | CategoryServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CategoryServices.
     */
    cursor?: CategoryServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryServices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryServices.
     */
    skip?: number
    distinct?: CategoryServiceScalarFieldEnum | CategoryServiceScalarFieldEnum[]
  }

  /**
   * CategoryService create
   */
  export type CategoryServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a CategoryService.
     */
    data: XOR<CategoryServiceCreateInput, CategoryServiceUncheckedCreateInput>
  }

  /**
   * CategoryService createMany
   */
  export type CategoryServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CategoryServices.
     */
    data: CategoryServiceCreateManyInput | CategoryServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoryService update
   */
  export type CategoryServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a CategoryService.
     */
    data: XOR<CategoryServiceUpdateInput, CategoryServiceUncheckedUpdateInput>
    /**
     * Choose, which CategoryService to update.
     */
    where: CategoryServiceWhereUniqueInput
  }

  /**
   * CategoryService updateMany
   */
  export type CategoryServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CategoryServices.
     */
    data: XOR<CategoryServiceUpdateManyMutationInput, CategoryServiceUncheckedUpdateManyInput>
    /**
     * Filter which CategoryServices to update
     */
    where?: CategoryServiceWhereInput
    /**
     * Limit how many CategoryServices to update.
     */
    limit?: number
  }

  /**
   * CategoryService upsert
   */
  export type CategoryServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the CategoryService to update in case it exists.
     */
    where: CategoryServiceWhereUniqueInput
    /**
     * In case the CategoryService found by the `where` argument doesn't exist, create a new CategoryService with this data.
     */
    create: XOR<CategoryServiceCreateInput, CategoryServiceUncheckedCreateInput>
    /**
     * In case the CategoryService was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryServiceUpdateInput, CategoryServiceUncheckedUpdateInput>
  }

  /**
   * CategoryService delete
   */
  export type CategoryServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    /**
     * Filter which CategoryService to delete.
     */
    where: CategoryServiceWhereUniqueInput
  }

  /**
   * CategoryService deleteMany
   */
  export type CategoryServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryServices to delete
     */
    where?: CategoryServiceWhereInput
    /**
     * Limit how many CategoryServices to delete.
     */
    limit?: number
  }

  /**
   * CategoryService.plans
   */
  export type CategoryService$plansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanService
     */
    select?: PlanServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanService
     */
    omit?: PlanServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanServiceInclude<ExtArgs> | null
    where?: PlanServiceWhereInput
    orderBy?: PlanServiceOrderByWithRelationInput | PlanServiceOrderByWithRelationInput[]
    cursor?: PlanServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanServiceScalarFieldEnum | PlanServiceScalarFieldEnum[]
  }

  /**
   * CategoryService.orders
   */
  export type CategoryService$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * CategoryService.pages
   */
  export type CategoryService$pagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    where?: PagesWhereInput
  }

  /**
   * CategoryService without action
   */
  export type CategoryServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
  }


  /**
   * Model Price
   */

  export type AggregatePrice = {
    _count: PriceCountAggregateOutputType | null
    _avg: PriceAvgAggregateOutputType | null
    _sum: PriceSumAggregateOutputType | null
    _min: PriceMinAggregateOutputType | null
    _max: PriceMaxAggregateOutputType | null
  }

  export type PriceAvgAggregateOutputType = {
    amount: number | null
    discount: number | null
  }

  export type PriceSumAggregateOutputType = {
    amount: number | null
    discount: number | null
  }

  export type PriceMinAggregateOutputType = {
    id: string | null
    curr: $Enums.Currency | null
    amount: number | null
    discount: number | null
    idPlan: string | null
  }

  export type PriceMaxAggregateOutputType = {
    id: string | null
    curr: $Enums.Currency | null
    amount: number | null
    discount: number | null
    idPlan: string | null
  }

  export type PriceCountAggregateOutputType = {
    id: number
    curr: number
    amount: number
    discount: number
    idPlan: number
    _all: number
  }


  export type PriceAvgAggregateInputType = {
    amount?: true
    discount?: true
  }

  export type PriceSumAggregateInputType = {
    amount?: true
    discount?: true
  }

  export type PriceMinAggregateInputType = {
    id?: true
    curr?: true
    amount?: true
    discount?: true
    idPlan?: true
  }

  export type PriceMaxAggregateInputType = {
    id?: true
    curr?: true
    amount?: true
    discount?: true
    idPlan?: true
  }

  export type PriceCountAggregateInputType = {
    id?: true
    curr?: true
    amount?: true
    discount?: true
    idPlan?: true
    _all?: true
  }

  export type PriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Price to aggregate.
     */
    where?: PriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prices to fetch.
     */
    orderBy?: PriceOrderByWithRelationInput | PriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Prices
    **/
    _count?: true | PriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriceMaxAggregateInputType
  }

  export type GetPriceAggregateType<T extends PriceAggregateArgs> = {
        [P in keyof T & keyof AggregatePrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrice[P]>
      : GetScalarType<T[P], AggregatePrice[P]>
  }




  export type PriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceWhereInput
    orderBy?: PriceOrderByWithAggregationInput | PriceOrderByWithAggregationInput[]
    by: PriceScalarFieldEnum[] | PriceScalarFieldEnum
    having?: PriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriceCountAggregateInputType | true
    _avg?: PriceAvgAggregateInputType
    _sum?: PriceSumAggregateInputType
    _min?: PriceMinAggregateInputType
    _max?: PriceMaxAggregateInputType
  }

  export type PriceGroupByOutputType = {
    id: string
    curr: $Enums.Currency
    amount: number
    discount: number
    idPlan: string
    _count: PriceCountAggregateOutputType | null
    _avg: PriceAvgAggregateOutputType | null
    _sum: PriceSumAggregateOutputType | null
    _min: PriceMinAggregateOutputType | null
    _max: PriceMaxAggregateOutputType | null
  }

  type GetPriceGroupByPayload<T extends PriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriceGroupByOutputType[P]>
            : GetScalarType<T[P], PriceGroupByOutputType[P]>
        }
      >
    >


  export type PriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    curr?: boolean
    amount?: boolean
    discount?: boolean
    idPlan?: boolean
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["price"]>



  export type PriceSelectScalar = {
    id?: boolean
    curr?: boolean
    amount?: boolean
    discount?: boolean
    idPlan?: boolean
  }

  export type PriceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "curr" | "amount" | "discount" | "idPlan", ExtArgs["result"]["price"]>
  export type PriceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }

  export type $PricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Price"
    objects: {
      plan: Prisma.$PlanServicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      curr: $Enums.Currency
      amount: number
      discount: number
      idPlan: string
    }, ExtArgs["result"]["price"]>
    composites: {}
  }

  type PriceGetPayload<S extends boolean | null | undefined | PriceDefaultArgs> = $Result.GetResult<Prisma.$PricePayload, S>

  type PriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriceCountAggregateInputType | true
    }

  export interface PriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Price'], meta: { name: 'Price' } }
    /**
     * Find zero or one Price that matches the filter.
     * @param {PriceFindUniqueArgs} args - Arguments to find a Price
     * @example
     * // Get one Price
     * const price = await prisma.price.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriceFindUniqueArgs>(args: SelectSubset<T, PriceFindUniqueArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Price that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriceFindUniqueOrThrowArgs} args - Arguments to find a Price
     * @example
     * // Get one Price
     * const price = await prisma.price.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriceFindUniqueOrThrowArgs>(args: SelectSubset<T, PriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Price that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceFindFirstArgs} args - Arguments to find a Price
     * @example
     * // Get one Price
     * const price = await prisma.price.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriceFindFirstArgs>(args?: SelectSubset<T, PriceFindFirstArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Price that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceFindFirstOrThrowArgs} args - Arguments to find a Price
     * @example
     * // Get one Price
     * const price = await prisma.price.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriceFindFirstOrThrowArgs>(args?: SelectSubset<T, PriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Prices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Prices
     * const prices = await prisma.price.findMany()
     * 
     * // Get first 10 Prices
     * const prices = await prisma.price.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priceWithIdOnly = await prisma.price.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriceFindManyArgs>(args?: SelectSubset<T, PriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Price.
     * @param {PriceCreateArgs} args - Arguments to create a Price.
     * @example
     * // Create one Price
     * const Price = await prisma.price.create({
     *   data: {
     *     // ... data to create a Price
     *   }
     * })
     * 
     */
    create<T extends PriceCreateArgs>(args: SelectSubset<T, PriceCreateArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Prices.
     * @param {PriceCreateManyArgs} args - Arguments to create many Prices.
     * @example
     * // Create many Prices
     * const price = await prisma.price.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriceCreateManyArgs>(args?: SelectSubset<T, PriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Price.
     * @param {PriceDeleteArgs} args - Arguments to delete one Price.
     * @example
     * // Delete one Price
     * const Price = await prisma.price.delete({
     *   where: {
     *     // ... filter to delete one Price
     *   }
     * })
     * 
     */
    delete<T extends PriceDeleteArgs>(args: SelectSubset<T, PriceDeleteArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Price.
     * @param {PriceUpdateArgs} args - Arguments to update one Price.
     * @example
     * // Update one Price
     * const price = await prisma.price.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriceUpdateArgs>(args: SelectSubset<T, PriceUpdateArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Prices.
     * @param {PriceDeleteManyArgs} args - Arguments to filter Prices to delete.
     * @example
     * // Delete a few Prices
     * const { count } = await prisma.price.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriceDeleteManyArgs>(args?: SelectSubset<T, PriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Prices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Prices
     * const price = await prisma.price.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriceUpdateManyArgs>(args: SelectSubset<T, PriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Price.
     * @param {PriceUpsertArgs} args - Arguments to update or create a Price.
     * @example
     * // Update or create a Price
     * const price = await prisma.price.upsert({
     *   create: {
     *     // ... data to create a Price
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Price we want to update
     *   }
     * })
     */
    upsert<T extends PriceUpsertArgs>(args: SelectSubset<T, PriceUpsertArgs<ExtArgs>>): Prisma__PriceClient<$Result.GetResult<Prisma.$PricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Prices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceCountArgs} args - Arguments to filter Prices to count.
     * @example
     * // Count the number of Prices
     * const count = await prisma.price.count({
     *   where: {
     *     // ... the filter for the Prices we want to count
     *   }
     * })
    **/
    count<T extends PriceCountArgs>(
      args?: Subset<T, PriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Price.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PriceAggregateArgs>(args: Subset<T, PriceAggregateArgs>): Prisma.PrismaPromise<GetPriceAggregateType<T>>

    /**
     * Group by Price.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceGroupByArgs} args - Group by arguments.
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
      T extends PriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriceGroupByArgs['orderBy'] }
        : { orderBy?: PriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Price model
   */
  readonly fields: PriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Price.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plan<T extends PlanServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanServiceDefaultArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Price model
   */ 
  interface PriceFieldRefs {
    readonly id: FieldRef<"Price", 'String'>
    readonly curr: FieldRef<"Price", 'Currency'>
    readonly amount: FieldRef<"Price", 'Float'>
    readonly discount: FieldRef<"Price", 'Float'>
    readonly idPlan: FieldRef<"Price", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Price findUnique
   */
  export type PriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter, which Price to fetch.
     */
    where: PriceWhereUniqueInput
  }

  /**
   * Price findUniqueOrThrow
   */
  export type PriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter, which Price to fetch.
     */
    where: PriceWhereUniqueInput
  }

  /**
   * Price findFirst
   */
  export type PriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter, which Price to fetch.
     */
    where?: PriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prices to fetch.
     */
    orderBy?: PriceOrderByWithRelationInput | PriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prices.
     */
    cursor?: PriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prices.
     */
    distinct?: PriceScalarFieldEnum | PriceScalarFieldEnum[]
  }

  /**
   * Price findFirstOrThrow
   */
  export type PriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter, which Price to fetch.
     */
    where?: PriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prices to fetch.
     */
    orderBy?: PriceOrderByWithRelationInput | PriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prices.
     */
    cursor?: PriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prices.
     */
    distinct?: PriceScalarFieldEnum | PriceScalarFieldEnum[]
  }

  /**
   * Price findMany
   */
  export type PriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter, which Prices to fetch.
     */
    where?: PriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prices to fetch.
     */
    orderBy?: PriceOrderByWithRelationInput | PriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Prices.
     */
    cursor?: PriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prices.
     */
    skip?: number
    distinct?: PriceScalarFieldEnum | PriceScalarFieldEnum[]
  }

  /**
   * Price create
   */
  export type PriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * The data needed to create a Price.
     */
    data: XOR<PriceCreateInput, PriceUncheckedCreateInput>
  }

  /**
   * Price createMany
   */
  export type PriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Prices.
     */
    data: PriceCreateManyInput | PriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Price update
   */
  export type PriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * The data needed to update a Price.
     */
    data: XOR<PriceUpdateInput, PriceUncheckedUpdateInput>
    /**
     * Choose, which Price to update.
     */
    where: PriceWhereUniqueInput
  }

  /**
   * Price updateMany
   */
  export type PriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Prices.
     */
    data: XOR<PriceUpdateManyMutationInput, PriceUncheckedUpdateManyInput>
    /**
     * Filter which Prices to update
     */
    where?: PriceWhereInput
    /**
     * Limit how many Prices to update.
     */
    limit?: number
  }

  /**
   * Price upsert
   */
  export type PriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * The filter to search for the Price to update in case it exists.
     */
    where: PriceWhereUniqueInput
    /**
     * In case the Price found by the `where` argument doesn't exist, create a new Price with this data.
     */
    create: XOR<PriceCreateInput, PriceUncheckedCreateInput>
    /**
     * In case the Price was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriceUpdateInput, PriceUncheckedUpdateInput>
  }

  /**
   * Price delete
   */
  export type PriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
    /**
     * Filter which Price to delete.
     */
    where: PriceWhereUniqueInput
  }

  /**
   * Price deleteMany
   */
  export type PriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prices to delete
     */
    where?: PriceWhereInput
    /**
     * Limit how many Prices to delete.
     */
    limit?: number
  }

  /**
   * Price without action
   */
  export type PriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Price
     */
    select?: PriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Price
     */
    omit?: PriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceInclude<ExtArgs> | null
  }


  /**
   * Model Benefit
   */

  export type AggregateBenefit = {
    _count: BenefitCountAggregateOutputType | null
    _min: BenefitMinAggregateOutputType | null
    _max: BenefitMaxAggregateOutputType | null
  }

  export type BenefitMinAggregateOutputType = {
    id: string | null
    value: string | null
    idPlan: string | null
  }

  export type BenefitMaxAggregateOutputType = {
    id: string | null
    value: string | null
    idPlan: string | null
  }

  export type BenefitCountAggregateOutputType = {
    id: number
    value: number
    idPlan: number
    _all: number
  }


  export type BenefitMinAggregateInputType = {
    id?: true
    value?: true
    idPlan?: true
  }

  export type BenefitMaxAggregateInputType = {
    id?: true
    value?: true
    idPlan?: true
  }

  export type BenefitCountAggregateInputType = {
    id?: true
    value?: true
    idPlan?: true
    _all?: true
  }

  export type BenefitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Benefit to aggregate.
     */
    where?: BenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Benefits to fetch.
     */
    orderBy?: BenefitOrderByWithRelationInput | BenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Benefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Benefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Benefits
    **/
    _count?: true | BenefitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BenefitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BenefitMaxAggregateInputType
  }

  export type GetBenefitAggregateType<T extends BenefitAggregateArgs> = {
        [P in keyof T & keyof AggregateBenefit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBenefit[P]>
      : GetScalarType<T[P], AggregateBenefit[P]>
  }




  export type BenefitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BenefitWhereInput
    orderBy?: BenefitOrderByWithAggregationInput | BenefitOrderByWithAggregationInput[]
    by: BenefitScalarFieldEnum[] | BenefitScalarFieldEnum
    having?: BenefitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BenefitCountAggregateInputType | true
    _min?: BenefitMinAggregateInputType
    _max?: BenefitMaxAggregateInputType
  }

  export type BenefitGroupByOutputType = {
    id: string
    value: string
    idPlan: string
    _count: BenefitCountAggregateOutputType | null
    _min: BenefitMinAggregateOutputType | null
    _max: BenefitMaxAggregateOutputType | null
  }

  type GetBenefitGroupByPayload<T extends BenefitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BenefitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BenefitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BenefitGroupByOutputType[P]>
            : GetScalarType<T[P], BenefitGroupByOutputType[P]>
        }
      >
    >


  export type BenefitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
    idPlan?: boolean
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["benefit"]>



  export type BenefitSelectScalar = {
    id?: boolean
    value?: boolean
    idPlan?: boolean
  }

  export type BenefitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "value" | "idPlan", ExtArgs["result"]["benefit"]>
  export type BenefitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }

  export type $BenefitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Benefit"
    objects: {
      plan: Prisma.$PlanServicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      value: string
      idPlan: string
    }, ExtArgs["result"]["benefit"]>
    composites: {}
  }

  type BenefitGetPayload<S extends boolean | null | undefined | BenefitDefaultArgs> = $Result.GetResult<Prisma.$BenefitPayload, S>

  type BenefitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BenefitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BenefitCountAggregateInputType | true
    }

  export interface BenefitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Benefit'], meta: { name: 'Benefit' } }
    /**
     * Find zero or one Benefit that matches the filter.
     * @param {BenefitFindUniqueArgs} args - Arguments to find a Benefit
     * @example
     * // Get one Benefit
     * const benefit = await prisma.benefit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BenefitFindUniqueArgs>(args: SelectSubset<T, BenefitFindUniqueArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Benefit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BenefitFindUniqueOrThrowArgs} args - Arguments to find a Benefit
     * @example
     * // Get one Benefit
     * const benefit = await prisma.benefit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BenefitFindUniqueOrThrowArgs>(args: SelectSubset<T, BenefitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Benefit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitFindFirstArgs} args - Arguments to find a Benefit
     * @example
     * // Get one Benefit
     * const benefit = await prisma.benefit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BenefitFindFirstArgs>(args?: SelectSubset<T, BenefitFindFirstArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Benefit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitFindFirstOrThrowArgs} args - Arguments to find a Benefit
     * @example
     * // Get one Benefit
     * const benefit = await prisma.benefit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BenefitFindFirstOrThrowArgs>(args?: SelectSubset<T, BenefitFindFirstOrThrowArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Benefits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Benefits
     * const benefits = await prisma.benefit.findMany()
     * 
     * // Get first 10 Benefits
     * const benefits = await prisma.benefit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const benefitWithIdOnly = await prisma.benefit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BenefitFindManyArgs>(args?: SelectSubset<T, BenefitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Benefit.
     * @param {BenefitCreateArgs} args - Arguments to create a Benefit.
     * @example
     * // Create one Benefit
     * const Benefit = await prisma.benefit.create({
     *   data: {
     *     // ... data to create a Benefit
     *   }
     * })
     * 
     */
    create<T extends BenefitCreateArgs>(args: SelectSubset<T, BenefitCreateArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Benefits.
     * @param {BenefitCreateManyArgs} args - Arguments to create many Benefits.
     * @example
     * // Create many Benefits
     * const benefit = await prisma.benefit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BenefitCreateManyArgs>(args?: SelectSubset<T, BenefitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Benefit.
     * @param {BenefitDeleteArgs} args - Arguments to delete one Benefit.
     * @example
     * // Delete one Benefit
     * const Benefit = await prisma.benefit.delete({
     *   where: {
     *     // ... filter to delete one Benefit
     *   }
     * })
     * 
     */
    delete<T extends BenefitDeleteArgs>(args: SelectSubset<T, BenefitDeleteArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Benefit.
     * @param {BenefitUpdateArgs} args - Arguments to update one Benefit.
     * @example
     * // Update one Benefit
     * const benefit = await prisma.benefit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BenefitUpdateArgs>(args: SelectSubset<T, BenefitUpdateArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Benefits.
     * @param {BenefitDeleteManyArgs} args - Arguments to filter Benefits to delete.
     * @example
     * // Delete a few Benefits
     * const { count } = await prisma.benefit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BenefitDeleteManyArgs>(args?: SelectSubset<T, BenefitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Benefits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Benefits
     * const benefit = await prisma.benefit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BenefitUpdateManyArgs>(args: SelectSubset<T, BenefitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Benefit.
     * @param {BenefitUpsertArgs} args - Arguments to update or create a Benefit.
     * @example
     * // Update or create a Benefit
     * const benefit = await prisma.benefit.upsert({
     *   create: {
     *     // ... data to create a Benefit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Benefit we want to update
     *   }
     * })
     */
    upsert<T extends BenefitUpsertArgs>(args: SelectSubset<T, BenefitUpsertArgs<ExtArgs>>): Prisma__BenefitClient<$Result.GetResult<Prisma.$BenefitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Benefits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitCountArgs} args - Arguments to filter Benefits to count.
     * @example
     * // Count the number of Benefits
     * const count = await prisma.benefit.count({
     *   where: {
     *     // ... the filter for the Benefits we want to count
     *   }
     * })
    **/
    count<T extends BenefitCountArgs>(
      args?: Subset<T, BenefitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BenefitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Benefit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BenefitAggregateArgs>(args: Subset<T, BenefitAggregateArgs>): Prisma.PrismaPromise<GetBenefitAggregateType<T>>

    /**
     * Group by Benefit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BenefitGroupByArgs} args - Group by arguments.
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
      T extends BenefitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BenefitGroupByArgs['orderBy'] }
        : { orderBy?: BenefitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BenefitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBenefitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Benefit model
   */
  readonly fields: BenefitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Benefit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BenefitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plan<T extends PlanServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanServiceDefaultArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Benefit model
   */ 
  interface BenefitFieldRefs {
    readonly id: FieldRef<"Benefit", 'String'>
    readonly value: FieldRef<"Benefit", 'String'>
    readonly idPlan: FieldRef<"Benefit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Benefit findUnique
   */
  export type BenefitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter, which Benefit to fetch.
     */
    where: BenefitWhereUniqueInput
  }

  /**
   * Benefit findUniqueOrThrow
   */
  export type BenefitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter, which Benefit to fetch.
     */
    where: BenefitWhereUniqueInput
  }

  /**
   * Benefit findFirst
   */
  export type BenefitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter, which Benefit to fetch.
     */
    where?: BenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Benefits to fetch.
     */
    orderBy?: BenefitOrderByWithRelationInput | BenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Benefits.
     */
    cursor?: BenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Benefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Benefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Benefits.
     */
    distinct?: BenefitScalarFieldEnum | BenefitScalarFieldEnum[]
  }

  /**
   * Benefit findFirstOrThrow
   */
  export type BenefitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter, which Benefit to fetch.
     */
    where?: BenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Benefits to fetch.
     */
    orderBy?: BenefitOrderByWithRelationInput | BenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Benefits.
     */
    cursor?: BenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Benefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Benefits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Benefits.
     */
    distinct?: BenefitScalarFieldEnum | BenefitScalarFieldEnum[]
  }

  /**
   * Benefit findMany
   */
  export type BenefitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter, which Benefits to fetch.
     */
    where?: BenefitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Benefits to fetch.
     */
    orderBy?: BenefitOrderByWithRelationInput | BenefitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Benefits.
     */
    cursor?: BenefitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Benefits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Benefits.
     */
    skip?: number
    distinct?: BenefitScalarFieldEnum | BenefitScalarFieldEnum[]
  }

  /**
   * Benefit create
   */
  export type BenefitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * The data needed to create a Benefit.
     */
    data: XOR<BenefitCreateInput, BenefitUncheckedCreateInput>
  }

  /**
   * Benefit createMany
   */
  export type BenefitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Benefits.
     */
    data: BenefitCreateManyInput | BenefitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Benefit update
   */
  export type BenefitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * The data needed to update a Benefit.
     */
    data: XOR<BenefitUpdateInput, BenefitUncheckedUpdateInput>
    /**
     * Choose, which Benefit to update.
     */
    where: BenefitWhereUniqueInput
  }

  /**
   * Benefit updateMany
   */
  export type BenefitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Benefits.
     */
    data: XOR<BenefitUpdateManyMutationInput, BenefitUncheckedUpdateManyInput>
    /**
     * Filter which Benefits to update
     */
    where?: BenefitWhereInput
    /**
     * Limit how many Benefits to update.
     */
    limit?: number
  }

  /**
   * Benefit upsert
   */
  export type BenefitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * The filter to search for the Benefit to update in case it exists.
     */
    where: BenefitWhereUniqueInput
    /**
     * In case the Benefit found by the `where` argument doesn't exist, create a new Benefit with this data.
     */
    create: XOR<BenefitCreateInput, BenefitUncheckedCreateInput>
    /**
     * In case the Benefit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BenefitUpdateInput, BenefitUncheckedUpdateInput>
  }

  /**
   * Benefit delete
   */
  export type BenefitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
    /**
     * Filter which Benefit to delete.
     */
    where: BenefitWhereUniqueInput
  }

  /**
   * Benefit deleteMany
   */
  export type BenefitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Benefits to delete
     */
    where?: BenefitWhereInput
    /**
     * Limit how many Benefits to delete.
     */
    limit?: number
  }

  /**
   * Benefit without action
   */
  export type BenefitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Benefit
     */
    select?: BenefitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Benefit
     */
    omit?: BenefitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BenefitInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    status: $Enums.PlanStatus | null
    refreshToken: string | null
    role: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    status: $Enums.PlanStatus | null
    refreshToken: string | null
    role: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    status: number
    refreshToken: number
    role: number
    features: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    status?: true
    refreshToken?: true
    role?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    status?: true
    refreshToken?: true
    role?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    status?: true
    refreshToken?: true
    role?: true
    features?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken: string | null
    role: string
    features: JsonValue
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    refreshToken?: boolean
    role?: boolean
    features?: boolean
    blogs?: boolean | Role$blogsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>



  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    status?: boolean
    refreshToken?: boolean
    role?: boolean
    features?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "status" | "refreshToken" | "role" | "features", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blogs?: boolean | Role$blogsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      blogs: Prisma.$BlogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      status: $Enums.PlanStatus
      refreshToken: string | null
      role: string
      features: Prisma.JsonValue
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
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
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    blogs<T extends Role$blogsArgs<ExtArgs> = {}>(args?: Subset<T, Role$blogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */ 
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly email: FieldRef<"Role", 'String'>
    readonly password: FieldRef<"Role", 'String'>
    readonly status: FieldRef<"Role", 'PlanStatus'>
    readonly refreshToken: FieldRef<"Role", 'String'>
    readonly role: FieldRef<"Role", 'String'>
    readonly features: FieldRef<"Role", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.blogs
   */
  export type Role$blogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    where?: BlogWhereInput
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    cursor?: BlogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Blog
   */

  export type AggregateBlog = {
    _count: BlogCountAggregateOutputType | null
    _min: BlogMinAggregateOutputType | null
    _max: BlogMaxAggregateOutputType | null
  }

  export type BlogMinAggregateOutputType = {
    id: string | null
    title: string | null
    image: string | null
    content: string | null
    status: $Enums.BlogStatus | null
    favorite: boolean | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    roleId: string | null
  }

  export type BlogMaxAggregateOutputType = {
    id: string | null
    title: string | null
    image: string | null
    content: string | null
    status: $Enums.BlogStatus | null
    favorite: boolean | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    roleId: string | null
  }

  export type BlogCountAggregateOutputType = {
    id: number
    title: number
    image: number
    content: number
    status: number
    favorite: number
    categoryId: number
    createdAt: number
    updatedAt: number
    roleId: number
    _all: number
  }


  export type BlogMinAggregateInputType = {
    id?: true
    title?: true
    image?: true
    content?: true
    status?: true
    favorite?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
  }

  export type BlogMaxAggregateInputType = {
    id?: true
    title?: true
    image?: true
    content?: true
    status?: true
    favorite?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
  }

  export type BlogCountAggregateInputType = {
    id?: true
    title?: true
    image?: true
    content?: true
    status?: true
    favorite?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    roleId?: true
    _all?: true
  }

  export type BlogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Blog to aggregate.
     */
    where?: BlogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Blogs to fetch.
     */
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BlogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Blogs
    **/
    _count?: true | BlogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlogMaxAggregateInputType
  }

  export type GetBlogAggregateType<T extends BlogAggregateArgs> = {
        [P in keyof T & keyof AggregateBlog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlog[P]>
      : GetScalarType<T[P], AggregateBlog[P]>
  }




  export type BlogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlogWhereInput
    orderBy?: BlogOrderByWithAggregationInput | BlogOrderByWithAggregationInput[]
    by: BlogScalarFieldEnum[] | BlogScalarFieldEnum
    having?: BlogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogCountAggregateInputType | true
    _min?: BlogMinAggregateInputType
    _max?: BlogMaxAggregateInputType
  }

  export type BlogGroupByOutputType = {
    id: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    categoryId: string
    createdAt: Date | null
    updatedAt: Date | null
    roleId: string | null
    _count: BlogCountAggregateOutputType | null
    _min: BlogMinAggregateOutputType | null
    _max: BlogMaxAggregateOutputType | null
  }

  type GetBlogGroupByPayload<T extends BlogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlogGroupByOutputType[P]>
            : GetScalarType<T[P], BlogGroupByOutputType[P]>
        }
      >
    >


  export type BlogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    image?: boolean
    content?: boolean
    status?: boolean
    favorite?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
    category?: boolean | BlogCategoryDefaultArgs<ExtArgs>
    role?: boolean | Blog$roleArgs<ExtArgs>
  }, ExtArgs["result"]["blog"]>



  export type BlogSelectScalar = {
    id?: boolean
    title?: boolean
    image?: boolean
    content?: boolean
    status?: boolean
    favorite?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roleId?: boolean
  }

  export type BlogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "image" | "content" | "status" | "favorite" | "categoryId" | "createdAt" | "updatedAt" | "roleId", ExtArgs["result"]["blog"]>
  export type BlogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | BlogCategoryDefaultArgs<ExtArgs>
    role?: boolean | Blog$roleArgs<ExtArgs>
  }

  export type $BlogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Blog"
    objects: {
      category: Prisma.$BlogCategoryPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      image: string
      content: string
      status: $Enums.BlogStatus
      favorite: boolean
      categoryId: string
      createdAt: Date | null
      updatedAt: Date | null
      roleId: string | null
    }, ExtArgs["result"]["blog"]>
    composites: {}
  }

  type BlogGetPayload<S extends boolean | null | undefined | BlogDefaultArgs> = $Result.GetResult<Prisma.$BlogPayload, S>

  type BlogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BlogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogCountAggregateInputType | true
    }

  export interface BlogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Blog'], meta: { name: 'Blog' } }
    /**
     * Find zero or one Blog that matches the filter.
     * @param {BlogFindUniqueArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogFindUniqueArgs>(args: SelectSubset<T, BlogFindUniqueArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Blog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogFindUniqueOrThrowArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Blog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogFindFirstArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogFindFirstArgs>(args?: SelectSubset<T, BlogFindFirstArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Blog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogFindFirstOrThrowArgs} args - Arguments to find a Blog
     * @example
     * // Get one Blog
     * const blog = await prisma.blog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Blogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Blogs
     * const blogs = await prisma.blog.findMany()
     * 
     * // Get first 10 Blogs
     * const blogs = await prisma.blog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blogWithIdOnly = await prisma.blog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BlogFindManyArgs>(args?: SelectSubset<T, BlogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Blog.
     * @param {BlogCreateArgs} args - Arguments to create a Blog.
     * @example
     * // Create one Blog
     * const Blog = await prisma.blog.create({
     *   data: {
     *     // ... data to create a Blog
     *   }
     * })
     * 
     */
    create<T extends BlogCreateArgs>(args: SelectSubset<T, BlogCreateArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Blogs.
     * @param {BlogCreateManyArgs} args - Arguments to create many Blogs.
     * @example
     * // Create many Blogs
     * const blog = await prisma.blog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BlogCreateManyArgs>(args?: SelectSubset<T, BlogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Blog.
     * @param {BlogDeleteArgs} args - Arguments to delete one Blog.
     * @example
     * // Delete one Blog
     * const Blog = await prisma.blog.delete({
     *   where: {
     *     // ... filter to delete one Blog
     *   }
     * })
     * 
     */
    delete<T extends BlogDeleteArgs>(args: SelectSubset<T, BlogDeleteArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Blog.
     * @param {BlogUpdateArgs} args - Arguments to update one Blog.
     * @example
     * // Update one Blog
     * const blog = await prisma.blog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BlogUpdateArgs>(args: SelectSubset<T, BlogUpdateArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Blogs.
     * @param {BlogDeleteManyArgs} args - Arguments to filter Blogs to delete.
     * @example
     * // Delete a few Blogs
     * const { count } = await prisma.blog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BlogDeleteManyArgs>(args?: SelectSubset<T, BlogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Blogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Blogs
     * const blog = await prisma.blog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BlogUpdateManyArgs>(args: SelectSubset<T, BlogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Blog.
     * @param {BlogUpsertArgs} args - Arguments to update or create a Blog.
     * @example
     * // Update or create a Blog
     * const blog = await prisma.blog.upsert({
     *   create: {
     *     // ... data to create a Blog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Blog we want to update
     *   }
     * })
     */
    upsert<T extends BlogUpsertArgs>(args: SelectSubset<T, BlogUpsertArgs<ExtArgs>>): Prisma__BlogClient<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Blogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCountArgs} args - Arguments to filter Blogs to count.
     * @example
     * // Count the number of Blogs
     * const count = await prisma.blog.count({
     *   where: {
     *     // ... the filter for the Blogs we want to count
     *   }
     * })
    **/
    count<T extends BlogCountArgs>(
      args?: Subset<T, BlogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Blog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BlogAggregateArgs>(args: Subset<T, BlogAggregateArgs>): Prisma.PrismaPromise<GetBlogAggregateType<T>>

    /**
     * Group by Blog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogGroupByArgs} args - Group by arguments.
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
      T extends BlogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogGroupByArgs['orderBy'] }
        : { orderBy?: BlogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BlogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Blog model
   */
  readonly fields: BlogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Blog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends BlogCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BlogCategoryDefaultArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends Blog$roleArgs<ExtArgs> = {}>(args?: Subset<T, Blog$roleArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Blog model
   */ 
  interface BlogFieldRefs {
    readonly id: FieldRef<"Blog", 'String'>
    readonly title: FieldRef<"Blog", 'String'>
    readonly image: FieldRef<"Blog", 'String'>
    readonly content: FieldRef<"Blog", 'String'>
    readonly status: FieldRef<"Blog", 'BlogStatus'>
    readonly favorite: FieldRef<"Blog", 'Boolean'>
    readonly categoryId: FieldRef<"Blog", 'String'>
    readonly createdAt: FieldRef<"Blog", 'DateTime'>
    readonly updatedAt: FieldRef<"Blog", 'DateTime'>
    readonly roleId: FieldRef<"Blog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Blog findUnique
   */
  export type BlogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter, which Blog to fetch.
     */
    where: BlogWhereUniqueInput
  }

  /**
   * Blog findUniqueOrThrow
   */
  export type BlogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter, which Blog to fetch.
     */
    where: BlogWhereUniqueInput
  }

  /**
   * Blog findFirst
   */
  export type BlogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter, which Blog to fetch.
     */
    where?: BlogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Blogs to fetch.
     */
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Blogs.
     */
    cursor?: BlogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Blogs.
     */
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * Blog findFirstOrThrow
   */
  export type BlogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter, which Blog to fetch.
     */
    where?: BlogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Blogs to fetch.
     */
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Blogs.
     */
    cursor?: BlogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Blogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Blogs.
     */
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * Blog findMany
   */
  export type BlogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter, which Blogs to fetch.
     */
    where?: BlogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Blogs to fetch.
     */
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Blogs.
     */
    cursor?: BlogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Blogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Blogs.
     */
    skip?: number
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * Blog create
   */
  export type BlogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * The data needed to create a Blog.
     */
    data: XOR<BlogCreateInput, BlogUncheckedCreateInput>
  }

  /**
   * Blog createMany
   */
  export type BlogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Blogs.
     */
    data: BlogCreateManyInput | BlogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Blog update
   */
  export type BlogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * The data needed to update a Blog.
     */
    data: XOR<BlogUpdateInput, BlogUncheckedUpdateInput>
    /**
     * Choose, which Blog to update.
     */
    where: BlogWhereUniqueInput
  }

  /**
   * Blog updateMany
   */
  export type BlogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Blogs.
     */
    data: XOR<BlogUpdateManyMutationInput, BlogUncheckedUpdateManyInput>
    /**
     * Filter which Blogs to update
     */
    where?: BlogWhereInput
    /**
     * Limit how many Blogs to update.
     */
    limit?: number
  }

  /**
   * Blog upsert
   */
  export type BlogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * The filter to search for the Blog to update in case it exists.
     */
    where: BlogWhereUniqueInput
    /**
     * In case the Blog found by the `where` argument doesn't exist, create a new Blog with this data.
     */
    create: XOR<BlogCreateInput, BlogUncheckedCreateInput>
    /**
     * In case the Blog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogUpdateInput, BlogUncheckedUpdateInput>
  }

  /**
   * Blog delete
   */
  export type BlogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    /**
     * Filter which Blog to delete.
     */
    where: BlogWhereUniqueInput
  }

  /**
   * Blog deleteMany
   */
  export type BlogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Blogs to delete
     */
    where?: BlogWhereInput
    /**
     * Limit how many Blogs to delete.
     */
    limit?: number
  }

  /**
   * Blog.role
   */
  export type Blog$roleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    where?: RoleWhereInput
  }

  /**
   * Blog without action
   */
  export type BlogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
  }


  /**
   * Model BlogCategory
   */

  export type AggregateBlogCategory = {
    _count: BlogCategoryCountAggregateOutputType | null
    _min: BlogCategoryMinAggregateOutputType | null
    _max: BlogCategoryMaxAggregateOutputType | null
  }

  export type BlogCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: $Enums.PlanStatus | null
  }

  export type BlogCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: $Enums.PlanStatus | null
  }

  export type BlogCategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    status: number
    _all: number
  }


  export type BlogCategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
  }

  export type BlogCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
  }

  export type BlogCategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    _all?: true
  }

  export type BlogCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlogCategory to aggregate.
     */
    where?: BlogCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogCategories to fetch.
     */
    orderBy?: BlogCategoryOrderByWithRelationInput | BlogCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BlogCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BlogCategories
    **/
    _count?: true | BlogCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlogCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlogCategoryMaxAggregateInputType
  }

  export type GetBlogCategoryAggregateType<T extends BlogCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateBlogCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogCategory[P]>
      : GetScalarType<T[P], AggregateBlogCategory[P]>
  }




  export type BlogCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlogCategoryWhereInput
    orderBy?: BlogCategoryOrderByWithAggregationInput | BlogCategoryOrderByWithAggregationInput[]
    by: BlogCategoryScalarFieldEnum[] | BlogCategoryScalarFieldEnum
    having?: BlogCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogCategoryCountAggregateInputType | true
    _min?: BlogCategoryMinAggregateInputType
    _max?: BlogCategoryMaxAggregateInputType
  }

  export type BlogCategoryGroupByOutputType = {
    id: string
    name: string
    slug: string
    status: $Enums.PlanStatus
    _count: BlogCategoryCountAggregateOutputType | null
    _min: BlogCategoryMinAggregateOutputType | null
    _max: BlogCategoryMaxAggregateOutputType | null
  }

  type GetBlogCategoryGroupByPayload<T extends BlogCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlogCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlogCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], BlogCategoryGroupByOutputType[P]>
        }
      >
    >


  export type BlogCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    blogs?: boolean | BlogCategory$blogsArgs<ExtArgs>
    _count?: boolean | BlogCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["blogCategory"]>



  export type BlogCategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
  }

  export type BlogCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "status", ExtArgs["result"]["blogCategory"]>
  export type BlogCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    blogs?: boolean | BlogCategory$blogsArgs<ExtArgs>
    _count?: boolean | BlogCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $BlogCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BlogCategory"
    objects: {
      blogs: Prisma.$BlogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      status: $Enums.PlanStatus
    }, ExtArgs["result"]["blogCategory"]>
    composites: {}
  }

  type BlogCategoryGetPayload<S extends boolean | null | undefined | BlogCategoryDefaultArgs> = $Result.GetResult<Prisma.$BlogCategoryPayload, S>

  type BlogCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BlogCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogCategoryCountAggregateInputType | true
    }

  export interface BlogCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogCategory'], meta: { name: 'BlogCategory' } }
    /**
     * Find zero or one BlogCategory that matches the filter.
     * @param {BlogCategoryFindUniqueArgs} args - Arguments to find a BlogCategory
     * @example
     * // Get one BlogCategory
     * const blogCategory = await prisma.blogCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogCategoryFindUniqueArgs>(args: SelectSubset<T, BlogCategoryFindUniqueArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogCategoryFindUniqueOrThrowArgs} args - Arguments to find a BlogCategory
     * @example
     * // Get one BlogCategory
     * const blogCategory = await prisma.blogCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryFindFirstArgs} args - Arguments to find a BlogCategory
     * @example
     * // Get one BlogCategory
     * const blogCategory = await prisma.blogCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogCategoryFindFirstArgs>(args?: SelectSubset<T, BlogCategoryFindFirstArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryFindFirstOrThrowArgs} args - Arguments to find a BlogCategory
     * @example
     * // Get one BlogCategory
     * const blogCategory = await prisma.blogCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogCategories
     * const blogCategories = await prisma.blogCategory.findMany()
     * 
     * // Get first 10 BlogCategories
     * const blogCategories = await prisma.blogCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blogCategoryWithIdOnly = await prisma.blogCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BlogCategoryFindManyArgs>(args?: SelectSubset<T, BlogCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BlogCategory.
     * @param {BlogCategoryCreateArgs} args - Arguments to create a BlogCategory.
     * @example
     * // Create one BlogCategory
     * const BlogCategory = await prisma.blogCategory.create({
     *   data: {
     *     // ... data to create a BlogCategory
     *   }
     * })
     * 
     */
    create<T extends BlogCategoryCreateArgs>(args: SelectSubset<T, BlogCategoryCreateArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogCategories.
     * @param {BlogCategoryCreateManyArgs} args - Arguments to create many BlogCategories.
     * @example
     * // Create many BlogCategories
     * const blogCategory = await prisma.blogCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BlogCategoryCreateManyArgs>(args?: SelectSubset<T, BlogCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogCategory.
     * @param {BlogCategoryDeleteArgs} args - Arguments to delete one BlogCategory.
     * @example
     * // Delete one BlogCategory
     * const BlogCategory = await prisma.blogCategory.delete({
     *   where: {
     *     // ... filter to delete one BlogCategory
     *   }
     * })
     * 
     */
    delete<T extends BlogCategoryDeleteArgs>(args: SelectSubset<T, BlogCategoryDeleteArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogCategory.
     * @param {BlogCategoryUpdateArgs} args - Arguments to update one BlogCategory.
     * @example
     * // Update one BlogCategory
     * const blogCategory = await prisma.blogCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BlogCategoryUpdateArgs>(args: SelectSubset<T, BlogCategoryUpdateArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogCategories.
     * @param {BlogCategoryDeleteManyArgs} args - Arguments to filter BlogCategories to delete.
     * @example
     * // Delete a few BlogCategories
     * const { count } = await prisma.blogCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BlogCategoryDeleteManyArgs>(args?: SelectSubset<T, BlogCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogCategories
     * const blogCategory = await prisma.blogCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BlogCategoryUpdateManyArgs>(args: SelectSubset<T, BlogCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogCategory.
     * @param {BlogCategoryUpsertArgs} args - Arguments to update or create a BlogCategory.
     * @example
     * // Update or create a BlogCategory
     * const blogCategory = await prisma.blogCategory.upsert({
     *   create: {
     *     // ... data to create a BlogCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogCategory we want to update
     *   }
     * })
     */
    upsert<T extends BlogCategoryUpsertArgs>(args: SelectSubset<T, BlogCategoryUpsertArgs<ExtArgs>>): Prisma__BlogCategoryClient<$Result.GetResult<Prisma.$BlogCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BlogCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryCountArgs} args - Arguments to filter BlogCategories to count.
     * @example
     * // Count the number of BlogCategories
     * const count = await prisma.blogCategory.count({
     *   where: {
     *     // ... the filter for the BlogCategories we want to count
     *   }
     * })
    **/
    count<T extends BlogCategoryCountArgs>(
      args?: Subset<T, BlogCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BlogCategoryAggregateArgs>(args: Subset<T, BlogCategoryAggregateArgs>): Prisma.PrismaPromise<GetBlogCategoryAggregateType<T>>

    /**
     * Group by BlogCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCategoryGroupByArgs} args - Group by arguments.
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
      T extends BlogCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogCategoryGroupByArgs['orderBy'] }
        : { orderBy?: BlogCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BlogCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BlogCategory model
   */
  readonly fields: BlogCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    blogs<T extends BlogCategory$blogsArgs<ExtArgs> = {}>(args?: Subset<T, BlogCategory$blogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BlogCategory model
   */ 
  interface BlogCategoryFieldRefs {
    readonly id: FieldRef<"BlogCategory", 'String'>
    readonly name: FieldRef<"BlogCategory", 'String'>
    readonly slug: FieldRef<"BlogCategory", 'String'>
    readonly status: FieldRef<"BlogCategory", 'PlanStatus'>
  }
    

  // Custom InputTypes
  /**
   * BlogCategory findUnique
   */
  export type BlogCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BlogCategory to fetch.
     */
    where: BlogCategoryWhereUniqueInput
  }

  /**
   * BlogCategory findUniqueOrThrow
   */
  export type BlogCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BlogCategory to fetch.
     */
    where: BlogCategoryWhereUniqueInput
  }

  /**
   * BlogCategory findFirst
   */
  export type BlogCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BlogCategory to fetch.
     */
    where?: BlogCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogCategories to fetch.
     */
    orderBy?: BlogCategoryOrderByWithRelationInput | BlogCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlogCategories.
     */
    cursor?: BlogCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlogCategories.
     */
    distinct?: BlogCategoryScalarFieldEnum | BlogCategoryScalarFieldEnum[]
  }

  /**
   * BlogCategory findFirstOrThrow
   */
  export type BlogCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BlogCategory to fetch.
     */
    where?: BlogCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogCategories to fetch.
     */
    orderBy?: BlogCategoryOrderByWithRelationInput | BlogCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlogCategories.
     */
    cursor?: BlogCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlogCategories.
     */
    distinct?: BlogCategoryScalarFieldEnum | BlogCategoryScalarFieldEnum[]
  }

  /**
   * BlogCategory findMany
   */
  export type BlogCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BlogCategories to fetch.
     */
    where?: BlogCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogCategories to fetch.
     */
    orderBy?: BlogCategoryOrderByWithRelationInput | BlogCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BlogCategories.
     */
    cursor?: BlogCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogCategories.
     */
    skip?: number
    distinct?: BlogCategoryScalarFieldEnum | BlogCategoryScalarFieldEnum[]
  }

  /**
   * BlogCategory create
   */
  export type BlogCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogCategory.
     */
    data: XOR<BlogCategoryCreateInput, BlogCategoryUncheckedCreateInput>
  }

  /**
   * BlogCategory createMany
   */
  export type BlogCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BlogCategories.
     */
    data: BlogCategoryCreateManyInput | BlogCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogCategory update
   */
  export type BlogCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogCategory.
     */
    data: XOR<BlogCategoryUpdateInput, BlogCategoryUncheckedUpdateInput>
    /**
     * Choose, which BlogCategory to update.
     */
    where: BlogCategoryWhereUniqueInput
  }

  /**
   * BlogCategory updateMany
   */
  export type BlogCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BlogCategories.
     */
    data: XOR<BlogCategoryUpdateManyMutationInput, BlogCategoryUncheckedUpdateManyInput>
    /**
     * Filter which BlogCategories to update
     */
    where?: BlogCategoryWhereInput
    /**
     * Limit how many BlogCategories to update.
     */
    limit?: number
  }

  /**
   * BlogCategory upsert
   */
  export type BlogCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogCategory to update in case it exists.
     */
    where: BlogCategoryWhereUniqueInput
    /**
     * In case the BlogCategory found by the `where` argument doesn't exist, create a new BlogCategory with this data.
     */
    create: XOR<BlogCategoryCreateInput, BlogCategoryUncheckedCreateInput>
    /**
     * In case the BlogCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogCategoryUpdateInput, BlogCategoryUncheckedUpdateInput>
  }

  /**
   * BlogCategory delete
   */
  export type BlogCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
    /**
     * Filter which BlogCategory to delete.
     */
    where: BlogCategoryWhereUniqueInput
  }

  /**
   * BlogCategory deleteMany
   */
  export type BlogCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlogCategories to delete
     */
    where?: BlogCategoryWhereInput
    /**
     * Limit how many BlogCategories to delete.
     */
    limit?: number
  }

  /**
   * BlogCategory.blogs
   */
  export type BlogCategory$blogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Blog
     */
    select?: BlogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Blog
     */
    omit?: BlogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogInclude<ExtArgs> | null
    where?: BlogWhereInput
    orderBy?: BlogOrderByWithRelationInput | BlogOrderByWithRelationInput[]
    cursor?: BlogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogScalarFieldEnum | BlogScalarFieldEnum[]
  }

  /**
   * BlogCategory without action
   */
  export type BlogCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogCategory
     */
    select?: BlogCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogCategory
     */
    omit?: BlogCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Pages
   */

  export type AggregatePages = {
    _count: PagesCountAggregateOutputType | null
    _min: PagesMinAggregateOutputType | null
    _max: PagesMaxAggregateOutputType | null
  }

  export type PagesMinAggregateOutputType = {
    id: string | null
    page: string | null
    slug: string | null
    categoryServiceId: string | null
  }

  export type PagesMaxAggregateOutputType = {
    id: string | null
    page: string | null
    slug: string | null
    categoryServiceId: string | null
  }

  export type PagesCountAggregateOutputType = {
    id: number
    page: number
    slug: number
    categoryServiceId: number
    _all: number
  }


  export type PagesMinAggregateInputType = {
    id?: true
    page?: true
    slug?: true
    categoryServiceId?: true
  }

  export type PagesMaxAggregateInputType = {
    id?: true
    page?: true
    slug?: true
    categoryServiceId?: true
  }

  export type PagesCountAggregateInputType = {
    id?: true
    page?: true
    slug?: true
    categoryServiceId?: true
    _all?: true
  }

  export type PagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pages to aggregate.
     */
    where?: PagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PagesOrderByWithRelationInput | PagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pages
    **/
    _count?: true | PagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PagesMaxAggregateInputType
  }

  export type GetPagesAggregateType<T extends PagesAggregateArgs> = {
        [P in keyof T & keyof AggregatePages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePages[P]>
      : GetScalarType<T[P], AggregatePages[P]>
  }




  export type PagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagesWhereInput
    orderBy?: PagesOrderByWithAggregationInput | PagesOrderByWithAggregationInput[]
    by: PagesScalarFieldEnum[] | PagesScalarFieldEnum
    having?: PagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PagesCountAggregateInputType | true
    _min?: PagesMinAggregateInputType
    _max?: PagesMaxAggregateInputType
  }

  export type PagesGroupByOutputType = {
    id: string
    page: string
    slug: string
    categoryServiceId: string | null
    _count: PagesCountAggregateOutputType | null
    _min: PagesMinAggregateOutputType | null
    _max: PagesMaxAggregateOutputType | null
  }

  type GetPagesGroupByPayload<T extends PagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PagesGroupByOutputType[P]>
            : GetScalarType<T[P], PagesGroupByOutputType[P]>
        }
      >
    >


  export type PagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    page?: boolean
    slug?: boolean
    categoryServiceId?: boolean
    meta?: boolean | Pages$metaArgs<ExtArgs>
    categoryService?: boolean | Pages$categoryServiceArgs<ExtArgs>
    _count?: boolean | PagesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pages"]>



  export type PagesSelectScalar = {
    id?: boolean
    page?: boolean
    slug?: boolean
    categoryServiceId?: boolean
  }

  export type PagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "page" | "slug" | "categoryServiceId", ExtArgs["result"]["pages"]>
  export type PagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta?: boolean | Pages$metaArgs<ExtArgs>
    categoryService?: boolean | Pages$categoryServiceArgs<ExtArgs>
    _count?: boolean | PagesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pages"
    objects: {
      meta: Prisma.$MetaTagPayload<ExtArgs>[]
      categoryService: Prisma.$CategoryServicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      page: string
      slug: string
      categoryServiceId: string | null
    }, ExtArgs["result"]["pages"]>
    composites: {}
  }

  type PagesGetPayload<S extends boolean | null | undefined | PagesDefaultArgs> = $Result.GetResult<Prisma.$PagesPayload, S>

  type PagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PagesCountAggregateInputType | true
    }

  export interface PagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pages'], meta: { name: 'Pages' } }
    /**
     * Find zero or one Pages that matches the filter.
     * @param {PagesFindUniqueArgs} args - Arguments to find a Pages
     * @example
     * // Get one Pages
     * const pages = await prisma.pages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PagesFindUniqueArgs>(args: SelectSubset<T, PagesFindUniqueArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PagesFindUniqueOrThrowArgs} args - Arguments to find a Pages
     * @example
     * // Get one Pages
     * const pages = await prisma.pages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PagesFindUniqueOrThrowArgs>(args: SelectSubset<T, PagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesFindFirstArgs} args - Arguments to find a Pages
     * @example
     * // Get one Pages
     * const pages = await prisma.pages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PagesFindFirstArgs>(args?: SelectSubset<T, PagesFindFirstArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesFindFirstOrThrowArgs} args - Arguments to find a Pages
     * @example
     * // Get one Pages
     * const pages = await prisma.pages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PagesFindFirstOrThrowArgs>(args?: SelectSubset<T, PagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pages
     * const pages = await prisma.pages.findMany()
     * 
     * // Get first 10 Pages
     * const pages = await prisma.pages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pagesWithIdOnly = await prisma.pages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PagesFindManyArgs>(args?: SelectSubset<T, PagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pages.
     * @param {PagesCreateArgs} args - Arguments to create a Pages.
     * @example
     * // Create one Pages
     * const Pages = await prisma.pages.create({
     *   data: {
     *     // ... data to create a Pages
     *   }
     * })
     * 
     */
    create<T extends PagesCreateArgs>(args: SelectSubset<T, PagesCreateArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pages.
     * @param {PagesCreateManyArgs} args - Arguments to create many Pages.
     * @example
     * // Create many Pages
     * const pages = await prisma.pages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PagesCreateManyArgs>(args?: SelectSubset<T, PagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pages.
     * @param {PagesDeleteArgs} args - Arguments to delete one Pages.
     * @example
     * // Delete one Pages
     * const Pages = await prisma.pages.delete({
     *   where: {
     *     // ... filter to delete one Pages
     *   }
     * })
     * 
     */
    delete<T extends PagesDeleteArgs>(args: SelectSubset<T, PagesDeleteArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pages.
     * @param {PagesUpdateArgs} args - Arguments to update one Pages.
     * @example
     * // Update one Pages
     * const pages = await prisma.pages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PagesUpdateArgs>(args: SelectSubset<T, PagesUpdateArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pages.
     * @param {PagesDeleteManyArgs} args - Arguments to filter Pages to delete.
     * @example
     * // Delete a few Pages
     * const { count } = await prisma.pages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PagesDeleteManyArgs>(args?: SelectSubset<T, PagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pages
     * const pages = await prisma.pages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PagesUpdateManyArgs>(args: SelectSubset<T, PagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pages.
     * @param {PagesUpsertArgs} args - Arguments to update or create a Pages.
     * @example
     * // Update or create a Pages
     * const pages = await prisma.pages.upsert({
     *   create: {
     *     // ... data to create a Pages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pages we want to update
     *   }
     * })
     */
    upsert<T extends PagesUpsertArgs>(args: SelectSubset<T, PagesUpsertArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesCountArgs} args - Arguments to filter Pages to count.
     * @example
     * // Count the number of Pages
     * const count = await prisma.pages.count({
     *   where: {
     *     // ... the filter for the Pages we want to count
     *   }
     * })
    **/
    count<T extends PagesCountArgs>(
      args?: Subset<T, PagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PagesAggregateArgs>(args: Subset<T, PagesAggregateArgs>): Prisma.PrismaPromise<GetPagesAggregateType<T>>

    /**
     * Group by Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagesGroupByArgs} args - Group by arguments.
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
      T extends PagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PagesGroupByArgs['orderBy'] }
        : { orderBy?: PagesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pages model
   */
  readonly fields: PagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meta<T extends Pages$metaArgs<ExtArgs> = {}>(args?: Subset<T, Pages$metaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    categoryService<T extends Pages$categoryServiceArgs<ExtArgs> = {}>(args?: Subset<T, Pages$categoryServiceArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pages model
   */ 
  interface PagesFieldRefs {
    readonly id: FieldRef<"Pages", 'String'>
    readonly page: FieldRef<"Pages", 'String'>
    readonly slug: FieldRef<"Pages", 'String'>
    readonly categoryServiceId: FieldRef<"Pages", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Pages findUnique
   */
  export type PagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where: PagesWhereUniqueInput
  }

  /**
   * Pages findUniqueOrThrow
   */
  export type PagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where: PagesWhereUniqueInput
  }

  /**
   * Pages findFirst
   */
  export type PagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where?: PagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PagesOrderByWithRelationInput | PagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pages.
     */
    cursor?: PagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pages.
     */
    distinct?: PagesScalarFieldEnum | PagesScalarFieldEnum[]
  }

  /**
   * Pages findFirstOrThrow
   */
  export type PagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where?: PagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PagesOrderByWithRelationInput | PagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pages.
     */
    cursor?: PagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pages.
     */
    distinct?: PagesScalarFieldEnum | PagesScalarFieldEnum[]
  }

  /**
   * Pages findMany
   */
  export type PagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where?: PagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PagesOrderByWithRelationInput | PagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pages.
     */
    cursor?: PagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    distinct?: PagesScalarFieldEnum | PagesScalarFieldEnum[]
  }

  /**
   * Pages create
   */
  export type PagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * The data needed to create a Pages.
     */
    data: XOR<PagesCreateInput, PagesUncheckedCreateInput>
  }

  /**
   * Pages createMany
   */
  export type PagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pages.
     */
    data: PagesCreateManyInput | PagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pages update
   */
  export type PagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * The data needed to update a Pages.
     */
    data: XOR<PagesUpdateInput, PagesUncheckedUpdateInput>
    /**
     * Choose, which Pages to update.
     */
    where: PagesWhereUniqueInput
  }

  /**
   * Pages updateMany
   */
  export type PagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pages.
     */
    data: XOR<PagesUpdateManyMutationInput, PagesUncheckedUpdateManyInput>
    /**
     * Filter which Pages to update
     */
    where?: PagesWhereInput
    /**
     * Limit how many Pages to update.
     */
    limit?: number
  }

  /**
   * Pages upsert
   */
  export type PagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * The filter to search for the Pages to update in case it exists.
     */
    where: PagesWhereUniqueInput
    /**
     * In case the Pages found by the `where` argument doesn't exist, create a new Pages with this data.
     */
    create: XOR<PagesCreateInput, PagesUncheckedCreateInput>
    /**
     * In case the Pages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PagesUpdateInput, PagesUncheckedUpdateInput>
  }

  /**
   * Pages delete
   */
  export type PagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
    /**
     * Filter which Pages to delete.
     */
    where: PagesWhereUniqueInput
  }

  /**
   * Pages deleteMany
   */
  export type PagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pages to delete
     */
    where?: PagesWhereInput
    /**
     * Limit how many Pages to delete.
     */
    limit?: number
  }

  /**
   * Pages.meta
   */
  export type Pages$metaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    where?: MetaTagWhereInput
    orderBy?: MetaTagOrderByWithRelationInput | MetaTagOrderByWithRelationInput[]
    cursor?: MetaTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MetaTagScalarFieldEnum | MetaTagScalarFieldEnum[]
  }

  /**
   * Pages.categoryService
   */
  export type Pages$categoryServiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryService
     */
    select?: CategoryServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryService
     */
    omit?: CategoryServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryServiceInclude<ExtArgs> | null
    where?: CategoryServiceWhereInput
  }

  /**
   * Pages without action
   */
  export type PagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pages
     */
    select?: PagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pages
     */
    omit?: PagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagesInclude<ExtArgs> | null
  }


  /**
   * Model MetaTag
   */

  export type AggregateMetaTag = {
    _count: MetaTagCountAggregateOutputType | null
    _min: MetaTagMinAggregateOutputType | null
    _max: MetaTagMaxAggregateOutputType | null
  }

  export type MetaTagMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    content: string | null
    slug: string | null
  }

  export type MetaTagMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    content: string | null
    slug: string | null
  }

  export type MetaTagCountAggregateOutputType = {
    id: number
    key: number
    value: number
    content: number
    slug: number
    _all: number
  }


  export type MetaTagMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    content?: true
    slug?: true
  }

  export type MetaTagMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    content?: true
    slug?: true
  }

  export type MetaTagCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    content?: true
    slug?: true
    _all?: true
  }

  export type MetaTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetaTag to aggregate.
     */
    where?: MetaTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaTags to fetch.
     */
    orderBy?: MetaTagOrderByWithRelationInput | MetaTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetaTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MetaTags
    **/
    _count?: true | MetaTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetaTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetaTagMaxAggregateInputType
  }

  export type GetMetaTagAggregateType<T extends MetaTagAggregateArgs> = {
        [P in keyof T & keyof AggregateMetaTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetaTag[P]>
      : GetScalarType<T[P], AggregateMetaTag[P]>
  }




  export type MetaTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetaTagWhereInput
    orderBy?: MetaTagOrderByWithAggregationInput | MetaTagOrderByWithAggregationInput[]
    by: MetaTagScalarFieldEnum[] | MetaTagScalarFieldEnum
    having?: MetaTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetaTagCountAggregateInputType | true
    _min?: MetaTagMinAggregateInputType
    _max?: MetaTagMaxAggregateInputType
  }

  export type MetaTagGroupByOutputType = {
    id: string
    key: string
    value: string
    content: string
    slug: string
    _count: MetaTagCountAggregateOutputType | null
    _min: MetaTagMinAggregateOutputType | null
    _max: MetaTagMaxAggregateOutputType | null
  }

  type GetMetaTagGroupByPayload<T extends MetaTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetaTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetaTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetaTagGroupByOutputType[P]>
            : GetScalarType<T[P], MetaTagGroupByOutputType[P]>
        }
      >
    >


  export type MetaTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    content?: boolean
    slug?: boolean
    pages?: boolean | PagesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metaTag"]>



  export type MetaTagSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    content?: boolean
    slug?: boolean
  }

  export type MetaTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "content" | "slug", ExtArgs["result"]["metaTag"]>
  export type MetaTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pages?: boolean | PagesDefaultArgs<ExtArgs>
  }

  export type $MetaTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MetaTag"
    objects: {
      pages: Prisma.$PagesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      content: string
      slug: string
    }, ExtArgs["result"]["metaTag"]>
    composites: {}
  }

  type MetaTagGetPayload<S extends boolean | null | undefined | MetaTagDefaultArgs> = $Result.GetResult<Prisma.$MetaTagPayload, S>

  type MetaTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetaTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetaTagCountAggregateInputType | true
    }

  export interface MetaTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MetaTag'], meta: { name: 'MetaTag' } }
    /**
     * Find zero or one MetaTag that matches the filter.
     * @param {MetaTagFindUniqueArgs} args - Arguments to find a MetaTag
     * @example
     * // Get one MetaTag
     * const metaTag = await prisma.metaTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetaTagFindUniqueArgs>(args: SelectSubset<T, MetaTagFindUniqueArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MetaTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetaTagFindUniqueOrThrowArgs} args - Arguments to find a MetaTag
     * @example
     * // Get one MetaTag
     * const metaTag = await prisma.metaTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetaTagFindUniqueOrThrowArgs>(args: SelectSubset<T, MetaTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetaTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagFindFirstArgs} args - Arguments to find a MetaTag
     * @example
     * // Get one MetaTag
     * const metaTag = await prisma.metaTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetaTagFindFirstArgs>(args?: SelectSubset<T, MetaTagFindFirstArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetaTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagFindFirstOrThrowArgs} args - Arguments to find a MetaTag
     * @example
     * // Get one MetaTag
     * const metaTag = await prisma.metaTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetaTagFindFirstOrThrowArgs>(args?: SelectSubset<T, MetaTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MetaTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MetaTags
     * const metaTags = await prisma.metaTag.findMany()
     * 
     * // Get first 10 MetaTags
     * const metaTags = await prisma.metaTag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metaTagWithIdOnly = await prisma.metaTag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetaTagFindManyArgs>(args?: SelectSubset<T, MetaTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MetaTag.
     * @param {MetaTagCreateArgs} args - Arguments to create a MetaTag.
     * @example
     * // Create one MetaTag
     * const MetaTag = await prisma.metaTag.create({
     *   data: {
     *     // ... data to create a MetaTag
     *   }
     * })
     * 
     */
    create<T extends MetaTagCreateArgs>(args: SelectSubset<T, MetaTagCreateArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MetaTags.
     * @param {MetaTagCreateManyArgs} args - Arguments to create many MetaTags.
     * @example
     * // Create many MetaTags
     * const metaTag = await prisma.metaTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetaTagCreateManyArgs>(args?: SelectSubset<T, MetaTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MetaTag.
     * @param {MetaTagDeleteArgs} args - Arguments to delete one MetaTag.
     * @example
     * // Delete one MetaTag
     * const MetaTag = await prisma.metaTag.delete({
     *   where: {
     *     // ... filter to delete one MetaTag
     *   }
     * })
     * 
     */
    delete<T extends MetaTagDeleteArgs>(args: SelectSubset<T, MetaTagDeleteArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MetaTag.
     * @param {MetaTagUpdateArgs} args - Arguments to update one MetaTag.
     * @example
     * // Update one MetaTag
     * const metaTag = await prisma.metaTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetaTagUpdateArgs>(args: SelectSubset<T, MetaTagUpdateArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MetaTags.
     * @param {MetaTagDeleteManyArgs} args - Arguments to filter MetaTags to delete.
     * @example
     * // Delete a few MetaTags
     * const { count } = await prisma.metaTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetaTagDeleteManyArgs>(args?: SelectSubset<T, MetaTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetaTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MetaTags
     * const metaTag = await prisma.metaTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetaTagUpdateManyArgs>(args: SelectSubset<T, MetaTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MetaTag.
     * @param {MetaTagUpsertArgs} args - Arguments to update or create a MetaTag.
     * @example
     * // Update or create a MetaTag
     * const metaTag = await prisma.metaTag.upsert({
     *   create: {
     *     // ... data to create a MetaTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MetaTag we want to update
     *   }
     * })
     */
    upsert<T extends MetaTagUpsertArgs>(args: SelectSubset<T, MetaTagUpsertArgs<ExtArgs>>): Prisma__MetaTagClient<$Result.GetResult<Prisma.$MetaTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MetaTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagCountArgs} args - Arguments to filter MetaTags to count.
     * @example
     * // Count the number of MetaTags
     * const count = await prisma.metaTag.count({
     *   where: {
     *     // ... the filter for the MetaTags we want to count
     *   }
     * })
    **/
    count<T extends MetaTagCountArgs>(
      args?: Subset<T, MetaTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetaTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MetaTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MetaTagAggregateArgs>(args: Subset<T, MetaTagAggregateArgs>): Prisma.PrismaPromise<GetMetaTagAggregateType<T>>

    /**
     * Group by MetaTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaTagGroupByArgs} args - Group by arguments.
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
      T extends MetaTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetaTagGroupByArgs['orderBy'] }
        : { orderBy?: MetaTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetaTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetaTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MetaTag model
   */
  readonly fields: MetaTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MetaTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetaTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pages<T extends PagesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PagesDefaultArgs<ExtArgs>>): Prisma__PagesClient<$Result.GetResult<Prisma.$PagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MetaTag model
   */ 
  interface MetaTagFieldRefs {
    readonly id: FieldRef<"MetaTag", 'String'>
    readonly key: FieldRef<"MetaTag", 'String'>
    readonly value: FieldRef<"MetaTag", 'String'>
    readonly content: FieldRef<"MetaTag", 'String'>
    readonly slug: FieldRef<"MetaTag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MetaTag findUnique
   */
  export type MetaTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter, which MetaTag to fetch.
     */
    where: MetaTagWhereUniqueInput
  }

  /**
   * MetaTag findUniqueOrThrow
   */
  export type MetaTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter, which MetaTag to fetch.
     */
    where: MetaTagWhereUniqueInput
  }

  /**
   * MetaTag findFirst
   */
  export type MetaTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter, which MetaTag to fetch.
     */
    where?: MetaTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaTags to fetch.
     */
    orderBy?: MetaTagOrderByWithRelationInput | MetaTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetaTags.
     */
    cursor?: MetaTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetaTags.
     */
    distinct?: MetaTagScalarFieldEnum | MetaTagScalarFieldEnum[]
  }

  /**
   * MetaTag findFirstOrThrow
   */
  export type MetaTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter, which MetaTag to fetch.
     */
    where?: MetaTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaTags to fetch.
     */
    orderBy?: MetaTagOrderByWithRelationInput | MetaTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetaTags.
     */
    cursor?: MetaTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetaTags.
     */
    distinct?: MetaTagScalarFieldEnum | MetaTagScalarFieldEnum[]
  }

  /**
   * MetaTag findMany
   */
  export type MetaTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter, which MetaTags to fetch.
     */
    where?: MetaTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaTags to fetch.
     */
    orderBy?: MetaTagOrderByWithRelationInput | MetaTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MetaTags.
     */
    cursor?: MetaTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaTags.
     */
    skip?: number
    distinct?: MetaTagScalarFieldEnum | MetaTagScalarFieldEnum[]
  }

  /**
   * MetaTag create
   */
  export type MetaTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * The data needed to create a MetaTag.
     */
    data: XOR<MetaTagCreateInput, MetaTagUncheckedCreateInput>
  }

  /**
   * MetaTag createMany
   */
  export type MetaTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MetaTags.
     */
    data: MetaTagCreateManyInput | MetaTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetaTag update
   */
  export type MetaTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * The data needed to update a MetaTag.
     */
    data: XOR<MetaTagUpdateInput, MetaTagUncheckedUpdateInput>
    /**
     * Choose, which MetaTag to update.
     */
    where: MetaTagWhereUniqueInput
  }

  /**
   * MetaTag updateMany
   */
  export type MetaTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MetaTags.
     */
    data: XOR<MetaTagUpdateManyMutationInput, MetaTagUncheckedUpdateManyInput>
    /**
     * Filter which MetaTags to update
     */
    where?: MetaTagWhereInput
    /**
     * Limit how many MetaTags to update.
     */
    limit?: number
  }

  /**
   * MetaTag upsert
   */
  export type MetaTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * The filter to search for the MetaTag to update in case it exists.
     */
    where: MetaTagWhereUniqueInput
    /**
     * In case the MetaTag found by the `where` argument doesn't exist, create a new MetaTag with this data.
     */
    create: XOR<MetaTagCreateInput, MetaTagUncheckedCreateInput>
    /**
     * In case the MetaTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetaTagUpdateInput, MetaTagUncheckedUpdateInput>
  }

  /**
   * MetaTag delete
   */
  export type MetaTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
    /**
     * Filter which MetaTag to delete.
     */
    where: MetaTagWhereUniqueInput
  }

  /**
   * MetaTag deleteMany
   */
  export type MetaTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetaTags to delete
     */
    where?: MetaTagWhereInput
    /**
     * Limit how many MetaTags to delete.
     */
    limit?: number
  }

  /**
   * MetaTag without action
   */
  export type MetaTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaTag
     */
    select?: MetaTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaTag
     */
    omit?: MetaTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaTagInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    amount: number | null
  }

  export type OrderSumAggregateOutputType = {
    amount: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    amount: number | null
    bussiness: string | null
    categoryId: string | null
    date: string | null
    email: string | null
    message: string | null
    name: string | null
    phoneNumber: string | null
    idPlan: string | null
    time: string | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    amount: number | null
    bussiness: string | null
    categoryId: string | null
    date: string | null
    email: string | null
    message: string | null
    name: string | null
    phoneNumber: string | null
    idPlan: string | null
    time: string | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    amount: number
    bussiness: number
    categoryId: number
    date: number
    email: number
    message: number
    name: number
    phoneNumber: number
    idPlan: number
    time: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    amount?: true
  }

  export type OrderSumAggregateInputType = {
    amount?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    amount?: true
    bussiness?: true
    categoryId?: true
    date?: true
    email?: true
    message?: true
    name?: true
    phoneNumber?: true
    idPlan?: true
    time?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    amount?: true
    bussiness?: true
    categoryId?: true
    date?: true
    email?: true
    message?: true
    name?: true
    phoneNumber?: true
    idPlan?: true
    time?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    amount?: true
    bussiness?: true
    categoryId?: true
    date?: true
    email?: true
    message?: true
    name?: true
    phoneNumber?: true
    idPlan?: true
    time?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    amount: number
    bussiness: string
    categoryId: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    idPlan: string
    time: string
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    bussiness?: boolean
    categoryId?: boolean
    date?: boolean
    email?: boolean
    message?: boolean
    name?: boolean
    phoneNumber?: boolean
    idPlan?: boolean
    time?: boolean
    category?: boolean | CategoryServiceDefaultArgs<ExtArgs>
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>



  export type OrderSelectScalar = {
    id?: boolean
    amount?: boolean
    bussiness?: boolean
    categoryId?: boolean
    date?: boolean
    email?: boolean
    message?: boolean
    name?: boolean
    phoneNumber?: boolean
    idPlan?: boolean
    time?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "amount" | "bussiness" | "categoryId" | "date" | "email" | "message" | "name" | "phoneNumber" | "idPlan" | "time", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryServiceDefaultArgs<ExtArgs>
    plan?: boolean | PlanServiceDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      category: Prisma.$CategoryServicePayload<ExtArgs>
      plan: Prisma.$PlanServicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      amount: number
      bussiness: string
      categoryId: string
      date: string
      email: string
      message: string
      name: string
      phoneNumber: string
      idPlan: string
      time: string
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
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
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryServiceDefaultArgs<ExtArgs>>): Prisma__CategoryServiceClient<$Result.GetResult<Prisma.$CategoryServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends PlanServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanServiceDefaultArgs<ExtArgs>>): Prisma__PlanServiceClient<$Result.GetResult<Prisma.$PlanServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */ 
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly amount: FieldRef<"Order", 'Float'>
    readonly bussiness: FieldRef<"Order", 'String'>
    readonly categoryId: FieldRef<"Order", 'String'>
    readonly date: FieldRef<"Order", 'String'>
    readonly email: FieldRef<"Order", 'String'>
    readonly message: FieldRef<"Order", 'String'>
    readonly name: FieldRef<"Order", 'String'>
    readonly phoneNumber: FieldRef<"Order", 'String'>
    readonly idPlan: FieldRef<"Order", 'String'>
    readonly time: FieldRef<"Order", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PlanServiceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    showPrice: 'showPrice',
    status: 'status',
    options: 'options',
    descriptions: 'descriptions',
    categoryId: 'categoryId'
  };

  export type PlanServiceScalarFieldEnum = (typeof PlanServiceScalarFieldEnum)[keyof typeof PlanServiceScalarFieldEnum]


  export const CategoryServiceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    heading: 'heading',
    description: 'description',
    status: 'status',
    slug: 'slug'
  };

  export type CategoryServiceScalarFieldEnum = (typeof CategoryServiceScalarFieldEnum)[keyof typeof CategoryServiceScalarFieldEnum]


  export const PriceScalarFieldEnum: {
    id: 'id',
    curr: 'curr',
    amount: 'amount',
    discount: 'discount',
    idPlan: 'idPlan'
  };

  export type PriceScalarFieldEnum = (typeof PriceScalarFieldEnum)[keyof typeof PriceScalarFieldEnum]


  export const BenefitScalarFieldEnum: {
    id: 'id',
    value: 'value',
    idPlan: 'idPlan'
  };

  export type BenefitScalarFieldEnum = (typeof BenefitScalarFieldEnum)[keyof typeof BenefitScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    status: 'status',
    refreshToken: 'refreshToken',
    role: 'role',
    features: 'features'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const BlogScalarFieldEnum: {
    id: 'id',
    title: 'title',
    image: 'image',
    content: 'content',
    status: 'status',
    favorite: 'favorite',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    roleId: 'roleId'
  };

  export type BlogScalarFieldEnum = (typeof BlogScalarFieldEnum)[keyof typeof BlogScalarFieldEnum]


  export const BlogCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    status: 'status'
  };

  export type BlogCategoryScalarFieldEnum = (typeof BlogCategoryScalarFieldEnum)[keyof typeof BlogCategoryScalarFieldEnum]


  export const PagesScalarFieldEnum: {
    id: 'id',
    page: 'page',
    slug: 'slug',
    categoryServiceId: 'categoryServiceId'
  };

  export type PagesScalarFieldEnum = (typeof PagesScalarFieldEnum)[keyof typeof PagesScalarFieldEnum]


  export const MetaTagScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    content: 'content',
    slug: 'slug'
  };

  export type MetaTagScalarFieldEnum = (typeof MetaTagScalarFieldEnum)[keyof typeof MetaTagScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    amount: 'amount',
    bussiness: 'bussiness',
    categoryId: 'categoryId',
    date: 'date',
    email: 'email',
    message: 'message',
    name: 'name',
    phoneNumber: 'phoneNumber',
    idPlan: 'idPlan',
    time: 'time'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const PlanServiceOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    options: 'options',
    descriptions: 'descriptions',
    categoryId: 'categoryId'
  };

  export type PlanServiceOrderByRelevanceFieldEnum = (typeof PlanServiceOrderByRelevanceFieldEnum)[keyof typeof PlanServiceOrderByRelevanceFieldEnum]


  export const CategoryServiceOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    heading: 'heading',
    description: 'description',
    slug: 'slug'
  };

  export type CategoryServiceOrderByRelevanceFieldEnum = (typeof CategoryServiceOrderByRelevanceFieldEnum)[keyof typeof CategoryServiceOrderByRelevanceFieldEnum]


  export const PriceOrderByRelevanceFieldEnum: {
    id: 'id',
    idPlan: 'idPlan'
  };

  export type PriceOrderByRelevanceFieldEnum = (typeof PriceOrderByRelevanceFieldEnum)[keyof typeof PriceOrderByRelevanceFieldEnum]


  export const BenefitOrderByRelevanceFieldEnum: {
    id: 'id',
    value: 'value',
    idPlan: 'idPlan'
  };

  export type BenefitOrderByRelevanceFieldEnum = (typeof BenefitOrderByRelevanceFieldEnum)[keyof typeof BenefitOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const RoleOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    refreshToken: 'refreshToken',
    role: 'role'
  };

  export type RoleOrderByRelevanceFieldEnum = (typeof RoleOrderByRelevanceFieldEnum)[keyof typeof RoleOrderByRelevanceFieldEnum]


  export const BlogOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    image: 'image',
    content: 'content',
    categoryId: 'categoryId',
    roleId: 'roleId'
  };

  export type BlogOrderByRelevanceFieldEnum = (typeof BlogOrderByRelevanceFieldEnum)[keyof typeof BlogOrderByRelevanceFieldEnum]


  export const BlogCategoryOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug'
  };

  export type BlogCategoryOrderByRelevanceFieldEnum = (typeof BlogCategoryOrderByRelevanceFieldEnum)[keyof typeof BlogCategoryOrderByRelevanceFieldEnum]


  export const PagesOrderByRelevanceFieldEnum: {
    id: 'id',
    page: 'page',
    slug: 'slug',
    categoryServiceId: 'categoryServiceId'
  };

  export type PagesOrderByRelevanceFieldEnum = (typeof PagesOrderByRelevanceFieldEnum)[keyof typeof PagesOrderByRelevanceFieldEnum]


  export const MetaTagOrderByRelevanceFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    content: 'content',
    slug: 'slug'
  };

  export type MetaTagOrderByRelevanceFieldEnum = (typeof MetaTagOrderByRelevanceFieldEnum)[keyof typeof MetaTagOrderByRelevanceFieldEnum]


  export const OrderOrderByRelevanceFieldEnum: {
    id: 'id',
    bussiness: 'bussiness',
    categoryId: 'categoryId',
    date: 'date',
    email: 'email',
    message: 'message',
    name: 'name',
    phoneNumber: 'phoneNumber',
    idPlan: 'idPlan',
    time: 'time'
  };

  export type OrderOrderByRelevanceFieldEnum = (typeof OrderOrderByRelevanceFieldEnum)[keyof typeof OrderOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'PlanType'
   */
  export type EnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PlanStatus'
   */
  export type EnumPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanStatus'>
    


  /**
   * Reference to a field of type 'Currency'
   */
  export type EnumCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Currency'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'BlogStatus'
   */
  export type EnumBlogStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BlogStatus'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type PlanServiceWhereInput = {
    AND?: PlanServiceWhereInput | PlanServiceWhereInput[]
    OR?: PlanServiceWhereInput[]
    NOT?: PlanServiceWhereInput | PlanServiceWhereInput[]
    id?: StringFilter<"PlanService"> | string
    name?: StringFilter<"PlanService"> | string
    type?: EnumPlanTypeFilter<"PlanService"> | $Enums.PlanType
    showPrice?: BoolFilter<"PlanService"> | boolean
    status?: EnumPlanStatusFilter<"PlanService"> | $Enums.PlanStatus
    options?: StringFilter<"PlanService"> | string
    descriptions?: StringFilter<"PlanService"> | string
    categoryId?: StringFilter<"PlanService"> | string
    prices?: PriceListRelationFilter
    benefits?: BenefitListRelationFilter
    category?: XOR<CategoryServiceScalarRelationFilter, CategoryServiceWhereInput>
    orders?: OrderListRelationFilter
  }

  export type PlanServiceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    showPrice?: SortOrder
    status?: SortOrder
    options?: SortOrder
    descriptions?: SortOrder
    categoryId?: SortOrder
    prices?: PriceOrderByRelationAggregateInput
    benefits?: BenefitOrderByRelationAggregateInput
    category?: CategoryServiceOrderByWithRelationInput
    orders?: OrderOrderByRelationAggregateInput
    _relevance?: PlanServiceOrderByRelevanceInput
  }

  export type PlanServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanServiceWhereInput | PlanServiceWhereInput[]
    OR?: PlanServiceWhereInput[]
    NOT?: PlanServiceWhereInput | PlanServiceWhereInput[]
    name?: StringFilter<"PlanService"> | string
    type?: EnumPlanTypeFilter<"PlanService"> | $Enums.PlanType
    showPrice?: BoolFilter<"PlanService"> | boolean
    status?: EnumPlanStatusFilter<"PlanService"> | $Enums.PlanStatus
    options?: StringFilter<"PlanService"> | string
    descriptions?: StringFilter<"PlanService"> | string
    categoryId?: StringFilter<"PlanService"> | string
    prices?: PriceListRelationFilter
    benefits?: BenefitListRelationFilter
    category?: XOR<CategoryServiceScalarRelationFilter, CategoryServiceWhereInput>
    orders?: OrderListRelationFilter
  }, "id">

  export type PlanServiceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    showPrice?: SortOrder
    status?: SortOrder
    options?: SortOrder
    descriptions?: SortOrder
    categoryId?: SortOrder
    _count?: PlanServiceCountOrderByAggregateInput
    _max?: PlanServiceMaxOrderByAggregateInput
    _min?: PlanServiceMinOrderByAggregateInput
  }

  export type PlanServiceScalarWhereWithAggregatesInput = {
    AND?: PlanServiceScalarWhereWithAggregatesInput | PlanServiceScalarWhereWithAggregatesInput[]
    OR?: PlanServiceScalarWhereWithAggregatesInput[]
    NOT?: PlanServiceScalarWhereWithAggregatesInput | PlanServiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlanService"> | string
    name?: StringWithAggregatesFilter<"PlanService"> | string
    type?: EnumPlanTypeWithAggregatesFilter<"PlanService"> | $Enums.PlanType
    showPrice?: BoolWithAggregatesFilter<"PlanService"> | boolean
    status?: EnumPlanStatusWithAggregatesFilter<"PlanService"> | $Enums.PlanStatus
    options?: StringWithAggregatesFilter<"PlanService"> | string
    descriptions?: StringWithAggregatesFilter<"PlanService"> | string
    categoryId?: StringWithAggregatesFilter<"PlanService"> | string
  }

  export type CategoryServiceWhereInput = {
    AND?: CategoryServiceWhereInput | CategoryServiceWhereInput[]
    OR?: CategoryServiceWhereInput[]
    NOT?: CategoryServiceWhereInput | CategoryServiceWhereInput[]
    id?: StringFilter<"CategoryService"> | string
    name?: StringFilter<"CategoryService"> | string
    heading?: StringFilter<"CategoryService"> | string
    description?: StringFilter<"CategoryService"> | string
    status?: EnumPlanStatusFilter<"CategoryService"> | $Enums.PlanStatus
    slug?: StringFilter<"CategoryService"> | string
    plans?: PlanServiceListRelationFilter
    orders?: OrderListRelationFilter
    pages?: XOR<PagesNullableScalarRelationFilter, PagesWhereInput> | null
  }

  export type CategoryServiceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    heading?: SortOrder
    description?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    plans?: PlanServiceOrderByRelationAggregateInput
    orders?: OrderOrderByRelationAggregateInput
    pages?: PagesOrderByWithRelationInput
    _relevance?: CategoryServiceOrderByRelevanceInput
  }

  export type CategoryServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    slug?: string
    AND?: CategoryServiceWhereInput | CategoryServiceWhereInput[]
    OR?: CategoryServiceWhereInput[]
    NOT?: CategoryServiceWhereInput | CategoryServiceWhereInput[]
    heading?: StringFilter<"CategoryService"> | string
    description?: StringFilter<"CategoryService"> | string
    status?: EnumPlanStatusFilter<"CategoryService"> | $Enums.PlanStatus
    plans?: PlanServiceListRelationFilter
    orders?: OrderListRelationFilter
    pages?: XOR<PagesNullableScalarRelationFilter, PagesWhereInput> | null
  }, "id" | "name" | "slug">

  export type CategoryServiceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    heading?: SortOrder
    description?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    _count?: CategoryServiceCountOrderByAggregateInput
    _max?: CategoryServiceMaxOrderByAggregateInput
    _min?: CategoryServiceMinOrderByAggregateInput
  }

  export type CategoryServiceScalarWhereWithAggregatesInput = {
    AND?: CategoryServiceScalarWhereWithAggregatesInput | CategoryServiceScalarWhereWithAggregatesInput[]
    OR?: CategoryServiceScalarWhereWithAggregatesInput[]
    NOT?: CategoryServiceScalarWhereWithAggregatesInput | CategoryServiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CategoryService"> | string
    name?: StringWithAggregatesFilter<"CategoryService"> | string
    heading?: StringWithAggregatesFilter<"CategoryService"> | string
    description?: StringWithAggregatesFilter<"CategoryService"> | string
    status?: EnumPlanStatusWithAggregatesFilter<"CategoryService"> | $Enums.PlanStatus
    slug?: StringWithAggregatesFilter<"CategoryService"> | string
  }

  export type PriceWhereInput = {
    AND?: PriceWhereInput | PriceWhereInput[]
    OR?: PriceWhereInput[]
    NOT?: PriceWhereInput | PriceWhereInput[]
    id?: StringFilter<"Price"> | string
    curr?: EnumCurrencyFilter<"Price"> | $Enums.Currency
    amount?: FloatFilter<"Price"> | number
    discount?: FloatFilter<"Price"> | number
    idPlan?: StringFilter<"Price"> | string
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }

  export type PriceOrderByWithRelationInput = {
    id?: SortOrder
    curr?: SortOrder
    amount?: SortOrder
    discount?: SortOrder
    idPlan?: SortOrder
    plan?: PlanServiceOrderByWithRelationInput
    _relevance?: PriceOrderByRelevanceInput
  }

  export type PriceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PriceWhereInput | PriceWhereInput[]
    OR?: PriceWhereInput[]
    NOT?: PriceWhereInput | PriceWhereInput[]
    curr?: EnumCurrencyFilter<"Price"> | $Enums.Currency
    amount?: FloatFilter<"Price"> | number
    discount?: FloatFilter<"Price"> | number
    idPlan?: StringFilter<"Price"> | string
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }, "id">

  export type PriceOrderByWithAggregationInput = {
    id?: SortOrder
    curr?: SortOrder
    amount?: SortOrder
    discount?: SortOrder
    idPlan?: SortOrder
    _count?: PriceCountOrderByAggregateInput
    _avg?: PriceAvgOrderByAggregateInput
    _max?: PriceMaxOrderByAggregateInput
    _min?: PriceMinOrderByAggregateInput
    _sum?: PriceSumOrderByAggregateInput
  }

  export type PriceScalarWhereWithAggregatesInput = {
    AND?: PriceScalarWhereWithAggregatesInput | PriceScalarWhereWithAggregatesInput[]
    OR?: PriceScalarWhereWithAggregatesInput[]
    NOT?: PriceScalarWhereWithAggregatesInput | PriceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Price"> | string
    curr?: EnumCurrencyWithAggregatesFilter<"Price"> | $Enums.Currency
    amount?: FloatWithAggregatesFilter<"Price"> | number
    discount?: FloatWithAggregatesFilter<"Price"> | number
    idPlan?: StringWithAggregatesFilter<"Price"> | string
  }

  export type BenefitWhereInput = {
    AND?: BenefitWhereInput | BenefitWhereInput[]
    OR?: BenefitWhereInput[]
    NOT?: BenefitWhereInput | BenefitWhereInput[]
    id?: StringFilter<"Benefit"> | string
    value?: StringFilter<"Benefit"> | string
    idPlan?: StringFilter<"Benefit"> | string
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }

  export type BenefitOrderByWithRelationInput = {
    id?: SortOrder
    value?: SortOrder
    idPlan?: SortOrder
    plan?: PlanServiceOrderByWithRelationInput
    _relevance?: BenefitOrderByRelevanceInput
  }

  export type BenefitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BenefitWhereInput | BenefitWhereInput[]
    OR?: BenefitWhereInput[]
    NOT?: BenefitWhereInput | BenefitWhereInput[]
    value?: StringFilter<"Benefit"> | string
    idPlan?: StringFilter<"Benefit"> | string
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }, "id">

  export type BenefitOrderByWithAggregationInput = {
    id?: SortOrder
    value?: SortOrder
    idPlan?: SortOrder
    _count?: BenefitCountOrderByAggregateInput
    _max?: BenefitMaxOrderByAggregateInput
    _min?: BenefitMinOrderByAggregateInput
  }

  export type BenefitScalarWhereWithAggregatesInput = {
    AND?: BenefitScalarWhereWithAggregatesInput | BenefitScalarWhereWithAggregatesInput[]
    OR?: BenefitScalarWhereWithAggregatesInput[]
    NOT?: BenefitScalarWhereWithAggregatesInput | BenefitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Benefit"> | string
    value?: StringWithAggregatesFilter<"Benefit"> | string
    idPlan?: StringWithAggregatesFilter<"Benefit"> | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: StringFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    email?: StringFilter<"Role"> | string
    password?: StringFilter<"Role"> | string
    status?: EnumPlanStatusFilter<"Role"> | $Enums.PlanStatus
    refreshToken?: StringNullableFilter<"Role"> | string | null
    role?: StringFilter<"Role"> | string
    features?: JsonFilter<"Role">
    blogs?: BlogListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    role?: SortOrder
    features?: SortOrder
    blogs?: BlogOrderByRelationAggregateInput
    _relevance?: RoleOrderByRelevanceInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    name?: StringFilter<"Role"> | string
    password?: StringFilter<"Role"> | string
    status?: EnumPlanStatusFilter<"Role"> | $Enums.PlanStatus
    refreshToken?: StringNullableFilter<"Role"> | string | null
    role?: StringFilter<"Role"> | string
    features?: JsonFilter<"Role">
    blogs?: BlogListRelationFilter
  }, "id" | "email">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    role?: SortOrder
    features?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    email?: StringWithAggregatesFilter<"Role"> | string
    password?: StringWithAggregatesFilter<"Role"> | string
    status?: EnumPlanStatusWithAggregatesFilter<"Role"> | $Enums.PlanStatus
    refreshToken?: StringNullableWithAggregatesFilter<"Role"> | string | null
    role?: StringWithAggregatesFilter<"Role"> | string
    features?: JsonWithAggregatesFilter<"Role">
  }

  export type BlogWhereInput = {
    AND?: BlogWhereInput | BlogWhereInput[]
    OR?: BlogWhereInput[]
    NOT?: BlogWhereInput | BlogWhereInput[]
    id?: StringFilter<"Blog"> | string
    title?: StringFilter<"Blog"> | string
    image?: StringFilter<"Blog"> | string
    content?: StringFilter<"Blog"> | string
    status?: EnumBlogStatusFilter<"Blog"> | $Enums.BlogStatus
    favorite?: BoolFilter<"Blog"> | boolean
    categoryId?: StringFilter<"Blog"> | string
    createdAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    roleId?: StringNullableFilter<"Blog"> | string | null
    category?: XOR<BlogCategoryScalarRelationFilter, BlogCategoryWhereInput>
    role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
  }

  export type BlogOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    image?: SortOrder
    content?: SortOrder
    status?: SortOrder
    favorite?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    roleId?: SortOrderInput | SortOrder
    category?: BlogCategoryOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
    _relevance?: BlogOrderByRelevanceInput
  }

  export type BlogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogWhereInput | BlogWhereInput[]
    OR?: BlogWhereInput[]
    NOT?: BlogWhereInput | BlogWhereInput[]
    title?: StringFilter<"Blog"> | string
    image?: StringFilter<"Blog"> | string
    content?: StringFilter<"Blog"> | string
    status?: EnumBlogStatusFilter<"Blog"> | $Enums.BlogStatus
    favorite?: BoolFilter<"Blog"> | boolean
    categoryId?: StringFilter<"Blog"> | string
    createdAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    roleId?: StringNullableFilter<"Blog"> | string | null
    category?: XOR<BlogCategoryScalarRelationFilter, BlogCategoryWhereInput>
    role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
  }, "id">

  export type BlogOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    image?: SortOrder
    content?: SortOrder
    status?: SortOrder
    favorite?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    roleId?: SortOrderInput | SortOrder
    _count?: BlogCountOrderByAggregateInput
    _max?: BlogMaxOrderByAggregateInput
    _min?: BlogMinOrderByAggregateInput
  }

  export type BlogScalarWhereWithAggregatesInput = {
    AND?: BlogScalarWhereWithAggregatesInput | BlogScalarWhereWithAggregatesInput[]
    OR?: BlogScalarWhereWithAggregatesInput[]
    NOT?: BlogScalarWhereWithAggregatesInput | BlogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Blog"> | string
    title?: StringWithAggregatesFilter<"Blog"> | string
    image?: StringWithAggregatesFilter<"Blog"> | string
    content?: StringWithAggregatesFilter<"Blog"> | string
    status?: EnumBlogStatusWithAggregatesFilter<"Blog"> | $Enums.BlogStatus
    favorite?: BoolWithAggregatesFilter<"Blog"> | boolean
    categoryId?: StringWithAggregatesFilter<"Blog"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Blog"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Blog"> | Date | string | null
    roleId?: StringNullableWithAggregatesFilter<"Blog"> | string | null
  }

  export type BlogCategoryWhereInput = {
    AND?: BlogCategoryWhereInput | BlogCategoryWhereInput[]
    OR?: BlogCategoryWhereInput[]
    NOT?: BlogCategoryWhereInput | BlogCategoryWhereInput[]
    id?: StringFilter<"BlogCategory"> | string
    name?: StringFilter<"BlogCategory"> | string
    slug?: StringFilter<"BlogCategory"> | string
    status?: EnumPlanStatusFilter<"BlogCategory"> | $Enums.PlanStatus
    blogs?: BlogListRelationFilter
  }

  export type BlogCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    blogs?: BlogOrderByRelationAggregateInput
    _relevance?: BlogCategoryOrderByRelevanceInput
  }

  export type BlogCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    slug?: string
    AND?: BlogCategoryWhereInput | BlogCategoryWhereInput[]
    OR?: BlogCategoryWhereInput[]
    NOT?: BlogCategoryWhereInput | BlogCategoryWhereInput[]
    status?: EnumPlanStatusFilter<"BlogCategory"> | $Enums.PlanStatus
    blogs?: BlogListRelationFilter
  }, "id" | "name" | "slug">

  export type BlogCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    _count?: BlogCategoryCountOrderByAggregateInput
    _max?: BlogCategoryMaxOrderByAggregateInput
    _min?: BlogCategoryMinOrderByAggregateInput
  }

  export type BlogCategoryScalarWhereWithAggregatesInput = {
    AND?: BlogCategoryScalarWhereWithAggregatesInput | BlogCategoryScalarWhereWithAggregatesInput[]
    OR?: BlogCategoryScalarWhereWithAggregatesInput[]
    NOT?: BlogCategoryScalarWhereWithAggregatesInput | BlogCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BlogCategory"> | string
    name?: StringWithAggregatesFilter<"BlogCategory"> | string
    slug?: StringWithAggregatesFilter<"BlogCategory"> | string
    status?: EnumPlanStatusWithAggregatesFilter<"BlogCategory"> | $Enums.PlanStatus
  }

  export type PagesWhereInput = {
    AND?: PagesWhereInput | PagesWhereInput[]
    OR?: PagesWhereInput[]
    NOT?: PagesWhereInput | PagesWhereInput[]
    id?: StringFilter<"Pages"> | string
    page?: StringFilter<"Pages"> | string
    slug?: StringFilter<"Pages"> | string
    categoryServiceId?: StringNullableFilter<"Pages"> | string | null
    meta?: MetaTagListRelationFilter
    categoryService?: XOR<CategoryServiceNullableScalarRelationFilter, CategoryServiceWhereInput> | null
  }

  export type PagesOrderByWithRelationInput = {
    id?: SortOrder
    page?: SortOrder
    slug?: SortOrder
    categoryServiceId?: SortOrderInput | SortOrder
    meta?: MetaTagOrderByRelationAggregateInput
    categoryService?: CategoryServiceOrderByWithRelationInput
    _relevance?: PagesOrderByRelevanceInput
  }

  export type PagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    categoryServiceId?: string
    AND?: PagesWhereInput | PagesWhereInput[]
    OR?: PagesWhereInput[]
    NOT?: PagesWhereInput | PagesWhereInput[]
    page?: StringFilter<"Pages"> | string
    meta?: MetaTagListRelationFilter
    categoryService?: XOR<CategoryServiceNullableScalarRelationFilter, CategoryServiceWhereInput> | null
  }, "id" | "slug" | "categoryServiceId">

  export type PagesOrderByWithAggregationInput = {
    id?: SortOrder
    page?: SortOrder
    slug?: SortOrder
    categoryServiceId?: SortOrderInput | SortOrder
    _count?: PagesCountOrderByAggregateInput
    _max?: PagesMaxOrderByAggregateInput
    _min?: PagesMinOrderByAggregateInput
  }

  export type PagesScalarWhereWithAggregatesInput = {
    AND?: PagesScalarWhereWithAggregatesInput | PagesScalarWhereWithAggregatesInput[]
    OR?: PagesScalarWhereWithAggregatesInput[]
    NOT?: PagesScalarWhereWithAggregatesInput | PagesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pages"> | string
    page?: StringWithAggregatesFilter<"Pages"> | string
    slug?: StringWithAggregatesFilter<"Pages"> | string
    categoryServiceId?: StringNullableWithAggregatesFilter<"Pages"> | string | null
  }

  export type MetaTagWhereInput = {
    AND?: MetaTagWhereInput | MetaTagWhereInput[]
    OR?: MetaTagWhereInput[]
    NOT?: MetaTagWhereInput | MetaTagWhereInput[]
    id?: StringFilter<"MetaTag"> | string
    key?: StringFilter<"MetaTag"> | string
    value?: StringFilter<"MetaTag"> | string
    content?: StringFilter<"MetaTag"> | string
    slug?: StringFilter<"MetaTag"> | string
    pages?: XOR<PagesScalarRelationFilter, PagesWhereInput>
  }

  export type MetaTagOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    content?: SortOrder
    slug?: SortOrder
    pages?: PagesOrderByWithRelationInput
    _relevance?: MetaTagOrderByRelevanceInput
  }

  export type MetaTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug_value?: MetaTagSlugValueCompoundUniqueInput
    AND?: MetaTagWhereInput | MetaTagWhereInput[]
    OR?: MetaTagWhereInput[]
    NOT?: MetaTagWhereInput | MetaTagWhereInput[]
    key?: StringFilter<"MetaTag"> | string
    value?: StringFilter<"MetaTag"> | string
    content?: StringFilter<"MetaTag"> | string
    slug?: StringFilter<"MetaTag"> | string
    pages?: XOR<PagesScalarRelationFilter, PagesWhereInput>
  }, "id" | "slug_value">

  export type MetaTagOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    content?: SortOrder
    slug?: SortOrder
    _count?: MetaTagCountOrderByAggregateInput
    _max?: MetaTagMaxOrderByAggregateInput
    _min?: MetaTagMinOrderByAggregateInput
  }

  export type MetaTagScalarWhereWithAggregatesInput = {
    AND?: MetaTagScalarWhereWithAggregatesInput | MetaTagScalarWhereWithAggregatesInput[]
    OR?: MetaTagScalarWhereWithAggregatesInput[]
    NOT?: MetaTagScalarWhereWithAggregatesInput | MetaTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MetaTag"> | string
    key?: StringWithAggregatesFilter<"MetaTag"> | string
    value?: StringWithAggregatesFilter<"MetaTag"> | string
    content?: StringWithAggregatesFilter<"MetaTag"> | string
    slug?: StringWithAggregatesFilter<"MetaTag"> | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    amount?: FloatFilter<"Order"> | number
    bussiness?: StringFilter<"Order"> | string
    categoryId?: StringFilter<"Order"> | string
    date?: StringFilter<"Order"> | string
    email?: StringFilter<"Order"> | string
    message?: StringFilter<"Order"> | string
    name?: StringFilter<"Order"> | string
    phoneNumber?: StringFilter<"Order"> | string
    idPlan?: StringFilter<"Order"> | string
    time?: StringFilter<"Order"> | string
    category?: XOR<CategoryServiceScalarRelationFilter, CategoryServiceWhereInput>
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    amount?: SortOrder
    bussiness?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    email?: SortOrder
    message?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    idPlan?: SortOrder
    time?: SortOrder
    category?: CategoryServiceOrderByWithRelationInput
    plan?: PlanServiceOrderByWithRelationInput
    _relevance?: OrderOrderByRelevanceInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    amount?: FloatFilter<"Order"> | number
    bussiness?: StringFilter<"Order"> | string
    categoryId?: StringFilter<"Order"> | string
    date?: StringFilter<"Order"> | string
    email?: StringFilter<"Order"> | string
    message?: StringFilter<"Order"> | string
    name?: StringFilter<"Order"> | string
    phoneNumber?: StringFilter<"Order"> | string
    idPlan?: StringFilter<"Order"> | string
    time?: StringFilter<"Order"> | string
    category?: XOR<CategoryServiceScalarRelationFilter, CategoryServiceWhereInput>
    plan?: XOR<PlanServiceScalarRelationFilter, PlanServiceWhereInput>
  }, "id">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    amount?: SortOrder
    bussiness?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    email?: SortOrder
    message?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    idPlan?: SortOrder
    time?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    amount?: FloatWithAggregatesFilter<"Order"> | number
    bussiness?: StringWithAggregatesFilter<"Order"> | string
    categoryId?: StringWithAggregatesFilter<"Order"> | string
    date?: StringWithAggregatesFilter<"Order"> | string
    email?: StringWithAggregatesFilter<"Order"> | string
    message?: StringWithAggregatesFilter<"Order"> | string
    name?: StringWithAggregatesFilter<"Order"> | string
    phoneNumber?: StringWithAggregatesFilter<"Order"> | string
    idPlan?: StringWithAggregatesFilter<"Order"> | string
    time?: StringWithAggregatesFilter<"Order"> | string
  }

  export type PlanServiceCreateInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    prices?: PriceCreateNestedManyWithoutPlanInput
    benefits?: BenefitCreateNestedManyWithoutPlanInput
    category: CategoryServiceCreateNestedOneWithoutPlansInput
    orders?: OrderCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
    prices?: PriceUncheckedCreateNestedManyWithoutPlanInput
    benefits?: BenefitUncheckedCreateNestedManyWithoutPlanInput
    orders?: OrderUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    prices?: PriceUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUpdateManyWithoutPlanNestedInput
    category?: CategoryServiceUpdateOneRequiredWithoutPlansNestedInput
    orders?: OrderUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    prices?: PriceUncheckedUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUncheckedUpdateManyWithoutPlanNestedInput
    orders?: OrderUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceCreateManyInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
  }

  export type PlanServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
  }

  export type PlanServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryServiceCreateInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceCreateNestedManyWithoutCategoryInput
    orders?: OrderCreateNestedManyWithoutCategoryInput
    pages?: PagesCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceUncheckedCreateInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceUncheckedCreateNestedManyWithoutCategoryInput
    orders?: OrderUncheckedCreateNestedManyWithoutCategoryInput
    pages?: PagesUncheckedCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUpdateManyWithoutCategoryNestedInput
    orders?: OrderUpdateManyWithoutCategoryNestedInput
    pages?: PagesUpdateOneWithoutCategoryServiceNestedInput
  }

  export type CategoryServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUncheckedUpdateManyWithoutCategoryNestedInput
    orders?: OrderUncheckedUpdateManyWithoutCategoryNestedInput
    pages?: PagesUncheckedUpdateOneWithoutCategoryServiceNestedInput
  }

  export type CategoryServiceCreateManyInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
  }

  export type CategoryServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
  }

  export type PriceCreateInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
    plan: PlanServiceCreateNestedOneWithoutPricesInput
  }

  export type PriceUncheckedCreateInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
    idPlan: string
  }

  export type PriceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    plan?: PlanServiceUpdateOneRequiredWithoutPricesNestedInput
  }

  export type PriceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    idPlan?: StringFieldUpdateOperationsInput | string
  }

  export type PriceCreateManyInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
    idPlan: string
  }

  export type PriceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
  }

  export type PriceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    idPlan?: StringFieldUpdateOperationsInput | string
  }

  export type BenefitCreateInput = {
    id?: string
    value: string
    plan: PlanServiceCreateNestedOneWithoutBenefitsInput
  }

  export type BenefitUncheckedCreateInput = {
    id?: string
    value: string
    idPlan: string
  }

  export type BenefitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    plan?: PlanServiceUpdateOneRequiredWithoutBenefitsNestedInput
  }

  export type BenefitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
  }

  export type BenefitCreateManyInput = {
    id?: string
    value: string
    idPlan: string
  }

  export type BenefitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type BenefitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken?: string | null
    role: string
    features: JsonNullValueInput | InputJsonValue
    blogs?: BlogCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken?: string | null
    role: string
    features: JsonNullValueInput | InputJsonValue
    blogs?: BlogUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
    blogs?: BlogUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
    blogs?: BlogUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken?: string | null
    role: string
    features: JsonNullValueInput | InputJsonValue
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
  }

  export type BlogCreateInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    category: BlogCategoryCreateNestedOneWithoutBlogsInput
    role?: RoleCreateNestedOneWithoutBlogsInput
  }

  export type BlogUncheckedCreateInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    categoryId: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    roleId?: string | null
  }

  export type BlogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: BlogCategoryUpdateOneRequiredWithoutBlogsNestedInput
    role?: RoleUpdateOneWithoutBlogsNestedInput
  }

  export type BlogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BlogCreateManyInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    categoryId: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    roleId?: string | null
  }

  export type BlogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BlogCategoryCreateInput = {
    id?: string
    name: string
    slug: string
    status: $Enums.PlanStatus
    blogs?: BlogCreateNestedManyWithoutCategoryInput
  }

  export type BlogCategoryUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    status: $Enums.PlanStatus
    blogs?: BlogUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type BlogCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    blogs?: BlogUpdateManyWithoutCategoryNestedInput
  }

  export type BlogCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    blogs?: BlogUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type BlogCategoryCreateManyInput = {
    id?: string
    name: string
    slug: string
    status: $Enums.PlanStatus
  }

  export type BlogCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
  }

  export type BlogCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
  }

  export type PagesCreateInput = {
    id?: string
    page: string
    slug: string
    meta?: MetaTagCreateNestedManyWithoutPagesInput
    categoryService?: CategoryServiceCreateNestedOneWithoutPagesInput
  }

  export type PagesUncheckedCreateInput = {
    id?: string
    page: string
    slug: string
    categoryServiceId?: string | null
    meta?: MetaTagUncheckedCreateNestedManyWithoutPagesInput
  }

  export type PagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    meta?: MetaTagUpdateManyWithoutPagesNestedInput
    categoryService?: CategoryServiceUpdateOneWithoutPagesNestedInput
  }

  export type PagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    categoryServiceId?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: MetaTagUncheckedUpdateManyWithoutPagesNestedInput
  }

  export type PagesCreateManyInput = {
    id?: string
    page: string
    slug: string
    categoryServiceId?: string | null
  }

  export type PagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
  }

  export type PagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    categoryServiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetaTagCreateInput = {
    id?: string
    key: string
    value: string
    content: string
    pages: PagesCreateNestedOneWithoutMetaInput
  }

  export type MetaTagUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    content: string
    slug: string
  }

  export type MetaTagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    pages?: PagesUpdateOneRequiredWithoutMetaNestedInput
  }

  export type MetaTagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
  }

  export type MetaTagCreateManyInput = {
    id?: string
    key: string
    value: string
    content: string
    slug: string
  }

  export type MetaTagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type MetaTagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
  }

  export type OrderCreateInput = {
    id?: string
    amount: number
    bussiness: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    time: string
    category: CategoryServiceCreateNestedOneWithoutOrdersInput
    plan: PlanServiceCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    amount: number
    bussiness: string
    categoryId: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    idPlan: string
    time: string
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    category?: CategoryServiceUpdateOneRequiredWithoutOrdersNestedInput
    plan?: PlanServiceUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type OrderCreateManyInput = {
    id?: string
    amount: number
    bussiness: string
    categoryId: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    idPlan: string
    time: string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[]
    notIn?: $Enums.PlanType[]
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[]
    notIn?: $Enums.PlanStatus[]
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
  }

  export type PriceListRelationFilter = {
    every?: PriceWhereInput
    some?: PriceWhereInput
    none?: PriceWhereInput
  }

  export type BenefitListRelationFilter = {
    every?: BenefitWhereInput
    some?: BenefitWhereInput
    none?: BenefitWhereInput
  }

  export type CategoryServiceScalarRelationFilter = {
    is?: CategoryServiceWhereInput
    isNot?: CategoryServiceWhereInput
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type PriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BenefitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanServiceOrderByRelevanceInput = {
    fields: PlanServiceOrderByRelevanceFieldEnum | PlanServiceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlanServiceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    showPrice?: SortOrder
    status?: SortOrder
    options?: SortOrder
    descriptions?: SortOrder
    categoryId?: SortOrder
  }

  export type PlanServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    showPrice?: SortOrder
    status?: SortOrder
    options?: SortOrder
    descriptions?: SortOrder
    categoryId?: SortOrder
  }

  export type PlanServiceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    showPrice?: SortOrder
    status?: SortOrder
    options?: SortOrder
    descriptions?: SortOrder
    categoryId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[]
    notIn?: $Enums.PlanType[]
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[]
    notIn?: $Enums.PlanStatus[]
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
  }

  export type PlanServiceListRelationFilter = {
    every?: PlanServiceWhereInput
    some?: PlanServiceWhereInput
    none?: PlanServiceWhereInput
  }

  export type PagesNullableScalarRelationFilter = {
    is?: PagesWhereInput | null
    isNot?: PagesWhereInput | null
  }

  export type PlanServiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryServiceOrderByRelevanceInput = {
    fields: CategoryServiceOrderByRelevanceFieldEnum | CategoryServiceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryServiceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    heading?: SortOrder
    description?: SortOrder
    status?: SortOrder
    slug?: SortOrder
  }

  export type CategoryServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    heading?: SortOrder
    description?: SortOrder
    status?: SortOrder
    slug?: SortOrder
  }

  export type CategoryServiceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    heading?: SortOrder
    description?: SortOrder
    status?: SortOrder
    slug?: SortOrder
  }

  export type EnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>
    in?: $Enums.Currency[]
    notIn?: $Enums.Currency[]
    not?: NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PlanServiceScalarRelationFilter = {
    is?: PlanServiceWhereInput
    isNot?: PlanServiceWhereInput
  }

  export type PriceOrderByRelevanceInput = {
    fields: PriceOrderByRelevanceFieldEnum | PriceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PriceCountOrderByAggregateInput = {
    id?: SortOrder
    curr?: SortOrder
    amount?: SortOrder
    discount?: SortOrder
    idPlan?: SortOrder
  }

  export type PriceAvgOrderByAggregateInput = {
    amount?: SortOrder
    discount?: SortOrder
  }

  export type PriceMaxOrderByAggregateInput = {
    id?: SortOrder
    curr?: SortOrder
    amount?: SortOrder
    discount?: SortOrder
    idPlan?: SortOrder
  }

  export type PriceMinOrderByAggregateInput = {
    id?: SortOrder
    curr?: SortOrder
    amount?: SortOrder
    discount?: SortOrder
    idPlan?: SortOrder
  }

  export type PriceSumOrderByAggregateInput = {
    amount?: SortOrder
    discount?: SortOrder
  }

  export type EnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>
    in?: $Enums.Currency[]
    notIn?: $Enums.Currency[]
    not?: NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCurrencyFilter<$PrismaModel>
    _max?: NestedEnumCurrencyFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BenefitOrderByRelevanceInput = {
    fields: BenefitOrderByRelevanceFieldEnum | BenefitOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BenefitCountOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    idPlan?: SortOrder
  }

  export type BenefitMaxOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    idPlan?: SortOrder
  }

  export type BenefitMinOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    idPlan?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BlogListRelationFilter = {
    every?: BlogWhereInput
    some?: BlogWhereInput
    none?: BlogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BlogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleOrderByRelevanceInput = {
    fields: RoleOrderByRelevanceFieldEnum | RoleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    refreshToken?: SortOrder
    role?: SortOrder
    features?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    refreshToken?: SortOrder
    role?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    status?: SortOrder
    refreshToken?: SortOrder
    role?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumBlogStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BlogStatus | EnumBlogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlogStatus[]
    notIn?: $Enums.BlogStatus[]
    not?: NestedEnumBlogStatusFilter<$PrismaModel> | $Enums.BlogStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BlogCategoryScalarRelationFilter = {
    is?: BlogCategoryWhereInput
    isNot?: BlogCategoryWhereInput
  }

  export type RoleNullableScalarRelationFilter = {
    is?: RoleWhereInput | null
    isNot?: RoleWhereInput | null
  }

  export type BlogOrderByRelevanceInput = {
    fields: BlogOrderByRelevanceFieldEnum | BlogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BlogCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    image?: SortOrder
    content?: SortOrder
    status?: SortOrder
    favorite?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
  }

  export type BlogMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    image?: SortOrder
    content?: SortOrder
    status?: SortOrder
    favorite?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
  }

  export type BlogMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    image?: SortOrder
    content?: SortOrder
    status?: SortOrder
    favorite?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roleId?: SortOrder
  }

  export type EnumBlogStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlogStatus | EnumBlogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlogStatus[]
    notIn?: $Enums.BlogStatus[]
    not?: NestedEnumBlogStatusWithAggregatesFilter<$PrismaModel> | $Enums.BlogStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlogStatusFilter<$PrismaModel>
    _max?: NestedEnumBlogStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BlogCategoryOrderByRelevanceInput = {
    fields: BlogCategoryOrderByRelevanceFieldEnum | BlogCategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BlogCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
  }

  export type BlogCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
  }

  export type BlogCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
  }

  export type MetaTagListRelationFilter = {
    every?: MetaTagWhereInput
    some?: MetaTagWhereInput
    none?: MetaTagWhereInput
  }

  export type CategoryServiceNullableScalarRelationFilter = {
    is?: CategoryServiceWhereInput | null
    isNot?: CategoryServiceWhereInput | null
  }

  export type MetaTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PagesOrderByRelevanceInput = {
    fields: PagesOrderByRelevanceFieldEnum | PagesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PagesCountOrderByAggregateInput = {
    id?: SortOrder
    page?: SortOrder
    slug?: SortOrder
    categoryServiceId?: SortOrder
  }

  export type PagesMaxOrderByAggregateInput = {
    id?: SortOrder
    page?: SortOrder
    slug?: SortOrder
    categoryServiceId?: SortOrder
  }

  export type PagesMinOrderByAggregateInput = {
    id?: SortOrder
    page?: SortOrder
    slug?: SortOrder
    categoryServiceId?: SortOrder
  }

  export type PagesScalarRelationFilter = {
    is?: PagesWhereInput
    isNot?: PagesWhereInput
  }

  export type MetaTagOrderByRelevanceInput = {
    fields: MetaTagOrderByRelevanceFieldEnum | MetaTagOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MetaTagSlugValueCompoundUniqueInput = {
    slug: string
    value: string
  }

  export type MetaTagCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    content?: SortOrder
    slug?: SortOrder
  }

  export type MetaTagMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    content?: SortOrder
    slug?: SortOrder
  }

  export type MetaTagMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    content?: SortOrder
    slug?: SortOrder
  }

  export type OrderOrderByRelevanceInput = {
    fields: OrderOrderByRelevanceFieldEnum | OrderOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    bussiness?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    email?: SortOrder
    message?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    idPlan?: SortOrder
    time?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    bussiness?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    email?: SortOrder
    message?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    idPlan?: SortOrder
    time?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    bussiness?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    email?: SortOrder
    message?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    idPlan?: SortOrder
    time?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PriceCreateNestedManyWithoutPlanInput = {
    create?: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput> | PriceCreateWithoutPlanInput[] | PriceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PriceCreateOrConnectWithoutPlanInput | PriceCreateOrConnectWithoutPlanInput[]
    createMany?: PriceCreateManyPlanInputEnvelope
    connect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
  }

  export type BenefitCreateNestedManyWithoutPlanInput = {
    create?: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput> | BenefitCreateWithoutPlanInput[] | BenefitUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BenefitCreateOrConnectWithoutPlanInput | BenefitCreateOrConnectWithoutPlanInput[]
    createMany?: BenefitCreateManyPlanInputEnvelope
    connect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
  }

  export type CategoryServiceCreateNestedOneWithoutPlansInput = {
    create?: XOR<CategoryServiceCreateWithoutPlansInput, CategoryServiceUncheckedCreateWithoutPlansInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutPlansInput
    connect?: CategoryServiceWhereUniqueInput
  }

  export type OrderCreateNestedManyWithoutPlanInput = {
    create?: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput> | OrderCreateWithoutPlanInput[] | OrderUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutPlanInput | OrderCreateOrConnectWithoutPlanInput[]
    createMany?: OrderCreateManyPlanInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type PriceUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput> | PriceCreateWithoutPlanInput[] | PriceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PriceCreateOrConnectWithoutPlanInput | PriceCreateOrConnectWithoutPlanInput[]
    createMany?: PriceCreateManyPlanInputEnvelope
    connect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
  }

  export type BenefitUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput> | BenefitCreateWithoutPlanInput[] | BenefitUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BenefitCreateOrConnectWithoutPlanInput | BenefitCreateOrConnectWithoutPlanInput[]
    createMany?: BenefitCreateManyPlanInputEnvelope
    connect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput> | OrderCreateWithoutPlanInput[] | OrderUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutPlanInput | OrderCreateOrConnectWithoutPlanInput[]
    createMany?: OrderCreateManyPlanInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPlanTypeFieldUpdateOperationsInput = {
    set?: $Enums.PlanType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumPlanStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlanStatus
  }

  export type PriceUpdateManyWithoutPlanNestedInput = {
    create?: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput> | PriceCreateWithoutPlanInput[] | PriceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PriceCreateOrConnectWithoutPlanInput | PriceCreateOrConnectWithoutPlanInput[]
    upsert?: PriceUpsertWithWhereUniqueWithoutPlanInput | PriceUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: PriceCreateManyPlanInputEnvelope
    set?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    disconnect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    delete?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    connect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    update?: PriceUpdateWithWhereUniqueWithoutPlanInput | PriceUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: PriceUpdateManyWithWhereWithoutPlanInput | PriceUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: PriceScalarWhereInput | PriceScalarWhereInput[]
  }

  export type BenefitUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput> | BenefitCreateWithoutPlanInput[] | BenefitUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BenefitCreateOrConnectWithoutPlanInput | BenefitCreateOrConnectWithoutPlanInput[]
    upsert?: BenefitUpsertWithWhereUniqueWithoutPlanInput | BenefitUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BenefitCreateManyPlanInputEnvelope
    set?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    disconnect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    delete?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    connect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    update?: BenefitUpdateWithWhereUniqueWithoutPlanInput | BenefitUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BenefitUpdateManyWithWhereWithoutPlanInput | BenefitUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BenefitScalarWhereInput | BenefitScalarWhereInput[]
  }

  export type CategoryServiceUpdateOneRequiredWithoutPlansNestedInput = {
    create?: XOR<CategoryServiceCreateWithoutPlansInput, CategoryServiceUncheckedCreateWithoutPlansInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutPlansInput
    upsert?: CategoryServiceUpsertWithoutPlansInput
    connect?: CategoryServiceWhereUniqueInput
    update?: XOR<XOR<CategoryServiceUpdateToOneWithWhereWithoutPlansInput, CategoryServiceUpdateWithoutPlansInput>, CategoryServiceUncheckedUpdateWithoutPlansInput>
  }

  export type OrderUpdateManyWithoutPlanNestedInput = {
    create?: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput> | OrderCreateWithoutPlanInput[] | OrderUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutPlanInput | OrderCreateOrConnectWithoutPlanInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutPlanInput | OrderUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: OrderCreateManyPlanInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutPlanInput | OrderUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutPlanInput | OrderUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type PriceUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput> | PriceCreateWithoutPlanInput[] | PriceUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: PriceCreateOrConnectWithoutPlanInput | PriceCreateOrConnectWithoutPlanInput[]
    upsert?: PriceUpsertWithWhereUniqueWithoutPlanInput | PriceUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: PriceCreateManyPlanInputEnvelope
    set?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    disconnect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    delete?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    connect?: PriceWhereUniqueInput | PriceWhereUniqueInput[]
    update?: PriceUpdateWithWhereUniqueWithoutPlanInput | PriceUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: PriceUpdateManyWithWhereWithoutPlanInput | PriceUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: PriceScalarWhereInput | PriceScalarWhereInput[]
  }

  export type BenefitUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput> | BenefitCreateWithoutPlanInput[] | BenefitUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BenefitCreateOrConnectWithoutPlanInput | BenefitCreateOrConnectWithoutPlanInput[]
    upsert?: BenefitUpsertWithWhereUniqueWithoutPlanInput | BenefitUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BenefitCreateManyPlanInputEnvelope
    set?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    disconnect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    delete?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    connect?: BenefitWhereUniqueInput | BenefitWhereUniqueInput[]
    update?: BenefitUpdateWithWhereUniqueWithoutPlanInput | BenefitUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BenefitUpdateManyWithWhereWithoutPlanInput | BenefitUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BenefitScalarWhereInput | BenefitScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput> | OrderCreateWithoutPlanInput[] | OrderUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutPlanInput | OrderCreateOrConnectWithoutPlanInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutPlanInput | OrderUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: OrderCreateManyPlanInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutPlanInput | OrderUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutPlanInput | OrderUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type PlanServiceCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput> | PlanServiceCreateWithoutCategoryInput[] | PlanServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlanServiceCreateOrConnectWithoutCategoryInput | PlanServiceCreateOrConnectWithoutCategoryInput[]
    createMany?: PlanServiceCreateManyCategoryInputEnvelope
    connect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
  }

  export type OrderCreateNestedManyWithoutCategoryInput = {
    create?: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput> | OrderCreateWithoutCategoryInput[] | OrderUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutCategoryInput | OrderCreateOrConnectWithoutCategoryInput[]
    createMany?: OrderCreateManyCategoryInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type PagesCreateNestedOneWithoutCategoryServiceInput = {
    create?: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
    connectOrCreate?: PagesCreateOrConnectWithoutCategoryServiceInput
    connect?: PagesWhereUniqueInput
  }

  export type PlanServiceUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput> | PlanServiceCreateWithoutCategoryInput[] | PlanServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlanServiceCreateOrConnectWithoutCategoryInput | PlanServiceCreateOrConnectWithoutCategoryInput[]
    createMany?: PlanServiceCreateManyCategoryInputEnvelope
    connect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput> | OrderCreateWithoutCategoryInput[] | OrderUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutCategoryInput | OrderCreateOrConnectWithoutCategoryInput[]
    createMany?: OrderCreateManyCategoryInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type PagesUncheckedCreateNestedOneWithoutCategoryServiceInput = {
    create?: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
    connectOrCreate?: PagesCreateOrConnectWithoutCategoryServiceInput
    connect?: PagesWhereUniqueInput
  }

  export type PlanServiceUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput> | PlanServiceCreateWithoutCategoryInput[] | PlanServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlanServiceCreateOrConnectWithoutCategoryInput | PlanServiceCreateOrConnectWithoutCategoryInput[]
    upsert?: PlanServiceUpsertWithWhereUniqueWithoutCategoryInput | PlanServiceUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PlanServiceCreateManyCategoryInputEnvelope
    set?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    disconnect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    delete?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    connect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    update?: PlanServiceUpdateWithWhereUniqueWithoutCategoryInput | PlanServiceUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PlanServiceUpdateManyWithWhereWithoutCategoryInput | PlanServiceUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PlanServiceScalarWhereInput | PlanServiceScalarWhereInput[]
  }

  export type OrderUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput> | OrderCreateWithoutCategoryInput[] | OrderUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutCategoryInput | OrderCreateOrConnectWithoutCategoryInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutCategoryInput | OrderUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: OrderCreateManyCategoryInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutCategoryInput | OrderUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutCategoryInput | OrderUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type PagesUpdateOneWithoutCategoryServiceNestedInput = {
    create?: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
    connectOrCreate?: PagesCreateOrConnectWithoutCategoryServiceInput
    upsert?: PagesUpsertWithoutCategoryServiceInput
    disconnect?: PagesWhereInput | boolean
    delete?: PagesWhereInput | boolean
    connect?: PagesWhereUniqueInput
    update?: XOR<XOR<PagesUpdateToOneWithWhereWithoutCategoryServiceInput, PagesUpdateWithoutCategoryServiceInput>, PagesUncheckedUpdateWithoutCategoryServiceInput>
  }

  export type PlanServiceUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput> | PlanServiceCreateWithoutCategoryInput[] | PlanServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PlanServiceCreateOrConnectWithoutCategoryInput | PlanServiceCreateOrConnectWithoutCategoryInput[]
    upsert?: PlanServiceUpsertWithWhereUniqueWithoutCategoryInput | PlanServiceUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PlanServiceCreateManyCategoryInputEnvelope
    set?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    disconnect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    delete?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    connect?: PlanServiceWhereUniqueInput | PlanServiceWhereUniqueInput[]
    update?: PlanServiceUpdateWithWhereUniqueWithoutCategoryInput | PlanServiceUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PlanServiceUpdateManyWithWhereWithoutCategoryInput | PlanServiceUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PlanServiceScalarWhereInput | PlanServiceScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput> | OrderCreateWithoutCategoryInput[] | OrderUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutCategoryInput | OrderCreateOrConnectWithoutCategoryInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutCategoryInput | OrderUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: OrderCreateManyCategoryInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutCategoryInput | OrderUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutCategoryInput | OrderUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type PagesUncheckedUpdateOneWithoutCategoryServiceNestedInput = {
    create?: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
    connectOrCreate?: PagesCreateOrConnectWithoutCategoryServiceInput
    upsert?: PagesUpsertWithoutCategoryServiceInput
    disconnect?: PagesWhereInput | boolean
    delete?: PagesWhereInput | boolean
    connect?: PagesWhereUniqueInput
    update?: XOR<XOR<PagesUpdateToOneWithWhereWithoutCategoryServiceInput, PagesUpdateWithoutCategoryServiceInput>, PagesUncheckedUpdateWithoutCategoryServiceInput>
  }

  export type PlanServiceCreateNestedOneWithoutPricesInput = {
    create?: XOR<PlanServiceCreateWithoutPricesInput, PlanServiceUncheckedCreateWithoutPricesInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutPricesInput
    connect?: PlanServiceWhereUniqueInput
  }

  export type EnumCurrencyFieldUpdateOperationsInput = {
    set?: $Enums.Currency
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlanServiceUpdateOneRequiredWithoutPricesNestedInput = {
    create?: XOR<PlanServiceCreateWithoutPricesInput, PlanServiceUncheckedCreateWithoutPricesInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutPricesInput
    upsert?: PlanServiceUpsertWithoutPricesInput
    connect?: PlanServiceWhereUniqueInput
    update?: XOR<XOR<PlanServiceUpdateToOneWithWhereWithoutPricesInput, PlanServiceUpdateWithoutPricesInput>, PlanServiceUncheckedUpdateWithoutPricesInput>
  }

  export type PlanServiceCreateNestedOneWithoutBenefitsInput = {
    create?: XOR<PlanServiceCreateWithoutBenefitsInput, PlanServiceUncheckedCreateWithoutBenefitsInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutBenefitsInput
    connect?: PlanServiceWhereUniqueInput
  }

  export type PlanServiceUpdateOneRequiredWithoutBenefitsNestedInput = {
    create?: XOR<PlanServiceCreateWithoutBenefitsInput, PlanServiceUncheckedCreateWithoutBenefitsInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutBenefitsInput
    upsert?: PlanServiceUpsertWithoutBenefitsInput
    connect?: PlanServiceWhereUniqueInput
    update?: XOR<XOR<PlanServiceUpdateToOneWithWhereWithoutBenefitsInput, PlanServiceUpdateWithoutBenefitsInput>, PlanServiceUncheckedUpdateWithoutBenefitsInput>
  }

  export type BlogCreateNestedManyWithoutRoleInput = {
    create?: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput> | BlogCreateWithoutRoleInput[] | BlogUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutRoleInput | BlogCreateOrConnectWithoutRoleInput[]
    createMany?: BlogCreateManyRoleInputEnvelope
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
  }

  export type BlogUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput> | BlogCreateWithoutRoleInput[] | BlogUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutRoleInput | BlogCreateOrConnectWithoutRoleInput[]
    createMany?: BlogCreateManyRoleInputEnvelope
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BlogUpdateManyWithoutRoleNestedInput = {
    create?: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput> | BlogCreateWithoutRoleInput[] | BlogUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutRoleInput | BlogCreateOrConnectWithoutRoleInput[]
    upsert?: BlogUpsertWithWhereUniqueWithoutRoleInput | BlogUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: BlogCreateManyRoleInputEnvelope
    set?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    disconnect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    delete?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    update?: BlogUpdateWithWhereUniqueWithoutRoleInput | BlogUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: BlogUpdateManyWithWhereWithoutRoleInput | BlogUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: BlogScalarWhereInput | BlogScalarWhereInput[]
  }

  export type BlogUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput> | BlogCreateWithoutRoleInput[] | BlogUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutRoleInput | BlogCreateOrConnectWithoutRoleInput[]
    upsert?: BlogUpsertWithWhereUniqueWithoutRoleInput | BlogUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: BlogCreateManyRoleInputEnvelope
    set?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    disconnect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    delete?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    update?: BlogUpdateWithWhereUniqueWithoutRoleInput | BlogUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: BlogUpdateManyWithWhereWithoutRoleInput | BlogUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: BlogScalarWhereInput | BlogScalarWhereInput[]
  }

  export type BlogCategoryCreateNestedOneWithoutBlogsInput = {
    create?: XOR<BlogCategoryCreateWithoutBlogsInput, BlogCategoryUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: BlogCategoryCreateOrConnectWithoutBlogsInput
    connect?: BlogCategoryWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutBlogsInput = {
    create?: XOR<RoleCreateWithoutBlogsInput, RoleUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutBlogsInput
    connect?: RoleWhereUniqueInput
  }

  export type EnumBlogStatusFieldUpdateOperationsInput = {
    set?: $Enums.BlogStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BlogCategoryUpdateOneRequiredWithoutBlogsNestedInput = {
    create?: XOR<BlogCategoryCreateWithoutBlogsInput, BlogCategoryUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: BlogCategoryCreateOrConnectWithoutBlogsInput
    upsert?: BlogCategoryUpsertWithoutBlogsInput
    connect?: BlogCategoryWhereUniqueInput
    update?: XOR<XOR<BlogCategoryUpdateToOneWithWhereWithoutBlogsInput, BlogCategoryUpdateWithoutBlogsInput>, BlogCategoryUncheckedUpdateWithoutBlogsInput>
  }

  export type RoleUpdateOneWithoutBlogsNestedInput = {
    create?: XOR<RoleCreateWithoutBlogsInput, RoleUncheckedCreateWithoutBlogsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutBlogsInput
    upsert?: RoleUpsertWithoutBlogsInput
    disconnect?: RoleWhereInput | boolean
    delete?: RoleWhereInput | boolean
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutBlogsInput, RoleUpdateWithoutBlogsInput>, RoleUncheckedUpdateWithoutBlogsInput>
  }

  export type BlogCreateNestedManyWithoutCategoryInput = {
    create?: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput> | BlogCreateWithoutCategoryInput[] | BlogUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutCategoryInput | BlogCreateOrConnectWithoutCategoryInput[]
    createMany?: BlogCreateManyCategoryInputEnvelope
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
  }

  export type BlogUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput> | BlogCreateWithoutCategoryInput[] | BlogUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutCategoryInput | BlogCreateOrConnectWithoutCategoryInput[]
    createMany?: BlogCreateManyCategoryInputEnvelope
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
  }

  export type BlogUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput> | BlogCreateWithoutCategoryInput[] | BlogUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutCategoryInput | BlogCreateOrConnectWithoutCategoryInput[]
    upsert?: BlogUpsertWithWhereUniqueWithoutCategoryInput | BlogUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: BlogCreateManyCategoryInputEnvelope
    set?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    disconnect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    delete?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    update?: BlogUpdateWithWhereUniqueWithoutCategoryInput | BlogUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: BlogUpdateManyWithWhereWithoutCategoryInput | BlogUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: BlogScalarWhereInput | BlogScalarWhereInput[]
  }

  export type BlogUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput> | BlogCreateWithoutCategoryInput[] | BlogUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: BlogCreateOrConnectWithoutCategoryInput | BlogCreateOrConnectWithoutCategoryInput[]
    upsert?: BlogUpsertWithWhereUniqueWithoutCategoryInput | BlogUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: BlogCreateManyCategoryInputEnvelope
    set?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    disconnect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    delete?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    connect?: BlogWhereUniqueInput | BlogWhereUniqueInput[]
    update?: BlogUpdateWithWhereUniqueWithoutCategoryInput | BlogUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: BlogUpdateManyWithWhereWithoutCategoryInput | BlogUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: BlogScalarWhereInput | BlogScalarWhereInput[]
  }

  export type MetaTagCreateNestedManyWithoutPagesInput = {
    create?: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput> | MetaTagCreateWithoutPagesInput[] | MetaTagUncheckedCreateWithoutPagesInput[]
    connectOrCreate?: MetaTagCreateOrConnectWithoutPagesInput | MetaTagCreateOrConnectWithoutPagesInput[]
    createMany?: MetaTagCreateManyPagesInputEnvelope
    connect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
  }

  export type CategoryServiceCreateNestedOneWithoutPagesInput = {
    create?: XOR<CategoryServiceCreateWithoutPagesInput, CategoryServiceUncheckedCreateWithoutPagesInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutPagesInput
    connect?: CategoryServiceWhereUniqueInput
  }

  export type MetaTagUncheckedCreateNestedManyWithoutPagesInput = {
    create?: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput> | MetaTagCreateWithoutPagesInput[] | MetaTagUncheckedCreateWithoutPagesInput[]
    connectOrCreate?: MetaTagCreateOrConnectWithoutPagesInput | MetaTagCreateOrConnectWithoutPagesInput[]
    createMany?: MetaTagCreateManyPagesInputEnvelope
    connect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
  }

  export type MetaTagUpdateManyWithoutPagesNestedInput = {
    create?: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput> | MetaTagCreateWithoutPagesInput[] | MetaTagUncheckedCreateWithoutPagesInput[]
    connectOrCreate?: MetaTagCreateOrConnectWithoutPagesInput | MetaTagCreateOrConnectWithoutPagesInput[]
    upsert?: MetaTagUpsertWithWhereUniqueWithoutPagesInput | MetaTagUpsertWithWhereUniqueWithoutPagesInput[]
    createMany?: MetaTagCreateManyPagesInputEnvelope
    set?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    disconnect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    delete?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    connect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    update?: MetaTagUpdateWithWhereUniqueWithoutPagesInput | MetaTagUpdateWithWhereUniqueWithoutPagesInput[]
    updateMany?: MetaTagUpdateManyWithWhereWithoutPagesInput | MetaTagUpdateManyWithWhereWithoutPagesInput[]
    deleteMany?: MetaTagScalarWhereInput | MetaTagScalarWhereInput[]
  }

  export type CategoryServiceUpdateOneWithoutPagesNestedInput = {
    create?: XOR<CategoryServiceCreateWithoutPagesInput, CategoryServiceUncheckedCreateWithoutPagesInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutPagesInput
    upsert?: CategoryServiceUpsertWithoutPagesInput
    disconnect?: CategoryServiceWhereInput | boolean
    delete?: CategoryServiceWhereInput | boolean
    connect?: CategoryServiceWhereUniqueInput
    update?: XOR<XOR<CategoryServiceUpdateToOneWithWhereWithoutPagesInput, CategoryServiceUpdateWithoutPagesInput>, CategoryServiceUncheckedUpdateWithoutPagesInput>
  }

  export type MetaTagUncheckedUpdateManyWithoutPagesNestedInput = {
    create?: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput> | MetaTagCreateWithoutPagesInput[] | MetaTagUncheckedCreateWithoutPagesInput[]
    connectOrCreate?: MetaTagCreateOrConnectWithoutPagesInput | MetaTagCreateOrConnectWithoutPagesInput[]
    upsert?: MetaTagUpsertWithWhereUniqueWithoutPagesInput | MetaTagUpsertWithWhereUniqueWithoutPagesInput[]
    createMany?: MetaTagCreateManyPagesInputEnvelope
    set?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    disconnect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    delete?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    connect?: MetaTagWhereUniqueInput | MetaTagWhereUniqueInput[]
    update?: MetaTagUpdateWithWhereUniqueWithoutPagesInput | MetaTagUpdateWithWhereUniqueWithoutPagesInput[]
    updateMany?: MetaTagUpdateManyWithWhereWithoutPagesInput | MetaTagUpdateManyWithWhereWithoutPagesInput[]
    deleteMany?: MetaTagScalarWhereInput | MetaTagScalarWhereInput[]
  }

  export type PagesCreateNestedOneWithoutMetaInput = {
    create?: XOR<PagesCreateWithoutMetaInput, PagesUncheckedCreateWithoutMetaInput>
    connectOrCreate?: PagesCreateOrConnectWithoutMetaInput
    connect?: PagesWhereUniqueInput
  }

  export type PagesUpdateOneRequiredWithoutMetaNestedInput = {
    create?: XOR<PagesCreateWithoutMetaInput, PagesUncheckedCreateWithoutMetaInput>
    connectOrCreate?: PagesCreateOrConnectWithoutMetaInput
    upsert?: PagesUpsertWithoutMetaInput
    connect?: PagesWhereUniqueInput
    update?: XOR<XOR<PagesUpdateToOneWithWhereWithoutMetaInput, PagesUpdateWithoutMetaInput>, PagesUncheckedUpdateWithoutMetaInput>
  }

  export type CategoryServiceCreateNestedOneWithoutOrdersInput = {
    create?: XOR<CategoryServiceCreateWithoutOrdersInput, CategoryServiceUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutOrdersInput
    connect?: CategoryServiceWhereUniqueInput
  }

  export type PlanServiceCreateNestedOneWithoutOrdersInput = {
    create?: XOR<PlanServiceCreateWithoutOrdersInput, PlanServiceUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutOrdersInput
    connect?: PlanServiceWhereUniqueInput
  }

  export type CategoryServiceUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<CategoryServiceCreateWithoutOrdersInput, CategoryServiceUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: CategoryServiceCreateOrConnectWithoutOrdersInput
    upsert?: CategoryServiceUpsertWithoutOrdersInput
    connect?: CategoryServiceWhereUniqueInput
    update?: XOR<XOR<CategoryServiceUpdateToOneWithWhereWithoutOrdersInput, CategoryServiceUpdateWithoutOrdersInput>, CategoryServiceUncheckedUpdateWithoutOrdersInput>
  }

  export type PlanServiceUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<PlanServiceCreateWithoutOrdersInput, PlanServiceUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: PlanServiceCreateOrConnectWithoutOrdersInput
    upsert?: PlanServiceUpsertWithoutOrdersInput
    connect?: PlanServiceWhereUniqueInput
    update?: XOR<XOR<PlanServiceUpdateToOneWithWhereWithoutOrdersInput, PlanServiceUpdateWithoutOrdersInput>, PlanServiceUncheckedUpdateWithoutOrdersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[]
    notIn?: $Enums.PlanType[]
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[]
    notIn?: $Enums.PlanStatus[]
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[]
    notIn?: $Enums.PlanType[]
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[]
    notIn?: $Enums.PlanStatus[]
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
  }

  export type NestedEnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>
    in?: $Enums.Currency[]
    notIn?: $Enums.Currency[]
    not?: NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>
    in?: $Enums.Currency[]
    notIn?: $Enums.Currency[]
    not?: NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCurrencyFilter<$PrismaModel>
    _max?: NestedEnumCurrencyFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumBlogStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BlogStatus | EnumBlogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlogStatus[]
    notIn?: $Enums.BlogStatus[]
    not?: NestedEnumBlogStatusFilter<$PrismaModel> | $Enums.BlogStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumBlogStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BlogStatus | EnumBlogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BlogStatus[]
    notIn?: $Enums.BlogStatus[]
    not?: NestedEnumBlogStatusWithAggregatesFilter<$PrismaModel> | $Enums.BlogStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBlogStatusFilter<$PrismaModel>
    _max?: NestedEnumBlogStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PriceCreateWithoutPlanInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
  }

  export type PriceUncheckedCreateWithoutPlanInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
  }

  export type PriceCreateOrConnectWithoutPlanInput = {
    where: PriceWhereUniqueInput
    create: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput>
  }

  export type PriceCreateManyPlanInputEnvelope = {
    data: PriceCreateManyPlanInput | PriceCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type BenefitCreateWithoutPlanInput = {
    id?: string
    value: string
  }

  export type BenefitUncheckedCreateWithoutPlanInput = {
    id?: string
    value: string
  }

  export type BenefitCreateOrConnectWithoutPlanInput = {
    where: BenefitWhereUniqueInput
    create: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput>
  }

  export type BenefitCreateManyPlanInputEnvelope = {
    data: BenefitCreateManyPlanInput | BenefitCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type CategoryServiceCreateWithoutPlansInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    orders?: OrderCreateNestedManyWithoutCategoryInput
    pages?: PagesCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceUncheckedCreateWithoutPlansInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    orders?: OrderUncheckedCreateNestedManyWithoutCategoryInput
    pages?: PagesUncheckedCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceCreateOrConnectWithoutPlansInput = {
    where: CategoryServiceWhereUniqueInput
    create: XOR<CategoryServiceCreateWithoutPlansInput, CategoryServiceUncheckedCreateWithoutPlansInput>
  }

  export type OrderCreateWithoutPlanInput = {
    id?: string
    amount: number
    bussiness: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    time: string
    category: CategoryServiceCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateWithoutPlanInput = {
    id?: string
    amount: number
    bussiness: string
    categoryId: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    time: string
  }

  export type OrderCreateOrConnectWithoutPlanInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput>
  }

  export type OrderCreateManyPlanInputEnvelope = {
    data: OrderCreateManyPlanInput | OrderCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type PriceUpsertWithWhereUniqueWithoutPlanInput = {
    where: PriceWhereUniqueInput
    update: XOR<PriceUpdateWithoutPlanInput, PriceUncheckedUpdateWithoutPlanInput>
    create: XOR<PriceCreateWithoutPlanInput, PriceUncheckedCreateWithoutPlanInput>
  }

  export type PriceUpdateWithWhereUniqueWithoutPlanInput = {
    where: PriceWhereUniqueInput
    data: XOR<PriceUpdateWithoutPlanInput, PriceUncheckedUpdateWithoutPlanInput>
  }

  export type PriceUpdateManyWithWhereWithoutPlanInput = {
    where: PriceScalarWhereInput
    data: XOR<PriceUpdateManyMutationInput, PriceUncheckedUpdateManyWithoutPlanInput>
  }

  export type PriceScalarWhereInput = {
    AND?: PriceScalarWhereInput | PriceScalarWhereInput[]
    OR?: PriceScalarWhereInput[]
    NOT?: PriceScalarWhereInput | PriceScalarWhereInput[]
    id?: StringFilter<"Price"> | string
    curr?: EnumCurrencyFilter<"Price"> | $Enums.Currency
    amount?: FloatFilter<"Price"> | number
    discount?: FloatFilter<"Price"> | number
    idPlan?: StringFilter<"Price"> | string
  }

  export type BenefitUpsertWithWhereUniqueWithoutPlanInput = {
    where: BenefitWhereUniqueInput
    update: XOR<BenefitUpdateWithoutPlanInput, BenefitUncheckedUpdateWithoutPlanInput>
    create: XOR<BenefitCreateWithoutPlanInput, BenefitUncheckedCreateWithoutPlanInput>
  }

  export type BenefitUpdateWithWhereUniqueWithoutPlanInput = {
    where: BenefitWhereUniqueInput
    data: XOR<BenefitUpdateWithoutPlanInput, BenefitUncheckedUpdateWithoutPlanInput>
  }

  export type BenefitUpdateManyWithWhereWithoutPlanInput = {
    where: BenefitScalarWhereInput
    data: XOR<BenefitUpdateManyMutationInput, BenefitUncheckedUpdateManyWithoutPlanInput>
  }

  export type BenefitScalarWhereInput = {
    AND?: BenefitScalarWhereInput | BenefitScalarWhereInput[]
    OR?: BenefitScalarWhereInput[]
    NOT?: BenefitScalarWhereInput | BenefitScalarWhereInput[]
    id?: StringFilter<"Benefit"> | string
    value?: StringFilter<"Benefit"> | string
    idPlan?: StringFilter<"Benefit"> | string
  }

  export type CategoryServiceUpsertWithoutPlansInput = {
    update: XOR<CategoryServiceUpdateWithoutPlansInput, CategoryServiceUncheckedUpdateWithoutPlansInput>
    create: XOR<CategoryServiceCreateWithoutPlansInput, CategoryServiceUncheckedCreateWithoutPlansInput>
    where?: CategoryServiceWhereInput
  }

  export type CategoryServiceUpdateToOneWithWhereWithoutPlansInput = {
    where?: CategoryServiceWhereInput
    data: XOR<CategoryServiceUpdateWithoutPlansInput, CategoryServiceUncheckedUpdateWithoutPlansInput>
  }

  export type CategoryServiceUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    orders?: OrderUpdateManyWithoutCategoryNestedInput
    pages?: PagesUpdateOneWithoutCategoryServiceNestedInput
  }

  export type CategoryServiceUncheckedUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    orders?: OrderUncheckedUpdateManyWithoutCategoryNestedInput
    pages?: PagesUncheckedUpdateOneWithoutCategoryServiceNestedInput
  }

  export type OrderUpsertWithWhereUniqueWithoutPlanInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutPlanInput, OrderUncheckedUpdateWithoutPlanInput>
    create: XOR<OrderCreateWithoutPlanInput, OrderUncheckedCreateWithoutPlanInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutPlanInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutPlanInput, OrderUncheckedUpdateWithoutPlanInput>
  }

  export type OrderUpdateManyWithWhereWithoutPlanInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutPlanInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    amount?: FloatFilter<"Order"> | number
    bussiness?: StringFilter<"Order"> | string
    categoryId?: StringFilter<"Order"> | string
    date?: StringFilter<"Order"> | string
    email?: StringFilter<"Order"> | string
    message?: StringFilter<"Order"> | string
    name?: StringFilter<"Order"> | string
    phoneNumber?: StringFilter<"Order"> | string
    idPlan?: StringFilter<"Order"> | string
    time?: StringFilter<"Order"> | string
  }

  export type PlanServiceCreateWithoutCategoryInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    prices?: PriceCreateNestedManyWithoutPlanInput
    benefits?: BenefitCreateNestedManyWithoutPlanInput
    orders?: OrderCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    prices?: PriceUncheckedCreateNestedManyWithoutPlanInput
    benefits?: BenefitUncheckedCreateNestedManyWithoutPlanInput
    orders?: OrderUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceCreateOrConnectWithoutCategoryInput = {
    where: PlanServiceWhereUniqueInput
    create: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput>
  }

  export type PlanServiceCreateManyCategoryInputEnvelope = {
    data: PlanServiceCreateManyCategoryInput | PlanServiceCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type OrderCreateWithoutCategoryInput = {
    id?: string
    amount: number
    bussiness: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    time: string
    plan: PlanServiceCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateWithoutCategoryInput = {
    id?: string
    amount: number
    bussiness: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    idPlan: string
    time: string
  }

  export type OrderCreateOrConnectWithoutCategoryInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput>
  }

  export type OrderCreateManyCategoryInputEnvelope = {
    data: OrderCreateManyCategoryInput | OrderCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type PagesCreateWithoutCategoryServiceInput = {
    id?: string
    page: string
    slug: string
    meta?: MetaTagCreateNestedManyWithoutPagesInput
  }

  export type PagesUncheckedCreateWithoutCategoryServiceInput = {
    id?: string
    page: string
    slug: string
    meta?: MetaTagUncheckedCreateNestedManyWithoutPagesInput
  }

  export type PagesCreateOrConnectWithoutCategoryServiceInput = {
    where: PagesWhereUniqueInput
    create: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
  }

  export type PlanServiceUpsertWithWhereUniqueWithoutCategoryInput = {
    where: PlanServiceWhereUniqueInput
    update: XOR<PlanServiceUpdateWithoutCategoryInput, PlanServiceUncheckedUpdateWithoutCategoryInput>
    create: XOR<PlanServiceCreateWithoutCategoryInput, PlanServiceUncheckedCreateWithoutCategoryInput>
  }

  export type PlanServiceUpdateWithWhereUniqueWithoutCategoryInput = {
    where: PlanServiceWhereUniqueInput
    data: XOR<PlanServiceUpdateWithoutCategoryInput, PlanServiceUncheckedUpdateWithoutCategoryInput>
  }

  export type PlanServiceUpdateManyWithWhereWithoutCategoryInput = {
    where: PlanServiceScalarWhereInput
    data: XOR<PlanServiceUpdateManyMutationInput, PlanServiceUncheckedUpdateManyWithoutCategoryInput>
  }

  export type PlanServiceScalarWhereInput = {
    AND?: PlanServiceScalarWhereInput | PlanServiceScalarWhereInput[]
    OR?: PlanServiceScalarWhereInput[]
    NOT?: PlanServiceScalarWhereInput | PlanServiceScalarWhereInput[]
    id?: StringFilter<"PlanService"> | string
    name?: StringFilter<"PlanService"> | string
    type?: EnumPlanTypeFilter<"PlanService"> | $Enums.PlanType
    showPrice?: BoolFilter<"PlanService"> | boolean
    status?: EnumPlanStatusFilter<"PlanService"> | $Enums.PlanStatus
    options?: StringFilter<"PlanService"> | string
    descriptions?: StringFilter<"PlanService"> | string
    categoryId?: StringFilter<"PlanService"> | string
  }

  export type OrderUpsertWithWhereUniqueWithoutCategoryInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutCategoryInput, OrderUncheckedUpdateWithoutCategoryInput>
    create: XOR<OrderCreateWithoutCategoryInput, OrderUncheckedCreateWithoutCategoryInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutCategoryInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutCategoryInput, OrderUncheckedUpdateWithoutCategoryInput>
  }

  export type OrderUpdateManyWithWhereWithoutCategoryInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutCategoryInput>
  }

  export type PagesUpsertWithoutCategoryServiceInput = {
    update: XOR<PagesUpdateWithoutCategoryServiceInput, PagesUncheckedUpdateWithoutCategoryServiceInput>
    create: XOR<PagesCreateWithoutCategoryServiceInput, PagesUncheckedCreateWithoutCategoryServiceInput>
    where?: PagesWhereInput
  }

  export type PagesUpdateToOneWithWhereWithoutCategoryServiceInput = {
    where?: PagesWhereInput
    data: XOR<PagesUpdateWithoutCategoryServiceInput, PagesUncheckedUpdateWithoutCategoryServiceInput>
  }

  export type PagesUpdateWithoutCategoryServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    meta?: MetaTagUpdateManyWithoutPagesNestedInput
  }

  export type PagesUncheckedUpdateWithoutCategoryServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    meta?: MetaTagUncheckedUpdateManyWithoutPagesNestedInput
  }

  export type PlanServiceCreateWithoutPricesInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    benefits?: BenefitCreateNestedManyWithoutPlanInput
    category: CategoryServiceCreateNestedOneWithoutPlansInput
    orders?: OrderCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceUncheckedCreateWithoutPricesInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
    benefits?: BenefitUncheckedCreateNestedManyWithoutPlanInput
    orders?: OrderUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceCreateOrConnectWithoutPricesInput = {
    where: PlanServiceWhereUniqueInput
    create: XOR<PlanServiceCreateWithoutPricesInput, PlanServiceUncheckedCreateWithoutPricesInput>
  }

  export type PlanServiceUpsertWithoutPricesInput = {
    update: XOR<PlanServiceUpdateWithoutPricesInput, PlanServiceUncheckedUpdateWithoutPricesInput>
    create: XOR<PlanServiceCreateWithoutPricesInput, PlanServiceUncheckedCreateWithoutPricesInput>
    where?: PlanServiceWhereInput
  }

  export type PlanServiceUpdateToOneWithWhereWithoutPricesInput = {
    where?: PlanServiceWhereInput
    data: XOR<PlanServiceUpdateWithoutPricesInput, PlanServiceUncheckedUpdateWithoutPricesInput>
  }

  export type PlanServiceUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    benefits?: BenefitUpdateManyWithoutPlanNestedInput
    category?: CategoryServiceUpdateOneRequiredWithoutPlansNestedInput
    orders?: OrderUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceUncheckedUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    benefits?: BenefitUncheckedUpdateManyWithoutPlanNestedInput
    orders?: OrderUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceCreateWithoutBenefitsInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    prices?: PriceCreateNestedManyWithoutPlanInput
    category: CategoryServiceCreateNestedOneWithoutPlansInput
    orders?: OrderCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceUncheckedCreateWithoutBenefitsInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
    prices?: PriceUncheckedCreateNestedManyWithoutPlanInput
    orders?: OrderUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceCreateOrConnectWithoutBenefitsInput = {
    where: PlanServiceWhereUniqueInput
    create: XOR<PlanServiceCreateWithoutBenefitsInput, PlanServiceUncheckedCreateWithoutBenefitsInput>
  }

  export type PlanServiceUpsertWithoutBenefitsInput = {
    update: XOR<PlanServiceUpdateWithoutBenefitsInput, PlanServiceUncheckedUpdateWithoutBenefitsInput>
    create: XOR<PlanServiceCreateWithoutBenefitsInput, PlanServiceUncheckedCreateWithoutBenefitsInput>
    where?: PlanServiceWhereInput
  }

  export type PlanServiceUpdateToOneWithWhereWithoutBenefitsInput = {
    where?: PlanServiceWhereInput
    data: XOR<PlanServiceUpdateWithoutBenefitsInput, PlanServiceUncheckedUpdateWithoutBenefitsInput>
  }

  export type PlanServiceUpdateWithoutBenefitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    prices?: PriceUpdateManyWithoutPlanNestedInput
    category?: CategoryServiceUpdateOneRequiredWithoutPlansNestedInput
    orders?: OrderUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceUncheckedUpdateWithoutBenefitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    prices?: PriceUncheckedUpdateManyWithoutPlanNestedInput
    orders?: OrderUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type BlogCreateWithoutRoleInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    category: BlogCategoryCreateNestedOneWithoutBlogsInput
  }

  export type BlogUncheckedCreateWithoutRoleInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    categoryId: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type BlogCreateOrConnectWithoutRoleInput = {
    where: BlogWhereUniqueInput
    create: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput>
  }

  export type BlogCreateManyRoleInputEnvelope = {
    data: BlogCreateManyRoleInput | BlogCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type BlogUpsertWithWhereUniqueWithoutRoleInput = {
    where: BlogWhereUniqueInput
    update: XOR<BlogUpdateWithoutRoleInput, BlogUncheckedUpdateWithoutRoleInput>
    create: XOR<BlogCreateWithoutRoleInput, BlogUncheckedCreateWithoutRoleInput>
  }

  export type BlogUpdateWithWhereUniqueWithoutRoleInput = {
    where: BlogWhereUniqueInput
    data: XOR<BlogUpdateWithoutRoleInput, BlogUncheckedUpdateWithoutRoleInput>
  }

  export type BlogUpdateManyWithWhereWithoutRoleInput = {
    where: BlogScalarWhereInput
    data: XOR<BlogUpdateManyMutationInput, BlogUncheckedUpdateManyWithoutRoleInput>
  }

  export type BlogScalarWhereInput = {
    AND?: BlogScalarWhereInput | BlogScalarWhereInput[]
    OR?: BlogScalarWhereInput[]
    NOT?: BlogScalarWhereInput | BlogScalarWhereInput[]
    id?: StringFilter<"Blog"> | string
    title?: StringFilter<"Blog"> | string
    image?: StringFilter<"Blog"> | string
    content?: StringFilter<"Blog"> | string
    status?: EnumBlogStatusFilter<"Blog"> | $Enums.BlogStatus
    favorite?: BoolFilter<"Blog"> | boolean
    categoryId?: StringFilter<"Blog"> | string
    createdAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Blog"> | Date | string | null
    roleId?: StringNullableFilter<"Blog"> | string | null
  }

  export type BlogCategoryCreateWithoutBlogsInput = {
    id?: string
    name: string
    slug: string
    status: $Enums.PlanStatus
  }

  export type BlogCategoryUncheckedCreateWithoutBlogsInput = {
    id?: string
    name: string
    slug: string
    status: $Enums.PlanStatus
  }

  export type BlogCategoryCreateOrConnectWithoutBlogsInput = {
    where: BlogCategoryWhereUniqueInput
    create: XOR<BlogCategoryCreateWithoutBlogsInput, BlogCategoryUncheckedCreateWithoutBlogsInput>
  }

  export type RoleCreateWithoutBlogsInput = {
    id?: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken?: string | null
    role: string
    features: JsonNullValueInput | InputJsonValue
  }

  export type RoleUncheckedCreateWithoutBlogsInput = {
    id?: string
    name: string
    email: string
    password: string
    status: $Enums.PlanStatus
    refreshToken?: string | null
    role: string
    features: JsonNullValueInput | InputJsonValue
  }

  export type RoleCreateOrConnectWithoutBlogsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutBlogsInput, RoleUncheckedCreateWithoutBlogsInput>
  }

  export type BlogCategoryUpsertWithoutBlogsInput = {
    update: XOR<BlogCategoryUpdateWithoutBlogsInput, BlogCategoryUncheckedUpdateWithoutBlogsInput>
    create: XOR<BlogCategoryCreateWithoutBlogsInput, BlogCategoryUncheckedCreateWithoutBlogsInput>
    where?: BlogCategoryWhereInput
  }

  export type BlogCategoryUpdateToOneWithWhereWithoutBlogsInput = {
    where?: BlogCategoryWhereInput
    data: XOR<BlogCategoryUpdateWithoutBlogsInput, BlogCategoryUncheckedUpdateWithoutBlogsInput>
  }

  export type BlogCategoryUpdateWithoutBlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
  }

  export type BlogCategoryUncheckedUpdateWithoutBlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
  }

  export type RoleUpsertWithoutBlogsInput = {
    update: XOR<RoleUpdateWithoutBlogsInput, RoleUncheckedUpdateWithoutBlogsInput>
    create: XOR<RoleCreateWithoutBlogsInput, RoleUncheckedCreateWithoutBlogsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutBlogsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutBlogsInput, RoleUncheckedUpdateWithoutBlogsInput>
  }

  export type RoleUpdateWithoutBlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
  }

  export type RoleUncheckedUpdateWithoutBlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    features?: JsonNullValueInput | InputJsonValue
  }

  export type BlogCreateWithoutCategoryInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    role?: RoleCreateNestedOneWithoutBlogsInput
  }

  export type BlogUncheckedCreateWithoutCategoryInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    roleId?: string | null
  }

  export type BlogCreateOrConnectWithoutCategoryInput = {
    where: BlogWhereUniqueInput
    create: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput>
  }

  export type BlogCreateManyCategoryInputEnvelope = {
    data: BlogCreateManyCategoryInput | BlogCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type BlogUpsertWithWhereUniqueWithoutCategoryInput = {
    where: BlogWhereUniqueInput
    update: XOR<BlogUpdateWithoutCategoryInput, BlogUncheckedUpdateWithoutCategoryInput>
    create: XOR<BlogCreateWithoutCategoryInput, BlogUncheckedCreateWithoutCategoryInput>
  }

  export type BlogUpdateWithWhereUniqueWithoutCategoryInput = {
    where: BlogWhereUniqueInput
    data: XOR<BlogUpdateWithoutCategoryInput, BlogUncheckedUpdateWithoutCategoryInput>
  }

  export type BlogUpdateManyWithWhereWithoutCategoryInput = {
    where: BlogScalarWhereInput
    data: XOR<BlogUpdateManyMutationInput, BlogUncheckedUpdateManyWithoutCategoryInput>
  }

  export type MetaTagCreateWithoutPagesInput = {
    id?: string
    key: string
    value: string
    content: string
  }

  export type MetaTagUncheckedCreateWithoutPagesInput = {
    id?: string
    key: string
    value: string
    content: string
  }

  export type MetaTagCreateOrConnectWithoutPagesInput = {
    where: MetaTagWhereUniqueInput
    create: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput>
  }

  export type MetaTagCreateManyPagesInputEnvelope = {
    data: MetaTagCreateManyPagesInput | MetaTagCreateManyPagesInput[]
    skipDuplicates?: boolean
  }

  export type CategoryServiceCreateWithoutPagesInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceCreateNestedManyWithoutCategoryInput
    orders?: OrderCreateNestedManyWithoutCategoryInput
  }

  export type CategoryServiceUncheckedCreateWithoutPagesInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceUncheckedCreateNestedManyWithoutCategoryInput
    orders?: OrderUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryServiceCreateOrConnectWithoutPagesInput = {
    where: CategoryServiceWhereUniqueInput
    create: XOR<CategoryServiceCreateWithoutPagesInput, CategoryServiceUncheckedCreateWithoutPagesInput>
  }

  export type MetaTagUpsertWithWhereUniqueWithoutPagesInput = {
    where: MetaTagWhereUniqueInput
    update: XOR<MetaTagUpdateWithoutPagesInput, MetaTagUncheckedUpdateWithoutPagesInput>
    create: XOR<MetaTagCreateWithoutPagesInput, MetaTagUncheckedCreateWithoutPagesInput>
  }

  export type MetaTagUpdateWithWhereUniqueWithoutPagesInput = {
    where: MetaTagWhereUniqueInput
    data: XOR<MetaTagUpdateWithoutPagesInput, MetaTagUncheckedUpdateWithoutPagesInput>
  }

  export type MetaTagUpdateManyWithWhereWithoutPagesInput = {
    where: MetaTagScalarWhereInput
    data: XOR<MetaTagUpdateManyMutationInput, MetaTagUncheckedUpdateManyWithoutPagesInput>
  }

  export type MetaTagScalarWhereInput = {
    AND?: MetaTagScalarWhereInput | MetaTagScalarWhereInput[]
    OR?: MetaTagScalarWhereInput[]
    NOT?: MetaTagScalarWhereInput | MetaTagScalarWhereInput[]
    id?: StringFilter<"MetaTag"> | string
    key?: StringFilter<"MetaTag"> | string
    value?: StringFilter<"MetaTag"> | string
    content?: StringFilter<"MetaTag"> | string
    slug?: StringFilter<"MetaTag"> | string
  }

  export type CategoryServiceUpsertWithoutPagesInput = {
    update: XOR<CategoryServiceUpdateWithoutPagesInput, CategoryServiceUncheckedUpdateWithoutPagesInput>
    create: XOR<CategoryServiceCreateWithoutPagesInput, CategoryServiceUncheckedCreateWithoutPagesInput>
    where?: CategoryServiceWhereInput
  }

  export type CategoryServiceUpdateToOneWithWhereWithoutPagesInput = {
    where?: CategoryServiceWhereInput
    data: XOR<CategoryServiceUpdateWithoutPagesInput, CategoryServiceUncheckedUpdateWithoutPagesInput>
  }

  export type CategoryServiceUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUpdateManyWithoutCategoryNestedInput
    orders?: OrderUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryServiceUncheckedUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUncheckedUpdateManyWithoutCategoryNestedInput
    orders?: OrderUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type PagesCreateWithoutMetaInput = {
    id?: string
    page: string
    slug: string
    categoryService?: CategoryServiceCreateNestedOneWithoutPagesInput
  }

  export type PagesUncheckedCreateWithoutMetaInput = {
    id?: string
    page: string
    slug: string
    categoryServiceId?: string | null
  }

  export type PagesCreateOrConnectWithoutMetaInput = {
    where: PagesWhereUniqueInput
    create: XOR<PagesCreateWithoutMetaInput, PagesUncheckedCreateWithoutMetaInput>
  }

  export type PagesUpsertWithoutMetaInput = {
    update: XOR<PagesUpdateWithoutMetaInput, PagesUncheckedUpdateWithoutMetaInput>
    create: XOR<PagesCreateWithoutMetaInput, PagesUncheckedCreateWithoutMetaInput>
    where?: PagesWhereInput
  }

  export type PagesUpdateToOneWithWhereWithoutMetaInput = {
    where?: PagesWhereInput
    data: XOR<PagesUpdateWithoutMetaInput, PagesUncheckedUpdateWithoutMetaInput>
  }

  export type PagesUpdateWithoutMetaInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    categoryService?: CategoryServiceUpdateOneWithoutPagesNestedInput
  }

  export type PagesUncheckedUpdateWithoutMetaInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    categoryServiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CategoryServiceCreateWithoutOrdersInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceCreateNestedManyWithoutCategoryInput
    pages?: PagesCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    heading: string
    description: string
    status: $Enums.PlanStatus
    slug: string
    plans?: PlanServiceUncheckedCreateNestedManyWithoutCategoryInput
    pages?: PagesUncheckedCreateNestedOneWithoutCategoryServiceInput
  }

  export type CategoryServiceCreateOrConnectWithoutOrdersInput = {
    where: CategoryServiceWhereUniqueInput
    create: XOR<CategoryServiceCreateWithoutOrdersInput, CategoryServiceUncheckedCreateWithoutOrdersInput>
  }

  export type PlanServiceCreateWithoutOrdersInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    prices?: PriceCreateNestedManyWithoutPlanInput
    benefits?: BenefitCreateNestedManyWithoutPlanInput
    category: CategoryServiceCreateNestedOneWithoutPlansInput
  }

  export type PlanServiceUncheckedCreateWithoutOrdersInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
    categoryId: string
    prices?: PriceUncheckedCreateNestedManyWithoutPlanInput
    benefits?: BenefitUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanServiceCreateOrConnectWithoutOrdersInput = {
    where: PlanServiceWhereUniqueInput
    create: XOR<PlanServiceCreateWithoutOrdersInput, PlanServiceUncheckedCreateWithoutOrdersInput>
  }

  export type CategoryServiceUpsertWithoutOrdersInput = {
    update: XOR<CategoryServiceUpdateWithoutOrdersInput, CategoryServiceUncheckedUpdateWithoutOrdersInput>
    create: XOR<CategoryServiceCreateWithoutOrdersInput, CategoryServiceUncheckedCreateWithoutOrdersInput>
    where?: CategoryServiceWhereInput
  }

  export type CategoryServiceUpdateToOneWithWhereWithoutOrdersInput = {
    where?: CategoryServiceWhereInput
    data: XOR<CategoryServiceUpdateWithoutOrdersInput, CategoryServiceUncheckedUpdateWithoutOrdersInput>
  }

  export type CategoryServiceUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUpdateManyWithoutCategoryNestedInput
    pages?: PagesUpdateOneWithoutCategoryServiceNestedInput
  }

  export type CategoryServiceUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    heading?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    slug?: StringFieldUpdateOperationsInput | string
    plans?: PlanServiceUncheckedUpdateManyWithoutCategoryNestedInput
    pages?: PagesUncheckedUpdateOneWithoutCategoryServiceNestedInput
  }

  export type PlanServiceUpsertWithoutOrdersInput = {
    update: XOR<PlanServiceUpdateWithoutOrdersInput, PlanServiceUncheckedUpdateWithoutOrdersInput>
    create: XOR<PlanServiceCreateWithoutOrdersInput, PlanServiceUncheckedCreateWithoutOrdersInput>
    where?: PlanServiceWhereInput
  }

  export type PlanServiceUpdateToOneWithWhereWithoutOrdersInput = {
    where?: PlanServiceWhereInput
    data: XOR<PlanServiceUpdateWithoutOrdersInput, PlanServiceUncheckedUpdateWithoutOrdersInput>
  }

  export type PlanServiceUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    prices?: PriceUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUpdateManyWithoutPlanNestedInput
    category?: CategoryServiceUpdateOneRequiredWithoutPlansNestedInput
  }

  export type PlanServiceUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    prices?: PriceUncheckedUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PriceCreateManyPlanInput = {
    id?: string
    curr: $Enums.Currency
    amount: number
    discount: number
  }

  export type BenefitCreateManyPlanInput = {
    id?: string
    value: string
  }

  export type OrderCreateManyPlanInput = {
    id?: string
    amount: number
    bussiness: string
    categoryId: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    time: string
  }

  export type PriceUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
  }

  export type PriceUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
  }

  export type PriceUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    curr?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency
    amount?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
  }

  export type BenefitUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type BenefitUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type BenefitUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type OrderUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    category?: CategoryServiceUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type OrderUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type PlanServiceCreateManyCategoryInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    showPrice?: boolean
    status: $Enums.PlanStatus
    options: string
    descriptions: string
  }

  export type OrderCreateManyCategoryInput = {
    id?: string
    amount: number
    bussiness: string
    date: string
    email: string
    message: string
    name: string
    phoneNumber: string
    idPlan: string
    time: string
  }

  export type PlanServiceUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    prices?: PriceUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUpdateManyWithoutPlanNestedInput
    orders?: OrderUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
    prices?: PriceUncheckedUpdateManyWithoutPlanNestedInput
    benefits?: BenefitUncheckedUpdateManyWithoutPlanNestedInput
    orders?: OrderUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanServiceUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    showPrice?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    options?: StringFieldUpdateOperationsInput | string
    descriptions?: StringFieldUpdateOperationsInput | string
  }

  export type OrderUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    plan?: PlanServiceUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type OrderUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    bussiness?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    idPlan?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
  }

  export type BlogCreateManyRoleInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    categoryId: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type BlogUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: BlogCategoryUpdateOneRequiredWithoutBlogsNestedInput
  }

  export type BlogUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlogUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BlogCreateManyCategoryInput = {
    id?: string
    title: string
    image: string
    content: string
    status: $Enums.BlogStatus
    favorite: boolean
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    roleId?: string | null
  }

  export type BlogUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneWithoutBlogsNestedInput
  }

  export type BlogUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BlogUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: EnumBlogStatusFieldUpdateOperationsInput | $Enums.BlogStatus
    favorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetaTagCreateManyPagesInput = {
    id?: string
    key: string
    value: string
    content: string
  }

  export type MetaTagUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type MetaTagUncheckedUpdateWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type MetaTagUncheckedUpdateManyWithoutPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}