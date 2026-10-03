import "@workspace/design-system/globals.css";

import { ThemeProvider } from "@workspace/design-system/components/theme-provider";
import { Toaster } from "@workspace/design-system/components/ui/toast";
import { cn } from "@workspace/design-system/lib/utils";
import { Figtree, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/client/shared/query-client/provider";

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

export default function Layout({ children }: PropsWithChildren) {
  // @disabled posthog
  // const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable)}
    >
      <body>
        {/* @disabled posthog
        <AnalyticsProvider appName="customer" user={session?.user}>
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
