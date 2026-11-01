import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { z } from "zod";

import { texts } from "@/client/modules/project/consts/texts.const";

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1, texts.createSheet.field.name.required),
  color: projectColorSchema,
});

export type ProjectCreateSchemaType = z.infer<typeof projectCreateSchema>;
