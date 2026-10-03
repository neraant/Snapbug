import type { AuthEventPropsMap } from "@workspace/analytics/modules/auth/events";

export type EventPropsMap = AuthEventPropsMap;
export type AnalyticsEventName = keyof EventPropsMap;
