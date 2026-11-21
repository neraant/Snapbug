import { notificationEmailSubject } from "@workspace/server/modules/notification/email/notification-email-copy.const";
import { NotificationImmediateEmailTemplate } from "@workspace/server/modules/notification/email/notification-immediate-email-template";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type NotificationEmailDeliveryInput = {
  userId: string;
  organizationId: string;
  type: NotificationType;
  actorUserId: string | null;
  objectType: NotificationObjectType;
  objectId: string;
  projectId: string | null;
  payload: NotificationPayloadType;
};

export class NotificationEmailDispatchService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userPort: NotificationUserPort,
  ) {}

  async deliver(input: NotificationEmailDeliveryInput): Promise<void> {
    const users = await this.userPort.findManyByIds([input.userId]);
    const user = users[0];
    if (!user) return;

    await this.emailService.send({
      to: user.email,
      subject: notificationEmailSubject(input.type, input.payload, user.interfaceLanguage),
      react: NotificationImmediateEmailTemplate({
        type: input.type,
        objectType: input.objectType,
        payload: input.payload,
        language: user.interfaceLanguage,
      }),
    });
  }
}
