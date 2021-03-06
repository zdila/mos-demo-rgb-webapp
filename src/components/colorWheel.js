// credits: https://medium.com/@bantic/hand-coding-a-color-wheel-with-canvas-78256c9d7d43
export function drawCircle(canvas) {
  const ctx = canvas.getContext('2d');

  const radius = canvas.width / 2;

  const image = ctx.createImageData(2 * radius, 2 * radius);

  const { data } = image;

  for (let x = -radius; x < radius; x++) {
    for (let y = -radius; y < radius; y++) {
      const { r, phi } = xy2polar(x, y);

      if (r > radius) {
        // skip all (x,y) coordinates that are outside of the circle
        continue;
      }

      // Figure out the starting index of this pixel in the image data array.
      const rowLength = 2 * radius;

      // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
      const adjustedX = x + radius;

      // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
      const adjustedY = y + radius;

      // each pixel requires 4 slots in the data array
      const pixelWidth = 4;

      const index = (adjustedX + adjustedY * rowLength) * pixelWidth;

      const [red, green, blue] = hsv2rgb(rad2deg(phi), r / radius, 1.0);

      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
      data[index + 3] = 255; // alpha
    }
  }

  ctx.putImageData(image, 0, 0);
}

function xy2polar(x, y) {
  return { r: Math.sqrt(x * x + y * y), phi: Math.atan2(y, x) };
}

// rad in [-π, π] range
// return degree in [0, 360] range
function rad2deg(rad) {
  return ((rad + Math.PI) / (2 * Math.PI)) * 360;
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
function hsv2rgb(hue, saturation, value) {
  const chroma = value * saturation;

  const hue1 = hue / 60;

  const x = chroma * (1 - Math.abs((hue1 % 2) - 1));

  let r1, g1, b1;

  if (hue1 >= 0 && hue1 <= 1) {
    [r1, g1, b1] = [chroma, x, 0];
  } else if (hue1 >= 1 && hue1 <= 2) {
    [r1, g1, b1] = [x, chroma, 0];
  } else if (hue1 >= 2 && hue1 <= 3) {
    [r1, g1, b1] = [0, chroma, x];
  } else if (hue1 >= 3 && hue1 <= 4) {
    [r1, g1, b1] = [0, x, chroma];
  } else if (hue1 >= 4 && hue1 <= 5) {
    [r1, g1, b1] = [x, 0, chroma];
  } else if (hue1 >= 5 && hue1 <= 6) {
    [r1, g1, b1] = [chroma, 0, x];
  }

  const m = value - chroma;

  const [r, g, b] = [r1 + m, g1 + m, b1 + m];

  // Change r,g,b values from [0,1] to [0,255]
  return [255 * r, 255 * g, 255 * b];
}
