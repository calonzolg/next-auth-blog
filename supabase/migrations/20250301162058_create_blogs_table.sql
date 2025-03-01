create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title varchar not null,
  content text not null,
  slug text not null,
  user_id uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blogs enable row level security;

create policy "Individuals can see all blogs" on blogs for select using (true);
create policy "Individuals can create blogs" on blogs for insert with check (true);
create policy "Individuals can update blogs" on blogs for update using (auth.uid() = user_id);
create policy "Individuals can delete blogs" on blogs for delete using (auth.uid() = user_id);

alter table blogs
add constraint blogs_user_id_fkey 
foreign key (user_id) references public.profiles(id) on delete cascade;