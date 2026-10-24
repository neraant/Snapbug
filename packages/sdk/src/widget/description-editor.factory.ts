import {
  HEADING_CLASS,
  HEADING_LEVEL_1_CLASS,
  HEADING_LEVEL_2_CLASS,
  HEADING_LEVEL_3_CLASS,
  headingLevelFromBlock,
  LINK_CLASS,
  LIST_OL_CLASS,
  LIST_UL_CLASS,
  QUOTE_CLASS,
  serializeDescriptionFromDom,
} from "./description-markdown.util";
import { COPY } from "./widget-copy.const";

export type DescriptionEditorControl = {
  root: HTMLElement;
  editable: HTMLDivElement;
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
  const linkPopover = createLinkPopover();

  const editable = document.createElement("div");
  editable.className = "snapbug-textarea snapbug-description-editable";
  editable.contentEditable = "true";
  editable.setAttribute("role", "textbox");
  editable.setAttribute("aria-multiline", "true");
  editable.dataset.placeholder = COPY.descriptionPlaceholder;

  const syncEmpty = () => {
    const empty = editable.textContent?.trim().length === 0 && editable.querySelector("img") === null;
    editable.classList.toggle("snapbug-description-editable-empty", empty);
  };

  const syncToolbar = () => {
    syncEmpty();
    updateToolbarState(editable, {
      boldButton,
      italicButton,
      bulletListButton,
      numberedListButton,
      quoteButton,
      linkButton,
      headingMenu,
    });
  };

  let toolbarSelection: Range | null = null;

  const captureToolbarSelection = () => {
    const saved = saveEditorSelection(editable);
    if (saved) toolbarSelection = saved;
  };

  const runWithEditorSelection = (action: () => void) => {
    restoreEditorSelection(editable, toolbarSelection);
    action();
    toolbarSelection = null;
    syncToolbar();
  };

  toolbar.addEventListener("mousedown", (event) => {
    event.preventDefault();
    captureToolbarSelection();
  });

  editable.addEventListener("focus", () => {
    editable.classList.add("snapbug-description-editable-focused");
  });
  editable.addEventListener("blur", () => {
    editable.classList.remove("snapbug-description-editable-focused");
    syncEmpty();
  });
  editable.addEventListener("input", syncToolbar);
  editable.addEventListener("keyup", syncToolbar);
  editable.addEventListener("mouseup", () => {
    captureToolbarSelection();
    syncToolbar();
  });
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    if (!selection?.anchorNode || !editable.contains(selection.anchorNode)) return;
    syncToolbar();
  });

  bindToolButton(boldButton, () => {
    runWithEditorSelection(() => {
      document.execCommand("bold");
    });
  });

  bindToolButton(italicButton, () => {
    runWithEditorSelection(() => {
      document.execCommand("italic");
    });
  });

  bindToolButton(bulletListButton, () => {
    runWithEditorSelection(() => {
      document.execCommand("insertUnorderedList");
      normalizeListClasses(editable);
    });
  });

  bindToolButton(numberedListButton, () => {
    runWithEditorSelection(() => {
      document.execCommand("insertOrderedList");
      normalizeListClasses(editable);
    });
  });

  bindToolButton(quoteButton, () => {
    runWithEditorSelection(() => {
      toggleQuoteBlock(editable);
    });
  });

  bindToolButton(linkButton, () => {
    const selectionRange = toolbarSelection;
    restoreEditorSelection(editable, selectionRange);
    linkPopover.open(editable, selectionRange);
    toolbarSelection = null;
    syncToolbar();
  });

  toolbar.append(
    boldButton,
    italicButton,
    bulletListButton,
    numberedListButton,
    headingMenu.root,
    linkButton,
    quoteButton,
  );
  root.append(toolbar, linkPopover.element, editable);

  headingMenu.bind(editable, runWithEditorSelection, syncToolbar);
  linkPopover.bindApply(editable, syncToolbar);

  syncToolbar();

  return {
    root,
    editable,
    getValue: () => serializeDescriptionFromDom(editable),
    clear: () => {
      editable.innerHTML = "";
      linkPopover.close();
      headingMenu.close();
      syncToolbar();
    },
  };
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

function bindToolButton(button: HTMLButtonElement, action: () => void) {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    action();
  });
}

