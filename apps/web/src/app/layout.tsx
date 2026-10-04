import "@workspace/design-system/globals.css";

import { ThemeProvider } from "@workspace/design-system/components/theme-provider";
import { Toaster } from "@workspace/design-system/components/ui/toast";
import { cn } from "@workspace/design-system/lib/utils";
import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";

import { QueryProvider } from "@/client/shared/query-client/provider";
import { texts } from "@/shared/consts/texts";

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
