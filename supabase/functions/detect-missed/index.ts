import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔥 Environment variables from Supabase Edge Function Secrets
const SUPABASE_URL = Deno.env.get("https://tfyzepwbamhhmvwakjww.supabase.co")!;
const SERVICE_ROLE_KEY = Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeXplcHdiYW1oaG12d2Frand3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM3ODc3OCwiZXhwIjoyMDgwOTU0Nzc4fQ.maKyY7kDm7jEA6rpOOy-aggeoWFSlhjMQda_4I5-gD8")!;
const EXPO_PUSH_URL = Deno.env.get("https://exp.host/--/api/v2/push/send")!;
const EXPO_ACCESS_TOKEN = Deno.env.get("ylJ9Bi9ijU8u3YEON4H-jF9WOWHwY1q8ZyjZic5R")!;

// Create Supabase Server Client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (_req) => {
  try {
    const now = new Date();
    const windowMinutes = 5;

    // Fetch medicine schedules
    const { data: medicines, error } = await supabase
      .from("medicines")
      .select("id, user_id, name, times");

    if (error) throw error;

    const alerts: any[] = [];

    for (const med of medicines || []) {
      const { id: medicine_id, user_id, name, times } = med;
      if (!times) continue;

      for (const t of times) {
        const scheduled = new Date(t);
        const diff = (now.getTime() - scheduled.getTime()) / 60000;

        // Check missed window (1–5 minutes)
        if (diff >= 1 && diff <= windowMinutes) {
          const scheduled_key = `${user_id}|${medicine_id}|${scheduled.toISOString()}`;

          // Check if already logged
          const { data: logs } = await supabase
            .from("medicine_logs")
            .select("id")
            .eq("scheduled_key", scheduled_key);

          if (!logs || logs.length === 0) {
            // Insert missed log
            await supabase.from("medicine_logs").insert([
              {
                user_id,
                medicine_id,
                status: "missed",
                scheduled_key,
                timestamp: now.toISOString(),
              },
            ]);

            // Insert alert entry
            await supabase.from("alerts").insert([
              {
                user_id,
                medicine_id,
                message: `Missed dose: ${name}`,
                severity: "high",
              },
            ]);

            // Get guardian push tokens
            const { data: guardians } = await supabase
              .from("guardians")
              .select("push_token")
              .eq("user_id", user_id);

            const pushMessages = (guardians || [])
              .filter((g) => g.push_token)
              .map((g) => ({
                to: g.push_token,
                sound: "default",
                title: "⏰ Missed Medicine Alert",
                body: `The patient missed their dose: ${name}`,
              }));

            // Send Expo push notification
            if (pushMessages.length) {
              await fetch(EXPO_PUSH_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${EXPO_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(pushMessages),
              });
            }

            alerts.push({ user_id, medicine_id, name });
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, alerts }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
