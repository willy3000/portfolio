// Maps an element's rectangle onto any four projected points with a CSS
// matrix3d. This is what lets real, focusable HTML sit exactly on the 3D
// laptop display at any angle, then grow until it is the page.

// Corners in order: top-left, top-right, bottom-right, bottom-left, as
// [x, y] pixel pairs relative to the element's offset parent.
export function quadToMatrix3d(width, height, corners) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = corners;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  let a;
  let b;
  let d;
  let e;
  let g = 0;
  let h = 0;
  if (Math.abs(dx3) < 1e-6 && Math.abs(dy3) < 1e-6) {
    a = x1 - x0;
    b = x3 - x0;
    d = y1 - y0;
    e = y3 - y0;
  } else {
    const det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) < 1e-9) return null;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    h = (dx1 * dy3 - dx3 * dy1) / det;
    a = x1 - x0 + g * x1;
    b = x3 - x0 + h * x3;
    d = y1 - y0 + g * y1;
    e = y3 - y0 + h * y3;
  }

  // Unit square → quad, pre-scaled so the element's own pixels map in.
  const m = [
    a / width, d / width, 0, g / width,
    b / height, e / height, 0, h / height,
    0, 0, 1, 0,
    x0, y0, 0, 1,
  ];
  return `matrix3d(${m.map((v) => (Number.isFinite(v) ? v.toFixed(8) : 0)).join(',')})`;
}
