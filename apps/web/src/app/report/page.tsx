import type { Metadata } from "next";

import { ReportSamplePage } from "@/client/modules/report/components/report-sample-page";
import { texts } from "@/client/modules/report/consts/texts.const";

export const metadata: Metadata = {
  title: texts.sample.title,
};

const fallbackApiKey = "sb_test_store_active";

function resolveReportApiKey(): string {
  const configured = process.env.SNAPBUG_TEST_API_KEY?.trim();
  return configured || fallbackApiKey;
}

export default function Page() {
  return <ReportSamplePage apiKey={resolveReportApiKey()} />;
}
