import type { EditPatch, EditState } from "./description-edit.util";
import {
  applyLink,
  continueMarkup,
  detectFormat,
  findLinkAt,
  removeLink,
  setHeading,
  toggleInline,
  toggleLines,
} from "./description-edit.util";
import { COPY } from "./widget-copy.const";

export type DescriptionEditorControl = {
  root: HTMLElement;
  editable: HTMLTextAreaElement;
  getValue: () => string;
  clear: () => void;
};

type ToolbarButton = HTMLButtonElement & { format: ToolbarFormat };

type ToolbarFormat = "bold" | "italic" | "bulletList" | "numberedList" | "quote" | "link";

export function createDescriptionEditor(): DescriptionEditorControl {
  const root = document.createElement("div");
  root.className = "snapbug-description-editor";

  const toolbar = document.createElement("div");
  toolbar.className = "snapbug-description-toolbar";

  const textarea = document.createElement("textarea");
  textarea.className = "snapbug-textarea snapbug-description-textarea";
  textarea.placeholder = COPY.descriptionPlaceholder;
  textarea.setAttribute("aria-label", COPY.descriptionLabel);
  textarea.rows = 5;

  const boldButton = createToolButton(COPY.descriptionToolBold, COPY.descriptionBoldLabel, "bold");
  const italicButton = createToolButton(COPY.descriptionToolItalic, COPY.descriptionItalicLabel, "italic");
  const bulletListButton = createToolButton(
    COPY.descriptionToolBulletList,
    COPY.descriptionBulletListLabel,
    "bulletList",
  );
  const numberedListButton = createToolButton(
    COPY.descriptionToolNumberedList,
    COPY.descriptionNumberedListLabel,
    "numberedList",
  );
  const quoteButton = createToolButton(COPY.descriptionToolQuote, COPY.descriptionQuoteLabel, "quote");
  const linkButton = createToolButton(COPY.descriptionToolLink, COPY.descriptionLinkLabel, "link");

  const headingMenu = createHeadingMenu();
  const linkPopover = createLinkPopover(textarea);

  const state = (): EditState => ({
    value: textarea.value,
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  });

  const syncToolbar = () => {
    const format = detectFormat(state());
    setPressed(boldButton, format.bold);
    setPressed(italicButton, format.italic);
    setPressed(bulletListButton, format.bullet);
    setPressed(numberedListButton, format.numbered);
    setPressed(quoteButton, format.quote);
    setPressed(linkButton, format.link);
    headingMenu.update(format.heading);
  };

  const run = (build: (current: EditState) => EditPatch | null) => {
    const patch = build(state());
    if (patch) applyPatch(textarea, patch);
    syncToolbar();
  };

  toolbar.addEventListener("mousedown", (event) => event.preventDefault());

  boldButton.addEventListener("click", () => run((current) => toggleInline(current, "bold")));
  italicButton.addEventListener("click", () => run((current) => toggleInline(current, "italic")));
  bulletListButton.addEventListener("click", () => run((current) => toggleLines(current, "bullet")));
  numberedListButton.addEventListener("click", () => run((current) => toggleLines(current, "numbered")));
  quoteButton.addEventListener("click", () => run((current) => toggleLines(current, "quote")));
  headingMenu.onSelect = (level) => run((current) => setHeading(current, level));

  let linkSelection: EditState | null = null;
  const openLink = () => {
    linkSelection = state();
    const existing = findLinkAt(linkSelection.value, linkSelection.start, linkSelection.end);
    linkPopover.open(existing?.href ?? "https://");
  };
  linkButton.addEventListener("click", () => openLink());
  linkPopover.onApply = (url) => {
    if (!linkSelection) return;
    const patch = url.trim() === "" ? removeLink(linkSelection) : applyLink(linkSelection, url);
    if (patch) applyPatch(textarea, patch);
    linkSelection = null;
    syncToolbar();
  };

  textarea.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    const mod = event.metaKey || event.ctrlKey;
    if (mod && !event.shiftKey && !event.altKey) {
      const key = event.key.toLowerCase();
      if (key === "b") {
        event.preventDefault();
        run((current) => toggleInline(current, "bold"));
        return;
      }
      if (key === "i") {
        event.preventDefault();
        run((current) => toggleInline(current, "italic"));
        return;
      }
      if (key === "k") {
        event.preventDefault();
        openLink();
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey && !mod && !event.altKey) {
      const patch = continueMarkup(state());
      if (!patch) return;
      event.preventDefault();
      applyPatch(textarea, patch);
      syncToolbar();
    }
  });

  for (const type of ["input", "keyup", "mouseup", "focus", "select"] as const) {
    textarea.addEventListener(type, syncToolbar);
  }

  toolbar.append(
    boldButton,
    italicButton,
    bulletListButton,
    numberedListButton,
    headingMenu.root,
    linkButton,
    quoteButton,
  );
  root.append(toolbar, linkPopover.element, textarea);
  syncToolbar();

  return {
    root,
    editable: textarea,
    getValue: () => textarea.value.replaceAll("\r\n", "\n").trim(),
    clear: () => {
      textarea.value = "";
      linkPopover.close();
      headingMenu.close();
      syncToolbar();
    },
  };
}

