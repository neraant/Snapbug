import type { OpenAPIGeneratorGenerateOptions } from "@orpc/openapi";

const SESSION_COOKIE_NAME = "authjs.session-token";

export const openapiDocumentOptions = {
  info: { title: "Snapbug API", version: "0.0.1" },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: SESSION_COOKIE_NAME,
        description: "Auth.js session cookie. Sign in via the app, then Try it from the same origin.",
      },
    },
  },
} satisfies OpenAPIGeneratorGenerateOptions;
