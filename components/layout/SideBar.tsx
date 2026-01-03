import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Sidebar = () => {
  return (
    <aside className="w-full md:w-80 space-y-6">
      {/* 공지사항 섹션 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          공지사항
        </h4>
        <ul className="text-sm space-y-3 text-slate-600">
          <li className="hover:text-emerald-500 cursor-pointer transition-colors">🎉 Blio Beta 서비스 런칭 안내</li>
          <li className="hover:text-emerald-500 cursor-pointer transition-colors">📗 GitHub 연동 가이드 (필독)</li>
        </ul>
      </div>
      
      {/* 프로모션 배너 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100">
        <h4 className="font-bold mb-2 text-lg">Portfolio Challenge</h4>
        <p className="text-sm opacity-90 mb-4">이번 달 최고의 포트폴리오에 도전하고 성장을 기록하세요!</p>
        <Button variant="ghost" className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
          자세히 보기
        </Button>
      </div>
    </aside>
  );
};