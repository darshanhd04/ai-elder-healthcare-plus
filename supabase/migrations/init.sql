create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'patient',
  created_at timestamptz default now()
);

create table if not exists medicines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  dosage text,
  times timestamptz[] not null,
  created_at timestamptz default now()
);

create table if not exists medicine_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  medicine_id uuid references medicines(id) on delete cascade,
  status text not null check (status in ('taken','missed')),
  scheduled_key text not null,
  timestamp timestamptz default now()
);

create table if not exists guardians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  phone text,
  push_token text
);

create table if not exists push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  token text not null
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  medicine_id uuid references medicines(id),
  message text,
  severity text default 'info',
  created_at timestamptz default now()
);
