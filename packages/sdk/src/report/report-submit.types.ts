export type SubmitReportFailure = {
  message: string;
};

export type ReportSeverity = "low" | "high" | "critical";

export type SubmitReportDiagnostics = {
  replay: boolean;
  console: boolean;
  network: boolean;
  environment: boolean;
};

export type SubmitReportInput = {
  title: string;
  description: string;
  steps: string;
  severity: ReportSeverity;
  email: string;
  diagnostics: SubmitReportDiagnostics;
  screenshot: Blob | null;
};
