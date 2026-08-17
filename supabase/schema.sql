-- ───────────────────────────────────────────────────────────────
-- loachm — Supabase schema for the shared board (deals)
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- ───────────────────────────────────────────────────────────────

create table if not exists public.deals (
    id          text primary key,
    cat         text        not null default '',
    icon        text        not null default 'ShoppingBag',
    name        text        not null default '',
    spec        text        not null default '',
    was         numeric     not null default 0,
    now         numeric     not null default 0,
    stock       integer     not null default 0,
    hot         boolean     not null default false,
    image       text        not null default '',   -- public URL from the 'product-images' bucket
    sort        integer     not null default 0,     -- ordering on the board (lower = first)
    updated_at  timestamptz not null default now()
);

alter table public.deals enable row level security;

-- Anyone (including anonymous visitors) may READ the board.
create policy "deals are public to read"
    on public.deals for select
    using (true);

-- Only signed-in admins may write. (We use Supabase Auth for the admin login.)
create policy "authenticated can insert"
    on public.deals for insert
    to authenticated with check (true);

create policy "authenticated can update"
    on public.deals for update
    to authenticated using (true) with check (true);

create policy "authenticated can delete"
    on public.deals for delete
    to authenticated using (true);

-- ── Storage bucket for product photos ──
-- Create a PUBLIC bucket named 'product-images' in Storage (UI), then:
create policy "product images are public to read"
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy "authenticated can upload product images"
    on storage.objects for insert
    to authenticated with check (bucket_id = 'product-images');

create policy "authenticated can delete product images"
    on storage.objects for delete
    to authenticated using (bucket_id = 'product-images');

-- ── Live updates ──
-- Push board changes to every open browser in real time.
alter publication supabase_realtime add table public.deals;

-- ───────────────────────────────────────────────────────────────
-- Editable site content (ticker, NONSTOP, extras, section texts…).
-- One JSON row, id = 'main'. Hero, phones and hours stay in code.
-- ───────────────────────────────────────────────────────────────
create table if not exists public.site_content (
    id          text primary key,
    data        jsonb       not null default '{}'::jsonb,
    updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "site content public read"
    on public.site_content for select
    using (true);

create policy "site content authenticated insert"
    on public.site_content for insert
    to authenticated with check (true);

create policy "site content authenticated update"
    on public.site_content for update
    to authenticated using (true) with check (true);

alter publication supabase_realtime add table public.site_content;

-- ───────────────────────────────────────────────────────────────
-- Repairs / service log. Contains customer PII (name, phone), so it is
-- ADMIN-ONLY: every operation requires an authenticated session. No public
-- read, unlike deals/site_content.
-- ───────────────────────────────────────────────────────────────
create table if not exists public.repairs (
    id          text primary key,
    item        text        not null default '',
    customer    text        not null default '',
    phone       text        not null default '',
    issue       text        not null default '',
    status      text        not null default 'received',
    price       numeric     not null default 0,
    notes       text        not null default '',
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

alter table public.repairs enable row level security;

create policy "repairs authenticated read"
    on public.repairs for select to authenticated using (true);
create policy "repairs authenticated insert"
    on public.repairs for insert to authenticated with check (true);
create policy "repairs authenticated update"
    on public.repairs for update to authenticated using (true) with check (true);
create policy "repairs authenticated delete"
    on public.repairs for delete to authenticated using (true);

alter publication supabase_realtime add table public.repairs;
