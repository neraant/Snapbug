export function isEditableFocusTarget(element: Element | null) {
  if (!element) return false;
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return true;
  }
  if (element instanceof HTMLElement) {
    return element.isContentEditable || element.getAttribute("contenteditable") === "true";
  }
  return false;
}
