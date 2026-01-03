import { LayoutGrid, FileText } from 'lucide-react';

interface PostCardProps {
  type: 'BLOG' | 'PORTFOLIO';
  title: string;
  author: string;
  thumbnail?: string;
}

export const PostCard = ({ type, title, author }: PostCardProps) => {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer">
      <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
        {type === 'PORTFOLIO' ? <LayoutGrid className="w-10 h-10 text-slate-300" /> : <FileText className="w-10 h-10 text-slate-300" />}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          {type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-200" />
          <span className="text-sm text-slate-500 font-medium">{author}</span>
        </div>
      </div>
    </div>
  );
};