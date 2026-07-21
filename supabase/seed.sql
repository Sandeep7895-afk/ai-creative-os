-- ============================================================================
-- Local development seed data. Never run against production.
-- Requires an auth.users row to already exist (create one via Supabase
-- Studio → Authentication, or `supabase auth admin` locally) — profiles are
-- created automatically by the on_auth_user_created trigger.
-- Replace :owner_id below with that user's UUID before running.
-- ============================================================================

-- Example:
-- \set owner_id '00000000-0000-0000-0000-000000000000'

update profiles set role = 'ADMIN' where id = :'owner_id';

insert into workspaces (id, name, slug, owner_id) values
  (gen_random_uuid(), 'Hanuman Channel', 'hanuman-channel', :'owner_id'),
  (gen_random_uuid(), 'Motivation', 'motivation', :'owner_id'),
  (gen_random_uuid(), 'AI Facts', 'ai-facts', :'owner_id');

insert into workspace_members (workspace_id, user_id, role)
  select id, :'owner_id', 'ADMIN' from workspaces where owner_id = :'owner_id';

update profiles set active_workspace_id = (select id from workspaces where slug = 'hanuman-channel')
  where id = :'owner_id';
