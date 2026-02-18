'use client';

import { useState, useMemo } from 'react';
import { BookText, FileUser, LayoutGrid, Calendar, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommitHistoryItem {
  date: string; // YYYY-MM-DD
  contents: Array<{
    id: string;
    type: 'blog' | 'resume' | 'portfolio';
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
}

interface CommitHistoryProps {
  contents: Array<{
    id: string;
    type: 'blog' | 'resume' | 'portfolio';
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
  onContentClick?: (id: string, type: string) => void;
}

const typeConfig = {
  blog: {
    icon: BookText,
    label: '블로그',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  resume: {
    icon: FileUser,
    label: '자소서',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  portfolio: {
    icon: LayoutGrid,
    label: '포트폴리오',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${weekday}요일`;
};

export const CommitHistory = ({ contents, onContentClick }: CommitHistoryProps) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'blog' | 'resume' | 'portfolio'>('all');
  const [showCount, setShowCount] = useState(10); // 초기 표시 개수

  // 날짜별로 그룹화
  const historyByDate = useMemo(() => {
    const grouped: Record<string, CommitHistoryItem['contents']> = {};

    contents.forEach((content) => {
      const createdDate = formatDate(content.createdAt);
      const updatedDate = formatDate(content.updatedAt);

      // 작성일
      if (!grouped[createdDate]) {
        grouped[createdDate] = [];
      }
      grouped[createdDate].push(content);

      // 수정일이 다르면 수정일에도 추가
      if (updatedDate !== createdDate) {
        if (!grouped[updatedDate]) {
          grouped[updatedDate] = [];
        }
        grouped[updatedDate].push(content);
      }
    });

    // 날짜순 정렬 (최신순)
    return Object.entries(grouped)
      .map(([date, items]) => ({
        date,
        contents: items,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contents]);

  // 타입 필터링
  const filteredHistory = useMemo(() => {
    if (filterType === 'all') return historyByDate;
    return historyByDate.map((item) => ({
      ...item,
      contents: item.contents.filter((c) => c.type === filterType),
    })).filter((item) => item.contents.length > 0);
  }, [historyByDate, filterType]);

  // 표시할 항목 (초기 10개)
  const displayedHistory = useMemo(() => {
    return filteredHistory.slice(0, showCount);
  }, [filteredHistory, showCount]);

  const toggleExpand = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleContentClick = (id: string, type: string) => {
    if (onContentClick) {
      onContentClick(id, type);
    } else {
      router.push(`/write/${type}/${id}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">커밋 히스토리</h2>
            <p className="text-sm text-slate-500">작성한 컨텐츠의 활동 내역을 날짜별로 확인하세요.</p>
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
          {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          전체
        </button>
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filterType === type
                  ? `${config.bgColor} ${config.color} border ${config.borderColor}`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* 히스토리 목록 */}
      <div className="space-y-4">
        {displayedHistory.length > 0 ? (
          <>
            {displayedHistory.map((item) => {
              const isExpanded = expandedDates.has(item.date);
              const displayContents = isExpanded ? item.contents : item.contents.slice(0, 3);
              const hasMore = item.contents.length > 3;

              return (
                <div key={item.date} className="border border-slate-200 rounded-xl p-4">
                  {/* 날짜 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-slate-900">
                        {formatDisplayDate(item.date)}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                        {item.contents.length}개 활동
                      </span>
                    </div>
                    {hasMore && (
                      <button
                        onClick={() => toggleExpand(item.date)}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            접기
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            더보기 ({item.contents.length - 3}개)
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 컨텐츠 목록 */}
                  <div className="space-y-2">
                    {displayContents.map((content) => {
                      const config = typeConfig[content.type];
                      const Icon = config.icon;
                      return (
                        <div
                          key={content.id}
                          onClick={() => handleContentClick(content.id, content.type)}
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group"
                        >
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${config.bgColor} ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                            <h3 className="font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                              {content.title || '제목 없음'}
                            </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* 더보기 버튼 */}
            {filteredHistory.length > showCount && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowCount(showCount + 10)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  더보기 ({filteredHistory.length - showCount}개 남음)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-medium mb-2">활동 내역이 없습니다</p>
            <p className="text-sm">컨텐츠를 작성하면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

