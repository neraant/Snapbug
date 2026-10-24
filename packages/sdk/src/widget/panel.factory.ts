import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { createField } from "./field.factory";
import { bindPanelActions } from "./panel-action.factory";
import { createPanelElements } from "./panel-element.factory";
import { bindPanelScreenshot } from "./panel-screenshot.factory";
import { bindPanelShell } from "./panel-shell.factory";
import { bindPanelSubmit } from "./panel-submit.factory";
import { COPY } from "./widget-copy.const";

export function createPanel(trigger: HTMLButtonElement, options: ResolvedWidgetOptions) {
  const session = createPanelElements(trigger, options);
  bindPanelActions(session);
  bindPanelScreenshot(session);
  bindPanelSubmit(session);
  appendPanelContent(session);
  bindPanelShell(session);
  return session.panel;
}

function appendPanelContent(session: ReturnType<typeof createPanelElements>) {
  session.screenshotPreviewWrap.append(session.screenshotPreview);
  session.screenshotBlock.append(session.captureScreenshot, session.screenshotPreviewWrap, session.removeScreenshot);
  session.actions.append(session.cancel, session.submit);
  session.intro.append(session.heading, session.subtitle);
  const titleField = createField(COPY.titleLabel, session.title);
  titleField.append(session.titleError);
  const descriptionField = createField(COPY.descriptionLabel, session.description.root);
  descriptionField.append(session.descriptionError);

  session.form.append(session.intro, titleField, descriptionField, session.screenshotBlock, session.actions);
  session.success.append(session.successHeading, session.successShortId, session.successMessage, session.done);
  session.error.append(session.errorHeading, session.errorMessage, session.tryAgain);
  session.panel.append(session.form, session.success, session.error);
}
