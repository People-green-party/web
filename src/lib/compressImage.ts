/** Compress/resize an image for profile upload (max edge + JPEG quality). */
export async function compressImageForUpload(
  file: File,
  opts?: { maxEdge?: number; quality?: number; maxBytes?: number },
): Promise<File> {
  const maxEdge = opts?.maxEdge ?? 1200;
  const quality = opts?.quality ?? 0.82;
  const maxBytes = opts?.maxBytes ?? 1.5 * 1024 * 1024;

  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name)) {
    throw new Error("Please choose an image file (JPG/PNG).");
  }

  if (file.size <= maxBytes && (file.type === "image/jpeg" || file.type === "image/png")) {
    return file;
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read this photo. Try JPG/PNG."));
      el.src = url;
    });

    const scale = Math.min(1, maxEdge / Math.max(img.width || 1, img.height || 1));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round((img.width || 1) * scale));
    canvas.height = Math.max(1, Math.round((img.height || 1) * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process photo");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let q = quality;
    let blob: Blob | null = null;
    for (let i = 0; i < 4; i++) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", q));
      if (blob && blob.size <= maxBytes) break;
      q -= 0.12;
    }
    if (!blob) throw new Error("Could not compress photo");

    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}
