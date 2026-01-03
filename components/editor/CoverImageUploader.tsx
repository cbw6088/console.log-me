import { Image as ImageIcon, X } from 'lucide-react';

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
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <ImageIcon className="w-10 h-10 text-slate-300 mb-2 group-hover:text-emerald-400 transition-colors" />
          <p className="text-sm text-slate-400 group-hover:text-emerald-500 transition-colors font-medium">
            커버 이미지를 추가해보세요
          </p>
        </>
      )}
    </div>
  );
};