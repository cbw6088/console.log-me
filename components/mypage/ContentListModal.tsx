'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, Folder, FolderOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from './ContentItem';

interface ContentMetadata {
  id: string;
  type: 'blog' | 'resume' | 'portfolio';
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isPublic: boolean;
  folderId?: string;
  folderName?: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  parentId?: string | null;
}

interface ContentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  contents: ContentMetadata[];
  onEdit?: (id: string, type: string) => void;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  onMoveFolder?: (id: string, folderId: string | null, folderName: string | null) => void;
  onUpdateContents?: (updatedContents: ContentMetadata[]) => void;
}

const ITEMS_PER_PAGE = 10;

export const ContentListModal = ({
  isOpen,
  onClose,
  contents,
  onEdit,
  onDelete,
  onTogglePublic,
  onRename,
  onMoveFolder,
  onUpdateContents,
}: ContentListModalProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameContentId, setRenameContentId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [isMoveFolderModalOpen, setIsMoveFolderModalOpen] = useState(false);
  const [moveContentId, setMoveContentId] = useState<string | null>(null);
  const [foldersRefreshKey, setFoldersRefreshKey] = useState(0);
  const [selectedMoveFolderId, setSelectedMoveFolderId] = useState<string | null>(null);

  // 폴더 이동 모달용 폴더 목록 (중첩 구조 포함) - 항상 계산
  const moveFolders = useMemo(() => {
    const folderMap = new Map<string, { id: string; name: string; count: number; parentId?: string | null }>();
    
    if (typeof window !== 'undefined') {
      const savedFolders = localStorage.getItem('folders');
      const savedFoldersList = savedFolders ? JSON.parse(savedFolders) : [];
      
      savedFoldersList.forEach((folder: { id: string; name: string; parentId?: string | null }) => {
        folderMap.set(folder.id, {
          id: folder.id,
          name: folder.name,
          count: 0,
          parentId: folder.parentId || null,
        });
      });
    }
    
    contents.forEach((content) => {
      if (content.folderId && content.folderName) {
        const existing = folderMap.get(content.folderId);
        if (existing) {
          existing.count += 1;
        } else {
          // 폴더가 저장된 목록에 없으면 추가
          // localStorage에서 해당 폴더의 parentId 정보 찾기
          let parentId: string | null = null;
          if (typeof window !== 'undefined') {
            const savedFolders = localStorage.getItem('folders');
            const savedFoldersList = savedFolders ? JSON.parse(savedFolders) : [];
            const savedFolder = savedFoldersList.find((f: { id: string }) => f.id === content.folderId);
            parentId = savedFolder?.parentId || null;
          }
          
          folderMap.set(content.folderId, {
            id: content.folderId,
            name: content.folderName,
            count: 1,
            parentId: parentId,
          });
        }
      }
    });
    
    // 모든 폴더 반환 (중첩 구조 포함)
    return Array.from(folderMap.values());
  }, [contents, foldersRefreshKey]);

  // 선택된 폴더의 자식 폴더 가져오기 함수
  const getChildFolders = (parentId: string | null) => {
    return moveFolders.filter((f) => f.parentId === parentId);
  };

  // 폴더 목록 생성
  const folders = useMemo(() => {
    const folderMap = new Map<string, { id: string; name: string; count: number; parentId?: string | null }>();
    
    // 전체 폴더 추가
    folderMap.set('all', { id: 'all', name: '전체', count: contents.length });
    
    // localStorage에서 저장된 폴더 목록 가져오기 (클라이언트에서만)
    if (typeof window !== 'undefined') {
      const savedFolders = localStorage.getItem('folders');
      const savedFoldersList = savedFolders ? JSON.parse(savedFolders) : [];
      
      // 저장된 폴더들을 먼저 추가 (count는 0으로 시작)
      savedFoldersList.forEach((folder: { id: string; name: string; parentId?: string | null }) => {
        folderMap.set(folder.id, {
          id: folder.id,
          name: folder.name,
          count: 0,
          parentId: folder.parentId || null,
        });
      });
    }
    
    // 각 컨텐츠의 폴더 정보 수집 및 카운트 업데이트
    contents.forEach((content) => {
      if (content.folderId && content.folderName) {
        const existing = folderMap.get(content.folderId);
        if (existing) {
          existing.count += 1;
        } else {
          let parentId: string | null = null;
          if (typeof window !== 'undefined') {
            const savedFolders = localStorage.getItem('folders');
            const savedFoldersList = savedFolders ? JSON.parse(savedFolders) : [];
            const savedFolder = savedFoldersList.find((f: { id: string }) => f.id === content.folderId);
            parentId = savedFolder?.parentId || null;
          }
          
          folderMap.set(content.folderId, {
            id: content.folderId,
            name: content.folderName,
            count: 1,
            parentId: parentId,
          });
        }
      }
    });
    
 
    const rootFolders = Array.from(folderMap.values()).filter(
      (folder) => folder.id === 'all' || !folder.parentId
    );
    
    // 모든 폴더 반환 (루트 + 하위 폴더 모두)
    const allFolders = Array.from(folderMap.values());
    
    if (selectedFolderId && selectedFolderId !== 'all') {
      const selectedFolder = allFolders.find((f) => f.id === selectedFolderId);
      const childFolders = allFolders.filter(
        (folder) => folder.parentId === selectedFolderId
      );
      
      if (selectedFolder?.parentId) {
        // 선택된 폴더가 하위 폴더인 경우, 부모 폴더의 자식들도 표시
        const parentChildFolders = allFolders.filter(
          (folder) => folder.parentId === selectedFolder.parentId
        );
        return [...rootFolders, ...parentChildFolders];
      }
      
      // 선택된 폴더의 자식 폴더 표시
      return [...rootFolders, ...childFolders];
    }
    
    return rootFolders;
  }, [contents, selectedFolderId, foldersRefreshKey]);

  // 선택된 폴더의 컨텐츠 필터링
  const filteredContents = useMemo(() => {
    let filtered = contents;
    
    if (selectedFolderId && selectedFolderId !== 'all') {
      filtered = contents.filter((content) => content.folderId === selectedFolderId);
    }
    
    // 최신순 정렬
    return filtered.sort((a, b) => {
      const dateA = typeof a.updatedAt === 'string' ? new Date(a.updatedAt) : a.updatedAt;
      const dateB = typeof b.updatedAt === 'string' ? new Date(b.updatedAt) : b.updatedAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [contents, selectedFolderId]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContents = filteredContents.slice(startIndex, endIndex);

  // 폴더 변경 시 첫 페이지로 리셋
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setCurrentPage(1);
  };

  // 폴더 생성
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    if (typeof window === 'undefined') return; // 클라이언트에서만 실행
    
    const newFolderId = `folder-${Date.now()}`;
    const newFolderName_trimmed = newFolderName.trim();
    
    // 선택된 폴더가 'all'이 아니면 해당 폴더를 부모로 설정
    const parentId = selectedFolderId && selectedFolderId !== 'all' ? selectedFolderId : null;
    
    // localStorage에서 저장된 폴더 목록 가져오기
    const savedFolders = localStorage.getItem('folders');
    const folders = savedFolders ? JSON.parse(savedFolders) : [];
    
    // 새 폴더 추가
    const newFolder = {
      id: newFolderId,
      name: newFolderName_trimmed,
      parentId: parentId,
    };
    
    const updatedFolders = [...folders, newFolder];
    localStorage.setItem('folders', JSON.stringify(updatedFolders));
    
    setIsCreatingFolder(false);
    setNewFolderName('');
    
    // 폴더 목록 새로고침
    setFoldersRefreshKey((prev) => prev + 1);
    
    // 새로 생성된 폴더를 선택 상태로 변경
    setSelectedFolderId(newFolderId);
  };

  // 이름 변경 핸들러
  const handleRenameClick = (id: string, currentTitle: string) => {
    setRenameContentId(id);
    setRenameTitle(currentTitle);
    setIsRenameModalOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameContentId && renameTitle.trim()) {
      onRename?.(renameContentId, renameTitle.trim());
      setIsRenameModalOpen(false);
      setRenameContentId(null);
      setRenameTitle('');
    }
  };

  // 폴더 이동 핸들러
  const handleMoveFolderClick = (id: string) => {
    setMoveContentId(id);
    setSelectedMoveFolderId(null);
    setIsMoveFolderModalOpen(true);
  };

  const handleMoveFolderSelect = (folderId: string | null) => {
    setSelectedMoveFolderId(folderId);
  };

  const handleMoveFolderConfirm = () => {
    if (moveContentId) {
      const selectedFolder = folders.find((f) => f.id === selectedMoveFolderId);
      const folderName = selectedFolder ? selectedFolder.name : null;
      onMoveFolder?.(moveContentId, selectedMoveFolderId, folderName);
      setIsMoveFolderModalOpen(false);
      setMoveContentId(null);
      setSelectedMoveFolderId(null);
      setFoldersRefreshKey((prev) => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">게시글 목록</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측 폴더 사이드바 */}
          <div className="w-64 border-r border-slate-200 overflow-y-auto bg-slate-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">폴더</h3>
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  title="폴더 생성"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              
              {/* 폴더 생성 입력 */}
              {isCreatingFolder && (
                <div className="mb-2 p-2 bg-white rounded-lg border border-emerald-200">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFolder();
                      } else if (e.key === 'Escape') {
                        setIsCreatingFolder(false);
                        setNewFolderName('');
                      }
                    }}
                    placeholder="폴더 이름 입력"
                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={handleCreateFolder}
                      className="flex-1 px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                    >
                      생성
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderName('');
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {folders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id || (!selectedFolderId && folder.id === 'all');
                  const Icon = isSelected ? FolderOpen : Folder;
                  const isChildFolder = folder.parentId !== null && folder.parentId !== undefined;
                  
                  // 실제 count 계산 (하위 폴더 포함)
                  const actualCount = contents.filter((c) => c.folderId === folder.id).length;
                  
                  return (
                    <div key={folder.id} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFolderSelect(folder.id);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className={`text-sm font-medium ${isChildFolder ? 'pl-4' : ''}`}>
                            {isChildFolder && '└ '}
                            {folder.name}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {actualCount}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 우측 컨텐츠 목록 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 min-h-[500px]">
              {paginatedContents.length > 0 ? (
                <div className="space-y-3">
                  {paginatedContents.map((content) => (
                    <ContentItem
                      key={content.id}
                      {...content}
                      onEdit={(id) => onEdit?.(id, content.type)}
                      onDelete={onDelete}
                      onTogglePublic={onTogglePublic}
                      onRename={handleRenameClick}
                      onMoveFolder={handleMoveFolderClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 min-h-[500px] flex flex-col items-center justify-center">
                  <p className="text-lg font-medium mb-2">게시글이 없습니다</p>
                  <p className="text-sm">
                    {selectedFolderId && selectedFolderId !== 'all'
                      ? '이 폴더에 게시글이 없습니다'
                      : '게시글을 작성해보세요'}
                  </p>
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 p-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {startIndex + 1}-{Math.min(endIndex, filteredContents.length)} / {filteredContents.length}개
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // 페이지가 많을 경우 일부만 표시
                      if (totalPages > 7) {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                currentPage === page
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-slate-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-emerald-500 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이름 변경 모달 */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">이름 변경</h3>
            <input
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameConfirm();
                } else if (e.key === 'Escape') {
                  setIsRenameModalOpen(false);
                }
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              placeholder="새 이름을 입력하세요"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsRenameModalOpen(false);
                  setRenameTitle('');
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRenameConfirm}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 폴더 이동 모달 */}
      {isMoveFolderModalOpen && (() => {
        const rootFolders = getChildFolders(null);
        
        // 선택된 폴더가 하위 폴더인 경우, 그 부모 폴더도 찾기
        const selectedFolder = selectedMoveFolderId ? moveFolders.find((f) => f.id === selectedMoveFolderId) : null;
        const parentFolderId = selectedFolder?.parentId;
        
        // 표시할 자식 폴더들: 선택된 폴더가 루트 폴더면 그 자식들, 하위 폴더면 부모의 자식들
        const displayedChildFolders = selectedMoveFolderId 
          ? (parentFolderId ? getChildFolders(parentFolderId) : getChildFolders(selectedMoveFolderId))
          : [];

        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => {
            // 모달 배경 클릭 시 모달 닫기 방지 (선택적으로)
            e.stopPropagation();
          }}>
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">폴더 이동</h3>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {/* 폴더 없음 옵션 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveFolderSelect(null);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg transition-colors ${
                    selectedMoveFolderId === null
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">폴더 없음</span>
                </button>

                {/* 루트 폴더들 */}
                {rootFolders.map((folder: { id: string; name: string; count: number; parentId?: string | null }) => {
                  const isSelected = selectedMoveFolderId === folder.id;
                  const isExpanded = isSelected || (parentFolderId === folder.id); // 선택된 폴더의 부모면 펼침
                  const hasChildren = getChildFolders(folder.id).length > 0;
                  const childFolders = getChildFolders(folder.id);
                  
                  return (
                    <div key={folder.id} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveFolderSelect(folder.id);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <Folder className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm flex-1">{folder.name}</span>
                        <span className="text-xs text-slate-500">({folder.count})</span>
                        {hasChildren && (
                          <span className="text-xs text-slate-400 ml-2">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        )}
                      </button>
                      
                      {/* 펼쳐진 폴더의 자식 폴더 표시 */}
                      {isExpanded && childFolders.length > 0 && (
                        <div className="pl-4 mt-1 space-y-1" onClick={(e) => e.stopPropagation()}>
                          {childFolders.map((childFolder: { id: string; name: string; count: number; parentId?: string | null }) => {
                            const isChildSelected = selectedMoveFolderId === childFolder.id;
                            return (
                              <button
                                key={childFolder.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveFolderSelect(childFolder.id);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg transition-colors ${
                                  isChildSelected
                                    ? 'bg-emerald-50 border border-emerald-200'
                                    : 'hover:bg-slate-50'
                                }`}
                              >
                                <Folder className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm">└ {childFolder.name}</span>
                                <span className="ml-auto text-xs text-slate-500">({childFolder.count})</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsMoveFolderModalOpen(false);
                    setMoveContentId(null);
                    setSelectedMoveFolderId(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleMoveFolderConfirm}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  이동
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

