import type { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { OrganizationFactory } from "@workspace/server/modules/organization/entity/organization.factory";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { CompleteOnboardingInputDtoType } from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

const DEFAULT_ORGANIZATION_NAME = "Workspace";
const DEFAULT_PROJECT_NAME = "Default project";

export class CompleteOnboardingUseCase {
  constructor(
    private readonly userPort: UserPort,
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
    private readonly projectPort: ProjectPort,
    private readonly findOnboarding: FindOnboardingUseCase,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: CompleteOnboardingInputDtoType, userId: string): Promise<FindOnboardingOutputDtoType> {
    const { onboardingCompletedAt } = await this.userPort.findOnboardingState(userId);
    if (onboardingCompletedAt) {
      return await this.findOnboarding.execute(userId);
    }

    const membership = await this.membershipPort.findByUser(userId);

    await this.withTransaction(async (tx) => {
      const organizationRepository = this.organizationRepository.withTx(tx);
      const membershipPort = this.membershipPort.withTx(tx);
      const projectPort = this.projectPort.withTx(tx);
      const userPort = this.userPort.withTx(tx);

      if (!membership) {
        const organizationName = input.organizationName || DEFAULT_ORGANIZATION_NAME;
        const projectName = input.projectName || DEFAULT_PROJECT_NAME;
        const organization = OrganizationFactory.create({ name: organizationName });
        await organizationRepository.save(organization);
        await membershipPort.create({ organizationId: organization.id }, userId);
        await projectPort.create({ organizationId: organization.id, name: projectName }, userId);
      } else {
        const projects = await projectPort.findManyByOrganizationId({ organizationId: membership.organizationId });
        if (projects.length === 0) {
          const projectName = input.projectName || DEFAULT_PROJECT_NAME;
          await projectPort.create({ organizationId: membership.organizationId, name: projectName }, userId);
        }
      }

      await userPort.markOnboardingComplete(userId);
    });

    return await this.findOnboarding.execute(userId);
  }
}
