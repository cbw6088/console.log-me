import { Search, PenSquare, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent cursor-pointer">
            Blio
          </h1>
          {/* 검색바 컴포넌트화 가능 */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="관심 있는 프로젝트를 검색해보세요" 
              className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary">
            <PenSquare className="w-4 h-4" /> 새 글 작성
          </Button>
          <Button variant="secondary">
            <Github className="w-4 h-4" /> 로그인
          </Button>
        </div>
      </div>
    </nav>
  );
};