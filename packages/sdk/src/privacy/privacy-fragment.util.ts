import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import { MIN_FRAGMENT_LENGTH, REDACTED } from "./privacy.const";

export function collectRedactionFragments(
  privacy: ProjectWidgetSettingModelType["privacy"],
  contextText?: string,
): string[] {
  if (!privacy.maskText && !privacy.maskInputs) return [];

  const fragments = new Set<string>();
  const blockedRoots = queryBlockedRoots(privacy.blockSelectors);

  if (privacy.maskText && typeof document !== "undefined" && document.body) {
    collectTextNodeFragments(document.body, blockedRoots, fragments);
  }

  if (privacy.maskInputs && typeof document !== "undefined") {
    collectInputFragments(blockedRoots, fragments);
  }

  if (contextText && privacy.maskText) {
    addFragment(contextText, fragments);
  }

  return [...fragments]
    .filter((fragment) => fragment.length >= MIN_FRAGMENT_LENGTH)
    .sort((a, b) => b.length - a.length);
}

export function redactFragments(value: string, fragments: readonly string[]): string {
  let result = value;
  for (const fragment of fragments) {
    if (!fragment || fragment.length < MIN_FRAGMENT_LENGTH) continue;
    if (!result.includes(fragment)) continue;
    result = result.split(fragment).join(REDACTED);
  }
  return result;
}

function queryBlockedRoots(selectors: readonly string[]): Element[] {
  const roots: Element[] = [];
  if (typeof document === "undefined") return roots;

  for (const selector of selectors) {
    try {
      document.querySelectorAll(selector).forEach((node) => roots.push(node));
    } catch {
      // ignore invalid selectors
    }
  }
  return roots;
}

function isInsideBlocked(element: Element, blockedRoots: Element[]): boolean {
  return blockedRoots.some((root) => root === element || root.contains(element));
}

function collectTextNodeFragments(root: Element, blockedRoots: Element[], fragments: Set<string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (parent && !isInsideBlocked(parent, blockedRoots)) {
      const text = node.textContent ?? "";
      for (const token of text.split(/\s+/)) {
        addFragment(token, fragments);
      }
    }
    node = walker.nextNode();
  }
}

function collectInputFragments(blockedRoots: Element[], fragments: Set<string>) {
  const fields = document.querySelectorAll("input, textarea, select");
  fields.forEach((field) => {
    if (!(field instanceof HTMLElement) || isInsideBlocked(field, blockedRoots)) return;

    if (field instanceof HTMLInputElement) {
      if (field.type === "password") {
        if (field.value) addFragment(field.value, fragments);
        return;
      }
      if (field.value) addFragment(field.value, fragments);
      return;
    }

    if (field instanceof HTMLTextAreaElement && field.value) {
      addFragment(field.value, fragments);
      return;
    }

    if (field instanceof HTMLSelectElement) {
      const selected = field.options[field.selectedIndex]?.text;
      if (selected) addFragment(selected, fragments);
    }
  });
}

function addFragment(value: string, fragments: Set<string>) {
  const trimmed = value.trim();
  if (trimmed.length >= MIN_FRAGMENT_LENGTH) {
    fragments.add(trimmed);
  }
}
