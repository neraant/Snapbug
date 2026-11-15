import type { eventWithTime } from "@rrweb/types";
import type {
  BugReportConsoleLogEntryType,
  BugReportNetworkLogEntryType,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

/** Local capture for a demonstration page. The widget does not upload this. */
export type WidgetPreviewCapture = {
  title: string;
  description: string;
  url: string;
  userAgent?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  consoleLogs?: BugReportConsoleLogEntryType[];
  networkLogs?: BugReportNetworkLogEntryType[];
  screenshotUrl: string | null;
  replayEvents: eventWithTime[];
};

export type WidgetConfig = {
  apiKey: string;
  host: string;
  position?: ProjectWidgetSettingModelType["position"];
  buttonLabel?: string;
  theme?: ProjectWidgetSettingModelType["theme"];
  accent?: ProjectWidgetSettingModelType["accent"];
  background?: ProjectWidgetSettingModelType["background"];
  text?: ProjectWidgetSettingModelType["text"];
  mutedText?: ProjectWidgetSettingModelType["mutedText"];
  font?: ProjectWidgetSettingModelType["font"];
  privacy?: Partial<ProjectWidgetSettingModelType["privacy"]>;
  collectVisitorEmail?: boolean;
  /** When set, submit stays in the page and never calls ingest. */
  preview?: (capture: WidgetPreviewCapture) => void;
};

export type ResolvedWidgetOptions = Pick<
  ProjectWidgetSettingModelType,
  "position" | "buttonLabel" | "theme" | "accent" | "privacy" | "background" | "text" | "mutedText" | "font"
> & {
  collectVisitorEmail: boolean;
};

export type RemoteWidgetConfig = Pick<
  ProjectWidgetSettingModelType,
  "position" | "buttonLabel" | "theme" | "accent" | "privacy" | "background" | "text" | "mutedText" | "font"
> & {
  collectVisitorEmail?: boolean;
};
