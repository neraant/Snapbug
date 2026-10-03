import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import type { ApiKeyPersistedType } from "@workspace/server/modules/api-key/entity/api-key.types";

export abstract class ApiKeyMapper {
  static fromPersistence(row: ApiKeyPersistedType): ApiKey {
    return new ApiKey(row);
  }

  static toPersistence(apiKey: ApiKey): ApiKeyPersistedType {
    return apiKey.toObject();
  }
}
