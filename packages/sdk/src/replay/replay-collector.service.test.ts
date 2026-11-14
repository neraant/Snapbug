/**
 * @vitest-environment jsdom
 */
import { record } from "@rrweb/record";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { widgetState } from "../core/widget-state";
import { startReplayCollector, stopReplayCollector } from "./replay-collector.service";

vi.mock("@rrweb/record", () => ({
  record: vi.fn().mockReturnValue(() => {}),
}));

beforeEach(() => {
  widgetState.privacy = null;
  stopReplayCollector();
});

describe("startReplayCollector", () => {
  it("masks password inputs even when input masking is turned off", () => {
    widgetState.privacy = {
      maskText: false,
      maskInputs: false,
      blockSelectors: [],
    };

    startReplayCollector();

    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({
        maskAllInputs: false,
        maskInputOptions: expect.objectContaining({ password: true }),
      }),
    );
  });

  it("masks all inputs when input masking is turned on", () => {
    widgetState.privacy = {
      maskText: false,
      maskInputs: true,
      blockSelectors: [],
    };

    startReplayCollector();

    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({
        maskAllInputs: true,
        maskInputOptions: expect.objectContaining({ password: true }),
      }),
    );
  });

  it("masks text when masking is enabled", () => {
    widgetState.privacy = {
      maskText: true,
      maskInputs: false,
      blockSelectors: [],
    };

    startReplayCollector();

    expect(record).toHaveBeenCalledWith(
      expect.objectContaining({
        maskTextSelector: "*",
      }),
    );
  });
});
