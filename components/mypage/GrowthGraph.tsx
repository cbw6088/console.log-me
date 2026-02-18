'use client';

import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileText, GitCommit } from 'lucide-react';

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white rounded-lg px-3 py-2 shadow-lg border border-slate-700">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}개
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface GrowthGraphProps {
  contents: Array<{
    id: string;
    type: 'blog' | 'resume' | 'portfolio';
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
}

interface MonthlyData {
  month: string;
  blog: number;
  resume: number;
  portfolio: number;
  total: number;
  commits: number;
}

const formatDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const GrowthGraph = ({ contents }: GrowthGraphProps) => {
  // 월별 데이터 집계
  const monthlyData = useMemo(() => {
    const data: Record<string, MonthlyData> = {};
    const currentYear = new Date().getFullYear();
    
    // 올해 1월부터 현재 월까지 초기화
    const today = new Date();
    const currentMonth = today.getMonth();
    
    for (let month = 0; month <= currentMonth; month++) {
      const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      data[monthKey] = {
        month: `${month + 1}월`,
        blog: 0,
        resume: 0,
        portfolio: 0,
        total: 0,
        commits: 0,
      };
    }

    // 컨텐츠별로 집계
    contents.forEach((content) => {
      const createdDate = formatDate(content.createdAt);
      const updatedDate = formatDate(content.updatedAt);
      
      // 올해 데이터만 집계
      if (createdDate.getFullYear() === currentYear) {
        const monthKey = `${currentYear}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        if (data[monthKey]) {
          data[monthKey][content.type]++;
          data[monthKey].total++;
          data[monthKey].commits++;
        }
      }

      // 수정일이 다르면 수정일에도 추가
      if (updatedDate.getTime() !== createdDate.getTime() && updatedDate.getFullYear() === currentYear) {
        const monthKey = `${currentYear}-${String(updatedDate.getMonth() + 1).padStart(2, '0')}`;
        if (data[monthKey]) {
          data[monthKey].commits++;
        }
      }
    });

    return Object.values(data);
  }, [contents]);

  // 성장 지표 계산
  const growthMetrics = useMemo(() => {
    if (monthlyData.length === 0) {
      return {
        totalGrowth: 0,
        averageMonthly: 0,
        bestMonth: null as string | null,
        bestMonthCount: 0,
      };
    }

    const totalGrowth = monthlyData.reduce((sum, d) => sum + d.total, 0);
    const averageMonthly = totalGrowth / monthlyData.length;
    const bestMonth = monthlyData.reduce((best, current) => 
      current.total > best.total ? current : best
    );

    return {
      totalGrowth,
      averageMonthly: Math.round(averageMonthly * 10) / 10,
      bestMonth: bestMonth.month,
      bestMonthCount: bestMonth.total,
    };
  }, [monthlyData]);

  return (
    <div id="growth-graph" className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">성장 그래프</h2>
        <p className="text-sm text-slate-500">월별 컨텐츠 작성 추이를 확인하세요</p>
      </div>

      {/* 성장 지표 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">총 작성 수</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{growthMetrics.totalGrowth}개</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">월평균</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{growthMetrics.averageMonthly}개</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">최고 달</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {growthMetrics.bestMonth || '-'}
          </p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">최고 달 작성</span>
          </div>
          <p className="text-2xl font-bold text-teal-900">{growthMetrics.bestMonthCount}개</p>
        </div>
      </div>

      {/* 월별 작성 추이 그래프 (바 차트) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">월별 작성 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              position={{ x: undefined, y: undefined }}
              allowEscapeViewBox={{ x: false, y: false }}
              shared={true}
              isAnimationActive={false}
            />
            <Legend />
            <Bar dataKey="blog" stackId="a" fill="#3b82f6" name="블로그" />
            <Bar dataKey="resume" stackId="a" fill="#a855f7" name="자소서" />
            <Bar dataKey="portfolio" stackId="a" fill="#10b981" name="포트폴리오" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 커밋 활동 추이 그래프 (라인 차트) */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">커밋 활동 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
              position={{ x: undefined, y: undefined }}
              allowEscapeViewBox={{ x: false, y: false }}
              shared={false}
              isAnimationActive={false}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="commits" 
              stroke="#10b981" 
              strokeWidth={2}
              name="커밋 수"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

