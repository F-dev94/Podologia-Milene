import { createClient } from '@supabase/supabase-js'

// Novas chaves oficiais do projeto Podologia
const supabaseUrl = 'https://kyhonqyuxaeybcwaxehh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5aG9ucXl1eGFleWJjd2F4ZWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NTYsImV4cCI6MjA4OTg4MTc1Nn0.4waDj_Rv-m7yd4NkrqqgPfhZufLA6uwp9pa6puMjPvo'

export const supabase = createClient(supabaseUrl, supabaseKey)