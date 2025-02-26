
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wfmcvjfoaekixcctxltq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbWN2amZvYWVraXhjY3R4bHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MDM4OTksImV4cCI6MjA1NjA3OTg5OX0.1ug_pspVbpsN7bcT6A4BduTSJ4sAzDZRIbgfBsswGiI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
