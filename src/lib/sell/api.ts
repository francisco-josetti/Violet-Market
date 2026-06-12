import { SellFormData, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from './schemas';
import { supabase } from '../supabase';

export async function publishProduct(
  data: SellFormData,
): Promise<{ productId: string }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Usuário não autenticado');
  }

  const priceInCents = Math.round(data.price * 100);

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      seller_id: session.user.id,
      title: data.title,
      description: data.description,
      price: priceInCents,
      stock: data.stock,
      sku: data.sku ?? null,
      condition: data.condition,
      images: data.images,
      variants:
        data.variants && data.variants.length > 0 ? data.variants : null,
      shipping_type: data.shippingType,
      weight_kg:
        data.shippingType === 'calculate' ? data.weightKg : null,
      cep: data.shippingType === 'calculate' ? data.cep : null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao publicar produto:', error);
    throw new Error(error.message);
  }

  return { productId: product.id };
}

export function uploadPhoto(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      reject(
        new Error('Formato de arquivo não suportado (use JPEG, PNG ou WEBP)'),
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`O arquivo excede o limite de ${MAX_FILE_SIZE_MB}MB`));
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (onProgress) onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Erro ao processar imagem'));
          }
        };
        reader.onerror = () => reject(new Error('Erro ao ler imagem'));
        reader.readAsDataURL(file);
      }
    }, 150);
  });
}
