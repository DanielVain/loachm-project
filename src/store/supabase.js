import { createClient } from "@supabase/supabase-js";

/* ───────────────────────────────────────────────────────────────
   Supabase client.

   The URL and anon key are PUBLIC by design — they ship in every
   browser bundle. What protects your data is Row Level Security
   (see supabase/schema.sql): anyone can read the board, only a
   signed-in admin can write. Env vars override the baked-in
   defaults so you can point at a different project without a build
   change.
   ─────────────────────────────────────────────────────────────── */
const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://xqqnvixrcfhhzbnysvwq.supabase.co";

const SUPABASE_ANON_KEY =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcW52aXhyY2ZoaHpibnlzdndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjk4MzgsImV4cCI6MjA5NjYwNTgzOH0.tUZ9NjyD9kfh9k6PBu_pgzVIRXJrZOJfEGFUimYK-u0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const PRODUCT_BUCKET = "product-images";

/** Decode a File to an ImageBitmap, or null if it isn't a processable raster
 * (animated GIFs are skipped so they keep their animation). */
async function toBitmap(file) {
    if (!file.type.startsWith("image/") || file.type === "image/gif")
        return null;
    try {
        return await createImageBitmap(file);
    } catch {
        return null;
    }
}

/** Re-encode a decoded bitmap to a WebP Blob, downscaled to fit `maxDim`. */
async function encodeWebp(bitmap, maxDim, quality) {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/webp", quality),
    );
}

async function uploadBlob(path, body, contentType) {
    const { error } = await supabase.storage
        .from(PRODUCT_BUCKET)
        .upload(path, body, { cacheControl: "31536000", upsert: false, contentType });
    if (error) throw error;
}

const publicUrl = (path) =>
    supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;

/**
 * Upload a product photo and return its public URL.
 *
 * When the browser can process the image we store TWO WebP variants that share
 * a base name: a full-size one (`…-full.webp`, for the lightbox) and a small
 * display one (`…-sm.webp`, ~720px, for cards / hero / logos). The returned URL
 * is the full variant; smImage() (data/content.js) derives the small one from
 * it, so the rest of the app still passes a single string around. Non-raster
 * files (e.g. animated GIF) fall back to a single original upload — with no
 * `-full` marker, smImage() leaves those untouched.
 */
export async function uploadProductImage(file) {
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const bitmap = await toBitmap(file);

    if (bitmap) {
        try {
            const [full, small] = await Promise.all([
                encodeWebp(bitmap, 1600, 0.82),
                encodeWebp(bitmap, 720, 0.8),
            ]);
            bitmap.close?.();
            if (full?.size > 0 && small?.size > 0) {
                await uploadBlob(`${base}-full.webp`, full, "image/webp");
                await uploadBlob(`${base}-sm.webp`, small, "image/webp");
                return publicUrl(`${base}-full.webp`);
            }
        } catch {
            bitmap.close?.();
            // Fall through to the original-file upload below.
        }
    }

    // Fallback: upload the original unchanged (single-variant, no `-full` marker).
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${base}.${ext}`;
    await uploadBlob(path, file, file.type || "image/jpeg");
    return publicUrl(path);
}
