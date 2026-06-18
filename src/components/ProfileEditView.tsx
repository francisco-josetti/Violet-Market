'use client';

import React, { useRef, useState } from 'react';
import { User, Camera, X } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';
import { useAuth } from '@/src/contexts/AuthContext';

interface ProfileEditViewProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function ProfileEditView({ onClose, onSaved }: ProfileEditViewProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('O nome não pode ficar vazio.');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }

    setLoading(true);

    let avatarUrl = user.avatarUrl;

    if (avatarFile) {
      const supabase = createClient();
      const timestamp = Date.now();
      const ext = avatarFile.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { contentType: avatarFile.type, upsert: true });

      if (uploadError) {
        setError('Erro ao fazer upload da imagem: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      avatarUrl = urlData.publicUrl;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setLoading(false);

    if (updateError) {
      setError('Erro ao salvar perfil: ' + updateError.message);
      return;
    }

    setSuccess('Perfil atualizado!');
    setTimeout(() => {
      onSaved();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 md:pt-20">
      <div className="glass-panel luxury-shadow rounded-2xl p-6 md:p-8 w-full max-w-md border border-primary/10 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-hanken text-xl font-bold text-on-surface">
            Editar Perfil
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="text-sm text-error bg-error-container/10 border border-error/20 rounded-xl px-4 py-3 mb-4" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-tertiary bg-tertiary-container/15 border border-tertiary/20 rounded-xl px-4 py-3 mb-4" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-violet to-primary-container flex items-center justify-center overflow-hidden cursor-pointer relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-white" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-sans text-xs text-primary hover:text-brand-violet transition-colors cursor-pointer"
            >
              Alterar foto
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-profile-name"
              className="font-mono text-xs text-on-surface-variant uppercase tracking-wider"
            >
              Nome
            </label>
            <input
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-3.5 text-on-surface font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50 focus:ring-primary/25 transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-low border border-white/10 text-on-surface font-mono text-xs py-3.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-violet text-white py-3.5 rounded-xl font-mono text-xs font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
