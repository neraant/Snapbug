import { submitReport } from "../report/report-submit.service";
import type { SubmitReportFailure } from "../report/report-submit.types";
import { isDescriptionEmpty } from "./description-markdown.util";
import type { PanelSession } from "./panel.types";
import { hidePanelFieldError, showPanelFieldError } from "./panel-field-error.util";
import { clearPanelScreenshot } from "./panel-screenshot.factory";
import { showPanelError } from "./panel-view.factory";
import { COPY } from "./widget-copy.const";

export function bindPanelSubmit(session: PanelSession) {
  const hideTitleError = () => hidePanelFieldError(session.title, session.titleError);
  const hideDescriptionError = () => hidePanelFieldError(session.description.editable, session.descriptionError);

  session.title.addEventListener("input", hideTitleError);
  session.title.addEventListener("keyup", hideTitleError);
  session.description.editable.addEventListener("input", hideDescriptionError);

  session.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    hideTitleError();
    hideDescriptionError();

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
    if (!valid) return;

    const current = ++session.attempt;
    session.submit.disabled = true;
    session.submit.textContent = COPY.sending;

    try {
      await session.annotation?.flush();
      if (current !== session.attempt) return;

      const shortId = await submitReport(title, description, session.screenshotBlob);
      if (current !== session.attempt) return;

      clearPanelScreenshot(session);
      showSubmitSuccess(session, shortId);
    } catch (reason) {
      if (current !== session.attempt) return;
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
