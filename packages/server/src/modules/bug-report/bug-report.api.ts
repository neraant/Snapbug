import { ApiKeyAdapter } from "@workspace/server/modules/api-key/adapter/api-key.adapter";
import { CreateBugReportUseCase } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { FindBugReportsUseCase } from "@workspace/server/modules/bug-report/application/find-bug-reports.use-case";
import { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import type {
  CreateBugReportInputDtoType,
  CreateBugReportOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import type {
  FindBugReportsInputDtoType,
  FindBugReportsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-bug-reports.schema";

export async function createBugReport(input: CreateBugReportInputDtoType): Promise<CreateBugReportOutputDtoType> {
  const useCase = new CreateBugReportUseCase(new ApiKeyAdapter(), new BugReportRepository());
  return await useCase.execute(input);
}

export async function findBugReports(
  input: FindBugReportsInputDtoType,
  userId: string,
): Promise<FindBugReportsOutputDtoType> {
  const useCase = new FindBugReportsUseCase(new MembershipAdapter(), new ProjectAdapter(), new BugReportRepository());
  return await useCase.execute(input, userId);
}
