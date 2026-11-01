# @neraant/snapbug

Embeddable Snapbug bug-report widget with screenshot, console, and network capture.

## Install

In this monorepo, add a workspace dependency to your app:

```bash
pnpm add @neraant/snapbug --filter <your-app>
```

## Example

```ts
import { snapbug } from "@neraant/snapbug";

await snapbug.init({
  apiKey: "your-api-key",
  host: "https://your-app.com",
});
```

`apiKey` and `host` are required. `host` is your Snapbug API origin (no trailing slash). Remote project settings are loaded from the API; anything you pass in `init` overrides those defaults.

Optional fields: `position` (`"bottom-right"` | `"bottom-left"`), `buttonLabel`, `theme` (`"auto"` | `"light"` | `"dark"`), `accent`, `background`, `text`, `mutedText`, `font`, and `privacy` (`maskText`, `maskInputs`, `blockSelectors`).

## Session replay and privacy

The widget records the page with [rrweb](https://github.com/rrweb-io/rrweb) and keeps only the **last 30 seconds** in memory (a ring buffer of recent full snapshots, refreshed every 10 seconds). Nothing is sent until the user submits a report.

- **Opt-out per report:** the panel's "Diagnostic Data Included" section has toggles for session replay, console warnings and exceptions, failed network requests, and browser and system environment. Turning a toggle off removes that data from the payload. The page `url` is always sent.
- **Privacy options apply to replay:** `privacy.maskInputs` masks all input values, `privacy.maskText` masks all text, and `privacy.blockSelectors` elements are blocked (not recorded). The widget itself is never recorded.
- **Size limit:** the replay is gzipped (raw JSON if `CompressionStream` is unavailable). If it is still larger than **3 MB**, it is omitted and the report is submitted without it.
- **Transport:** reports with a screenshot or replay are sent as `multipart/form-data` (file field `replay`); otherwise as JSON.
