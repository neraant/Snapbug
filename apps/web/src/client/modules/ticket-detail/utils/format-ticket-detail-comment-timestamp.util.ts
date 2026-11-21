import {
  formatTicketDetailExactWhen,
  formatTicketDetailWhen,
} from "@/client/modules/ticket-detail/utils/format-ticket-detail-timestamp.util";

export function formatTicketDetailCommentWhen(isoDate: string, timeZone: string): string {
  return formatTicketDetailWhen(isoDate, timeZone);
}

export function formatTicketDetailCommentExactWhen(isoDate: string, timeZone: string): string {
  return formatTicketDetailExactWhen(isoDate, timeZone);
}
