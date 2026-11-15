import { ReportSamplePage } from "@/client/modules/report/components/report-sample-page";

const fallbackApiKey = "sb_test_store_active";

function resolveReportApiKey(): string {
  const configured = process.env.SNAPBUG_TEST_API_KEY?.trim();
  return configured || fallbackApiKey;
}

export default function Page() {
  return <ReportSamplePage apiKey={resolveReportApiKey()} />;
}
