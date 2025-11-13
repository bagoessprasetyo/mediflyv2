import { createClient } from '@/lib/supabase/server';

export async function getInspiredContentBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('inspired_content')
    .select(`
      *,
      category:inspired_categories(id, name, color_code)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    throw error;
  }

  return data;
}