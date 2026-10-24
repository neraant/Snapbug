import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { createDescriptionEditor } from "./description-editor.factory";
import {
  PANEL_DESCRIPTION_ERROR_ID,
  PANEL_ERROR_HEADING_ID,
  PANEL_FORM_HEADING_ID,
  PANEL_SUCCESS_HEADING_ID,
  PANEL_TITLE_ERROR_ID,
} from "./panel.const";
import type { PanelSession } from "./panel.types";
import { PANEL_ATTR } from "./widget-attribute.const";
import { COPY } from "./widget-copy.const";
import { applyWidgetRootOptions } from "./widget-root.service";

export function createPanelElements(trigger: HTMLButtonElement, options: ResolvedWidgetOptions): PanelSession {
  const panel = document.createElement("div");
  const form = document.createElement("form");
  const intro = document.createElement("div");
  const heading = document.createElement("h2");
  const subtitle = document.createElement("p");
  const title = document.createElement("input");
  const description = createDescriptionEditor();
  const titleError = document.createElement("p");
  const descriptionError = document.createElement("p");
  const actions = document.createElement("div");
  const submit = document.createElement("button");
  const cancel = document.createElement("button");

  configurePanelShell(panel, options);
  configureFormIntro(form, intro, heading, subtitle);
  configureFormFields(form, title, description, titleError, descriptionError, actions, submit, cancel);

  const success = createSuccessBlock();
  const error = createErrorBlock();
  const screenshot = createScreenshotBlock();

  return {
    trigger,
    options,
    panel,
    form,
    intro,
    heading,
    subtitle,
    title,
    titleError,
    description,
    descriptionError,
    actions,
    submit,
    cancel,
    ...success,
    ...error,
    ...screenshot,
    formHeadingId: PANEL_FORM_HEADING_ID,
    successHeadingId: PANEL_SUCCESS_HEADING_ID,
    errorHeadingId: PANEL_ERROR_HEADING_ID,
    attempt: 0,
    screenshotBlob: null,
    screenshotPreviewUrl: null,
    annotation: null,
    openPanel: () => undefined,
    closePanel: () => undefined,
  };
}

function configurePanelShell(panel: HTMLDivElement, options: ResolvedWidgetOptions) {
  panel.className = "snapbug snapbug-panel";
  applyWidgetRootOptions(panel, options);
  panel.setAttribute(PANEL_ATTR, "");
  panel.setAttribute("aria-hidden", "true");
  panel.inert = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", PANEL_FORM_HEADING_ID);
}

function configureFormIntro(
  form: HTMLFormElement,
  intro: HTMLDivElement,
  heading: HTMLHeadingElement,
  subtitle: HTMLParagraphElement,
) {
  form.className = "snapbug-form";
  intro.className = "snapbug-intro";
  heading.className = "snapbug-heading";
  heading.id = PANEL_FORM_HEADING_ID;
  heading.textContent = COPY.title;
  subtitle.className = "snapbug-subtitle";
  subtitle.textContent = COPY.subtitle;
}

function configureFormFields(
  form: HTMLFormElement,
  title: HTMLInputElement,
  description: ReturnType<typeof createDescriptionEditor>,
  titleError: HTMLParagraphElement,
  descriptionError: HTMLParagraphElement,
  actions: HTMLDivElement,
  submit: HTMLButtonElement,
  cancel: HTMLButtonElement,
) {
  form.noValidate = true;
  title.className = "snapbug-input";
  title.placeholder = COPY.titlePlaceholder;
  titleError.className = "snapbug-field-error";
  titleError.id = PANEL_TITLE_ERROR_ID;
  titleError.hidden = true;
  descriptionError.className = "snapbug-field-error";
  descriptionError.id = PANEL_DESCRIPTION_ERROR_ID;
  descriptionError.hidden = true;
  actions.className = "snapbug-actions";
  submit.type = "submit";
  submit.className = "snapbug-primary";
  submit.textContent = COPY.submit;
  cancel.type = "button";
  cancel.className = "snapbug-secondary";
  cancel.textContent = COPY.cancel;
}

function createSuccessBlock() {
  const success = document.createElement("div");
  const successHeading = document.createElement("h2");
  const successShortId = document.createElement("p");
  const successMessage = document.createElement("p");
  const done = document.createElement("button");

  success.className = "snapbug-result";
  success.hidden = true;
  successHeading.className = "snapbug-heading snapbug-heading-success";
  successHeading.id = PANEL_SUCCESS_HEADING_ID;
  successHeading.textContent = COPY.successHeading;
  successShortId.className = "snapbug-message";
  successShortId.hidden = true;
  successMessage.className = "snapbug-message";
  successMessage.textContent = COPY.successMessage;
  done.type = "button";
  done.className = "snapbug-primary";
  done.textContent = COPY.done;

  return { success, successHeading, successShortId, successMessage, done };
}

function createErrorBlock() {
  const error = document.createElement("div");
  const errorHeading = document.createElement("h2");
  const errorMessage = document.createElement("p");
  const tryAgain = document.createElement("button");

  error.className = "snapbug-result";
  error.hidden = true;
  errorHeading.className = "snapbug-heading snapbug-heading-error";
  errorHeading.id = PANEL_ERROR_HEADING_ID;
  errorHeading.textContent = COPY.errorHeading;
  errorMessage.className = "snapbug-message";
  errorMessage.style.whiteSpace = "pre-line";
  errorMessage.textContent = COPY.errorMessage;
  tryAgain.type = "button";
  tryAgain.className = "snapbug-primary";
  tryAgain.textContent = COPY.tryAgain;

  return { error, errorHeading, errorMessage, tryAgain };
}

function createScreenshotBlock() {
  const screenshotBlock = document.createElement("div");
  const captureScreenshot = document.createElement("button");
  const screenshotPreviewWrap = document.createElement("div");
  const screenshotPreview = document.createElement("img");
  const removeScreenshot = document.createElement("button");

  screenshotBlock.className = "snapbug-screenshot-block";
  captureScreenshot.type = "button";
  captureScreenshot.className = "snapbug-secondary";
  captureScreenshot.textContent = COPY.captureScreenshot;
  screenshotPreviewWrap.className = "snapbug-screenshot-preview-wrap";
  screenshotPreviewWrap.hidden = true;
  screenshotPreview.className = "snapbug-screenshot-preview";
  screenshotPreview.alt = "";
  removeScreenshot.type = "button";
  removeScreenshot.className = "snapbug-screenshot-remove";
  removeScreenshot.textContent = COPY.removeScreenshot;
  removeScreenshot.hidden = true;

  return { screenshotBlock, captureScreenshot, screenshotPreviewWrap, screenshotPreview, removeScreenshot };
}
