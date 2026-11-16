import type { ZodTypeAny } from "zod";
import { ZodDefault, ZodObject, ZodOptional } from "zod";

export function assertZodObjectFieldsDescribed(schema: ZodTypeAny, path = ""): string[] {
  const unlabeled: string[] = [];
  const resolved = unwrapOptionalDefault(schema);
  if (!(resolved instanceof ZodObject)) return unlabeled;

  for (const [key, fieldSchema] of Object.entries(resolved.shape)) {
    const fieldPath = path ? `${path}.${key}` : key;
    if (fieldHasDescription(fieldSchema as ZodTypeAny)) continue;
    const unwrapped = unwrapOptionalDefault(fieldSchema as ZodTypeAny);
    if (unwrapped instanceof ZodObject) {
      unlabeled.push(...assertZodObjectFieldsDescribed(unwrapped, fieldPath));
      continue;
    }
    unlabeled.push(fieldPath);
  }
  return unlabeled;
}

function fieldHasDescription(schema: ZodTypeAny): boolean {
  let current: ZodTypeAny = schema;
  while (current instanceof ZodOptional || current instanceof ZodDefault) {
    if (current.description) return true;
    current = current.unwrap() as ZodTypeAny;
  }
  return Boolean(current.description);
}

function unwrapOptionalDefault(schema: ZodTypeAny): ZodTypeAny {
  if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
    return unwrapOptionalDefault(schema.unwrap() as ZodTypeAny);
  }
  return schema;
}
