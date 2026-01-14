// components/editor/CoverImageUploader.tsx
'use client';

import { Image as ImageIcon, X, RefreshCw } from 'lucide-react';

interface CoverImageUploaderProps {
  image?: string;
  onUpload: () => void;
  onRemove: () => void;
}

export const CoverImageUploader = ({ image, onUpload, onRemove }: CoverImageUploaderProps) => {
  return (
    <div 
      onClick={!image ? onUpload : undefined}
      className={`group relative w-full aspect-[21/9] rounded-[2.5rem] mb-12 flex flex-col items-center justify-center border-2 border-dashed transition-all overflow-hidden ${
        image ? 'border-transparent' : 'border-slate-200 bg-slate-50 hover:border-emerald-300 cursor-pointer'
      }`}
    >
      {image ? (
        <>
          <img src={image} alt="Cover" className="w-full h-full object-cover" />
          {/* 이미지 위에 오버레이 버튼 */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpload(); }}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-3 bg-red-500/50 hover:bg-red-500/70 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </>
      ) : (
        <>
          <ImageIcon className="w-10 h-10 text-slate-300 mb-2 group-hover:text-emerald-400 transition-colors" />
          <p className="text-sm text-slate-400 group-hover:text-emerald-500 transition-colors font-medium">
            커버 이미지를 추가해보세요
          </p>
          <p className="text-xs text-slate-300 mt-1 font-light">권장 비율 21:9</p>
        </>
      )}
    </div>
  );
};