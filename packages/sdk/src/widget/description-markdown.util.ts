export function isDescriptionEmpty(serialized: string): boolean {
  if (serialized.trim().length === 0) return true;

  const lines = serialized.split("\n");
  for (const line of lines) {
    if (lineHasMeaningfulContent(line)) return false;
  }

  return true;
}

function lineHasMeaningfulContent(line: string): boolean {
  let content = line;
  content = content.replace(/^#{1,3}\s+/, "");
  content = content.replace(/^-\s+/, "");
  content = content.replace(/^\d+\.\s+/, "");
  content = content.replace(/^>\s+/, "");
  content = stripBoldMarkers(content);
  content = stripItalicMarkers(content);
  content = stripLinkMarkers(content);
  return content.trim().length > 0;
}

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*([^*]*)\*\*/g, "$1");
}

function stripItalicMarkers(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

function stripLinkMarkers(text: string): string {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}
