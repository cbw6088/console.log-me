'use client';

import { useState, useRef, useEffect } from 'react';
import { BookText, FileUser, LayoutGrid, Edit, Trash2, Eye, EyeOff, Calendar, MoreVertical, Folder, FileEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

interface ContentItemProps {
  id: string;
  type: 'blog' | 'resume' | 'portfolio';
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isPublic: boolean;
  coverImage?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  onMoveFolder?: (id: string) => void;
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

export const ContentItem = ({
  id,
  type,
  title,
  createdAt,
  updatedAt,
  isPublic,
  coverImage,
  onEdit,
  onDelete,
  onTogglePublic,
  onRename,
  onMoveFolder,
}: ContentItemProps) => {
  const router = useRouter();
  const config = typeConfig[type];
  const Icon = config.icon;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    } else {
      router.push(`/write/${type}/${id}`);
    }
  };

  const handleTogglePublic = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePublic?.(id);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onRename?.(id, title);
  };

  const handleMoveFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onMoveFolder?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete?.(id);
    }
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer relative">
      {/* 메뉴 버튼 */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="메뉴"
        >
          <MoreVertical className="w-5 h-5 text-slate-600" />
        </button>

        {/* 드롭다운 메뉴 */}
        {isMenuOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <button
              onClick={handleRename}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileEdit className="w-4 h-4" />
              이름 변경
            </button>
            <button
              onClick={handleMoveFolder}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Folder className="w-4 h-4" />
              폴더 이동
            </button>
            <div className="border-t border-slate-200 my-1" />
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {/* 썸네일 또는 아이콘 */}
        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Icon className={`w-8 h-8 ${config.color}`} />
          )}
        </div>

        {/* 컨텐츠 정보 */}
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${config.bgColor} ${config.color}`}>
                  {config.label}
                </span>
                {!isPublic && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    비공개
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {title || '제목 없음'}
              </h3>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>작성: {formatDate(createdAt)}</span>
            </div>
            {new Date(updatedAt).getTime() !== new Date(createdAt).getTime() && (
              <div className="flex items-center gap-1">
                <span>수정: {formatDate(updatedAt)}</span>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="편집"
            >
              <Edit className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={handleTogglePublic}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={isPublic ? '비공개로 변경' : '공개로 변경'}
            >
              {isPublic ? (
                <Eye className="w-4 h-4 text-slate-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

