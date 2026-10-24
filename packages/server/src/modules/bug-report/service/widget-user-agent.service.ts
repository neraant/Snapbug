export type ParsedWidgetUserAgentType = {
  browser: string | null;
  os: string | null;
  device: string | null;
};

export class WidgetUserAgentService {
  parse(userAgent: string | null | undefined): ParsedWidgetUserAgentType {
    if (!userAgent?.trim()) {
      return { browser: null, os: null, device: null };
    }

    const ua = userAgent;
    const device = this.resolveDevice(ua);
    const os = this.resolveOs(ua);
    const browser = this.resolveBrowser(ua);

    return { browser, os, device };
  }

  private resolveDevice(ua: string): string | null {
    if (/iPad|Tablet|PlayBook|Silk\//i.test(ua)) return "tablet";
    if (/Mobile|Android|iPhone|iPod|IEMobile|Opera Mini/i.test(ua)) return "mobile";
    return "desktop";
  }

  private resolveOs(ua: string): string | null {
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Mac OS X|Macintosh/i.test(ua)) return "macOS";
    if (/Windows NT|Windows/i.test(ua)) return "Windows";
    if (/Android/i.test(ua)) return "Android";
    if (/CrOS/i.test(ua)) return "Chrome OS";
    if (/Linux/i.test(ua)) return "Linux";
    return null;
  }

  private resolveBrowser(ua: string): string | null {
    const edge = ua.match(/Edg\/(\d+)/);
    if (edge) return `Edge ${edge[1]}`;

    const firefox = ua.match(/Firefox\/(\d+)/);
    if (firefox && !/Seamonkey/i.test(ua)) return `Firefox ${firefox[1]}`;

    const chrome = ua.match(/Chrome\/(\d+)/);
    if (chrome && !/Chromium|Edg/i.test(ua)) return `Chrome ${chrome[1]}`;

    const safari = ua.match(/Version\/(\d+)(?:\.\d+)?.*Safari/);
    if (safari) return `Safari ${safari[1]}`;

    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";

    return null;
  }
}
