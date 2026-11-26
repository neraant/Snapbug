import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { ReportApiKey } from "@/client/modules/report/components/report-api-key";
import { texts } from "@/client/modules/report/consts/texts.const";

export const metadata: Metadata = {
  title: texts.sample.title,
};

const fallbackApiKey = "sb_test_store_active";

function resolveReportApiKey(): string {
  const configured = process.env.SNAPBUG_TEST_API_KEY?.trim();
  return configured || fallbackApiKey;
}

export default function Layout({ children }: PropsWithChildren) {
  return <ReportApiKey apiKey={resolveReportApiKey()}>{children}</ReportApiKey>;
}
