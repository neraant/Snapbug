"use client";

import type { PropsWithChildren } from "react";

import { ReportApiKeyContext } from "@/client/modules/report/hooks/use-report-api-key";

type ReportApiKeyProps = PropsWithChildren<{
  apiKey: string;
}>;

export function ReportApiKey({ apiKey, children }: ReportApiKeyProps) {
  return <ReportApiKeyContext.Provider value={apiKey}>{children}</ReportApiKeyContext.Provider>;
}
