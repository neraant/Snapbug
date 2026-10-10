import { UpdateUserUseCase } from "@workspace/server/modules/identity/application/update-user.use-case";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { MembershipAdapter } from "@workspace/server/modules/membership/adapter/membership.adapter";
import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { OrganizationFactory } from "@workspace/server/modules/organization/entity/organization.factory";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { CreateProjectUseCase } from "@workspace/server/modules/project/application/create-project.use-case";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { withTransaction, type WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { CompleteOnboardingInputDtoType } from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

const DEFAULT_ORGANIZATION_NAME = "Workspace";
const DEFAULT_PROJECT_NAME = "Default project";

export class CompleteOnboardingUseCase {
  constructor(
    private readonly userPort: UserPort,
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly findOnboardingUseCase: FindOnboardingUseCase,
    private readonly withTransactionFn: WithTransactionType = withTransaction,
  ) {}

  async execute(input: CompleteOnboardingInputDtoType, userId: string): Promise<FindOnboardingOutputDtoType> {
    const { onboardingCompletedAt } = await this.userPort.findOnboardingState(userId);
    if (onboardingCompletedAt) {
      return await this.findOnboardingUseCase.execute(userId);
    }

    const membership = await this.membershipPort.findByUser(userId);

    await this.withTransactionFn(async (tx) => {
      const organizationRepository = this.organizationRepository.withTx(tx);
      const membershipRepository = this.membershipRepository.withTx(tx);
      const projectRepository = this.projectRepository.withTx(tx);
      const userRepository = this.userRepository.withTx(tx);
      const membershipAdapter = new MembershipAdapter(membershipRepository);

      if (!membership) {
        const organizationName = input.organizationName || DEFAULT_ORGANIZATION_NAME;
        const projectName = input.projectName || DEFAULT_PROJECT_NAME;
        const organization = OrganizationFactory.create({ name: organizationName });
        await organizationRepository.save(organization);
        await new CreateMembershipUseCase(membershipRepository).execute({ organizationId: organization.id }, userId);
        await new CreateProjectUseCase(membershipAdapter, projectRepository).execute(
          { organizationId: organization.id, name: projectName },
          userId,
        );
      } else {
        const projects = await projectRepository.findManyByOrganizationId(membership.organizationId);
        if (projects.length === 0) {
          const projectName = input.projectName || DEFAULT_PROJECT_NAME;
          await new CreateProjectUseCase(membershipAdapter, projectRepository).execute(
            { organizationId: membership.organizationId, name: projectName },
            userId,
          );
        }
      }

      await new UpdateUserUseCase(userRepository).execute({ userId, onboardingCompletedAt: new Date() });
    });

    return await this.findOnboardingUseCase.execute(userId);
  }
}
