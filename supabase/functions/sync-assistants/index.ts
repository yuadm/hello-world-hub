import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { applicationId } = await req.json();

    console.log(`[sync-assistants] Starting sync for application: ${applicationId}`);

    // Get application with assistants data
    const { data: application, error: appError } = await supabase
      .from("childminder_applications")
      .select("people_regular_contact")
      .eq("id", applicationId)
      .single();

    if (appError) throw appError;

    const assistants = (application.people_regular_contact as any[]) || [];
    console.log(`[sync-assistants] Found ${assistants.length} assistants in application`);

    const syncResults: any[] = [];

    for (const assistant of assistants) {
      // Check if assistant already exists
      const { data: existingAssistant } = await supabase
        .from("assistant_dbs_tracking")
        .select("*")
        .eq("application_id", applicationId)
        .eq("first_name", assistant.firstName)
        .eq("last_name", assistant.lastName)
        .eq("date_of_birth", assistant.dob)
        .maybeSingle();

      if (existingAssistant) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("assistant_dbs_tracking")
          .update({
            email: assistant.email || existingAssistant.email,
            phone: assistant.phone || existingAssistant.phone,
            role: assistant.role || existingAssistant.role,
          })
          .eq("id", existingAssistant.id);

        if (updateError) {
          console.error(`[sync-assistants] Error updating assistant ${assistant.firstName} ${assistant.lastName}:`, updateError);
        } else {
          syncResults.push({ name: `${assistant.firstName} ${assistant.lastName}`, action: "updated" });
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("assistant_dbs_tracking")
          .insert({
            application_id: applicationId,
            first_name: assistant.firstName,
            last_name: assistant.lastName,
            email: assistant.email,
            phone: assistant.phone,
            role: assistant.role,
            date_of_birth: assistant.dob,
            dbs_status: "not_requested",
            form_status: "not_sent",
          });

        if (insertError) {
          console.error(`[sync-assistants] Error creating assistant ${assistant.firstName} ${assistant.lastName}:`, insertError);
        } else {
          syncResults.push({ name: `${assistant.firstName} ${assistant.lastName}`, action: "created" });
        }
      }
    }

    console.log(`[sync-assistants] Sync complete. Results:`, syncResults);

    return new Response(
      JSON.stringify({ 
        synced: syncResults, 
        total: assistants.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[sync-assistants] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
