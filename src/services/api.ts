
import { supabase } from '@/integrations/supabase/client';

// Visitor Stats
export async function getVisitorStats() {
  const { data, error } = await supabase
    .from('visitor_stats')
    .select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true });
  
  if (error) {
    console.error('Error fetching visitor stats:', error);
    throw error;
  }
  
  return data;
}

// Origin Countries
export async function getOriginCountries() {
  const { data, error } = await supabase
    .from('origin_countries')
    .select('*')
    .order('visitor_count', { ascending: false });
  
  if (error) {
    console.error('Error fetching origin countries:', error);
    throw error;
  }
  
  return data;
}

// Occupancy Rates
export async function getOccupancyRates() {
  const { data, error } = await supabase
    .from('occupancy_rates')
    .select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true });
  
  if (error) {
    console.error('Error fetching occupancy rates:', error);
    throw error;
  }
  
  return data;
}

// Tourist Spending
export async function getTouristSpending() {
  const { data, error } = await supabase
    .from('tourist_spending')
    .select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true });
  
  if (error) {
    console.error('Error fetching tourist spending:', error);
    throw error;
  }
  
  return data;
}

// Attractions
export async function getAttractions() {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .order('visitors_count', { ascending: false });
  
  if (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
  
  return data;
}

// For admin operations
export async function addVisitorStat(visitorStat: any) {
  const { data, error } = await supabase
    .from('visitor_stats')
    .insert([visitorStat])
    .select();
  
  if (error) {
    console.error('Error adding visitor stat:', error);
    throw error;
  }
  
  return data;
}

export async function updateVisitorStat(id: string, updates: any) {
  const { data, error } = await supabase
    .from('visitor_stats')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating visitor stat:', error);
    throw error;
  }
  
  return data;
}

export async function deleteVisitorStat(id: string) {
  const { error } = await supabase
    .from('visitor_stats')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting visitor stat:', error);
    throw error;
  }
  
  return true;
}
