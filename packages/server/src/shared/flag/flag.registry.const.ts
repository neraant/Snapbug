// @disabled flag
import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const flagRegistry = {
  settingsVisible: flag({
    key: "settings-visible",
    description: "Show settings",
    defaultValue: false,
    options: [
      { label: "Off", value: false },
      { label: "On", value: true },
    ],
    adapter: vercelAdapter(),
  }),
};
