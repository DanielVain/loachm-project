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
