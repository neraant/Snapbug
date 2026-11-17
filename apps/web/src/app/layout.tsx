import "@workspace/design-system/globals.css";

import { ThemeProvider } from "@workspace/design-system/components/theme-provider";
import { Toaster } from "@workspace/design-system/components/ui/toast";
import { cn } from "@workspace/design-system/lib/utils";
import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";

import { USER_PREFERENCE_COOKIE } from "@/client/modules/preference/consts/user-preference-cookie.const";
import { QueryProvider } from "@/client/modules/shared/query-client/provider";
import { texts } from "@/shared/consts/texts.const";
import { buildUserPreferenceBootScript } from "@/shared/user-preference/build-user-preference-boot-script.util";
import { parseUserPreferenceCookie } from "@/shared/user-preference/parse-user-preference-cookie.util";

export const metadata: Metadata = {
  title: {
    default: texts.brand.name,
    template: `%s | ${texts.brand.name}`,
  },
  description: texts.brand.tagline,
};

// @disabled posthog
// import { AnalyticsProvider } from "@workspace/analytics/provider";
// import { AppSpeedInsights } from "@workspace/analytics/speed-insights";
// import { AppWebAnalytics } from "@workspace/analytics/web-analytics";
// import { auth } from "@/auth";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function Layout({ children }: PropsWithChildren) {
  // @disabled posthog
  // const session = await auth();
  const cookieStore = await cookies();
  const preferenceMirror = parseUserPreferenceCookie(cookieStore.get(USER_PREFERENCE_COOKIE)?.value);
  const preferenceBootScript = buildUserPreferenceBootScript(preferenceMirror);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable)}
    >
      {preferenceBootScript ? (
        <head>
          <script dangerouslySetInnerHTML={{ __html: preferenceBootScript }} />
        </head>
      ) : null}
      <body>
        {/* @disabled posthog
        <AnalyticsProvider appName="web" user={session?.user}>
        */}
        <ThemeProvider>
          <Toaster />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        {/* @disabled posthog
        </AnalyticsProvider>
        <AppSpeedInsights />
        <AppWebAnalytics />
        */}
      </body>
    </html>
  );
}
