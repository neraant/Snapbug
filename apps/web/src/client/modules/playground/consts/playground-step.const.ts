export const playgroundSteps = {
  interact: 1,
  report: 2,
  review: 3,
} as const;

export type PlaygroundStep = (typeof playgroundSteps)[keyof typeof playgroundSteps];
