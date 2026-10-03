"use client";

import type { AnalyticsEventName, EventPropsMap } from "@workspace/analytics/types";

// @disabled posthog
// import posthog from "posthog-js";

export function initAnalyticsClient(_appName: "customer" | "admin") {
  // @disabled posthog
  // if (initialized || typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
  //
  // posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  //   api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  //   person_profiles: "identified_only",
  //   capture_pageview: false,
  //   autocapture: true,
  //   session_recording: {
  //     maskAllInputs: true,
  //     maskTextSelector: "*",
  //   },
  // });
  //
  // posthog.register({ app: appName });
  // initialized = true;
}

export function trackEvent<T extends AnalyticsEventName>(_event: T, _props: EventPropsMap[T]) {
  // @disabled posthog
  // posthog.capture(event, props);
}

export function identifyUser(_userId: string, _props?: Record<string, unknown>) {
  // @disabled posthog
  // if (!userId) return;
  // posthog.identify(userId, props);
}

export function resetAnalytics() {
  // @disabled posthog
  // posthog.reset();
}

export function capturePageview(_url: string) {
  // @disabled posthog
  // posthog.capture("$pageview", { $current_url: url });
}
