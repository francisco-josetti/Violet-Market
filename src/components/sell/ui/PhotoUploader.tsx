// 1. Imports externos
import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Trash2, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

// 2. Imports internos
import { MAX_PHOTOS, MAX_FILE_SIZE_MB, ACCEPTED_MIME_TYPES } from '../../../lib/sell/schemas';
import { uploadPhoto } from '../../../lib/sell/api';

import PhotoPreviewItem from './PhotoPreviewItem';

// 3. Tipos/interfaces locais
interface PhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
}

// 4. Constantes locais

// 5. Componente
function PhotoUploader({ images, onChange, error }: PhotoUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadProgress[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;
    setLocalError(null);

    const validFiles: File[] = [];
    const currentTotal = images.length + uploadingFiles.length;

    if (currentTotal + files.length > MAX_PHOTOS) {
      setLocalError(`Você pode enviar no máximo ${MAX_PHOTOS} fotos.`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setLocalError('Formato de arquivo não suportado. Use JPEG, PNG ou WEBP.');
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setLocalError(`O arquivo "${file.name}" excede o limite de ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      validFiles.push(file);
    }

    // Processar uploads
    const uploadPromises = validFiles.map(async (file) => {
      // Adicionar aos arquivos em upload
      setUploadingFiles((prev) => [...prev, { fileName: file.name, progress: 0 }]);

      try {
        const url = await uploadPhoto(file, (progress) => {
          setUploadingFiles((prev) =>
            prev.map((item) =>
              item.fileName === file.name ? { ...item, progress } : item
            )
          );
        });

        // Adicionar URL ao array global
        onChange([...images, url]);
      } catch (err) {
        console.error(err);
        setLocalError(`Falha ao fazer upload de "${file.name}".`);
      } finally {
        // Remover dos arquivos em upload
        setUploadingFiles((prev) => prev.filter((item) => item.fileName !== file.name));
      }
    });

    await Promise.all(uploadPromises);
  }, [images, onChange, uploadingFiles.length]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  const displayError = error || localError;

  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      <div className="flex justify-between items-center">
        <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
          Fotos do Produto ({images.length}/{MAX_PHOTOS})
        </label>
        <span className="text-[11px] text-on-surface-variant/50">
          Mínimo de 1 foto. Arraste as fotos para reordenar.
        </span>
      </div>

      {/* Área de Drop */}
      {images.length < MAX_PHOTOS && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-surface-container-low/40 hover:bg-surface-container-low/80 transition-all duration-300 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload de fotos do produto"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_MIME_TYPES.join(',')}
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="text-primary w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-on-surface">
              Arraste e solte fotos aqui ou <span className="text-primary hover:underline">escolha arquivos</span>
            </p>
            <p className="text-xs text-on-surface-variant/50 mt-1">
              Formatos suportados: JPG, PNG, WEBP (Máx. {MAX_FILE_SIZE_MB}MB por foto)
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {displayError && (
        <div className="flex items-center gap-2 text-xs text-error bg-error-container/10 border border-error/20 rounded-xl px-4 py-3" role="alert">
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      {/* Grid de Uploads em Progresso */}
      {uploadingFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploadingFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-surface-container border border-white/5 rounded-xl p-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-on-surface truncate">{file.fileName}</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-brand-violet h-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-primary">{file.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid de Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((url, idx) => (
            <PhotoPreviewItem
              key={idx}
              url={url}
              index={idx}
              isMain={idx === 0}
              isLast={idx === images.length - 1}
              onRemove={handleRemove}
              onMove={handleMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 6. Export default
export default PhotoUploader;
