export const texts = {
  title: "Set up the SDK",
  description: "Add the Snapbug widget to your app so users can report bugs with screenshots, session replay and logs.",
  docsLink: "Read the docs",
  docsHref: "https://github.com/neraant/Snapbug",
  selectProject: "Select a project in the sidebar to view install steps and the API key for that project.",
  install: {
    title: "1. Install the package",
    description: "Choose your preferred package manager or embed our lightweight CDN script tag.",
    copy: "Copy",
    copied: "Copied",
    tabs: {
      npm: "npm",
      pnpm: "pnpm",
      yarn: "yarn",
      script: "Script tag",
    },
    panelTitle: {
      terminal: "Terminal",
      script: "index.html",
    },
  },
  init: {
    title: "2. Initialize the widget",
    description: "Paste into your application root. Use your project API key and ingestion host.",
    revealKey: "Reveal key",
    maskKey: "Mask key",
    tip: "Call snapbug.init once during client-side hydration. No server-side runtime code is required.",
    tabs: {
      react: "React",
      next: "Next.js",
    },
    panelTitle: {
      react: "src/App.tsx",
      next: "app/providers.tsx",
    },
  },
  apiKey: {
    title: "Project API Key",
    label: "Public Ingestion Key",
    copy: "Copy",
    copied: "Copied",
    show: "Show",
    hide: "Hide",
    created: (date: string) => `Created: ${date}`,
  },
  widgetSettings: {
    title: "Widget settings",
    description: "Configure how the Snapbug trigger looks and what data is masked before reports leave the browser.",
    position: {
      label: "Trigger position",
      bottomRight: "Bottom right",
      bottomLeft: "Bottom left",
    },
    buttonLabel: {
      label: "Trigger button label",
    },
    theme: {
      label: "Theme",
      auto: "Auto",
      light: "Light",
      dark: "Dark",
    },
    accent: {
      label: "Accent color",
      swatchLabel: (color: string) => `Use accent ${color}`,
    },
    privacy: {
      heading: "Privacy",
      maskText: {
        label: "Mask text",
        description: "Redact visible page text that appears in report fields.",
      },
      maskInputs: {
        label: "Mask inputs",
        description: "Redact values from page inputs that appear in report fields.",
      },
      blockSelectors: {
        label: "Block CSS selectors",
        description: "Selectors excluded from masking scans.",
        placeholder: "Add selector",
        removeTag: (selector: string) => `Remove ${selector}`,
      },
    },
  },
  testReport: {
    title: "3. Test report",
    description: "Send a sample report from your app to confirm the widget reaches Snapbug.",
    status: "Waiting for a test report from your site.",
  },
} as const;
