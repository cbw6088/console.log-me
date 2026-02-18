'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Bell, User, Lock, Github, Globe, Eye, EyeOff, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    nickname: string;
    bio: string;
    githubUsername?: string;
    githubConnected: boolean;
    profileImage?: string;
  };
  onProfileUpdate?: (data: {
    nickname: string;
    bio: string;
    isProfilePublic: boolean;
    profileImage?: string;
  }) => void;
  onImageChange?: (image: string) => void;
  onNotificationUpdate?: (settings: {
    commitSuccess: boolean;
    commitFailure: boolean;
    contentViews: boolean;
  }) => void;
  onGithubReconnect?: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  profileData,
  onProfileUpdate,
  onNotificationUpdate,
  onGithubReconnect,
  onImageChange,
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 프로필 설정
  const [nickname, setNickname] = useState(profileData.nickname);
  const [bio, setBio] = useState(profileData.bio);
  const [profileImage, setProfileImage] = useState(profileData.profileImage || '');
  const [isProfilePublic, setIsProfilePublic] = useState(true);

  // 알림 설정
  const [notifications, setNotifications] = useState({
    commitSuccess: true,
    commitFailure: true,
    contentViews: true,
  });

  // 초기값 로드
  useEffect(() => {
    if (isOpen) {
      setNickname(profileData.nickname);
      setBio(profileData.bio);
      setProfileImage(profileData.profileImage || '');
      
      // localStorage에서 설정 불러오기
      const savedProfilePublic = localStorage.getItem('isProfilePublic');
      if (savedProfilePublic !== null) {
        setIsProfilePublic(savedProfilePublic === 'true');
      }

      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
        } catch (e) {
          console.error('알림 설정 파싱 실패:', e);
        }
      }
    }
  }, [isOpen, profileData]);

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
        setProfileImage(imageUrl);
        onImageChange?.(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSaveProfile = () => {
    onProfileUpdate?.({
      nickname,
      bio,
      isProfilePublic,
      profileImage,
    });
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('bio', bio);
    localStorage.setItem('isProfilePublic', String(isProfilePublic));
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
  };

  const handleSaveNotifications = () => {
    onNotificationUpdate?.(notifications);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">설정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-slate-200 px-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              프로필
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'notifications'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              알림
            </div>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'privacy'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              개인정보
            </div>
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">프로필 정보</h3>
                
                {/* 프로필 이미지 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    프로필 사진
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                            {nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleImageUpload}
                        className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
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
                    <div>
                      <Button
                        variant="secondary"
                        onClick={handleImageUpload}
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        이미지 변경
                      </Button>
                      {profileImage && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setProfileImage('');
                            onImageChange?.('');
                            localStorage.removeItem('profileImage');
                          }}
                          className="mt-2 text-sm text-red-500 hover:text-red-600"
                        >
                          이미지 제거
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      닉네임
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="닉네임을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      한 줄 소개
                    </label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="자기소개를 입력하세요"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    저장
                  </Button>
                </div>
              </div>

              {/* GitHub 연동 */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">GitHub 연동</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {profileData.githubConnected ? '연동됨' : '미연동'}
                      </p>
                      {profileData.githubUsername && (
                        <p className="text-sm text-slate-500">
                          {profileData.githubUsername}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (onGithubReconnect) {
                        onGithubReconnect();
                      } else {
                        alert('GitHub 재연동 기능은 준비 중입니다.');
                      }
                    }}
                    variant={profileData.githubConnected ? 'secondary' : 'primary'}
                    className={profileData.githubConnected ? '' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                  >
                    {profileData.githubConnected ? '재연동' : '연동하기'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">알림 설정</h3>
                <p className="text-sm text-slate-500 mb-6">
                  받고 싶은 알림을 선택하세요
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">커밋 성공 알림</p>
                      <p className="text-sm text-slate-500">컨텐츠가 성공적으로 커밋되었을 때 알림</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.commitSuccess}
                        onChange={(e) =>
                          setNotifications((prev) => ({
                            ...prev,
                            commitSuccess: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">커밋 실패 알림</p>
                      <p className="text-sm text-slate-500">커밋이 실패했을 때 알림</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.commitFailure}
                        onChange={(e) =>
                          setNotifications((prev) => ({
                            ...prev,
                            commitFailure: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">컨텐츠 조회수 알림</p>
                      <p className="text-sm text-slate-500">컨텐츠 조회수가 증가했을 때 알림</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.contentViews}
                        onChange={(e) =>
                          setNotifications((prev) => ({
                            ...prev,
                            contentViews: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button
                    onClick={handleSaveNotifications}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">개인정보 설정</h3>
                <p className="text-sm text-slate-500 mb-6">
                  프로필 공개 여부를 설정하세요
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      {isProfilePublic ? (
                        <Globe className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">프로필 공개</p>
                        <p className="text-sm text-slate-500">
                          {isProfilePublic
                            ? '다른 사용자가 내 프로필을 볼 수 있습니다'
                            : '내 프로필이 비공개로 설정됩니다'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isProfilePublic}
                        onChange={(e) => setIsProfilePublic(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

