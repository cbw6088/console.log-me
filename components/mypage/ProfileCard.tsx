'use client';

import { useState, useRef } from 'react';
import { Github, Settings, Camera, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProfileCardProps {
  profileImage?: string;
  nickname: string;
  bio: string;
  githubUsername?: string;
  githubConnected: boolean;
  onEdit?: () => void;
  onImageChange?: (image: string) => void;
  onContentListClick?: () => void;
}

export const ProfileCard = ({
  profileImage,
  nickname,
  bio,
  githubUsername,
  githubConnected,
  onEdit,
  onImageChange,
  onContentListClick,
}: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState(nickname);
  const [editedBio, setEditedBio] = useState(bio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageChange?.(imageUrl);
        // localStorage에 저장 (임시)
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSave = () => {
    // 저장 로직 (향후 API 연동)
    localStorage.setItem('nickname', editedNickname);
    localStorage.setItem('bio', editedBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNickname(nickname);
    setEditedBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* 프로필 이미지 */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={handleImageUpload}
            className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
            title="프로필 사진 변경"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  한 줄 소개
                </label>
                <input
                  type="text"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="자기소개를 입력하세요"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  저장
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {nickname}
                </h2>
                <p className="text-slate-600 text-sm">
                  {bio || '한 줄 소개를 추가해보세요'}
                </p>
              </div>

              {/* GitHub 연동 정보 */}
              <div className="flex items-center gap-2">
                {githubConnected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-600">
                      GitHub 연동됨
                    </span>
                    {githubUsername && (
                      <a
                        href={`https://github.com/${githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>{githubUsername}</span>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      GitHub 미연동
                    </span>
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1"
                      onClick={() => {
                        // GitHub 연동 로직 (향후 구현)
                        alert('GitHub 연동 기능은 준비 중입니다.');
                      }}
                    >
                      연동하기
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        {!isEditing && (
          <div className="flex flex-col sm:flex-row gap-2">
            {onContentListClick && (
              <Button
                variant="secondary"
                onClick={onContentListClick}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">게시글 목록</span>
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">설정</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

