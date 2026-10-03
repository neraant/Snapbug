import { db } from "@workspace/database";
import { bugReportTable } from "@workspace/database/schema";
import type { ProjectRow } from "@workspace/database/seed/project";
import type { UserRow } from "@workspace/database/seed/user";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { inArray, type InferInsertModel } from "drizzle-orm";

type BugReportInsert = InferInsertModel<typeof bugReportTable>;

const STORE_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const MARKETING_PROJECT_ID = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
const SAFARI_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const FIREFOX_WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0";

export async function seedBugReport(projects: ProjectRow[], users: UserRow[]) {
  const projectIds = new Set(projects.map((project) => project.id));
  const aliceId = users.find((user) => user.email === "alice@example.com")?.id ?? null;
  const bobId = users.find((user) => user.email === "bob@example.com")?.id ?? null;
  const adminId = users.find((user) => user.email === "admin@example.com")?.id ?? null;

  const bugReportData: BugReportInsert[] = [
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
      projectId: STORE_PROJECT_ID,
      status: BugReportStatus.NEW,
      severity: BugReportSeverity.CRITICAL,
      title: "Pay button throws when the cart is empty",
      description: "Clicking Pay on an empty cart shows a blank page. The shopper cannot get back to the catalog.",
      stepsToReproduce: "1. Open the cart with no items.\n2. Click Pay.",
      reporterEmail: "sam@shopper.test",
      url: "https://store.acme.test/checkout",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1440,
      viewportHeight: 900,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d901/screenshot.png",
      consoleLogs: [
        {
          level: "error",
          message: "TypeError: Cannot read properties of undefined (reading 'price')",
          timestamp: daysAgo(0, 11).toISOString(),
        },
      ],
      networkLogs: [{ method: "POST", url: "https://store.acme.test/api/checkout", status: 500, durationMs: 842 }],
      customContext: { cartItemCount: 0, plan: "guest" },
      createdAt: daysAgo(0, 11),
      updatedAt: daysAgo(0, 11),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d902",
      projectId: STORE_PROJECT_ID,
      assignedTo: aliceId,
      status: BugReportStatus.NEW,
      severity: BugReportSeverity.HIGH,
      title: "Discount code SAVE10 is ignored at checkout",
      description: "The code is accepted in the field, then the total stays the same after Apply.",
      stepsToReproduce: "1. Add any product.\n2. Enter SAVE10 and click Apply.",
      reporterEmail: "nina@shopper.test",
      url: "https://store.acme.test/checkout",
      userAgent: FIREFOX_WINDOWS,
      browser: "Firefox 131",
      os: "Windows",
      device: "desktop",
      viewportWidth: 1366,
      viewportHeight: 768,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d902/screenshot.png",
      networkLogs: [{ method: "POST", url: "https://store.acme.test/api/discounts", status: 200, durationMs: 310 }],
      customContext: { coupon: "SAVE10" },
      createdAt: daysAgo(1, 15),
      updatedAt: daysAgo(1, 15),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d903",
      projectId: STORE_PROJECT_ID,
      assignedTo: bobId,
      status: BugReportStatus.IN_PROGRESS,
      severity: BugReportSeverity.HIGH,
      title: "Changing quantity does not update the order total",
      description: "The line quantity updates, but the summary total keeps the previous amount until a full reload.",
      stepsToReproduce: "1. Add one item.\n2. Increase quantity to 3.\n3. Compare the line price and the summary.",
      reporterEmail: "omar@shopper.test",
      url: "https://store.acme.test/cart",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1280,
      viewportHeight: 800,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d903/screenshot.png",
      hasReplay: true,
      consoleLogs: [
        { level: "warn", message: "Cart total stale after quantity change", timestamp: daysAgo(3, 10).toISOString() },
      ],
      createdAt: daysAgo(3, 10),
      updatedAt: daysAgo(1, 9),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d904",
      projectId: STORE_PROJECT_ID,
      assignedTo: aliceId,
      status: BugReportStatus.IN_PROGRESS,
      severity: BugReportSeverity.MEDIUM,
      title: "Shipping address suggestions never appear",
      description: "Typing a street name leaves the suggestion list empty. Manual entry still works.",
      stepsToReproduce: "1. Open checkout.\n2. Focus the street field and type a city name.",
      reporterEmail: "lea@shopper.test",
      url: "https://store.acme.test/checkout/shipping",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1512,
      viewportHeight: 982,
      networkLogs: [
        { method: "GET", url: "https://store.acme.test/api/address-suggest?q=market", status: 0, durationMs: 8001 },
      ],
      createdAt: daysAgo(4, 16),
      updatedAt: daysAgo(2, 12),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d905",
      projectId: STORE_PROJECT_ID,
      assignedTo: bobId,
      status: BugReportStatus.RESOLVED,
      severity: BugReportSeverity.MEDIUM,
      title: "Sign-in sends the user back to the login page",
      description: "A correct password returns the shopper to /login with no error. Session cookie is missing.",
      stepsToReproduce: "1. Open /login.\n2. Submit a valid account.\n3. Observe the redirect.",
      reporterEmail: "rita@shopper.test",
      url: "https://store.acme.test/login",
      userAgent: FIREFOX_WINDOWS,
      browser: "Firefox 131",
      os: "Windows",
      device: "desktop",
      viewportWidth: 1920,
      viewportHeight: 1080,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d905/screenshot.png",
      consoleLogs: [
        {
          level: "error",
          message: "Set-Cookie rejected: SameSite=None without Secure",
          timestamp: daysAgo(8, 9).toISOString(),
        },
      ],
      createdAt: daysAgo(8, 9),
      updatedAt: daysAgo(2, 18),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d906",
      projectId: STORE_PROJECT_ID,
      status: BugReportStatus.RESOLVED,
      severity: BugReportSeverity.LOW,
      title: "Careers link in the footer returns 404",
      description: "The footer Careers link opens a missing page.",
      url: "https://store.acme.test/",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1440,
      viewportHeight: 900,
      networkLogs: [{ method: "GET", url: "https://store.acme.test/careers", status: 404, durationMs: 90 }],
      createdAt: daysAgo(10, 13),
      updatedAt: daysAgo(6, 11),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d907",
      projectId: STORE_PROJECT_ID,
      assignedTo: adminId,
      status: BugReportStatus.CLOSED,
      severity: BugReportSeverity.LOW,
      title: "Shipping option label says Standart",
      description: "The cheapest shipping option is spelled Standart instead of Standard.",
      stepsToReproduce: "1. Reach the shipping step with a US address.",
      reporterEmail: "ivy@shopper.test",
      url: "https://store.acme.test/checkout/shipping",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1440,
      viewportHeight: 900,
      createdAt: daysAgo(14, 10),
      updatedAt: daysAgo(11, 15),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d908",
      projectId: STORE_PROJECT_ID,
      assignedTo: aliceId,
      status: BugReportStatus.CLOSED,
      severity: BugReportSeverity.CRITICAL,
      title: "Order was charged twice after a timeout",
      description: "The pay request timed out, the shopper retried, and two charges appeared on the card.",
      stepsToReproduce: "1. Pay with a slow connection.\n2. When the spinner exceeds 10s, click Pay again.",
      reporterEmail: "jon@shopper.test",
      url: "https://store.acme.test/checkout/pay",
      userAgent: FIREFOX_WINDOWS,
      browser: "Firefox 131",
      os: "Windows",
      device: "desktop",
      viewportWidth: 1536,
      viewportHeight: 864,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d908/screenshot.png",
      hasReplay: true,
      networkLogs: [
        { method: "POST", url: "https://store.acme.test/api/payments", status: 0, durationMs: 10002 },
        { method: "POST", url: "https://store.acme.test/api/payments", status: 201, durationMs: 640 },
      ],
      customContext: { orderId: "ord_1044" },
      createdAt: daysAgo(12, 19),
      updatedAt: daysAgo(6, 8),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d909",
      projectId: MARKETING_PROJECT_ID,
      status: BugReportStatus.NEW,
      severity: BugReportSeverity.LOW,
      title: "Hero image overflows on a phone-width screen",
      description: "On a narrow viewport the hero image forces horizontal scrolling.",
      stepsToReproduce: "1. Open the homepage at 390px width.",
      reporterEmail: "mia@reader.test",
      url: "https://acme.test/",
      userAgent: SAFARI_IOS,
      browser: "Safari 18",
      os: "iOS",
      device: "mobile",
      viewportWidth: 390,
      viewportHeight: 844,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d909/screenshot.png",
      createdAt: daysAgo(2, 8),
      updatedAt: daysAgo(2, 8),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d90a",
      projectId: MARKETING_PROJECT_ID,
      assignedTo: bobId,
      status: BugReportStatus.IN_PROGRESS,
      severity: BugReportSeverity.MEDIUM,
      title: "Contact form rejects a valid email",
      description: "Submitting the contact form with a normal address returns 422 and the message is not sent.",
      stepsToReproduce: "1. Open /contact.\n2. Fill every field with a valid email.\n3. Submit.",
      reporterEmail: "paul@reader.test",
      url: "https://acme.test/contact",
      userAgent: CHROME_MAC,
      browser: "Chrome 129",
      os: "macOS",
      device: "desktop",
      viewportWidth: 1440,
      viewportHeight: 900,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d90a/screenshot.png",
      hasReplay: true,
      networkLogs: [{ method: "POST", url: "https://acme.test/api/contact", status: 422, durationMs: 180 }],
      createdAt: daysAgo(5, 14),
      updatedAt: daysAgo(3, 11),
    }),
    report({
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d90b",
      projectId: MARKETING_PROJECT_ID,
      assignedTo: aliceId,
      status: BugReportStatus.RESOLVED,
      severity: BugReportSeverity.HIGH,
      title: "Pricing table is blank in Safari",
      description: "The pricing section renders an empty box in Safari. Chrome shows the three plans.",
      stepsToReproduce: "1. Open /pricing in Safari.\n2. Scroll to the plans.",
      reporterEmail: "noah@reader.test",
      url: "https://acme.test/pricing",
      userAgent: SAFARI_IOS,
      browser: "Safari 18",
      os: "iOS",
      device: "mobile",
      viewportWidth: 390,
      viewportHeight: 844,
      screenshotKey: "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d90b/screenshot.png",
      consoleLogs: [
        {
          level: "error",
          message: "TypeError: undefined is not an object (evaluating 'plans.map')",
          timestamp: daysAgo(9, 17).toISOString(),
        },
      ],
      createdAt: daysAgo(9, 17),
      updatedAt: daysAgo(4, 10),
    }),
  ].filter((bugReport) => projectIds.has(bugReport.projectId));

  if (bugReportData.length === 0) return [];

  await db.insert(bugReportTable).values(bugReportData).onConflictDoNothing({ target: bugReportTable.id });

  return db
    .select()
    .from(bugReportTable)
    .where(
      inArray(
        bugReportTable.id,
        bugReportData.map((bugReport) => bugReport.id),
      ),
    );
}

function report(values: BugReportInsert): BugReportInsert {
  return {
    hasReplay: false,
    ...values,
  };
}

function daysAgo(days: number, hour: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date;
}
