# Row-Level Security (RLS) policy examples

-- Enable RLS on tables after creating them:
-- ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Example policies:
-- Allow users to manage their own profiles
create policy "profiles_self" on profiles
  for all
  using (auth.uid() = id);

-- Allow users to manage their own medicines
create policy "medicines_owner" on medicines
  for all
  using (auth.uid() = user_id);

-- Allow insert to medicine_logs for the logged-in user
create policy "medicine_logs_insert" on medicine_logs
  for insert
  with check (auth.uid() = user_id);

-- For guardians, allow owner to insert and read
create policy "guardians_owner" on guardians
  for all
  using (auth.uid() = user_id);
