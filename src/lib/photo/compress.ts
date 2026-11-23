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

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [], // RIFF....WEBP — checked separately
};

export async function checkMagicBytes(file: File): Promise<boolean> {
  try {
    const buf = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buf);
    if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (file.type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    if (file.type === "image/webp") {
      // RIFF....WEBP
      return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    }
    return true; // heic and others: skip magic check
  } catch {
    return true;
  }
}

export function validatePhotoFile(file: File): string | null {
  if (file.size > MAX_PHOTO_BYTES) return "File too large (max 10 MB).";
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) return "Unsupported image type.";
  return null;
}

export async function checkStorageQuota(additionalBytes: number): Promise<boolean> {
  if (!navigator.storage?.estimate) return true;
  const est = await navigator.storage.estimate();
  const used = est.usage || 0;
  const quota = est.quota || 0;
  return used + additionalBytes < quota * 0.95;
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
