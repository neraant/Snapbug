import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

const findRecentAssigneeSchema = userModelSchema.pick({
  id: true,
  name: true,
  email: true,
});

const findRecentItemSchema = bugReportModelSchema
  .pick({
    id: true,
    shortId: true,
    title: true,
    severity: true,
    browser: true,
    createdAt: true,
  })
  .extend({
    projectName: z.string(),
    assignee: findRecentAssigneeSchema.nullable(),
  });

export const findRecentInputDtoSchema = findStatsInputDtoSchema.pick({ projectId: true });

export type FindRecentInputDtoType = z.infer<typeof findRecentInputDtoSchema>;

export const findRecentOutputDtoSchema = z.array(findRecentItemSchema);

export type FindRecentOutputDtoType = z.infer<typeof findRecentOutputDtoSchema>;
