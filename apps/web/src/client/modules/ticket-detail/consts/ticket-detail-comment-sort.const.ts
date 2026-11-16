export const TicketDetailCommentSort = {
  OLDEST: "oldest",
  NEWEST: "newest",
} as const;

export type TicketDetailCommentSortType = (typeof TicketDetailCommentSort)[keyof typeof TicketDetailCommentSort];
