import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: SupabaseClient;
  constructor() {
    const { SUPABASE_URL, SUPABASE_KEY } = environment;
    this.supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized:', this.supabase);
  }
}
