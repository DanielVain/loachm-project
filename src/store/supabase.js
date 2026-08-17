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

/**
 * Downscale + re-encode an image to WebP in the browser so uploads stay
 * small and the board loads fast on mobile. Returns a Blob, or null if the
 * file can't/shouldn't be processed (caller then uploads the original).
 */
async function compressImage(file, maxDim = 1600, quality = 0.82) {
    // Animated GIFs would lose their animation if flattened — leave as-is.
    if (!file.type.startsWith("image/") || file.type === "image/gif")
        return null;

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        return null;
    }

    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    return new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/webp", quality),
    );
}

/** Upload a product photo (compressed when possible) and return its public URL. */
export async function uploadProductImage(file) {
    let body = file;
    let ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    let contentType = file.type || "image/jpeg";

    try {
        const compressed = await compressImage(file);
        // Only use the compressed version if it actually saved bytes.
        if (compressed && compressed.size > 0 && compressed.size < file.size) {
            body = compressed;
            ext = "webp";
            contentType = "image/webp";
        }
    } catch {
        // Fall back to the original file on any encoding error.
    }

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
        .from(PRODUCT_BUCKET)
        .upload(path, body, {
            cacheControl: "31536000",
            upsert: false,
            contentType,
        });
    if (error) throw error;
    const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
