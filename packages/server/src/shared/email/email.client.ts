import { env } from "@workspace/server/shared/env/env.schema";
import { Resend } from "resend";

const globalForEmail = globalThis as unknown as { resend?: Resend };

export const resendClient = globalForEmail.resend ?? new Resend(env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForEmail.resend = resendClient;
}
