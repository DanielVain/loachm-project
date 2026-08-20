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

const MIME = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" };

/** Draw a bitmap onto a canvas, downscaled to fit `maxDim`. */
function drawCanvas(bitmap, maxDim) {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return { canvas, ctx };
}

/** True if any pixel is not fully opaque (so the image needs a format with alpha). */
function hasTransparency(ctx, w, h) {
    try {
        const { data } = ctx.getImageData(0, 0, w, h);
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) return true;
        }
        return false;
    } catch {
        return true; // can't tell → assume transparency, keep it safe
    }
}

const encodeAs = (canvas, ext, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, MIME[ext], quality));

/**
 * Choose the best output format the browser can actually produce for this image:
 *   • WebP when supported — small *and* keeps transparency (the ideal case).
 *   • Otherwise (older Safari, which can't export WebP): PNG when the image is
 *     transparent — e.g. a logo — since JPEG would fill the alpha with black;
 *     JPEG for opaque photos, which is a fraction of PNG's size.
 * Deciding once (from the full-size canvas) keeps both variants in one format.
 */
async function chooseFormat(canvas, ctx) {
    const probe = await encodeAs(canvas, "webp", 0.8);
    if (probe && probe.type === "image/webp") return "webp";
    return hasTransparency(ctx, canvas.width, canvas.height) ? "png" : "jpg";
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
 * When the browser can process the image we store TWO variants that share a
 * base name: a full-size one (`…-full.<ext>`, for the lightbox) and a small
 * display one (`…-sm.<ext>`, ~720px, for cards / hero / logos), each WebP where
 * supported or JPEG otherwise. The returned URL is the full variant; smImage()
 * (data/content.js) derives the small one from it, so the rest of the app still
 * passes a single string around. Non-raster files (e.g. animated GIF) fall back
 * to a single original upload — with no `-full` marker, smImage() leaves those
 * untouched.
 */
export async function uploadProductImage(file) {
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const bitmap = await toBitmap(file);

    if (bitmap) {
        try {
            const fullC = drawCanvas(bitmap, 1600);
            const smallC = drawCanvas(bitmap, 720);
            bitmap.close?.();
            if (fullC && smallC) {
                const ext = await chooseFormat(fullC.canvas, fullC.ctx);
                const [full, small] = await Promise.all([
                    encodeAs(fullC.canvas, ext, 0.82),
                    encodeAs(smallC.canvas, ext, 0.8),
                ]);
                if (full?.size > 0 && small?.size > 0) {
                    await uploadBlob(`${base}-full.${ext}`, full, MIME[ext]);
                    await uploadBlob(`${base}-sm.${ext}`, small, MIME[ext]);
                    return publicUrl(`${base}-full.${ext}`);
                }
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
