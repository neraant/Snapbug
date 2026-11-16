import { formatDistance } from "date-fns";

export function formatProjectLastTicketRelative(lastTicketAt: string | null, noTicketsLabel: string): string {
  if (!lastTicketAt) {
    return noTicketsLabel;
  }

  return formatDistance(new Date(lastTicketAt), new Date(), { addSuffix: true });
}