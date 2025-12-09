import { createClient } from '@supabase/supabase-js';
import { CollectionItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local CSV data.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mapeia os dados do banco para o formato da aplicação
const mapFromDB = (dbItem: any): CollectionItem => ({
  id: dbItem.id,
  material: dbItem.material || '',
  adicionadoEm: dbItem['adicionado em'] || '',
  moveisVolumosos: dbItem.moveis_volumosos || '',
  obs: dbItem.obs || '',
  encaminharPara: dbItem.encaminhar_para || '',
  cidade: dbItem.cidade || ''
});

// Mapeia os dados da aplicação para o formato do banco
const mapToDB = (item: Omit<CollectionItem, 'id'>) => ({
  material: item.material,
  'adicionado em': item.adicionadoEm,
  moveis_volumosos: item.moveisVolumosos,
  obs: item.obs,
  encaminhar_para: item.encaminharPara,
  cidade: item.cidade
});

// Database operations
export const supabaseService = {
  // Authentication
  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  },

  async signOut() {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) {
      return null;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return subscription;
  },

  // Fetch all items
  async fetchItems(): Promise<CollectionItem[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('coletaveis')
      .select('*')
      .order('material', { ascending: true });

    if (error) {
      console.error('Error fetching items:', error);
      throw error;
    }

    return (data || []).map(mapFromDB);
  },

  // Create new item
  async createItem(item: Omit<CollectionItem, 'id'>): Promise<CollectionItem> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('coletaveis')
      .insert([mapToDB(item)])
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      throw error;
    }

    return mapFromDB(data);
  },

  // Update existing item
  async updateItem(id: string, item: Omit<CollectionItem, 'id'>): Promise<CollectionItem> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('coletaveis')
      .update(mapToDB(item))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      throw error;
    }

    return mapFromDB(data);
  },

  // Delete item
  async deleteItem(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('coletaveis')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (payload: any) => void) {
    if (!supabase) {
      return null;
    }

    return supabase
      .channel('coletaveis_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coletaveis' }, 
        callback
      )
      .subscribe();
  }
};
