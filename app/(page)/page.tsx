'use client';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/SideBar';
import { Footer } from '@/components/layout/Footer';
import { HeroCarousel } from '@/components/layout/HeroCarousel'; // 추가
import { PromoBanner } from '@/components/common/PromoBanner'; // 추가
import { PostCard } from '@/components/common/PostCard';
import { Pagination } from '@/components/ui/Pagination';

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);
  const [posts] = useState(Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    type: i % 2 === 0 ? 'PORTFOLIO' : 'BLOG',
    title: `${i + 1}번째 프로젝트 기록입니다.`,
    author: 'dev_byungwoo'
  })));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* 1. 자동 슬라이드 Hero 구역 */}
        <HeroCarousel />

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            {/* 2. 컴포넌트로 분리된 환영 배너 */}
            {showBanner && <PromoBanner onClose={() => setShowBanner(false)} />}

            {/* 3. 게시글 필터 및 리스트 */}
            <div className="flex gap-4 mb-8">
              <button className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold">전체</button>
              <button className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">블로그</button>
              <button className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">포트폴리오</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post.id} type={post.type as 'PORTFOLIO' | 'BLOG'} title={post.title} author={post.author} />
              ))}
            </div>

            <Pagination totalPages={3} currentPage={1} onPageChange={() => {}} />
          </div>

          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}