function saveEditorSelection(editable: HTMLDivElement): Range | null {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  if (!selection.anchorNode || !editable.contains(selection.anchorNode)) return null;
  return selection.getRangeAt(0).cloneRange();
}

function restoreEditorSelection(editable: HTMLDivElement, range: Range | null) {
  editable.focus();
  if (!range) return;
  const selection = document.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
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

  let editableRef: HTMLDivElement | null = null;
  let syncRef: (() => void) | null = null;

  const close = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  };

  const bind = (
    editable: HTMLDivElement,
    runWithEditorSelection: (action: () => void) => void,
    syncToolbar: () => void,
  ) => {
    editableRef = editable;
    syncRef = syncToolbar;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (panel.hidden) open();
      else close();
    });

    for (const button of optionButtons) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (!editableRef) return;
        const level = Number(button.dataset.level) as 0 | 1 | 2 | 3;
        runWithEditorSelection(() => {
          applyHeadingLevel(editableRef!, level);
          close();
        });
      });
    }

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Node)) return;
      if (root.contains(event.target)) return;
      close();
    });
  };

  const update = (editable: HTMLDivElement) => {
    const level = currentHeadingLevel(editable);
    trigger.setAttribute("aria-pressed", level > 0 ? "true" : "false");
    trigger.classList.toggle("snapbug-description-tool-active", level > 0);
    trigger.textContent = COPY.descriptionToolHeading;

    for (const button of optionButtons) {
      const optionLevel = Number(button.dataset.level);
      button.classList.toggle("snapbug-description-menu-option-active", optionLevel === level);
    }
  };

  return { root, bind, close, update };
}

function createLinkPopover() {
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

  let savedRange: Range | null = null;

  const close = () => {
    element.hidden = true;
    savedRange = null;
  };

  const open = (editable: HTMLDivElement, selectionRange: Range | null) => {
    savedRange = selectionRange;

    const selection = document.getSelection();
    const existingLink = selection ? closestAnchor(editable, selection.anchorNode) : null;
    urlInput.value = existingLink?.getAttribute("href") ?? "https://";
    element.hidden = false;

    urlInput.focus();
    urlInput.select();
  };

  const apply = (editable: HTMLDivElement, syncToolbar: () => void) => {
    editable.focus();
    const selection = document.getSelection();
    if (savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    const url = urlInput.value.trim();
    if (url.length === 0) {
      document.execCommand("unlink");
      close();
      syncToolbar();
      return;
    }

    document.execCommand("createLink", false, url);
    const anchor = selection ? closestAnchor(editable, selection.anchorNode) : null;
    anchor?.classList.add(LINK_CLASS);
    close();
    syncToolbar();
  };

  applyButton.addEventListener("mousedown", (event) => event.preventDefault());
  return {
    element,
    open,
    close,
    bindApply: (editable: HTMLDivElement, syncToolbar: () => void) => {
      applyButton.addEventListener("click", () => apply(editable, syncToolbar));
      urlInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
        if (event.key === "Enter") {
          event.preventDefault();
          apply(editable, syncToolbar);
        }
      });
    },
  };
}

function updateToolbarState(
  editable: HTMLDivElement,
  controls: {
    boldButton: ToolbarButton;
    italicButton: ToolbarButton;
    bulletListButton: ToolbarButton;
    numberedListButton: ToolbarButton;
    quoteButton: ToolbarButton;
    linkButton: ToolbarButton;
    headingMenu: ReturnType<typeof createHeadingMenu>;
  },
) {
  setPressed(controls.boldButton, document.queryCommandState("bold"));
  setPressed(controls.italicButton, document.queryCommandState("italic"));
  setPressed(controls.bulletListButton, document.queryCommandState("insertUnorderedList"));
  setPressed(controls.numberedListButton, document.queryCommandState("insertOrderedList"));
  setPressed(controls.quoteButton, isInQuote(editable));
  setPressed(controls.linkButton, isInLink(editable));
  controls.headingMenu.update(editable);
  normalizeListClasses(editable);
  normalizeQuoteClasses(editable);
  normalizeLinkClasses(editable);
}

function setPressed(button: HTMLButtonElement, active: boolean) {
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.classList.toggle("snapbug-description-tool-active", active);
}

