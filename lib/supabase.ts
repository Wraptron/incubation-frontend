import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dfzfmtthyvwltwwmntmd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDQ5NDYsImV4cCI6MjA4Mzk4MDk0Nn0.SKA2upHjQTN_ME6TMusecLfVlvXHdVkLfyI9RN9dL6c"; // Replace with your actual anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);