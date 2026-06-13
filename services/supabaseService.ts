import { supabase } from '../utils/supabase';

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const saveJournalEntry = async (text: string) => {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase.from('journals').insert([{ user_id: user.id, content: text }]).select();
  return data;
};

export const getJournalHistory = async (limit = 10) => {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase.from('journals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(limit);
  return data || [];
};

export const saveEmotionalTag = async (emotion: string, intensity: string) => {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase.from('patterns').insert([{ user_id: user.id, emotion, intensity }]).select();
  return data;
};

export const fetchUserPatterns = async (limit = 10) => {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase.from('patterns').select('emotion, intensity, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(limit);
  return data || [];
};
