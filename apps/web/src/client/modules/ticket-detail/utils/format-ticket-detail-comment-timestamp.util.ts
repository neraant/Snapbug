import { formatDistance } from "date-fns";

import { formatTicketDetailExactTimestamp } from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

export function formatTicketDetailCommentRelativeTimestamp(isoDate: string): string {
  return formatDistance(new Date(isoDate), new Date(), { addSuffix: true });
}

export function formatTicketDetailCommentExactTimestamp(isoDate: string): string {
  return formatTicketDetailExactTimestamp(isoDate);
}
