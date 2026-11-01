import type { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { OrganizationFactory } from "@workspace/server/modules/organization/entity/organization.factory";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { CompleteOnboardingInputDtoType } from "@workspace/validation/modules/organization/dto/complete-onboarding.schema";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";
import { projectColorDefault } from "@workspace/validation/shared/project-color.schema";

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

  async execute(
    input: CompleteOnboardingInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindOnboardingOutputDtoType> {
    const { onboardingCompletedAt } = await this.userPort.findOnboardingState(userId);
    if (onboardingCompletedAt) {
      return await this.findOnboarding.execute(userId, organizationId);
    }

    let resolvedOrganizationId = organizationId;

    await this.withTransaction(async (tx) => {
      const organizationRepository = this.organizationRepository.withTx(tx);
      const membershipPort = this.membershipPort.withTx(tx);
      const projectPort = this.projectPort.withTx(tx);
      const userPort = this.userPort.withTx(tx);

      if (!resolvedOrganizationId) {
        const organizationName = input.organizationName || DEFAULT_ORGANIZATION_NAME;
        const projectName = input.projectName || DEFAULT_PROJECT_NAME;
        const organization = OrganizationFactory.create({ name: organizationName });
        await organizationRepository.save(organization);
        await membershipPort.create({ organizationId: organization.id }, userId);
        await projectPort.create(
          { organizationId: organization.id, name: projectName, color: projectColorDefault },
          userId,
        );
        resolvedOrganizationId = organization.id;
      } else {
        const membership = await membershipPort.findByUserAndOrganization({
          userId,
          organizationId: resolvedOrganizationId,
        });
        if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

        const projects = await projectPort.findManyByOrganizationId({ organizationId: resolvedOrganizationId });
        if (projects.length === 0) {
          const projectName = input.projectName || DEFAULT_PROJECT_NAME;
          await projectPort.create(
            { organizationId: resolvedOrganizationId, name: projectName, color: projectColorDefault },
            userId,
          );
        }
      }

      await userPort.markOnboardingComplete(userId);
    });

    return await this.findOnboarding.execute(userId, resolvedOrganizationId);
  }
}
