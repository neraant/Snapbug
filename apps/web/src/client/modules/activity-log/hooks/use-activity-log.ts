import { useFindActivityLogs } from "@/client/modules/shared/queries/use-find-activity-logs";

export function useActivityLog() {
  const { data } = useFindActivityLogs();

  return { entries: data };
}
