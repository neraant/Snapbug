# @workspace/sdk

Embeddable Snapbug bug-report widget with screenshot, console, and network capture.

## Install

In this monorepo, add a workspace dependency to your app:

```bash
pnpm add @workspace/sdk --filter <your-app>
```

## Example

```ts
import { snapbug } from "@workspace/sdk";

await snapbug.init({
  apiKey: "your-api-key",
  host: "https://your-app.com",
});
```

`apiKey` and `host` are required. `host` is your Snapbug API origin (no trailing slash). Remote project settings are loaded from the API; anything you pass in `init` overrides those defaults.

Optional fields: `position` (`"bottom-right"` | `"bottom-left"`), `buttonLabel`, `theme` (`"auto"` | `"light"` | `"dark"`), `accent`, `background`, `text`, `mutedText`, `font`, and `privacy` (`maskText`, `maskInputs`, `blockSelectors`).
