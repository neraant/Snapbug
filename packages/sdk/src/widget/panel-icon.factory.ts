const SVG_NS = "http://www.w3.org/2000/svg";

function icon(paths: string[], extra?: (svg: SVGElement) => void) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  for (const d of paths) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  extra?.(svg);
  return svg;
}

export function closeIcon() {
  return icon(["M18 6 6 18", "m6 6 12 12"]);
}

export function infoIcon() {
  return icon(["M12 16v-4", "M12 8h.01"], (svg) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");
    svg.prepend(circle);
  });
}

export function trashIcon() {
  return icon(["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]);
}

export function checkIcon() {
  return icon(["M20 6 9 17l-5-5"]);
}

export function cameraIcon() {
  return icon(["M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"], (svg) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "13");
    circle.setAttribute("r", "3");
    svg.append(circle);
  });
}
