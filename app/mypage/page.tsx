'use client';

import { useState, useEffect } from 'react';
import { ProfileCard } from '@/components/mypage/ProfileCard';
import { StatsCards } from '@/components/mypage/StatsCards';
import { GrassVisualization } from '@/components/mypage/GrassVisualization';
import { CommitHistory } from '@/components/mypage/CommitHistory';
import { GrowthGraph } from '@/components/mypage/GrowthGraph';
import { SettingsModal } from '@/components/mypage/SettingsModal';
import { ContentListModal } from '@/components/mypage/ContentListModal';

export default function MyPage() {
  const [profileData, setProfileData] = useState({
    profileImage: '',
    nickname: '사용자',
    bio: '',
    githubUsername: '',
    githubConnected: false,
  });

  const [stats, setStats] = useState({
    totalCommits: 0,
    streakDays: 0,
    totalContents: 0,
    thisMonthActivity: 0,
  });

  const [contents, setContents] = useState<any[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContentListModalOpen, setIsContentListModalOpen] = useState(false);

  // localStorage에서 프로필 데이터 로드
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    const savedNickname = localStorage.getItem('nickname') || '사용자';
    const savedBio = localStorage.getItem('bio') || '';
    const savedGithubUsername = localStorage.getItem('githubUsername') || '';
    const savedGithubConnected = localStorage.getItem('githubConnected') === 'true';

    setProfileData({
      profileImage: savedImage || '',
      nickname: savedNickname,
      bio: savedBio,
      githubUsername: savedGithubUsername,
      githubConnected: savedGithubConnected,
    });

    // 통계 데이터 로드 (임시 - 향후 API에서 가져올 예정)
    const savedTotalCommits = parseInt(localStorage.getItem('totalCommits') || '0');
    const savedStreakDays = parseInt(localStorage.getItem('streakDays') || '0');
    const savedTotalContents = parseInt(localStorage.getItem('totalContents') || '0');
    const savedThisMonthActivity = parseInt(localStorage.getItem('thisMonthActivity') || '0');

    setStats({
      totalCommits: savedTotalCommits,
      streakDays: savedStreakDays,
      totalContents: savedTotalContents,
      thisMonthActivity: savedThisMonthActivity,
    });

    // 컨텐츠 데이터 로드 (임시 - 향후 API에서 가져올 예정)
    const savedContents = localStorage.getItem('contents');
    if (savedContents) {
      try {
        const parsed = JSON.parse(savedContents);
        // 날짜 문자열을 Date 객체로 변환
        const contentsWithDates = parsed.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }));
        setContents(contentsWithDates);
      } catch (e) {
        console.error('컨텐츠 데이터 파싱 실패:', e);
      }
    } else {
      // 테스트용 임시 데이터 생성
      const today = new Date();
      const testContents = [];
      
      // 최근 6개월간의 샘플 데이터 생성
      for (let i = 0; i < 6; i++) {
        const monthDate = new Date(today);
        monthDate.setMonth(today.getMonth() - i);
        
        // 각 월마다 여러 개의 컨텐츠 생성
        const contentsPerMonth = Math.floor(Math.random() * 5) + 2; // 2-6개
        
        for (let j = 0; j < contentsPerMonth; j++) {
          const dayOffset = Math.floor(Math.random() * 28); // 0-27일
          const contentDate = new Date(monthDate);
          contentDate.setDate(1 + dayOffset);
          
          const types: ('blog' | 'resume' | 'portfolio')[] = ['blog', 'resume', 'portfolio'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          
          // 폴더 정보 추가 (일부 컨텐츠에만)
          const folderOptions = [
            { id: 'folder-1', name: '프로젝트' },
            { id: 'folder-2', name: '학습 노트' },
            { id: 'folder-3', name: '포트폴리오' },
            null, // 폴더 없음
          ];
          const selectedFolder = folderOptions[Math.floor(Math.random() * folderOptions.length)];
          
          testContents.push({
            id: `test-${i}-${j}`,
            type: randomType,
            title: `${randomType === 'blog' ? '블로그' : randomType === 'resume' ? '자소서' : '포트폴리오'} 제목 ${i + 1}-${j + 1}`,
            createdAt: new Date(contentDate),
            updatedAt: new Date(contentDate),
            isPublic: Math.random() > 0.3,
            folderId: selectedFolder?.id,
            folderName: selectedFolder?.name,
          });
        }
      }
      
      setContents(testContents);
      // localStorage에도 저장 (선택사항)
      // localStorage.setItem('contents', JSON.stringify(testContents));
    }
  }, []);

  const handleImageChange = (image: string) => {
    setProfileData((prev) => ({ ...prev, profileImage: image }));
  };

  const handleContentEdit = (id: string, type: string) => {
    // 편집 페이지로 이동 (향후 구현)
    console.log('편집:', id, type);
  };

  const handleContentDelete = (id: string) => {
    const updated = contents.filter((c) => c.id !== id);
    setContents(updated);
    localStorage.setItem('contents', JSON.stringify(updated));
    // 통계 업데이트
    setStats((prev) => ({
      ...prev,
      totalContents: updated.length,
    }));
  };

  const handleContentTogglePublic = (id: string) => {
    const updated = contents.map((c) =>
      c.id === id ? { ...c, isPublic: !c.isPublic } : c
    );
    setContents(updated);
    localStorage.setItem('contents', JSON.stringify(updated));
  };

  const handleContentRename = (id: string, newTitle: string) => {
    const updated = contents.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    setContents(updated);
    localStorage.setItem('contents', JSON.stringify(updated));
  };

  const handleContentMoveFolder = (id: string, folderId: string | null, folderName: string | null) => {
    const updated = contents.map((c) =>
      c.id === id ? { ...c, folderId, folderName } : c
    );
    setContents(updated);
    localStorage.setItem('contents', JSON.stringify(updated));
  };

  const handleProfileUpdate = (data: {
    nickname: string;
    bio: string;
    isProfilePublic: boolean;
    profileImage?: string;
  }) => {
    setProfileData((prev) => ({
      ...prev,
      nickname: data.nickname,
      bio: data.bio,
      profileImage: data.profileImage || prev.profileImage,
    }));
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('bio', data.bio);
    localStorage.setItem('isProfilePublic', String(data.isProfilePublic));
    if (data.profileImage) {
      localStorage.setItem('profileImage', data.profileImage);
    }
  };

  const handleNotificationUpdate = (settings: {
    commitSuccess: boolean;
    commitFailure: boolean;
    contentViews: boolean;
  }) => {
    localStorage.setItem('notifications', JSON.stringify(settings));
  };

  const handleGithubReconnect = () => {
    // GitHub 재연동 로직 (향후 구현)
    alert('GitHub 재연동 기능은 준비 중입니다.');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">마이 페이지</h1>
      
      {/* 프로필 카드 섹션 */}
      <div className="mb-8">
        <ProfileCard
          profileImage={profileData.profileImage}
          nickname={profileData.nickname}
          bio={profileData.bio}
          githubUsername={profileData.githubUsername}
          githubConnected={profileData.githubConnected}
          onImageChange={handleImageChange}
          onEdit={() => setIsSettingsModalOpen(true)}
          onContentListClick={() => setIsContentListModalOpen(true)}
        />
      </div>

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
        onNotificationUpdate={handleNotificationUpdate}
        onGithubReconnect={handleGithubReconnect}
        onImageChange={handleImageChange}
      />

      {/* 게시글 목록 모달 */}
      <ContentListModal
        isOpen={isContentListModalOpen}
        onClose={() => setIsContentListModalOpen(false)}
        contents={contents}
        onEdit={handleContentEdit}
        onDelete={handleContentDelete}
        onTogglePublic={handleContentTogglePublic}
        onRename={handleContentRename}
        onMoveFolder={handleContentMoveFolder}
        onUpdateContents={setContents}
      />

      {/* 통계 카드 섹션 */}
      <div className="mb-8">
        <StatsCards
          totalCommits={stats.totalCommits}
          streakDays={stats.streakDays}
          totalContents={stats.totalContents}
          thisMonthActivity={stats.thisMonthActivity}
        />
      </div>

      {/* 잔디 시각화 섹션 */}
      <div className="mb-8">
        <GrassVisualization contents={contents} />
      </div>

      {/* 성장 그래프 섹션 */}
      <div className="mb-8">
        <GrowthGraph contents={contents} />
      </div>

      {/* 커밋 히스토리 섹션 */}
      <div className="mb-8">
        <CommitHistory contents={contents} onContentClick={handleContentEdit} />
      </div>
    </div>
  );
}

