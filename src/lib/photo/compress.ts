// src/lib/photo/compress.ts
// Client-side canvas compression (PoolTechTools v5.0 Section 17.1 / 20.1)

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB original
export const MAX_PHOTOS = 2;

export interface CompressedPhoto {
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
}

export function validatePhotoFile(file: File): string | null {
  if (file.size > MAX_PHOTO_BYTES) return "File too large (max 10 MB).";
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) return "Unsupported image type.";
  return null;
}

export async function compressPhoto(file: File, maxDim = 1024, quality = 0.75): Promise<CompressedPhoto> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Compression failed")); return; }
          resolve({ blob, width, height, sizeBytes: blob.size });
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}
