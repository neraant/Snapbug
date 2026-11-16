import type { McpToolInputFieldType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import { ZodBoolean, ZodDefault, ZodEnum, ZodNumber, ZodObject, ZodOptional, ZodString, type ZodTypeAny } from "zod";

export function extractMcpToolInputFields(schema: ZodTypeAny | undefined): McpToolInputFieldType[] {
  if (!schema) return [];

  const resolved = unwrapOptionalDefault(schema);
  if (!(resolved instanceof ZodObject)) return [];

  const fields: McpToolInputFieldType[] = [];

  for (const [name, fieldSchema] of Object.entries(resolved.shape)) {
    fields.push({
      name,
      type: resolveZodTypeLabel(fieldSchema as ZodTypeAny),
      required: !isOptionalField(fieldSchema as ZodTypeAny),
      description: readZodDescription(fieldSchema as ZodTypeAny),
    });
  }

  return fields;
}

function isOptionalField(schema: ZodTypeAny): boolean {
  return schema instanceof ZodOptional || schema instanceof ZodDefault;
}

function readZodDescription(schema: ZodTypeAny): string | null {
  let current: ZodTypeAny = schema;
  while (current instanceof ZodOptional || current instanceof ZodDefault) {
    if (current.description) return current.description;
    current = current.unwrap() as ZodTypeAny;
  }
  return current.description ?? null;
}

function unwrapOptionalDefault(schema: ZodTypeAny): ZodTypeAny {
  if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
    return unwrapOptionalDefault(schema.unwrap() as ZodTypeAny);
  }
  return schema;
}

function resolveZodTypeLabel(schema: ZodTypeAny): string {
  const inner = unwrapOptionalDefault(schema);

  if (inner instanceof ZodString) return "string";

  if (inner instanceof ZodNumber) return "number";
  if (inner instanceof ZodBoolean) return "boolean";
  if (inner instanceof ZodEnum) return `enum (${inner.options.join(" | ")})`;
  if (inner instanceof ZodObject) return "object";

  const typeName = inner._zod?.def?.type;
  if (typeName === "string") return "string";
  if (typeName === "number") return "number";
  if (typeName === "boolean") return "boolean";

  return "unknown";
}
