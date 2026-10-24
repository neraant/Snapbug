const SVG_NS = "http://www.w3.org/2000/svg";

export function rectangleIcon(): SVGElement {
  const svg = createIconSvg();
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("x", "2.5");
  rect.setAttribute("y", "3.5");
  rect.setAttribute("width", "11");
  rect.setAttribute("height", "9");
  rect.setAttribute("rx", "1");
  svg.append(rect);
  return svg;
}

export function enlargeIcon(): SVGElement {
  const svg = createIconSvg();
  const corners = document.createElementNS(SVG_NS, "path");
  corners.setAttribute("d", "M6 2.5 H2.5 V6 M10 2.5 H13.5 V6 M13.5 10 V13.5 H10 M6 13.5 H2.5 V10");
  svg.append(corners);
  return svg;
}

export function closeIcon(): SVGElement {
  const svg = createIconSvg();
  const mark = document.createElementNS(SVG_NS, "path");
  mark.setAttribute("d", "M4 4 L12 12 M12 4 L4 12");
  svg.append(mark);
  return svg;
}

export function arrowIcon(): SVGElement {
  const svg = createIconSvg();
  const shaft = document.createElementNS(SVG_NS, "path");
  shaft.setAttribute("d", "M3 13 L13 3");
  const head = document.createElementNS(SVG_NS, "path");
  head.setAttribute("d", "M7 3 H13 V9");
  svg.append(shaft, head);
  return svg;
}

export function clearIcon(): SVGElement {
  const svg = createIconSvg();
  const lid = document.createElementNS(SVG_NS, "path");
  lid.setAttribute("d", "M3.75 4.5H12.25");
  const handle = document.createElementNS(SVG_NS, "path");
  handle.setAttribute("d", "M6.25 4.5V3.5Q6.25 2.75 7 2.75H9Q9.75 2.75 9.75 3.5V4.5");
  const bin = document.createElementNS(SVG_NS, "path");
  bin.setAttribute("d", "M4.75 4.5V12Q4.75 13 5.75 13H10.25Q11.25 13 11.25 12V4.5");
  svg.append(lid, handle, bin);
  return svg;
}

function createIconSvg(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  return svg;
}
