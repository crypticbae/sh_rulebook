import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface Category {
  id: string;
  title: string;
  icon: string;
  order_position: number;
  parent_id: string | null;
}

export interface Rule {
  id: string;
  category_id: string;
  title: string;
  content: string;
  order_position: number;
}

export interface Faction {
  id: string;
  category_id: string;
  name: string;
  image_url: string;
  discord_url: string;
  order_position: number;
}

export const isMainCategory = (category: Category) => category.parent_id === null;
export const isSubcategory = (category: Category) => category.parent_id !== null;

class StorageService {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_position', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .upsert(
          categories.map(category => ({
            ...category,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'id' }
        );
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  }

  async getRules(): Promise<Rule[]> {
    try {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('order_position', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to load rules');
      return [];
    }
  }

  async saveRule(rule: Rule): Promise<void> {
    try {
      const { error } = await supabase
        .from('rules')
        .upsert({
          ...rule,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving rule:', error);
      throw error;
    }
  }

  async deleteRule(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }
  }

  async getFactions(): Promise<Faction[]> {
    try {
      const { data, error } = await supabase
        .from('factions')
        .select('*')
        .order('order_position', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching factions:', error);
      toast.error('Failed to load factions');
      return [];
    }
  }

  async saveFaction(faction: Faction): Promise<void> {
    try {
      const { error } = await supabase
        .from('factions')
        .upsert({
          ...faction,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving faction:', error);
      throw error;
    }
  }

  async deleteFaction(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('factions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting faction:', error);
      throw error;
    }
  }
}

export const storage = new StorageService();