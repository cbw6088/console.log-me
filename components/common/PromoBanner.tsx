import { Sparkles, X } from 'lucide-react';

interface PromoBannerProps {
  onClose: () => void;
}

export const PromoBanner = ({ onClose }: PromoBannerProps) => {
  return (
    <div className="relative mb-10 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-100 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Blio에 오신 것을 환영합니다!</h3>
            <p className="text-emerald-50 text-sm leading-relaxed max-w-md">
              이력서부터 블로그까지, 여기서 작성한 모든 활동은 당신의 GitHub 잔디로 기록됩니다. 지금 첫 포트폴리오를 만들고 성장을 증명해보세요.
            </p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors whitespace-nowrap">
          서비스 가이드 보기
        </button>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-white/70" />
      </button>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
};