import { SellFormData, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from './schemas';
import { createClient } from '../supabase/client';

export async function publishProduct(
  data: SellFormData,
): Promise<{ productId: string }> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao publicar produto');
  }

  return response.json();
}

export async function uploadPhoto(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error('Formato de arquivo não suportado (use JPEG, PNG ou WEBP)');
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`O arquivo excede o limite de ${MAX_FILE_SIZE_MB}MB`);
  }

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Usuário não autenticado');
  }

  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${session.user.id}/${timestamp}_${sanitized}`;

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress = Math.min(progress + 15, 90);
    onProgress?.(progress);
  }, 200);

  const { data: uploadData, error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  clearInterval(progressInterval);

  if (error) {
    throw new Error('Erro ao fazer upload da imagem: ' + error.message);
  }

  onProgress?.(100);

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(uploadData.path);

  return publicUrl;
}