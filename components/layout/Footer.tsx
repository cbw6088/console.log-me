import { Github, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Blio
            </h2>
            <p className="text-sm text-slate-500 max-w-xs">
              모든 커리어가 기록이 되고, 기록이 곧 증명이 되는 공간. <br/>
              Blio와 함께 당신의 성장을 커밋하세요.
            </p>
          </div>

          {/* 네비게이션 섹션 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">서비스</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">홈</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">탐색</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">챌린지</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">내 기록</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">블로그</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">포트폴리오</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">자기소개서</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">지원</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">공지사항</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">문의하기</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2024 Blio. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};