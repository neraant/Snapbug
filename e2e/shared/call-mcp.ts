import type { APIRequestContext } from "@playwright/test";

export type McpCallResult = {
  status: number;
  body: unknown;
  isError: boolean;
  text: string;
};

function readToolText(body: unknown): { isError: boolean; text: string } {
  if (!body || typeof body !== "object") return { isError: false, text: "" };
  const record = body as {
    result?: { isError?: boolean; content?: { text?: string }[] };
    error?: { message?: string };
  };
  const text = record.result?.content?.[0]?.text ?? record.error?.message ?? "";
  return { isError: record.result?.isError === true || Boolean(record.error), text };
}

function parseBody(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as unknown;
  }

  const dataLine = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .at(-1);
  if (!dataLine) return trimmed;
  return JSON.parse(dataLine.slice("data:".length).trim()) as unknown;
}

export async function callMcpTool(
  request: APIRequestContext,
  token: string,
  name: string,
  args: Record<string, unknown>,
): Promise<McpCallResult> {
  const response = await request.post("/api/mcp", {
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "x-api-key": token,
    },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    },
  });
  const raw = await response.text();
  let body: unknown = raw;
  try {
    body = parseBody(raw);
  } catch {
    body = raw;
  }
  const tool = readToolText(body);
  return { status: response.status(), body, isError: tool.isError, text: tool.text };
}
