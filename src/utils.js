export function showMatrix(matrix, scale, normalize) {
  const n = matrix.length;
  const canvas = document.createElement('canvas');
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(n, n);

  scale = scale || 8; // Default scale factor

  // Find min/max for normalization
  let min = 0, max = 1;
  if (normalize === true) {
    let min = Infinity, max = -Infinity;
    for (let row of matrix) {
      for (let val of row) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
  }

  // Fill image data
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // Normalize value to [0, 1]
      let v = matrix[y][x];
      v = (v - min) / (max - min || 1);
      const idx = (y * n + x) * 4;
      imgData.data[idx] = imgData.data[idx + 1] = imgData.data[idx + 2] = Math.round(v * 255) ; // grayscale
      imgData.data[idx + 3] = 255; // alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const img = document.createElement('img');
  img.src = canvas.toDataURL();
  img.width = n*scale;
  img.height = n*scale;
  img.style.imageRendering = 'pixelated';
  return img;
}

export async function imageToArray(img) {
  // Ensure the image is decoded & has dimensions
  if (!img.complete || img.naturalWidth === 0) {
    await img.decode(); // throws if the image can't load
  }

  const w = img.naturalWidth, h = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);

  const out = new Array(h);
  let i = 0;
  for (let y = 0; y < h; y++) {
    const row = new Array(w);
    for (let x = 0; x < w; x++) {
      row[x] = [data[i] / 255, data[i + 1] / 255, data[i + 2] / 255, data[i + 3] / 255];
      i += 4;
    }
    out[y] = row;
  }

  // Free backing store ASAP
  canvas.width = canvas.height = 0;
  return out; // [H][W][4]
}