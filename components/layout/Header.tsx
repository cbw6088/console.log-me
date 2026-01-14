'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, PenSquare, Github, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WriteSelectModal } from '../common/WriteSelectModal';
import { LoginRequiredModal } from '@/components/ui/LoginRequiredModal';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  // 1. 전역 로그인 상태 및 로그아웃 함수 가져오기
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  
  // 2. 새 글 작성 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2-1. 로그인 필요 모달 상태 관리
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  
  // 3. 사용자 메뉴 드롭다운 상태 관리
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* 1. 로고 구역 */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity tracking-tight">
                Blio
              </h1>
            </Link>
            
            {/* 2. 검색 구역 (데스크탑 노출) */}
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
            {/* 새 글 작성 버튼 */}
            <Button 
              variant="primary" 
              onClick={() => {
                if (isLoggedIn) {
                  setIsModalOpen(true);
                } else {
                  setIsLoginRequiredModalOpen(true);
                }
              }}
              className="shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">새 글 작성</span>
            </Button>

            <div className="w-[1px] h-4 bg-slate-200 mx-1 hidden sm:block" />

            {isLoggedIn ? (
              <div className="relative flex items-center gap-2" ref={userMenuRef}>
                {/* 사용자 프로필 아이콘 (임시) */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-white transition-colors"
                  title="사용자 메뉴"
                >
                  <User className="w-5 h-5 text-slate-500" />
                </button>
                
                {/* 사용자 메뉴 드롭다운 */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                      {/* 마이 페이지 버튼 */}
                      <button
                        onClick={() => {
                          router.push('/mypage');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium"
                      >
                        <User className="w-4 h-4" />
                        마이 페이지
                      </button>
                    </div>
                    <div className="border-t border-slate-100 p-2">
                      {/* 로그아웃 버튼 */}
                      <button 
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 미로그인 상태: 로그인 버튼 표시 */
              <Link href="/login">
                <Button variant="secondary" className="flex items-center gap-2 border-slate-200 hover:bg-slate-50">
                  <Github className="w-4 h-4" />
                  <span className="font-bold">로그인</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 4. 새 글 작성 모달 */}
      <WriteSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* 5. 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={isLoginRequiredModalOpen}
        onClose={() => setIsLoginRequiredModalOpen(false)}
      />
    </>
  );
};