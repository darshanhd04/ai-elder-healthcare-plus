Deploying detect-missed function
-------------------------------

1. Install supabase CLI.
2. From this folder run:
   supabase functions deploy detect-missed --project-ref your-project-ref
3. Set env vars in Supabase for the function:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Schedule the function to run every minute via Supabase Cron (if available) or an external scheduler.
