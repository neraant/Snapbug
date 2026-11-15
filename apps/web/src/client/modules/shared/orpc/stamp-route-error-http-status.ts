import { attachRouteErrorHttpStatus } from "@workspace/server/error/app-error-http-status";

type QueryishOptions = {
  queryFn?: (context: unknown) => Promise<unknown>;
  mutationFn?: (input: unknown) => Promise<unknown>;
};

function stampRouteOptionFns<T extends QueryishOptions>(options: T): T {
  if (typeof options.queryFn === "function") {
    const queryFn = options.queryFn;
    return {
      ...options,
      queryFn: async (context) => {
        try {
          return await queryFn(context);
        } catch (error) {
          throw attachRouteErrorHttpStatus(error);
        }
      },
    };
  }

  if (typeof options.mutationFn === "function") {
    const mutationFn = options.mutationFn;
    return {
      ...options,
      mutationFn: async (input) => {
        try {
          return await mutationFn(input);
        } catch (error) {
          throw attachRouteErrorHttpStatus(error);
        }
      },
    };
  }

  return options;
}

function stampRouteProcedureCall<T extends (...args: never[]) => Promise<unknown>>(call: T): T {
  const stamped = async (...args: Parameters<T>) => {
    try {
      return await call(...args);
    } catch (error) {
      throw attachRouteErrorHttpStatus(error);
    }
  };
  return stamped as T;
}

export function stampRouteOrpcQueryUtils<T extends object>(utils: T): T {
  return new Proxy(utils, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "function") {
        if (prop === "queryOptions" || prop === "infiniteOptions" || prop === "mutationOptions") {
          const optionsFactory = value as (...args: unknown[]) => QueryishOptions;
          return (...args: unknown[]) => stampRouteOptionFns(optionsFactory(...args));
        }
        if (prop === "call") {
          return stampRouteProcedureCall(value as (...args: never[]) => Promise<unknown>);
        }
      }

      if (typeof value === "object" && value !== null && typeof prop === "string") {
        return stampRouteOrpcQueryUtils(value);
      }

      return value;
    },
  }) as T;
}
