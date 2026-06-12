export const LOGIN_FORM_DRAFT_KEY = 'violet_market_form_login_draft';
export const REGISTER_FORM_DRAFT_KEY = 'violet_market_form_register_draft';

export function loadFormDraft<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveFormDraft<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearFormDraft(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
