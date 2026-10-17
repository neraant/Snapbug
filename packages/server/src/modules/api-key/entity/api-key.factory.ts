import { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import { randomBytes, randomUUID } from "crypto";

export abstract class ApiKeyFactory {
  static create(projectId: string): ApiKey {
    return new ApiKey({
      id: randomUUID(),
      projectId,
      key: `snb_pk_live_${randomBytes(16).toString("hex")}`,
      createdAt: new Date(),
      revokedAt: null,
    });
  }
}
