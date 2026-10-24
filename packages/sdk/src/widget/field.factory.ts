export function createField(labelText: string, control: HTMLElement) {
  const field = document.createElement("label");
  const label = document.createElement("span");

  field.className = "snapbug-field";
  label.className = "snapbug-label";
  label.textContent = labelText;
  field.append(label, control);

  return field;
}

export function createFieldWithError(labelText: string, control: HTMLElement, errorId: string) {
  const field = document.createElement("label");
  const label = document.createElement("span");
  const error = document.createElement("p");

  field.className = "snapbug-field";
  label.className = "snapbug-label";
  label.textContent = labelText;
  error.className = "snapbug-field-error";
  error.id = errorId;
  error.hidden = true;
  field.append(label, control, error);

  return { field, error };
}
