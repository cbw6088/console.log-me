'use client';

import { useState, useMemo } from 'react';
import { BookText, FileUser, LayoutGrid, Search, SortAsc, SortDesc, ChevronDown, ChevronRight } from 'lucide-react';
import { ContentItem } from './ContentItem';

export type ContentType = 'blog' | 'resume' | 'portfolio' | 'all';

interface ContentMetadata {
  id: string;
  type: 'blog' | 'resume' | 'portfolio';
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isPublic: boolean;
  coverImage?: string;
}

interface ContentDashboardProps {
  contents: ContentMetadata[];
  onEdit?: (id: string, type: ContentType) => void;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string) => void;
}

type SortOption = 'latest' | 'oldest' | 'title-asc' | 'title-desc';

export const ContentDashboard = ({
  contents,
  onEdit,
  onDelete,
  onTogglePublic,
}: ContentDashboardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  // 탭별 필터링
  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return contents;
    return contents.filter((content) => content.type === activeTab);
  }, [contents, activeTab]);

  // 검색 필터링
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return filteredByTab;
    const query = searchQuery.toLowerCase();
    return filteredByTab.filter((content) =>
      content.title.toLowerCase().includes(query)
    );
  }, [filteredByTab, searchQuery]);

  // 정렬
  const sortedContents = useMemo(() => {
    const sorted = [...filteredBySearch];
    switch (sortOption) {
      case 'latest':
        return sorted.sort((a, b) => {
          const dateA = typeof a.updatedAt === 'string' ? new Date(a.updatedAt) : a.updatedAt;
          const dateB = typeof b.updatedAt === 'string' ? new Date(b.updatedAt) : b.updatedAt;
          return dateB.getTime() - dateA.getTime();
        });
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
          return dateA.getTime() - dateB.getTime();
        });
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [filteredBySearch, sortOption]);

  // 탭별 통계
  const tabStats = useMemo(() => {
    return {
      all: contents.length,
      blog: contents.filter((c) => c.type === 'blog').length,
      resume: contents.filter((c) => c.type === 'resume').length,
      portfolio: contents.filter((c) => c.type === 'portfolio').length,
    };
  }, [contents]);

  const tabs = [
    { id: 'all' as ContentType, label: '전체', icon: null, count: tabStats.all },
    { id: 'blog' as ContentType, label: '블로그', icon: BookText, count: tabStats.blog, color: 'text-blue-500' },
    { id: 'resume' as ContentType, label: '자소서', icon: FileUser, count: tabStats.resume, color: 'text-purple-500' },
    { id: 'portfolio' as ContentType, label: '포트폴리오', icon: LayoutGrid, count: tabStats.portfolio, color: 'text-emerald-500' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">컨텐츠 관리</h2>
            <p className="text-sm text-slate-500">작성한 블로그, 자소서, 포트폴리오를 관리하세요.</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isCollapsed ? '펼치기' : '접기'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 탭 */}
        <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${tab.color}`} />}
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 검색 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="title-asc">제목 (가나다순)</option>
              <option value="title-desc">제목 (역순)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {sortOption === 'latest' || sortOption === 'title-desc' ? (
                <SortDesc className="w-4 h-4 text-slate-400" />
              ) : (
                <SortAsc className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>
        </div>

        {/* 컨텐츠 목록 */}
      <div className="space-y-3">
        {sortedContents.length > 0 ? (
          sortedContents.map((content) => (
            <ContentItem
              key={content.id}
              {...content}
              onEdit={(id) => onEdit?.(id, content.type)}
              onDelete={onDelete}
              onTogglePublic={onTogglePublic}
            />
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-medium mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '작성한 컨텐츠가 없습니다'}
            </p>
            <p className="text-sm">
              {searchQuery ? '다른 검색어를 시도해보세요' : '새로운 컨텐츠를 작성해보세요'}
            </p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

