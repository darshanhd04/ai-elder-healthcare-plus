Supabase Setup Guide
--------------------

1. Create Supabase project: https://app.supabase.com
2. In Project Settings -> API, copy:
   - SUPABASE_URL (project URL)
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (keep secret, only server-side)
3. Run SQL:
   - Open SQL editor in Supabase UI
   - Paste contents of supabase/migrations/init.sql and run
4. Enable RLS on tables and apply policies from supabase/policies/README.md
   Example:
     ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
     -- then run the policy SQL
5. Deploy Edge Function:
   - Install supabase CLI: https://supabase.com/docs/guides/cli
   - cd supabase/edge_functions/detect-missed
   - supabase functions deploy detect-missed --project-ref your-project-ref
   - Set function environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
6. Scheduling:
   - Use Supabase Cron (if available) or external scheduler to call the function every minute.
   - Alternative: use GitHub Actions cron to curl the function URL every minute (not recommended for free tiers with limits).
7. Expo push notifications:
   - Use Expo push tokens from devices. Save tokens in push_tokens or guardians.push_token.
