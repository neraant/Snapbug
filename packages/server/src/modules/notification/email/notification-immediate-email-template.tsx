import {
  formatNotificationEmailLine,
  notificationEmailLanguage,
} from "@workspace/server/modules/notification/email/notification-email-copy.const";
import {
  notificationObjectUrl,
  notificationSettingsUrl,
} from "@workspace/server/modules/notification/email/notification-email-url.util";
import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import type { InterfaceLanguage } from "@workspace/validation/modules/user/consts/interface-language.const";

const color = {
  canvas: "#FAF7F2",
  ink: "#1C1917",
  muted: "#78716C",
  card: "#FFFFFF",
  border: "#E7E5E4",
  primary: "#FF7119",
  white: "#FFFFFF",
} as const;

const font = {
  sans: '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

type NotificationImmediateEmailTemplateProps = {
  type: NotificationType;
  objectType: NotificationObjectType;
  payload: NotificationPayloadType;
  language: InterfaceLanguage;
};

export function NotificationImmediateEmailTemplate({
  type,
  objectType,
  payload,
  language,
}: NotificationImmediateEmailTemplateProps) {
  const texts = notificationEmailLanguage(language);
  const line = formatNotificationEmailLine(type, payload, language);
  const actionUrl = notificationObjectUrl(objectType, payload);
  const settingsUrl = notificationSettingsUrl();

  return (
    <div style={{ backgroundColor: color.canvas, margin: 0, padding: "40px 16px", fontFamily: font.sans }}>
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ maxWidth: 520, margin: "0 auto", borderCollapse: "separate" }}
      >
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: color.card,
                border: `1px solid ${color.border}`,
                borderRadius: 20,
                padding: "32px 28px 24px",
              }}
            >
              <p style={{ margin: "0 0 8px", color: color.muted, fontSize: 12, fontWeight: 600 }}>
                {texts.immediateEyebrow}
              </p>
              <p style={{ margin: "0 0 20px", color: color.ink, fontSize: 22, lineHeight: "28px", fontWeight: 700 }}>
                {line.text}
              </p>
              {line.projectName ? (
                <p style={{ margin: "0 0 20px", color: color.muted, fontSize: 14 }}>{line.projectName}</p>
              ) : null}
              {actionUrl ? (
                <a
                  href={actionUrl}
                  style={{
                    display: "inline-block",
                    backgroundColor: color.primary,
                    color: color.white,
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    padding: "12px 20px",
                    borderRadius: 999,
                  }}
                >
                  {texts.viewTicket}
                </a>
              ) : null}
              <p style={{ margin: "28px 0 0", fontSize: 12, lineHeight: "18px" }}>
                <a href={settingsUrl} style={{ color: color.muted }}>
                  {texts.manageSettings}
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
