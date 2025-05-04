-- Create storage for images
create policy "Images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'images' );

create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );

create policy "Users can update their own images"
on storage.objects for update
using ( bucket_id = 'images' AND auth.uid() = owner );

create policy "Users can delete their own images"
on storage.objects for delete
using ( bucket_id = 'images' AND auth.uid() = owner );

-- Create table for storing image metadata
create table public.images (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    prompt text,
    url text not null,
    revised_prompt text,
    created_at timestamp with time zone default now(),
    type text not null, -- 'generated', 'edited', or 'variation'
    
    constraint type_check check (type in ('generated', 'edited', 'variation'))
);

-- Enable Row Level Security
alter table public.images enable row level security;

-- Define policies
create policy "Images are viewable by users who created them"
on public.images for select
using (auth.uid() = user_id);

create policy "Images can be inserted by users who created them"
on public.images for insert
with check (auth.uid() = user_id);

create policy "Images can be updated by users who created them"
on public.images for update
using (auth.uid() = user_id);

create policy "Images can be deleted by users who created them"
on public.images for delete
using (auth.uid() = user_id);