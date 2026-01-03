'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: <>내 커리어의 모든 기록, <br/> <span className="text-emerald-500">GitHub 잔디</span>가 됩니다.</>,
    description: "이력서, 포트폴리오, 블로그를 하나로 관리하고 수정할 때마다 자동으로 커밋을 남겨보세요."
  },
  {
    title: <>나만의 독특한 <br/> <span className="text-emerald-500">포트폴리오</span>를 완성하세요.</>,
    description: "PPT처럼 자유로운 에디터로 나만의 개성을 담은 결과물을 만들고 PDF로 간직하세요."
  },
  {
    title: <>취업 성공을 위한 <br/> <span className="text-emerald-500">자기소개서</span> 관리까지.</>,
    description: "실시간 글자 수 체크와 전문적인 서식으로 완성도 높은 지원 서류를 준비하세요."
  }
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // 다음 슬라이드로 이동 (재사용을 위해 useCallback 사용)
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // 자동 재생 로직
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, current]); // current가 바뀔 때마다 타이머를 리셋하여 수동 조작 시 꼬임 방지

  return (
    <section className="group mb-12 py-12 text-center min-h-[350px] flex flex-col justify-center relative overflow-hidden bg-white border border-slate-100 rounded-[3rem]">
      
      {/* 슬라이드 콘텐츠 */}
      <div className="relative flex-1 flex items-center justify-center">
        {SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center px-12 ${
              index === current 
              ? 'opacity-100 translate-x-0 scale-100' 
              : index < current 
                ? 'opacity-0 -translate-x-20 scale-95 pointer-events-none' 
                : 'opacity-0 translate-x-20 scale-95 pointer-events-none'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              {slide.title}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {slide.description}
            </p>
          </div>
        ))}
      </div>

      {/* 좌우 네비게이션 버튼 (호버 시에만 더 선명하게 보임) */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 하단 인디케이터 (클릭 가능) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current 
              ? 'w-10 bg-emerald-500' 
              : 'w-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};