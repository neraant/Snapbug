export const playgroundCaptureTabs = {
  overview: "overview",
  screenshot: "screenshot",
  replay: "replay",
  console: "console",
  network: "network",
  environment: "environment",
} as const;

export type PlaygroundCaptureTab = (typeof playgroundCaptureTabs)[keyof typeof playgroundCaptureTabs];
