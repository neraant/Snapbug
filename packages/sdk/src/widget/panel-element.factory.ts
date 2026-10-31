import type { ResolvedWidgetOptions } from "../core/widget-config.types";
import { createDescriptionEditor } from "./description/description-editor.factory";
import {
  PANEL_DESCRIPTION_ERROR_ID,
  PANEL_ERROR_HEADING_ID,
  PANEL_FORM_HEADING_ID,
  PANEL_SEVERITY_LABEL_ID,
  PANEL_SUCCESS_HEADING_ID,
  PANEL_TITLE_ERROR_ID,
} from "./panel.const";
import type { PanelSession } from "./panel.types";
import { createDiagnosticControl } from "./panel-diagnostic.factory";
import { createEmailControl } from "./panel-email.factory";
import { cameraIcon, checkIcon, closeIcon, trashIcon } from "./panel-icon.factory";
import { createSeverityControl } from "./panel-severity.factory";
import { PANEL_ATTR } from "./widget-attribute.const";
import { COPY } from "./widget-copy.const";
import { applyWidgetRootOptions } from "./widget-root.service";

export function createPanelElements(trigger: HTMLButtonElement, options: ResolvedWidgetOptions): PanelSession {
  const panel = document.createElement("div");
  const form = document.createElement("form");
  const header = document.createElement("div");
  const intro = document.createElement("div");
  const closeButton = document.createElement("button");
  const body = document.createElement("div");
  const heading = document.createElement("h2");
  const subtitle = document.createElement("p");
  const title = document.createElement("input");
  const description = createDescriptionEditor();
  const titleError = document.createElement("p");
  const descriptionError = document.createElement("p");
  const descriptionCounter = document.createElement("span");
  const actions = document.createElement("div");
  const submit = document.createElement("button");
  const cancel = document.createElement("button");

  configurePanelShell(panel, options);
  configureFormIntro(form, header, intro, closeButton, body, heading, subtitle);
  configureFormFields(title, titleError, descriptionError, descriptionCounter, actions, submit, cancel);

  const success = createSuccessBlock();
  const error = createErrorBlock();
  const screenshot = createScreenshotBlock();

  return {
    trigger,
    options,
    panel,
    form,
    header,
    intro,
    closeButton,
    body,
    heading,
    subtitle,
    title,
    titleError,
    description,
    descriptionError,
    descriptionCounter,
    severity: createSeverityControl(PANEL_SEVERITY_LABEL_ID),
    email: createEmailControl(),
    diagnostic: createDiagnosticControl(),
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
    sending: false,
    screenshotBlob: null,
    screenshotToken: 0,
    screenshotDeclined: false,
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
  header: HTMLDivElement,
  intro: HTMLDivElement,
  closeButton: HTMLButtonElement,
  body: HTMLDivElement,
  heading: HTMLHeadingElement,
  subtitle: HTMLParagraphElement,
) {
  form.className = "snapbug-form";
  form.noValidate = true;
  header.className = "snapbug-header";
  intro.className = "snapbug-intro";
  closeButton.type = "button";
  closeButton.className = "snapbug-close";
  closeButton.setAttribute("aria-label", COPY.closeLabel);
  closeButton.title = COPY.closeLabel;
  closeButton.append(closeIcon());
  body.className = "snapbug-body";
  heading.className = "snapbug-heading";
  heading.id = PANEL_FORM_HEADING_ID;
  heading.textContent = COPY.title;
  subtitle.className = "snapbug-subtitle";
  subtitle.textContent = COPY.subtitle;
}

function configureFormFields(
  title: HTMLInputElement,
  titleError: HTMLParagraphElement,
  descriptionError: HTMLParagraphElement,
  descriptionCounter: HTMLSpanElement,
  actions: HTMLDivElement,
  submit: HTMLButtonElement,
  cancel: HTMLButtonElement,
) {
  title.className = "snapbug-input";
  title.placeholder = COPY.titlePlaceholder;
  title.required = true;
  titleError.className = "snapbug-field-error";
  titleError.id = PANEL_TITLE_ERROR_ID;
  titleError.hidden = true;
  descriptionError.className = "snapbug-field-error";
  descriptionError.id = PANEL_DESCRIPTION_ERROR_ID;
  descriptionError.hidden = true;
  descriptionCounter.className = "snapbug-counter";
  descriptionCounter.setAttribute("aria-live", "polite");
  actions.className = "snapbug-actions";
  submit.type = "submit";
  submit.className = "snapbug-primary";
  submit.textContent = COPY.submit;
  submit.disabled = true;
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
  const screenshotCaption = document.createElement("div");
  const screenshotActions = document.createElement("div");
  const annotateScreenshot = document.createElement("button");
  const removeScreenshot = document.createElement("button");

  screenshotBlock.className = "snapbug-screenshot-block";
  captureScreenshot.type = "button";
  captureScreenshot.className = "snapbug-secondary snapbug-capture";
  const captureLabel = document.createElement("span");
  captureLabel.className = "snapbug-capture-label";
  captureLabel.textContent = COPY.captureScreenshot;
  captureScreenshot.append(cameraIcon(), captureLabel);
  screenshotPreviewWrap.className = "snapbug-screenshot-preview-wrap";
  screenshotPreviewWrap.hidden = true;
  screenshotPreview.className = "snapbug-screenshot-preview";
  screenshotPreview.alt = "";
  screenshotCaption.className = "snapbug-screenshot-caption";
  screenshotCaption.hidden = true;
  const captionText = document.createElement("span");
  captionText.className = "snapbug-screenshot-caption-text";
  captionText.append(checkIcon(), document.createTextNode(COPY.screenshotCaption));
  screenshotActions.className = "snapbug-screenshot-actions";
  annotateScreenshot.type = "button";
  annotateScreenshot.className = "snapbug-secondary snapbug-annotate";
  annotateScreenshot.textContent = COPY.annotate;
  removeScreenshot.type = "button";
  removeScreenshot.className = "snapbug-icon-button snapbug-screenshot-remove";
  removeScreenshot.setAttribute("aria-label", COPY.removeScreenshot);
  removeScreenshot.title = COPY.removeScreenshot;
  removeScreenshot.append(trashIcon());
  screenshotActions.append(annotateScreenshot, removeScreenshot);
  screenshotCaption.append(captionText, screenshotActions);

  return {
    screenshotBlock,
    captureScreenshot,
    screenshotPreviewWrap,
    screenshotPreview,
    screenshotCaption,
    screenshotActions,
    annotateScreenshot,
    removeScreenshot,
  };
}
