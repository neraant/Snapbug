import type { AnalyticsEventName, EventPropsMap } from "@workspace/analytics/shared/posthog/types";

// @disabled posthog
// import { PostHog } from "posthog-node";
//
// let client: PostHog | null = null;
//
// function getClient() {
//   if (!client) {
//     client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
//       host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//       flushAt: 1,
//       flushInterval: 0,
//     });
//   }
//   return client;
// }

export function trackServerEvent<T extends AnalyticsEventName>(
  _userId: string,
  _event: T,
  _props: EventPropsMap[T],
  _appName?: "app" | "admin",
) {
  // @disabled posthog
  // if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
  //
  // getClient().capture({
  //   distinctId: userId,
  //   event: event as string,
  //   properties: { ...props, ...(appName ? { app: appName } : {}) },
  // });
}

export async function shutdownAnalytics() {
  // @disabled posthog
  // await client?.shutdown();
  // client = null;
}
