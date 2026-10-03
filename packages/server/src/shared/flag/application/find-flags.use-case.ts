// @disabled flag
import type { FlagService } from "@workspace/server/shared/flag/service/flag.service";
import type { FlagModelType } from "@workspace/validation/modules/flag/dto/flag.model";

export class FindFlagsUseCase {
  constructor(private readonly flagService: FlagService) {}

  async execute(request?: Request): Promise<FlagModelType> {
    return await this.flagService.findFlags(request);
  }
}
