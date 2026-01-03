'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, PenSquare, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WriteSelectModal } from '../common/WriteSelectModal';

export const Header = () => {
  // 새 글 작성 모달의 열림/닫힘 상태를 관리합니다.
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* 1. 로고 구역: 클릭 시 홈으로 이동 */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                Blio
              </h1>
            </Link>
            
            {/* 2. 검색 구역: 모바일에서는 숨기고 테블릿/데스크탑에서만 노출 */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="관심 있는 프로젝트를 검색해보세요" 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-transparent focus:bg-white"
              />
            </div>
          </div>

          {/* 3. 액션 버튼 구역 */}
          <div className="flex items-center gap-3">
            {/* 새 글 작성 버튼: 클릭 시 모달 상태를 true로 변경 */}
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
              className="shadow-lg shadow-emerald-100"
            >
              <PenSquare className="w-4 h-4" />
              <span className="hidden sm:inline">새 글 작성</span>
            </Button>

            {/* 로그인 버튼: 클릭 시 로그인 페이지로 이동 */}
            <Link href="/login">
              <Button variant="secondary">
                <Github className="w-4 h-4" />
                <span>로그인</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. 새 글 작성 모달: isOpen 상태에 따라 화면에 나타납니다. */}
      <WriteSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};