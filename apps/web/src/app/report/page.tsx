"use client";

import { ReportSamplePage } from "@/client/modules/report/components/report-sample-page";
import { useReportApiKey } from "@/client/modules/report/hooks/use-report-api-key";

export default function Page() {
  const apiKey = useReportApiKey();
  return <ReportSamplePage apiKey={apiKey} />;
}