function applyPatch(textarea: HTMLTextAreaElement, patch: EditPatch) {
  const { value } = textarea;
  const expected = value.slice(0, patch.from) + patch.insert + value.slice(patch.to);

  textarea.focus();
  textarea.setSelectionRange(patch.from, patch.to);

  let done = false;
  try {
    done =
      patch.insert === "" ? document.execCommand("delete") : document.execCommand("insertText", false, patch.insert);
  } catch {
    done = false;
  }
  if (!done || textarea.value !== expected) {
    textarea.value = value;
    textarea.setRangeText(patch.insert, patch.from, patch.to, "end");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
  textarea.setSelectionRange(patch.selStart, patch.selEnd);
}

function createToolButton(label: string, ariaLabel: string, format: ToolbarFormat): ToolbarButton {
  const button = document.createElement("button") as ToolbarButton;
  button.type = "button";
  button.className = `snapbug-description-tool snapbug-description-tool-${format}`;
  button.setAttribute("aria-label", ariaLabel);
  button.setAttribute("title", ariaLabel);
  button.setAttribute("aria-pressed", "false");
  button.textContent = label;
  button.format = format;
  return button;
}

function createHeadingMenu() {
  const root = document.createElement("div");
  root.className = "snapbug-description-menu";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "snapbug-description-tool snapbug-description-heading-trigger";
  trigger.setAttribute("aria-label", COPY.descriptionHeadingMenuLabel);
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("title", COPY.descriptionHeadingMenuLabel);
  trigger.textContent = COPY.descriptionToolHeading;

  const panel = document.createElement("div");
  panel.className = "snapbug-description-menu-panel";
  panel.hidden = true;

  const options: { level: 0 | 1 | 2 | 3; label: string }[] = [
    { level: 0, label: COPY.descriptionHeadingNormal },
    { level: 1, label: COPY.descriptionHeading1 },
    { level: 2, label: COPY.descriptionHeading2 },
    { level: 3, label: COPY.descriptionHeading3 },
  ];

  const optionButtons: HTMLButtonElement[] = [];

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "snapbug-description-menu-option";
    button.dataset.level = String(option.level);
    button.textContent = option.label;
    panel.append(button);
    optionButtons.push(button);
  }

  root.append(trigger, panel);

  let onSelect: (level: 0 | 1 | 2 | 3) => void = () => {};
  let onDocumentClick: ((event: MouseEvent) => void) | null = null;

  const close = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (!onDocumentClick) return;
    document.removeEventListener("click", onDocumentClick, true);
    onDocumentClick = null;
  };

  const open = () => {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    onDocumentClick = (event) => {
      if (!(event.target instanceof Node) || root.contains(event.target)) return;
      close();
    };
    document.addEventListener("click", onDocumentClick, true);
  };

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    if (panel.hidden) open();
    else close();
  });

  for (const button of optionButtons) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const level = Number(button.dataset.level) as 0 | 1 | 2 | 3;
      close();
      onSelect(level);
    });
  }

  const update = (level: 0 | 1 | 2 | 3) => {
    trigger.setAttribute("aria-pressed", level > 0 ? "true" : "false");
    trigger.classList.toggle("snapbug-description-tool-active", level > 0);
    trigger.textContent = COPY.descriptionToolHeading;

    for (const button of optionButtons) {
      const optionLevel = Number(button.dataset.level);
      button.classList.toggle("snapbug-description-menu-option-active", optionLevel === level);
    }
  };

  return {
    root,
    close,
    update,
    set onSelect(handler: (level: 0 | 1 | 2 | 3) => void) {
      onSelect = handler;
    },
  };
}

function createLinkPopover(textarea: HTMLTextAreaElement) {
  const element = document.createElement("div");
  element.className = "snapbug-description-link-popover";
  element.hidden = true;

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.className = "snapbug-input snapbug-description-link-input";
  urlInput.placeholder = COPY.descriptionLinkUrlPlaceholder;
  urlInput.setAttribute("aria-label", COPY.descriptionLinkUrlPlaceholder);

  const applyButton = document.createElement("button");
  applyButton.type = "button";
  applyButton.className = "snapbug-secondary snapbug-description-link-apply";
  applyButton.textContent = COPY.descriptionLinkApply;

  element.append(urlInput, applyButton);

  let onApply: (url: string) => void = () => {};

  const close = () => {
    element.hidden = true;
  };

  const open = (initialUrl: string) => {
    urlInput.value = initialUrl;
    element.hidden = false;
    urlInput.focus();
    urlInput.select();
  };

  const commit = () => {
    const url = urlInput.value;
    onApply(url);
    close();
    textarea.focus();
  };

  applyButton.addEventListener("mousedown", (event) => event.preventDefault());
  applyButton.addEventListener("click", () => commit());
  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      textarea.focus();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
  });

  return {
    element,
    open,
    close,
    set onApply(handler: (url: string) => void) {
      onApply = handler;
    },
  };
}

function setPressed(button: HTMLButtonElement, active: boolean) {
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.classList.toggle("snapbug-description-tool-active", active);
}
