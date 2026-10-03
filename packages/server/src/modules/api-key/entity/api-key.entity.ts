import type { ApiKeyPersistedType } from "@workspace/server/modules/api-key/entity/api-key.types";

export class ApiKey {
  readonly id: ApiKeyPersistedType["id"];
  readonly projectId: ApiKeyPersistedType["projectId"];
  readonly key: ApiKeyPersistedType["key"];
  readonly createdAt: ApiKeyPersistedType["createdAt"];
  readonly revokedAt: ApiKeyPersistedType["revokedAt"];

  constructor(apiKey: ApiKeyPersistedType) {
    this.id = apiKey.id;
    this.projectId = apiKey.projectId;
    this.key = apiKey.key;
    this.createdAt = apiKey.createdAt;
    this.revokedAt = apiKey.revokedAt;
  }

  toObject(): ApiKeyPersistedType {
    return {
      id: this.id,
      projectId: this.projectId,
      key: this.key,
      createdAt: this.createdAt,
      revokedAt: this.revokedAt,
    };
  }
}
