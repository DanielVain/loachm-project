// Build-time prerender: fetch the current content from Supabase, render the
// storefront to static HTML, and bake it (plus the content as a CSP-safe JSON
// block) into dist/index.html. This puts the hero — the LCP element — into the
// initial HTML so it paints before the JS bundle boots. The client then seeds
// from the same JSON, re-renders the identical hero, and takes over live.
//
// Runs after `vite build` (client → dist/) and `vite build --ssr` (server →
// dist-ssr/). If the Supabase fetch fails, it falls back to default content so
// the build never breaks.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Public, anon-key values (same as the browser bundle — safe to embed).
const SUPABASE_URL =
    process.env.VITE_SUPABASE_URL || "https://xqqnvixrcfhhzbnysvwq.supabase.co";
const ANON_KEY =
    process.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcW52aXhyY2ZoaHpibnlzdndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjk4MzgsImV4cCI6MjA5NjYwNTgzOH0.tUZ9NjyD9kfh9k6PBu_pgzVIRXJrZOJfEGFUimYK-u0";

async function rest(path) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
    return res.json();
}

async function fetchContent() {
    try {
        const [siteRows, deals] = await Promise.all([
            rest("site_content?id=eq.main&select=data"),
            rest("deals?select=*&order=sort.asc"),
        ]);
        return { site: siteRows?.[0]?.data ?? {}, deals: deals ?? [] };
    } catch (err) {
        console.warn(
            "[prerender] content fetch failed, prerendering defaults:",
            err.message,
        );
        return { site: {}, deals: null };
    }
}

const { render } = await import(
    pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

const content = await fetchContent();
const appHtml = render("/", content);

const indexPath = resolve(root, "dist/index.html");
let html = await readFile(indexPath, "utf8");

// Escape "<" so a stray "</script>" in the data can't break out of the block.
const json = JSON.stringify(content).replace(/</g, "\\u003c");
const stateTag = `<script type="application/json" id="__INITIAL_CONTENT__">${json}</script>`;

if (!html.includes('<div id="root"></div>')) {
    throw new Error("[prerender] could not find <div id=\"root\"></div> to inject into");
}

html = html
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('<script type="module"', `${stateTag}\n    <script type="module"`);

await writeFile(indexPath, html, "utf8");
console.log(
    `[prerender] baked hero HTML + ${content.deals?.length ?? 0} deals into dist/index.html`,
);
