import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { createField } from "./field.factory";
import { PANEL_SEVERITY_LABEL_ID } from "./panel.const";
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
  session.screenshotBlock.append(session.captureScreenshot, session.screenshotPreviewWrap, session.screenshotCaption);
  session.actions.append(session.cancel, session.submit);
  session.intro.append(session.heading, session.subtitle);
  session.header.append(session.intro, session.closeButton);

  const titleField = createField(COPY.titleLabel, session.title);
  titleField.append(session.titleError);
  const descriptionField = createDescriptionField(session);
  const stepsField = createField(COPY.stepsLabel, session.steps);
  const severityField = createSeverityField(session);

  session.body.append(
    titleField,
    descriptionField,
    stepsField,
    severityField,
    session.email.root,
    session.screenshotBlock,
    session.diagnostic.root,
  );
  session.form.append(session.header, session.body, session.actions);
  session.success.append(session.successHeading, session.successShortId, session.successMessage, session.done);
  session.error.append(session.errorHeading, session.errorMessage, session.tryAgain);
  session.panel.append(session.form, session.success, session.error);
}

function createDescriptionField(session: ReturnType<typeof createPanelElements>) {
  const field = document.createElement("div");
  const row = document.createElement("div");
  const label = document.createElement("span");
  const mark = document.createElement("span");

  field.className = "snapbug-field";
  row.className = "snapbug-label-row";
  label.className = "snapbug-label";
  label.textContent = COPY.descriptionLabel;
  mark.className = "snapbug-required";
  mark.textContent = COPY.descriptionRequiredMark;
  mark.setAttribute("aria-hidden", "true");
  label.append(" ", mark);
  row.append(label, session.descriptionCounter);
  field.append(row, session.description.root, session.descriptionError);
  return field;
}

function createSeverityField(session: ReturnType<typeof createPanelElements>) {
  const field = document.createElement("div");
  const label = document.createElement("span");

  field.className = "snapbug-field";
  label.className = "snapbug-label";
  label.id = PANEL_SEVERITY_LABEL_ID;
  label.textContent = COPY.severityLabel;
  field.append(label, session.severity.root);
  return field;
}
