-- ============================================================================
-- AI Creative OS — initial schema
-- ============================================================================

create extension if not exists "pgcrypto";

create type user_role as enum ('ADMIN', 'USER');
create type prompt_status as enum ('pending', 'generating', 'generated', 'posting', 'posted', 'failed');
create type generation_kind as enum ('video', 'image', 'voice', 'pdf', 'blog');
create type job_status as enum ('queued', 'generating', 'ready', 'failed');
create type publish_platform as enum ('youtube', 'instagram');
create type publish_status as enum ('draft', 'scheduled', 'publishing', 'published', 'failed');
create type api_provider_kind as enum ('video_generation', 'image_generation', 'voice_generation', 'publish_youtube', 'publish_instagram');
create type api_credential_status as enum ('active', 'expiring', 'expired', 'revoked');
create type log_level as enum ('info', 'warning', 'error');
create type asset_kind as enum ('video', 'image', 'audio', 'pdf');

-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role user_role not null default 'USER',
  active_workspace_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add constraint fk_active_workspace foreign key (active_workspace_id) references workspaces(id) on delete set null;

create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role user_role not null default 'USER',
  joined_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- ----------------------------------------------------------------------------
create table prompts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  prompt text not null,
  category text not null default 'general',
  description text,
  hashtags text[] not null default '{}',
  status prompt_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_prompts_workspace on prompts(workspace_id);
create index idx_prompts_status on prompts(status);

create table generation_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  prompt_id uuid references prompts(id) on delete set null,
  kind generation_kind not null,
  provider text not null,
  input_prompt text not null,
  status job_status not null default 'queued',
  progress smallint not null default 0,
  result_url text,
  thumbnail_url text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_jobs_workspace on generation_jobs(workspace_id);

create table publish_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  platform publish_platform not null,
  account_name text not null,
  account_avatar text,
  connected boolean not null default false,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table publish_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  generation_job_id uuid not null references generation_jobs(id) on delete cascade,
  platform publish_platform not null,
  account_id uuid not null references publish_accounts(id) on delete cascade,
  caption text not null default '',
  hashtags text[] not null default '{}',
  scheduled_for timestamptz,
  status publish_status not null default 'draft',
  published_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  actions jsonb not null default '[]',
  related_job_id uuid,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, read);

create table assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  kind asset_kind not null,
  name text not null,
  url text not null,
  thumbnail_url text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create table api_credentials (
  id uuid primary key default gen_random_uuid(),
  provider_kind api_provider_kind not null,
  provider_name text not null,
  encrypted_key text not null,
  status api_credential_status not null default 'active',
  credits_remaining integer,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table system_logs (
  id uuid primary key default gen_random_uuid(),
  level log_level not null,
  source text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_logs_created on system_logs(created_at desc);

create table analytics_daily (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  date date not null,
  views integer not null default 0,
  engagement numeric(5,2) not null default 0,
  unique (workspace_id, date)
);

-- ----------------------------------------------------------------------------
-- Row Level Security — every table scoped to workspace membership.
-- ----------------------------------------------------------------------------
alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table prompts enable row level security;
alter table generation_jobs enable row level security;
alter table publish_accounts enable row level security;
alter table publish_jobs enable row level security;
alter table notifications enable row level security;
alter table assets enable row level security;
alter table api_credentials enable row level security;
alter table system_logs enable row level security;
alter table analytics_daily enable row level security;

create or replace function is_workspace_member(target_workspace_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = target_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN');
$$;

create policy "read own profile" on profiles for select using (id = auth.uid());
create policy "update own profile" on profiles for update using (id = auth.uid());

create policy "members read workspace" on workspaces for select using (is_workspace_member(id));
create policy "owner manage workspace" on workspaces for all using (owner_id = auth.uid());

create policy "members read membership" on workspace_members for select using (is_workspace_member(workspace_id));

create policy "members manage prompts" on prompts for all using (is_workspace_member(workspace_id));
create policy "members manage jobs" on generation_jobs for all using (is_workspace_member(workspace_id));
create policy "members manage publish accounts" on publish_accounts for all using (is_workspace_member(workspace_id));
create policy "members manage publish jobs" on publish_jobs for all using (is_workspace_member(workspace_id));
create policy "members manage assets" on assets for all using (is_workspace_member(workspace_id));
create policy "members read analytics" on analytics_daily for select using (is_workspace_member(workspace_id));

create policy "users read own notifications" on notifications for select using (user_id = auth.uid());
create policy "users update own notifications" on notifications for update using (user_id = auth.uid());

create policy "admin only api credentials" on api_credentials for all using (is_admin());
create policy "admin only system logs" on system_logs for select using (is_admin());

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
