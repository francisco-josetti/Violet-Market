// 1. Imports externos
import React from 'react';
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

// 2. Imports internos

// 3. Tipos/interfaces locais
interface PhotoPreviewItemProps {
  url: string;
  index: number;
  isMain: boolean;
  isLast: boolean;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'left' | 'right') => void;
}

// 4. Constantes locais

// 5. Componente
function PhotoPreviewItem({
  url,
  index,
  isMain,
  isLast,
  onRemove,
  onMove,
}: PhotoPreviewItemProps) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-high border border-white/5 group flex flex-col justify-end shadow-lg font-sans">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Preview ${index + 1}`}
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Badge de Foto Principal */}
      {isMain && (
        <span className="absolute top-2.5 left-2.5 bg-tertiary text-on-tertiary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
          Principal
        </span>
      )}

      {/* Painel de Controles */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 z-20">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 bg-error-container/80 hover:bg-error-container text-on-error-container hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Excluir foto"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Botões de Reordenação */}
        <div className="flex justify-between items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, 'left')}
            className="flex-1 p-1 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed flex justify-center transition-colors cursor-pointer"
            title="Mover para esquerda"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMove(index, 'right')}
            className="flex-1 p-1 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed flex justify-center transition-colors cursor-pointer"
            title="Mover para direita"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Export default
export default PhotoPreviewItem;
