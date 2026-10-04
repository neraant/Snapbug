import { env } from "@workspace/server/shared/env/env.schema";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { ReactNode } from "react";
import type { Resend } from "resend";

type SendParamsType = {
  to: string;
  subject: string;
  react: ReactNode;
};

export class EmailService {
  constructor(private readonly resend: Resend) {}

  async send({ to, subject, react }: SendParamsType) {
    const { error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      react,
    });

    if (error) {
      throw new InternalServerError(ERROR_CODES.EMAIL_SEND_FAILED);
    }
  }
}
