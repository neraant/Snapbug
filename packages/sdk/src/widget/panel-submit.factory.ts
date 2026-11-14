import { isValidReporterEmail } from "../report/report-context.service";
import { submitReport } from "../report/report-submit.service";
import type { SubmitReportFailure } from "../report/report-submit.types";
import { descriptionPlainLength, isDescriptionEmpty } from "./description/description-markdown.util";
import { PANEL_DESCRIPTION_MIN_LENGTH } from "./panel.const";
import type { PanelSession } from "./panel.types";
import { hidePanelFieldError, showPanelFieldError } from "./panel-field-error.util";
import { clearPanelScreenshot } from "./panel-screenshot.factory";
import { showPanelError, syncPanelSubmitState } from "./panel-view.factory";
import { COPY } from "./widget-copy.const";

export function bindPanelSubmit(session: PanelSession) {
  const hideTitleError = () => hidePanelFieldError(session.title, session.titleError);
  const hideDescriptionError = () => hidePanelFieldError(session.description.editable, session.descriptionError);

  const hideEmailError = () => hidePanelFieldError(session.email.input, session.email.error);

  session.title.addEventListener("input", () => {
    hideTitleError();
    syncPanelSubmitState(session);
  });
  session.title.addEventListener("keyup", hideTitleError);
  session.description.editable.addEventListener("input", () => {
    hideDescriptionError();
    syncPanelSubmitState(session);
  });
  session.email.input.addEventListener("input", hideEmailError);
  syncPanelSubmitState(session);

  session.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    hideTitleError();
    hideDescriptionError();
    hideEmailError();

    const title = session.title.value.trim();
    const description = session.description.getValue();
    let valid = true;

    if (title.length === 0) {
      showPanelFieldError(session.title, session.titleError, COPY.titleRequired);
      valid = false;
    }
    if (isDescriptionEmpty(description)) {
      showPanelFieldError(session.description.editable, session.descriptionError, COPY.descriptionRequired);
      valid = false;
    }
    if (!isDescriptionEmpty(description) && descriptionPlainLength(description) < PANEL_DESCRIPTION_MIN_LENGTH) {
      showPanelFieldError(session.description.editable, session.descriptionError, COPY.descriptionTooShort);
      valid = false;
    }
    const email = session.email.input.value.trim();
    if (email.length > 0 && !isValidReporterEmail(email)) {
      showPanelFieldError(session.email.input, session.email.error, COPY.emailInvalid);
      valid = false;
    }
    if (!valid) return;

    const current = ++session.attempt;
    session.sending = true;
    session.submit.disabled = true;
    session.submit.textContent = COPY.sending;

    try {
      await session.annotation?.flush();
      if (current !== session.attempt) return;

      const shortId = await submitReport({
        title,
        description,
        steps: session.steps.value.trim(),
        severity: session.severity.getValue(),
        email,
        diagnostics: session.diagnostic.getValues(),
        screenshot: session.screenshotBlob,
      });
      if (current !== session.attempt) return;

      session.sending = false;
      clearPanelScreenshot(session);
      showSubmitSuccess(session, shortId);
    } catch (reason) {
      if (current !== session.attempt) return;
      session.sending = false;
      showPanelError(session, submitErrorMessage(reason));
    }
  });
}

function showSubmitSuccess(session: PanelSession, shortId: string | null) {
  if (shortId) {
    session.successShortId.textContent = shortId;
    session.successShortId.hidden = false;
  } else {
    session.successShortId.textContent = "";
    session.successShortId.hidden = true;
  }

  session.form.hidden = true;
  session.error.hidden = true;
  session.success.hidden = false;
  session.panel.setAttribute("aria-labelledby", session.successHeadingId);
  session.done.focus();
}

function submitErrorMessage(reason: unknown) {
  if (reason !== null && typeof reason === "object" && !(reason instanceof Error)) {
    const failure = reason as SubmitReportFailure;
    if (typeof failure.message === "string" && failure.message.trim().length > 0) {
      return `${COPY.errorMessage}\n${failure.message.trim()}`;
    }
  }
  return COPY.errorMessage;
}
