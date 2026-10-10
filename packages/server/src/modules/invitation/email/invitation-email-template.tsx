const color = {
  canvas: "#FAF7F2",
  ink: "#1C1917",
  muted: "#78716C",
  card: "#FFFFFF",
  border: "#E7E5E4",
  primary: "#FF7119",
  primaryDeep: "#C2410C",
  accent: "#FFF7ED",
  blush: "#FCA5A5",
  white: "#FFFFFF",
} as const;

const font = {
  sans: '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

const texts = {
  eyebrow: "Snapbug",
  tagline: "Developer Triage",
  title: "You're on the guest list.",
  body: "Someone invited you to their Snapbug workspace. Create your account and jump in. This link stays live for 7 days.",
  action: "Accept invitation",
  fallback: "If the button hides, paste this link into your browser.",
  ignore: "Didn't expect this? Ignore the email — no account will be created.",
  copyright: "© 2026 Snapbug Inc.",
} as const;

type InvitationEmailTemplateProps = {
  inviteUrl: string;
};

export function InvitationEmailTemplate({ inviteUrl }: InvitationEmailTemplateProps) {
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
                padding: "36px 32px 28px",
              }}
            >
              <table role="presentation" cellPadding={0} cellSpacing={0} width="100%">
                <tbody>
                  <tr>
                    <td align="center" style={{ paddingBottom: 20 }}>
                      <div
                        style={{
                          width: 112,
                          height: 112,
                          margin: "0 auto",
                          borderRadius: 999,
                          backgroundColor: color.accent,
                          lineHeight: "112px",
                        }}
                      >
                        <WavingMascot />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style={{ paddingBottom: 8 }}>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: color.accent,
                          color: color.primaryDeep,
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {texts.eyebrow}
                        <span style={{ color: color.muted, fontWeight: 500 }}> · {texts.tagline}</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style={{
                        color: color.ink,
                        fontSize: 30,
                        lineHeight: "36px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        paddingBottom: 12,
                      }}
                    >
                      {texts.title}
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style={{
                        color: color.muted,
                        fontSize: 15,
                        lineHeight: "24px",
                        padding: "0 12px 28px",
                      }}
                    >
                      {texts.body}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style={{ paddingBottom: 28 }}>
                      <a
                        href={inviteUrl}
                        style={{
                          display: "inline-block",
                          backgroundColor: color.primary,
                          color: color.white,
                          textDecoration: "none",
                          fontSize: 15,
                          fontWeight: 600,
                          lineHeight: "20px",
                          padding: "14px 22px",
                          borderRadius: 999,
                        }}
                      >
                        {texts.action}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundColor: color.canvas,
                        borderRadius: 12,
                        padding: "14px 16px",
                      }}
                    >
                      <p style={{ margin: "0 0 8px", color: color.muted, fontSize: 12, lineHeight: "18px" }}>
                        {texts.fallback}
                      </p>
                      <a
                        href={inviteUrl}
                        style={{
                          color: color.ink,
                          fontFamily: font.mono,
                          fontSize: 12,
                          lineHeight: "18px",
                          wordBreak: "break-all",
                        }}
                      >
                        {inviteUrl}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style={{ padding: "20px 24px 0" }}>
              <p style={{ margin: "0 0 8px", color: color.muted, fontSize: 12, lineHeight: "18px" }}>{texts.ignore}</p>
              <p style={{ margin: 0, color: color.muted, fontSize: 12, lineHeight: "18px" }}>{texts.copyright}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function WavingMascot() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="88"
      height="88"
      viewBox="0 0 80 80"
      role="img"
      aria-label="Snapbug"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M30.4 22.4C27.2 14.4 19.2 12.8 16 14.4" stroke={color.primary} strokeWidth="2.8" strokeLinecap="round" />
      <path
        d="M16 16.8C17.3255 16.8 18.4 15.7255 18.4 14.4C18.4 13.0745 17.3255 12 16 12C14.6745 12 13.6 13.0745 13.6 14.4C13.6 15.7255 14.6745 16.8 16 16.8Z"
        fill={color.primary}
      />
      <path d="M49.6 22.4C52.8 14.4 60.8 12.8 64 14.4" stroke={color.primary} strokeWidth="2.8" strokeLinecap="round" />
      <path
        d="M64 16.8C65.3255 16.8 66.4 15.7255 66.4 14.4C66.4 13.0745 65.3255 12 64 12C62.6745 12 61.6 13.0745 61.6 14.4C61.6 15.7255 62.6745 16.8 64 16.8Z"
        fill={color.primary}
      />
      <path
        d="M25.6 64.8C27.8091 64.8 29.6 63.7255 29.6 62.4C29.6 61.0745 27.8091 60 25.6 60C23.3908 60 21.6 61.0745 21.6 62.4C21.6 63.7255 23.3908 64.8 25.6 64.8Z"
        fill={color.primaryDeep}
      />
      <path
        d="M54.4 64.8C56.6092 64.8 58.4 63.7255 58.4 62.4C58.4 61.0745 56.6092 60 54.4 60C52.1909 60 50.4 61.0745 50.4 62.4C50.4 63.7255 52.1909 64.8 54.4 64.8Z"
        fill={color.primaryDeep}
      />
      <path
        d="M40 67.2C54.1385 67.2 65.6 55.7385 65.6 41.6C65.6 27.4615 54.1385 16 40 16C25.8615 16 14.4 27.4615 14.4 41.6C14.4 55.7385 25.8615 67.2 40 67.2Z"
        fill={color.primary}
      />
      <path
        d="M38.4 60.8C50.7712 60.8 60.8 50.7712 60.8 38.4C60.8 26.0288 50.7712 16 38.4 16C26.0288 16 16 26.0288 16 38.4C16 50.7712 26.0288 60.8 38.4 60.8Z"
        fill={color.primary}
        opacity="0.6"
      />
      <path
        d="M17.6 44.8C19.2 57.6 28.8 65.6 40 65.6C51.2 65.6 60.8 57.6 62.4 44.8"
        fill={color.primary}
        opacity="0.3"
      />
      <path
        d="M40 51.2C47.0692 51.2 52.8 45.4692 52.8 38.4C52.8 31.3308 47.0692 25.6 40 25.6C32.9307 25.6 27.2 31.3308 27.2 38.4C27.2 45.4692 32.9307 51.2 40 51.2Z"
        fill={color.white}
        stroke={color.primaryDeep}
        strokeWidth="2"
      />
      <path
        d="M40 47.2C44.8601 47.2 48.8 43.2601 48.8 38.4C48.8 33.5399 44.8601 29.6 40 29.6C35.1398 29.6 31.2 33.5399 31.2 38.4C31.2 43.2601 35.1398 47.2 40 47.2Z"
        fill={color.ink}
        stroke={color.primary}
        strokeWidth="1.2"
      />
      <path
        d="M37.6 38.8C39.1464 38.8 40.4 37.5464 40.4 36C40.4 34.4536 39.1464 33.2 37.6 33.2C36.0537 33.2 34.8 34.4536 34.8 36C34.8 37.5464 36.0537 38.8 37.6 38.8Z"
        fill={color.white}
      />
      <path
        d="M42.4 42C43.0627 42 43.6 41.4627 43.6 40.8C43.6 40.1373 43.0627 39.6 42.4 39.6C41.7372 39.6 41.2 40.1373 41.2 40.8C41.2 41.4627 41.7372 42 42.4 42Z"
        fill={color.white}
      />
      <path d="M36 54.4C38.4 56.8 41.6 56.8 44 54.4" stroke={color.ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M59.2 36.8C65.6 32 68.8 25.6 67.2 20.8" stroke={color.primary} strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M67.2 23.2C68.5255 23.2 69.6 22.1255 69.6 20.8C69.6 19.4745 68.5255 18.4 67.2 18.4C65.8746 18.4 64.8 19.4745 64.8 20.8C64.8 22.1255 65.8746 23.2 67.2 23.2Z"
        fill={color.primary}
      />
      <path
        d="M22.4 47.2C23.7255 47.2 24.8 46.1255 24.8 44.8C24.8 43.4745 23.7255 42.4 22.4 42.4C21.0745 42.4 20 43.4745 20 44.8C20 46.1255 21.0745 47.2 22.4 47.2Z"
        fill={color.blush}
      />
      <path
        d="M57.6 47.2C58.9254 47.2 60 46.1255 60 44.8C60 43.4745 58.9254 42.4 57.6 42.4C56.2745 42.4 55.2 43.4745 55.2 44.8C55.2 46.1255 56.2745 47.2 57.6 47.2Z"
        fill={color.blush}
      />
    </svg>
  );
}
