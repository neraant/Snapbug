import "@workspace/design-system/globals.css";

import { ThemeProvider } from "@workspace/design-system/components/theme-provider";
import { cn } from "@workspace/design-system/lib/utils";
import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";

import { SnapbugWidget } from "@/client/modules/sdk/components/snapbug-widget";
import { texts } from "@/client/modules/shared/consts/texts.const";

export const metadata: Metadata = {
  title: {
    default: texts.brand.name,
    template: `%s | ${texts.brand.name}`,
  },
  description: texts.brand.tagline,
};

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", figtree.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <SnapbugWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
