import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import type { WidgetPreviewCapture } from "./widget-config.types";

export class WidgetState {
  apiKey: string | null = null;
  host: string | null = null;
  privacy: ProjectWidgetSettingModelType["privacy"] | null = null;
  preview: ((capture: WidgetPreviewCapture) => void) | null = null;
  identifiedEmail: string | null = null;
  collectVisitorEmail = true;
  customContext: Record<string, unknown> | null = null;
  outsideClick: ((event: MouseEvent) => void) | null = null;
  openPanel: (() => void) | null = null;
  closePanel: (() => void) | null = null;
  hotkeyListener: ((event: KeyboardEvent) => void) | null = null;

  takeOutsideClick() {
    const listener = this.outsideClick;
    this.outsideClick = null;
    return listener;
  }

  takeHotkeyListener() {
    const listener = this.hotkeyListener;
    this.hotkeyListener = null;
    return listener;
  }

  clearReport() {
    this.apiKey = null;
    this.host = null;
    this.privacy = null;
    this.preview = null;
    this.identifiedEmail = null;
    this.collectVisitorEmail = true;
    this.customContext = null;
  }
}

export const widgetState = new WidgetState();
