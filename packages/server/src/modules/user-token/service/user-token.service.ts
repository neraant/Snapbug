import { createHash, randomBytes } from "crypto";

const projectKeyPrefix = "snb_pk_";
const userTokenPrefix = "snb_ut_live_";
const prefixHintLength = 4;

export class UserTokenService {
  createSecret(): string {
    return `${userTokenPrefix}${randomBytes(32).toString("hex")}`;
  }

  hashSecret(secret: string): string {
    return createHash("sha256").update(secret).digest("hex");
  }

  displayPrefix(secret: string): string {
    return secret.slice(0, userTokenPrefix.length + prefixHintLength);
  }

  isProjectKey(secret: string): boolean {
    return secret.startsWith(projectKeyPrefix);
  }
}
