import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { CreateOrganizationUseCase } from "@workspace/server/modules/organization/application/create-organization.use-case";
import { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { UpdateOrganizationUseCase } from "@workspace/server/modules/organization/application/update-organization.use-case";
import { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ProjectAdapter } from "@workspace/server/modules/project/adapter/project.adapter";
import type {
  CreateOrganizationInputDtoType,
  CreateOrganizationOutputDtoType,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";
import type { UpdateOrganizationInputDtoType } from "@workspace/validation/modules/organization/dto/update-organization.schema";

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
  const useCase = new FindOnboardingUseCase(
    new MembershipAdapter(),
    new OrganizationRepository(),
    new ProjectAdapter(),
  );
  return await useCase.execute(userId);
}
