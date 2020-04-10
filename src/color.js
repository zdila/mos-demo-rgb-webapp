export function hsv2rgb(h, s, v) {
  let r, g, b;

  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }

  const i = Math.floor(h * 6);

  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return [r, g, b];
}

export function rgb2hsv(r, g, b) {
  const minRGB = Math.min(r, Math.min(g, b));
  const maxRGB = Math.max(r, Math.max(g, b));

  // black-gray-white
  if (minRGB == maxRGB) {
    return [0, 0, minRGB];
  }

  // Colors other than black-gray-white:
  const d = r == minRGB ? g - b : b == minRGB ? r - g : b - r;
  const h = r == minRGB ? 3 : b == minRGB ? 1 : 5;
  const hue = ((h - d / (maxRGB - minRGB)) / 6) * 2 * Math.PI;
  const saturation = (maxRGB - minRGB) / maxRGB;
  const value = maxRGB;
  return [hue, saturation, value];
}
