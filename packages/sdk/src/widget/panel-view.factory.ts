import type { PanelSession } from "./panel.types";
import { COPY } from "./widget-copy.const";

export function showPanelForm(session: PanelSession) {
  session.form.hidden = false;
  session.success.hidden = true;
  session.error.hidden = true;
  session.successShortId.textContent = "";
  session.successShortId.hidden = true;
  session.panel.setAttribute("aria-labelledby", session.formHeadingId);
  session.submit.disabled = false;
  session.submit.textContent = COPY.submit;
}

export function showPanelError(session: PanelSession, message: string) {
  session.errorMessage.textContent = message;
  session.form.hidden = true;
  session.success.hidden = true;
  session.error.hidden = false;
  session.panel.setAttribute("aria-labelledby", session.errorHeadingId);
  session.tryAgain.focus();
}