function applyHeadingLevel(editable: HTMLDivElement, level: 0 | 1 | 2 | 3) {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const block = closestTopLevelBlock(editable, selection.anchorNode);
  if (isListItem(block) || isInsideQuote(block, editable)) return;

  if (level === 0) {
    if (block) clearHeadingClasses(block);
    document.execCommand("formatBlock", false, "div");
    const nextBlock = closestTopLevelBlock(editable, selection.anchorNode);
    if (nextBlock) clearHeadingClasses(nextBlock);
    return;
  }

  document.execCommand("formatBlock", false, "div");
  const nextBlock = closestTopLevelBlock(editable, selection.anchorNode);
  if (!nextBlock || isListItem(nextBlock)) return;

  clearHeadingClasses(nextBlock);
  nextBlock.classList.add(HEADING_CLASS);
  if (level === 1) nextBlock.classList.add(HEADING_LEVEL_1_CLASS);
  if (level === 2) nextBlock.classList.add(HEADING_LEVEL_2_CLASS);
  if (level === 3) nextBlock.classList.add(HEADING_LEVEL_3_CLASS);
}

function clearHeadingClasses(block: HTMLElement) {
  block.classList.remove(HEADING_CLASS, HEADING_LEVEL_1_CLASS, HEADING_LEVEL_2_CLASS, HEADING_LEVEL_3_CLASS);
}

function toggleQuoteBlock(editable: HTMLDivElement) {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  if (isInQuote(editable)) {
    document.execCommand("formatBlock", false, "div");
    return;
  }

  document.execCommand("formatBlock", false, "blockquote");
  const block = closestTopLevelBlock(editable, selection.anchorNode);
  block?.classList.add(QUOTE_CLASS);
}

function normalizeListClasses(editable: HTMLDivElement) {
  editable.querySelectorAll("ul").forEach((list) => list.classList.add(LIST_UL_CLASS));
  editable.querySelectorAll("ol").forEach((list) => list.classList.add(LIST_OL_CLASS));
}

function normalizeQuoteClasses(editable: HTMLDivElement) {
  editable.querySelectorAll("blockquote").forEach((quote) => quote.classList.add(QUOTE_CLASS));
}

function normalizeLinkClasses(editable: HTMLDivElement) {
  editable.querySelectorAll("a[href]").forEach((anchor) => anchor.classList.add(LINK_CLASS));
}

function currentHeadingLevel(editable: HTMLDivElement): 0 | 1 | 2 | 3 {
  const selection = document.getSelection();
  if (!selection?.anchorNode) return 0;
  const block = closestTopLevelBlock(editable, selection.anchorNode);
  if (isListItem(block) || isInsideQuote(block, editable)) return 0;
  return headingLevelFromBlock(block);
}

function isInQuote(editable: HTMLDivElement): boolean {
  const selection = document.getSelection();
  if (!selection?.anchorNode) return false;
  let current: Node | null = selection.anchorNode;
  while (current && current !== editable) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName.toLowerCase() === "blockquote" || element.classList.contains(QUOTE_CLASS)) return true;
    }
    current = current.parentNode;
  }
  return false;
}

function isInLink(editable: HTMLDivElement): boolean {
  const selection = document.getSelection();
  if (!selection?.anchorNode) return false;
  return closestAnchor(editable, selection.anchorNode) !== null;
}

function closestAnchor(editable: HTMLDivElement, node: Node | null): HTMLAnchorElement | null {
  let current: Node | null = node;
  while (current && current !== editable) {
    if (current.nodeType === Node.ELEMENT_NODE && (current as HTMLElement).tagName.toLowerCase() === "a") {
      return current as HTMLAnchorElement;
    }
    current = current.parentNode;
  }
  return null;
}

function closestTopLevelBlock(editable: HTMLDivElement, node: Node | null): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== editable) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.parentElement === editable) return element;
      if (element.tagName.toLowerCase() === "li" && element.parentElement?.parentElement === editable) {
        return element;
      }
    }
    current = current.parentNode;
  }
  return null;
}

function isListItem(block: HTMLElement | null): boolean {
  return block?.tagName.toLowerCase() === "li";
}

function isInsideQuote(block: HTMLElement | null, editable: HTMLDivElement): boolean {
  if (!block) return false;
  let current: Node | null = block;
  while (current && current !== editable) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName.toLowerCase() === "blockquote" || element.classList.contains(QUOTE_CLASS)) return true;
    }
    current = current.parentNode;
  }
  return false;
}
