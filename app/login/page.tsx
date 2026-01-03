import { Github, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* 홈으로 돌아가기 버튼 */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>

      <div className="w-full max-w-md">
        {/* 서비스 브랜딩 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3">
            Blio
          </h1>
          <p className="text-slate-600 font-medium">당신의 모든 커리어를 커밋하세요.</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">로그인</h2>
            <p className="text-sm text-slate-500">
              GitHub 계정으로 로그인하여 잔디를 심기 시작하세요.
            </p>
          </div>

          <div className="space-y-4">
            <Button className="w-full py-4 bg-[#24292F] hover:bg-black text-white flex justify-center items-center gap-3 border-none">
              <Github className="w-5 h-5" />
              <span className="font-semibold">GitHub로 계속하기</span>
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">또는</span>
              </div>
            </div>

            <Button variant="secondary" className="w-full py-4 text-slate-400 cursor-not-allowed opacity-60">
              이메일로 로그인 (준비 중)
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            로그인 시 Blio의 <span className="underline cursor-pointer">이용약관</span> 및 <br/>
            <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>

        {/* 하단 도움말 */}
        <p className="text-center mt-8 text-sm text-slate-500">
          도움이 필요하신가요? <span className="text-emerald-500 font-medium cursor-pointer hover:underline">문의하기</span>
        </p>
      </div>
    </div>
  );
}