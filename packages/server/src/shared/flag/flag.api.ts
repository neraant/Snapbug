// @disabled flag
import { FindFlagsUseCase } from "@workspace/server/shared/flag/application/find-flags.use-case";
import { FlagService } from "@workspace/server/shared/flag/service/flag.service";
import type { FlagModelType } from "@workspace/validation/modules/flag/dto/flag.model";

export async function findFlags(request?: Request): Promise<FlagModelType> {
  const useCase = new FindFlagsUseCase(new FlagService());
  return await useCase.execute(request);
}
