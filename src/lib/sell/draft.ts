import { SellFormData } from './schemas';

const DRAFT_KEY = 'marketplace_sell_draft';

export function saveDraft(data: Partial<SellFormData>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error);
  }
}

export function loadDraft(): Partial<SellFormData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<SellFormData>;
  } catch (error) {
    console.error('Erro ao carregar rascunho:', error);
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Erro ao limpar rascunho:', error);
  }
}
