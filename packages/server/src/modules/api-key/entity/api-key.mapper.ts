import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import type { ApiKeyPersistedType } from "@workspace/server/modules/api-key/entity/api-key.types";
import type { FindProjectApiKeyOutputDtoType } from "@workspace/validation/modules/api-key/dto/find-project-api-key.schema";

export abstract class ApiKeyMapper {
  static fromPersistence(row: ApiKeyPersistedType): ApiKey {
    return new ApiKey(row);
  }

  static toPersistence(apiKey: ApiKey): ApiKeyPersistedType {
    return apiKey.toObject();
  }

  static toAudit(apiKey: ApiKey): Record<string, unknown> {
    const { projectId, createdAt, revokedAt } = apiKey.toObject();
    return { projectId, createdAt, revokedAt };
  }

  static toProjectApiKeyDto(apiKey: ApiKey): FindProjectApiKeyOutputDtoType {
    const { key, createdAt } = apiKey.toObject();

    return {
      key: key.replace(/.(?=.{4})/g, "\u2022"),
      createdAt: createdAt.toISOString(),
    };
  }
}
