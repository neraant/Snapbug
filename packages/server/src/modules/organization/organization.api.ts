import { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { UserAdapter } from "@workspace/server/modules/organization/adapter/user.adapter";
import { CompleteOnboardingUseCase } from "@workspace/server/modules/organization/application/complete-onboarding.use-case";
import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { UpdateOrganizationUseCase } from "@workspace/server/modules/organization/application/update-organization.use-case";
import { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { withTransaction } from "@workspace/server/shared/database/transaction.util";
import type {
  CompleteOnboardingInputDtoType,
  CompleteOnboardingOutputDtoType,
} from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import type {
  CreateOrganizationInputDtoType,
  CreateOrganizationOutputDtoType,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";
import type { UpdateOrganizationInputDtoType } from "@workspace/validation/modules/organization/dto/update-organization.schema";

function createFindOnboardingUseCase() {
  return new FindOnboardingUseCase(
    new UserAdapter(),
    new MembershipAdapter(),
    new OrganizationRepository(),
    new ProjectAdapter(),
  );
}

export async function createOrganization(
  input: CreateOrganizationInputDtoType,
  userId: string,
): Promise<CreateOrganizationOutputDtoType> {
  const useCase = new CreateOrganizationUseCase(
    new OrganizationRepository(),
    new MembershipAdapter(),
    new ProjectAdapter(),
  );
  return await useCase.execute(input, userId);
}

export async function updateOrganization(
  input: UpdateOrganizationInputDtoType,
  userId: string,
): Promise<OrganizationModelType> {
  const useCase = new UpdateOrganizationUseCase(new MembershipAdapter(), new OrganizationRepository());
  return await useCase.execute(input, userId);
}

export async function findOnboarding(userId: string): Promise<FindOnboardingOutputDtoType> {
  return await createFindOnboardingUseCase().execute(userId);
}

export async function completeOnboarding(
  input: CompleteOnboardingInputDtoType,
  userId: string,
): Promise<CompleteOnboardingOutputDtoType> {
  const findOnboardingUseCase = createFindOnboardingUseCase();
  const useCase = new CompleteOnboardingUseCase(
    new UserAdapter(),
    new MembershipAdapter(),
    new OrganizationRepository(),
    new MembershipRepository(),
    new ProjectRepository(),
    new UserRepository(),
    findOnboardingUseCase,
    withTransaction,
  );
  return await useCase.execute(input, userId);
}
