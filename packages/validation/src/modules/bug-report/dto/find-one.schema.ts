import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

const findOneAssigneeSchema = userModelSchema.pick({
  id: true,
  name: true,
  email: true,
});

export const findOneInputDtoSchema = z.object({
  shortId: z.string().min(1),
});

export type FindOneInputDtoType = z.infer<typeof findOneInputDtoSchema>;

export const findOneOutputDtoSchema = bugReportModelSchema.extend({
  assignee: findOneAssigneeSchema.nullable(),
  organizationId: z.uuid(),
});

export type FindOneOutputDtoType = z.infer<typeof findOneOutputDtoSchema>;
