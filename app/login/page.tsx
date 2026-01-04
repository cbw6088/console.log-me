'use client'; 

import { Github, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleMockLogin = () => {
    login();
    router.push('/'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* 홈으로 돌아가기 버튼 */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>

      <div className="w-full max-w-md">
        {/* 서비스 브랜딩 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Blio
          </h1>
          <p className="text-slate-600 font-medium">당신의 모든 커리어를 커밋하세요.</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm transition-all hover:shadow-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">로그인</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              GitHub 계정으로 로그인하여 <br/>
              당신의 성장을 잔디로 기록해보세요.
            </p>
          </div>

          <div className="space-y-4">
            {/* 💡 임시 로그인 버튼 */}
            <Button 
              onClick={handleMockLogin}
              className="w-full py-3 bg-[#24292F] hover:bg-black text-white flex justify-center items-center gap-3 border-none rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
            >
              <Github className="w-5 h-5" />
              <span className="font-bold text-lg">GitHub로 계속하기</span>
            </Button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-medium">또는</span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              className="w-full py-3 text-slate-400 cursor-not-allowed opacity-60 rounded-2xl border-slate-100 bg-slate-50"
            >
              <span className="font-semibold">이메일로 로그인 (준비 중)</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-[11px] text-slate-400 leading-relaxed">
            로그인 시 Blio의 <span className="underline cursor-pointer hover:text-slate-600">이용약관</span> 및 <br/>
            <span className="underline cursor-pointer hover:text-slate-600">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>

        {/* 하단 도움말 */}
        <p className="text-center mt-8 text-sm text-slate-500">
          도움이 필요하신가요? <span className="text-emerald-500 font-bold cursor-pointer hover:underline underline-offset-4 ml-1">문의하기</span>
        </p>
      </div>
    </div>
  );
}