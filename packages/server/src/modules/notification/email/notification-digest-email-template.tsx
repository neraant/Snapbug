import {
  formatNotificationEmailLine,
  notificationEmailLanguage,
} from "@workspace/server/modules/notification/email/notification-email-copy.const";
import { notificationObjectUrl, notificationSettingsUrl } from "@workspace/server/modules/notification/email/notification-email-url.util";
import type { NotificationDigestProjectGroup } from "@workspace/server/modules/notification/email/group-digest.util";
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

type NotificationDigestEmailTemplateProps = {
  groups: NotificationDigestProjectGroup[];
  language: InterfaceLanguage;
};

export function NotificationDigestEmailTemplate({ groups, language }: NotificationDigestEmailTemplateProps) {
  const texts = notificationEmailLanguage(language);
  const count = groups.reduce((total, group) => total + group.items.length, 0);
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
              <p style={{ margin: "0 0 8px", color: color.muted, fontSize: 12, fontWeight: 600 }}>{texts.immediateEyebrow}</p>
              <p style={{ margin: "0 0 8px", color: color.ink, fontSize: 22, lineHeight: "28px", fontWeight: 700 }}>
                {texts.digestTitle}
              </p>
              <p style={{ margin: "0 0 24px", color: color.muted, fontSize: 14 }}>{texts.digestIntro(count)}</p>
              {groups.map((group) => (
                <div key={group.projectKey} style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 8px", color: color.ink, fontSize: 15, fontWeight: 600 }}>{group.projectName}</p>
                  <ul style={{ margin: 0, paddingLeft: 18, color: color.muted, fontSize: 14, lineHeight: "22px" }}>
                    {group.items.map((item) => {
                      const line = formatNotificationEmailLine(item.type, item.payload, language);
                      const href = notificationObjectUrl(item.objectType, item.payload);
                      return (
                        <li key={item.id} style={{ marginBottom: 6 }}>
                          {href ? (
                            <a href={href} style={{ color: color.ink, textDecoration: "none" }}>
                              {line.text}
                            </a>
                          ) : (
                            line.text
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: "18px" }}>
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