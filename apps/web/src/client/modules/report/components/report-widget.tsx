import { snapbug } from "@neraant/snapbug";
import { useEffect } from "react";

type ReportWidgetProps = {
  apiKey: string;
};

export function ReportWidget({ apiKey }: ReportWidgetProps) {
  useEffect(() => {
    void snapbug.init({
      apiKey,
      host: window.location.origin,
    });

    return () => {
      snapbug.destroy();
    };
  }, [apiKey]);

  return null;
}
