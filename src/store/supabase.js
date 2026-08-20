/* ───────────────────────────────────────────────────────────────
   Supabase client — loaded lazily.

   The URL and anon key are PUBLIC by design — they ship in every
   browser bundle. What protects your data is Row Level Security
   (see supabase/schema.sql): anyone can read the board, only a
   signed-in admin can write. Env vars override the baked-in
   defaults so you can point at a different project without a build
   change.

   The @supabase/supabase-js SDK is ~50 KB gzipped and isn't needed
   for the first paint (the storefront renders from prerendered HTML +
   seeded content). So we import it dynamically via getSupabase(): it
   stays out of the initial bundle and only loads once we actually talk
   to the backend — after paint for live updates, or in the admin.
   ─────────────────────────────────────────────────────────────── */
const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://xqqnvixrcfhhzbnysvwq.supabase.co";

const SUPABASE_ANON_KEY =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcW52aXhyY2ZoaHpibnlzdndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjk4MzgsImV4cCI6MjA5NjYwNTgzOH0.tUZ9NjyD9kfh9k6PBu_pgzVIRXJrZOJfEGFUimYK-u0";

let clientPromise;

/** Lazily create (once) and return the Supabase client. */
export function getSupabase() {
    if (!clientPromise) {
        clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
            createClient(SUPABASE_URL, SUPABASE_ANON_KEY),
        );
    }
    return clientPromise;
}

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

const MIME = { webp: "image/webp", jpg: "image/jpeg" };

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

const encodeAs = (canvas, ext, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, MIME[ext], quality));

/**
 * Choose the output format: WebP when the browser can export it (small, and it
 * keeps transparency), otherwise JPEG. We never emit PNG — photos as PNG are
 * huge. (Firefox/Chrome export WebP fine; the JPEG path is a safety net for any
 * browser whose canvas can't.) Upload transparent images (e.g. logos) from a
 * WebP-capable browser so their alpha is preserved; opaque photos are fine
 * anywhere. Deciding once (from the full-size canvas) keeps both variants in
 * one format.
 */
async function chooseFormat(canvas) {
    const probe = await encodeAs(canvas, "webp", 0.8);
    return probe && probe.type === "image/webp" ? "webp" : "jpg";
}

async function uploadBlob(path, body, contentType) {
    const supabase = await getSupabase();
    const { error } = await supabase.storage
        .from(PRODUCT_BUCKET)
        .upload(path, body, { cacheControl: "31536000", upsert: false, contentType });
    if (error) throw error;
}

async function publicUrl(path) {
    const supabase = await getSupabase();
    return supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;
}

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
                const ext = await chooseFormat(fullC.canvas);
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
