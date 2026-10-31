import { descriptionPlainLength } from "./description/description-markdown.util";
import { PANEL_DESCRIPTION_MIN_LENGTH } from "./panel.const";
import type { PanelSession } from "./panel.types";
import { COPY } from "./widget-copy.const";

export function showPanelForm(session: PanelSession) {
  session.form.hidden = false;
  session.success.hidden = true;
  session.error.hidden = true;
  session.successShortId.textContent = "";
  session.successShortId.hidden = true;
  session.panel.setAttribute("aria-labelledby", session.formHeadingId);
  session.submit.textContent = COPY.submit;
  syncPanelSubmitState(session);
}

/** Updates the description counter and enables Send only when title and description are long enough. */
export function syncPanelSubmitState(session: PanelSession) {
  const length = descriptionPlainLength(session.description.getValue());
  session.descriptionCounter.textContent = COPY.descriptionCounter(length, PANEL_DESCRIPTION_MIN_LENGTH);
  session.descriptionCounter.classList.toggle("snapbug-counter-met", length >= PANEL_DESCRIPTION_MIN_LENGTH);
  session.submit.disabled =
    session.title.value.trim().length === 0 || length < PANEL_DESCRIPTION_MIN_LENGTH || session.sending;
}

export function showPanelError(session: PanelSession, message: string) {
  session.errorMessage.textContent = message;
  session.form.hidden = true;
  session.success.hidden = true;
  session.error.hidden = false;
  session.panel.setAttribute("aria-labelledby", session.errorHeadingId);
  session.tryAgain.focus();
}
