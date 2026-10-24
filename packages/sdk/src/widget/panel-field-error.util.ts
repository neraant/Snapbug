export function showPanelFieldError(control: HTMLElement, error: HTMLParagraphElement, message: string) {
  error.textContent = message;
  error.hidden = false;
  control.setAttribute("aria-invalid", "true");
  control.setAttribute("aria-describedby", error.id);
}

export function hidePanelFieldError(control: HTMLElement, error: HTMLParagraphElement) {
  error.hidden = true;
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-describedby");
}
