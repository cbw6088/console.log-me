'use client';

import { Calendar, FileText, GitCommit, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'teal';
}

const StatCard = ({ title, value, icon, description, color = 'emerald' }: StatCardProps) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    teal: 'bg-teal-50 border-teal-200 text-teal-600',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

interface StatsCardsProps {
  totalCommits?: number;
  streakDays?: number;
  totalContents?: number;
  thisMonthActivity?: number;
}

export const StatsCards = ({
  totalCommits = 0,
  streakDays = 0,
  totalContents = 0,
  thisMonthActivity = 0,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="총 커밋 수"
        value={totalCommits.toLocaleString()}
        icon={<GitCommit className="w-6 h-6" />}
        description="지금까지의 모든 커밋"
        color="emerald"
      />
      <StatCard
        title="연속 커밋 일수"
        value={streakDays}
        icon={<Calendar className="w-6 h-6" />}
        description="현재 연속 기록"
        color="blue"
      />
      <StatCard
        title="작성한 컨텐츠"
        value={totalContents}
        icon={<FileText className="w-6 h-6" />}
        description="블로그/자소서/포트폴리오"
        color="purple"
      />
      <StatCard
        title="이번 달 활동"
        value={thisMonthActivity}
        icon={<TrendingUp className="w-6 h-6" />}
        description="이번 달 작성 수"
        color="teal"
      />
    </div>
  );
};

