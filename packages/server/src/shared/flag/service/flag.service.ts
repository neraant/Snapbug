// @disabled flag
import { flagRegistry } from "@workspace/server/shared/flag/flag.registry.const";
import type { FlagModelType } from "@workspace/validation/modules/flag/dto/flag.model";
import { evaluate } from "flags/next";

export class FlagService {
  async findFlags(request?: Request): Promise<FlagModelType> {
    const values = await evaluate(flagRegistry, request);

    return {
      settingsVisible: Boolean(values.settingsVisible),
    };
  }
}
