export const isStagingApp =
  process.env.NEXT_PUBLIC_APP_ENV === "staging" || process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "staging";
