/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { createDescriptionEditor } from "./description-editor.factory";

function toolButton(root: HTMLElement, format: string) {
  return root.querySelector<HTMLButtonElement>(`.snapbug-description-tool-${format}`);
}

describe("createDescriptionEditor", () => {
  it("applies bold from the toolbar and syncs pressed state", () => {
    const editor = createDescriptionEditor();
    document.body.append(editor.root);

    editor.editable.value = "hello";
    editor.editable.setSelectionRange(0, 5);
    toolButton(editor.root, "bold")!.click();

    expect(editor.editable.value).toBe("**hello**");
    expect(toolButton(editor.root, "bold")!.getAttribute("aria-pressed")).toBe("true");

    document.body.removeChild(editor.root);
  });

  it("continues a bullet list on Enter", () => {
    const editor = createDescriptionEditor();
    document.body.append(editor.root);

    editor.editable.value = "- item";
    editor.editable.setSelectionRange(6, 6);
    editor.editable.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(editor.editable.value).toBe("- item\n- ");

    document.body.removeChild(editor.root);
  });

  it("trims value and normalizes line endings on read", () => {
    const editor = createDescriptionEditor();
    editor.editable.value = "  line\r\n";
    expect(editor.getValue()).toBe("line");
  });

  it("clears the textarea and hides link popover", () => {
    const editor = createDescriptionEditor();
    document.body.append(editor.root);

    editor.editable.value = "text";
    toolButton(editor.root, "link")!.click();
    const popover = editor.root.querySelector<HTMLElement>(".snapbug-description-link-popover");
    expect(popover?.hidden).toBe(false);

    editor.clear();
    expect(editor.editable.value).toBe("");
    expect(popover?.hidden).toBe(true);

    document.body.removeChild(editor.root);
  });

  it("applies Ctrl+B bold shortcut", () => {
    const editor = createDescriptionEditor();
    document.body.append(editor.root);

    editor.editable.value = "x";
    editor.editable.setSelectionRange(0, 1);
    editor.editable.dispatchEvent(
      new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true, cancelable: true }),
    );

    expect(editor.editable.value).toBe("**x**");

    document.body.removeChild(editor.root);
  });
});
