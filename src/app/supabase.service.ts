import { Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: SupabaseClient;
  cellNames = signal<string[]>([]);

  constructor() {
    const { SUPABASE_URL, SUPABASE_KEY } = environment;
    this.supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized:', this.supabase);
    this.getCellsFileNames();
  }

  getCellsFileNames() {
    console.log('Fetching cell file names...');
    this.supabase.storage
      .from('biomatch')
      .list('cells/')
      .then((response) => {
        if (response.data) {
          const cellNames = response.data.map((file) => file.name);
          this.cellNames.set(cellNames);
        }
      });
  }
}
