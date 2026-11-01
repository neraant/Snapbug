import { useFindBugReportRecent } from "@/client/modules/shared/queries/use-find-bug-report-recent";

const pollIntervalMs = 5000;

export type SdkSetupTestReportConnectionState = "connected" | "listening" | "not-connected";

function resolveConnectionState(
  projectId: string,
  isError: boolean,
  hasReport: boolean,
): SdkSetupTestReportConnectionState {
  if (!projectId || isError) {
    return "not-connected";
  }
  if (hasReport) {
    return "connected";
  }
  return "listening";
}

export function useSdkSetupTestReport(projectId: string) {
  const { data, isError } = useFindBugReportRecent(
    { projectId },
    {
      refetchInterval: (query) => {
        const items = query.state.data;
        if (Array.isArray(items) && items.length > 0) {
          return false;
        }
        return pollIntervalMs;
      },
    },
  );

  const latest = data[0] ?? null;
  const connectionState = resolveConnectionState(projectId, isError, latest !== null);

  return { latest, connectionState };
}
