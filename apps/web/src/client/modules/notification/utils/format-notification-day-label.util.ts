import { isToday } from "date-fns";

import { texts } from "@/client/modules/notification/consts/texts.const";

export function formatNotificationDayLabel(createdAt: string): string {
  if (isToday(new Date(createdAt))) return texts.day.today;
  return texts.day.earlier;
}