import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  // 전체 페이지 수만큼 배열 생성 (예: 3페이지면 [1, 2, 3])
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 이전 페이지 버튼 */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {/* 페이지 번호들 */}
      {pageNumbers.map((number) => (
        <button 
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-10 h-10 rounded-lg font-medium transition-all ${
            currentPage === number 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {number}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};