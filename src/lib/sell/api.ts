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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(path);
        resolve(publicUrl);
      } else {
        reject(new Error('Erro ao fazer upload da imagem'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Erro ao fazer upload da imagem'));
    });

    xhr.open('POST', `${supabaseUrl}/storage/v1/object/product-images/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.send(file);
  });
}