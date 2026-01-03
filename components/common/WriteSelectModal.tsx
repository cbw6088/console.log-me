import { BookText, LayoutGrid, FileUser, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WriteSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WriteSelectModal = ({ isOpen, onClose }: WriteSelectModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const SELECT_OPTIONS = [
    {
      id: 'blog',
      title: '블로그',
      description: '학습 기록이나 기술 인사이트를 자유롭게 남기세요.',
      icon: <BookText className="w-8 h-8 text-blue-500" />,
      path: '/write/blog',
    },
    {
      id: 'portfolio',
      title: '포트폴리오',
      description: '나만의 프로젝트를 PPT처럼 자유롭게 구성해보세요.',
      icon: <LayoutGrid className="w-8 h-8 text-emerald-500" />,
      path: '/write/portfolio',
    },
    {
      id: 'resume',
      title: '자기소개서',
      description: '글자 수 체크와 함께 합격용 자소서를 관리하세요.',
      icon: <FileUser className="w-8 h-8 text-purple-500" />,
      path: '/write/resume',
    },
  ];

  const handleSelect = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">무엇을 기록할까요?</h2>
          <p className="text-slate-500">작성하고자 하는 콘텐츠 종류를 선택해주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SELECT_OPTIONS.map((option) => (
            <div 
              key={option.id}
              onClick={() => handleSelect(option.path)}
              className="group cursor-pointer p-6 border border-slate-100 bg-slate-50 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {option.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{option.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};