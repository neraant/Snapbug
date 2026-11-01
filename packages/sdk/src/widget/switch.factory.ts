export type SwitchControl = {
  root: HTMLButtonElement;
  isChecked: () => boolean;
  setChecked: (value: boolean) => void;
};

export function createSwitch(label: string, onChange: (checked: boolean) => void): SwitchControl {
  const root = document.createElement("button");
  const thumb = document.createElement("span");

  root.type = "button";
  root.className = "snapbug-switch";
  root.setAttribute("role", "switch");
  root.setAttribute("aria-label", label);
  thumb.className = "snapbug-switch-thumb";
  root.append(thumb);

  const setChecked = (value: boolean) => {
    root.setAttribute("aria-checked", String(value));
  };
  setChecked(true);

  root.addEventListener("click", () => {
    const next = root.getAttribute("aria-checked") !== "true";
    setChecked(next);
    onChange(next);
  });

  return { root, isChecked: () => root.getAttribute("aria-checked") === "true", setChecked };
}
