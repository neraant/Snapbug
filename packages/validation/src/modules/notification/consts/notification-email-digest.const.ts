import { z } from "zod";

export const notificationEmailDigests = ["immediately", "hourly", "daily"] as const;

export type NotificationEmailDigest = (typeof notificationEmailDigests)[number];

export const notificationEmailDigestSchema = z.enum(notificationEmailDigests);

/** @deprecated Use `notificationEmailDigests` */
export const notificationEmailDigestValues = notificationEmailDigests;
