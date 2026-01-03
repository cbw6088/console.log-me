import { Tag as TagIcon } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput = ({ tags, onChange }: TagInputProps) => {
    return (
      <div className="flex items-center gap-3 mb-12 p-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all group">
        <TagIcon className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
        <input 
          type="text"
          placeholder="태그를 입력하세요 (쉼표로 구분)"
          className="flex-1 border-none focus:ring-0 text-sm p-0 bg-transparent placeholder:text-slate-300"
        />
      </div>
    );
  };