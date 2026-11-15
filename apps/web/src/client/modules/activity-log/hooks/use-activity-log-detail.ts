import { useCallback, useEffect } from "react";

import type { ActivityLogEntry } from "@/client/modules/activity-log/hooks/use-activity-log";

type UseActivityLogDetailInput = {
  entries: ActivityLogEntry[];
  selectedEventId: string | null;
  setSelectedEventId: (eventId: string | null) => void;
};

export function useActivityLogDetail({ entries, selectedEventId, setSelectedEventId }: UseActivityLogDetailInput) {
  const selectedIndex = selectedEventId ? entries.findIndex((entry) => entry.id === selectedEventId) : -1;

  const moveSelection = useCallback(
    (delta: number) => {
      if (entries.length === 0 || selectedIndex < 0) return;
      const nextIndex = selectedIndex + delta;
      const next = entries[nextIndex];
      if (!next) return;
      setSelectedEventId(next.id);
    },
    [entries, selectedIndex, setSelectedEventId],
  );

  useEffect(() => {
    if (!selectedEventId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        moveSelection(1);
      }
      if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        moveSelection(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveSelection, selectedEventId]);

  return {
    selectedIndex,
    canMovePrevious: selectedIndex > 0,
    canMoveNext: selectedIndex >= 0 && selectedIndex < entries.length - 1,
    movePrevious: () => moveSelection(-1),
    moveNext: () => moveSelection(1),
  };
}