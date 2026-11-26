import z from "zod";

/** Display names stay short enough for tables, menus, and profile rows. */
export const PERSON_NAME_MAX_LENGTH = 80;

export const personNameSchema = z.string().trim().min(1).max(PERSON_NAME_MAX_LENGTH);
