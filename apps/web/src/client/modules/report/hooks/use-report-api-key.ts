"use client";

import { createContext, useContext } from "react";

const fallbackApiKey = "sb_test_store_active";

export const ReportApiKeyContext = createContext(fallbackApiKey);

export function useReportApiKey(): string {
  return useContext(ReportApiKeyContext);
}
