import "@workspace/server/shared/openapi/schema-registry";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { openapiDocumentOptions } from "@workspace/server/shared/openapi/document.const";
import { router } from "@workspace/server/shared/router.const";

const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const isOpenApiDocsEnabled = !isProduction;

export const openAPIHandler = new OpenAPIHandler(router, {
  plugins: isOpenApiDocsEnabled
    ? [
        new OpenAPIReferencePlugin({
          docsProvider: "scalar",
          docsPath: "/reference",
          schemaConverters: [new ZodToJsonSchemaConverter()],
          specGenerateOptions: openapiDocumentOptions,
        }),
      ]
    : [],
});
