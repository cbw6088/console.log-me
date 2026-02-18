'use client';

import { useState, useMemo } from 'react';
import { BookText, FileUser, LayoutGrid } from 'lucide-react';

interface CommitData {
  date: string; // YYYY-MM-DD 형식
  count: number;
  contents: Array<{
    id: string;
    type: 'blog' | 'resume' | 'portfolio';
    title: string;
  }>;
}

interface GrassVisualizationProps {
  contents: Array<{
    id: string;
    type: 'blog' | 'resume' | 'portfolio';
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
}

// 날짜를 YYYY-MM-DD 형식으로 변환
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 커밋 수에 따른 색상 클래스 반환 (emerald로 통일)
const getColorClass = (count: number): string => {
  if (count === 0) return 'bg-slate-100';
  if (count === 1) return 'bg-emerald-200';
  if (count <= 3) return 'bg-emerald-400';
  return 'bg-emerald-600';
};

// 주의 첫 번째 날짜 계산 (일요일)
const getFirstDayOfYear = (year: number): Date => {
  const firstDay = new Date(year, 0, 1);
  const day = firstDay.getDay(); // 0 = 일요일
  const diff = firstDay.getDate() - day; // 일요일로 맞추기
  return new Date(year, 0, diff);
};

export const GrassVisualization = ({ contents }: GrassVisualizationProps) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  // 최근 1년간의 커밋 데이터 생성 (오늘부터 역으로 1년)
  const commitData = useMemo(() => {
    const data: Record<string, CommitData> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // 모든 컨텐츠를 날짜별로 그룹화 (최근 1년 범위 내만)
    contents.forEach((content) => {
      const createdDate = formatDate(content.createdAt);
      const updatedDate = formatDate(content.updatedAt);
      const createdDateObj = new Date(createdDate);
      const updatedDateObj = new Date(updatedDate);

      // 최근 1년 범위 내인지 확인
      const isCreatedInRange = createdDateObj >= oneYearAgo && createdDateObj <= today;
      const isUpdatedInRange = updatedDateObj >= oneYearAgo && updatedDateObj <= today;

      // 작성일
      if (isCreatedInRange) {
        if (!data[createdDate]) {
          data[createdDate] = {
            date: createdDate,
            count: 0,
            contents: [],
          };
        }
        data[createdDate].count += 1;
        data[createdDate].contents.push({
          id: content.id,
          type: content.type,
          title: content.title,
        });
      }

      // 수정일이 다르고 최근 1년 범위 내면 수정일에도 추가
      if (updatedDate !== createdDate && isUpdatedInRange) {
        if (!data[updatedDate]) {
          data[updatedDate] = {
            date: updatedDate,
            count: 0,
            contents: [],
          };
        }
        data[updatedDate].count += 1;
        data[updatedDate].contents.push({
          id: content.id,
          type: content.type,
          title: content.title,
        });
      }
    });

    return Object.values(data);
  }, [contents]);

  // 잔디 그리드 생성 (오늘부터 역으로 1년, 주 단위)
  const grassGrid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // 1년 전 날짜의 첫 번째 일요일 찾기
    const firstSunday = new Date(oneYearAgo);
    const dayOfWeek = firstSunday.getDay();
    firstSunday.setDate(firstSunday.getDate() - dayOfWeek);

    const weeks: Array<Array<{ date: string; count: number; contents: CommitData['contents'] }>> = [];
    const commitMap = new Map<string, CommitData>();
    commitData.forEach((data) => {
      commitMap.set(data.date, data);
    });

    // 53주 생성
    for (let week = 0; week < 53; week++) {
      const weekData: Array<{ date: string; count: number; contents: CommitData['contents'] }> = [];
      
      // 각 주의 7일 (일~토)
      for (let day = 0; day < 7; day++) {
        const date = new Date(firstSunday);
        date.setDate(firstSunday.getDate() + week * 7 + day);
        
        // 최근 1년 범위 밖이면 제외
        if (date < oneYearAgo) {
          weekData.push({ date: '', count: 0, contents: [] });
          continue;
        }

        // 오늘 이후는 제외
        if (date > today) {
          weekData.push({ date: '', count: 0, contents: [] });
          continue;
        }

        const dateStr = formatDate(date);
        const commit = commitMap.get(dateStr);
        
        weekData.push({
          date: dateStr,
          count: commit?.count || 0,
          contents: commit?.contents || [],
        });
      }
      weeks.push(weekData);
    }

    return weeks;
  }, [commitData]);

  // 호버된 날짜의 정보
  const hoveredInfo = useMemo(() => {
    if (!hoveredDate) return null;
    return commitData.find((d) => d.date === hoveredDate);
  }, [hoveredDate, commitData]);

  // 날짜 포맷팅 (한국어)
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 ${weekday}요일`;
  };

  // 간단한 날짜 포맷팅
  const formatSimpleDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };


  return (
    <div id="grass-visualization" className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">활동 잔디</h2>
        <p className="text-sm text-slate-500">최근 1년간의 컨텐츠 작성 활동을 확인하세요</p>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 mb-6 text-xs">
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-slate-100" />
          <div className="w-4 h-4 rounded bg-emerald-200" />
          <div className="w-4 h-4 rounded bg-emerald-400" />
          <div className="w-4 h-4 rounded bg-emerald-600" />
        </div>
      </div>

      {/* 잔디 그리드 */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max py-4">
          {grassGrid.map((week, weekIndex) => {
            return (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (!day.date) {
                    return <div key={dayIndex} className="w-4 h-4" />;
                  }

                  const colorClass = getColorClass(day.count);
                  const isHovered = hoveredDate === day.date;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-4 h-4 rounded-sm transition-all cursor-pointer ${colorClass} ${
                        isHovered ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : ''
                      }`}
                      onMouseEnter={(e) => {
                        setHoveredDate(day.date);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPosition({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredDate(null);
                        setHoveredPosition(null);
                      }}
                      title={day.date ? `${formatDisplayDate(day.date)}: ${day.count}개 커밋` : ''}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 호버 툴팁 */}
      {hoveredDate && hoveredPosition && (
        <div
          className="fixed z-50 bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-lg pointer-events-none"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y - 8}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-xs font-medium">
            {formatSimpleDate(hoveredDate)}
            {hoveredInfo && hoveredInfo.count > 0 && (
              <span className="ml-2 text-slate-300">
                {hoveredInfo.count}개 활동
              </span>
            )}
          </div>
          {/* 말풍선 꼬리 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"
            style={{ bottom: '-4px' }}
          />
        </div>
      )}

      {/* 통계 요약 */}
      <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-slate-500">총 활동일: </span>
          <span className="font-bold text-slate-900">
            {commitData.filter((d) => d.count > 0).length}일
          </span>
        </div>
        <div>
          <span className="text-slate-500">총 활동 수: </span>
          <span className="font-bold text-slate-900">
            {commitData.reduce((sum, d) => sum + d.count, 0)}개
          </span>
        </div>
      </div>
    </div>
  );
};

