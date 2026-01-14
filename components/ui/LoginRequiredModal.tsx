'use client';

import { X, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">로그인이 필요합니다</h2>
          <p className="text-slate-500">
            새 글을 작성하려면 먼저 로그인해주세요.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
          >
            취소
          </button>
          <Button
            onClick={handleLogin}
            className="flex-1 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            로그인하기
          </Button>
        </div>
      </div>
    </div>
  );
};

