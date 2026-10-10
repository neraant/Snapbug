export type FindUserOnboardingStateOutput = {
  onboardingCompletedAt: Date | null;
  suggestedOrganizationName: string;
};

export type UserPort = {
  withTx: (tx: unknown) => UserPort;
  findOnboardingState: (userId: string) => Promise<FindUserOnboardingStateOutput>;
  markOnboardingComplete: (userId: string) => Promise<void>;
};
