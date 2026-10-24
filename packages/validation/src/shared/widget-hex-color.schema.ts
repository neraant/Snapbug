import { z } from "zod";

export const widgetHexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color in the form #RRGGBB");
