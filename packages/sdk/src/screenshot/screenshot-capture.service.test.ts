/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";

import { maskPasswordInputs } from "./screenshot-capture.service";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("maskPasswordInputs", () => {
  it("replaces a password value with bullets so the screenshot never shows it", () => {
    const input = document.createElement("input");
    input.type = "password";
    input.value = "super-secret-password";

    maskPasswordInputs(input);

    expect(input.value).not.toContain("super-secret-password");
    expect(input.value).toBe("•".repeat("super-secret-password".length));
    expect(input.getAttribute("value")).toBe("•".repeat("super-secret-password".length));
  });

  it("keeps an empty password field empty", () => {
    const input = document.createElement("input");
    input.type = "password";
    input.value = "";

    maskPasswordInputs(input);

    expect(input.value).toBe("");
    expect(input.getAttribute("value")).toBeNull();
  });

  it("forces disc rendering so custom CSS cannot reveal the password", () => {
    const input = document.createElement("input");
    input.type = "password";
    input.value = "secret";

    maskPasswordInputs(input);

    expect(input.style.getPropertyValue("-webkit-text-security")).toBe("disc");
  });

  it("does not change non-password inputs", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = "plain text";

    maskPasswordInputs(input);

    expect(input.value).toBe("plain text");
    expect(input.style.getPropertyValue("-webkit-text-security")).toBe("");
  });

  it("masks every password field in a fragment, ignoring other elements", () => {
    const container = document.createElement("div");
    const password = document.createElement("input");
    password.type = "password";
    password.value = "first";
    const text = document.createElement("input");
    text.type = "text";
    text.value = "second";
    container.appendChild(password);
    container.appendChild(text);

    maskPasswordInputs(container);
    maskPasswordInputs(password);
    maskPasswordInputs(text);

    expect(password.value).toBe("•".repeat("first".length));
    expect(text.value).toBe("second");
  });
});
