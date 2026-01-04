'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send } from 'lucide-react';

// 공통 컴포넌트
import { Button } from '@/components/ui/Button';

// 에디터 관련 컴포넌트
import { CoverImageUploader } from '@/components/editor/CoverImageUploader';
import { CoverImageEditorModal } from '@/components/editor/CoverImageEditorModal';
import { EditorTitle } from '@/components/editor/EditorTitle';
import { TagInput } from '@/components/editor/TagInput';
import { BodyEditor } from '@/components/editor/BodyEditor';

// 유틸리티
import getCroppedImg from '@/lib/cropImage';

export default function BlogWritePage() {
  const router = useRouter();
  
  /* --- 1. 상태 관리 (DB 전송 데이터) --- */
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();

  /* --- 2. 커버 이미지 편집 관련 상태 --- */
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* --- 3. 핸들러 함수들 --- */
  
  // 커버 이미지 업로드 트리거
  const handleUploadClick = () => fileInputRef.current?.click();

  // 파일 선택 시 모달 오픈
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      e.target.value = ''; // 동일 파일 재업로드 가능하게 초기화
    }
  };

  // 크롭 이미지 확정 로직 (2단계 캔버스 연산 적용)
  const handleCropConfirm = async (croppedAreaPixels: any) => {
    try {
      if (tempImage && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
        setCoverImage(croppedImage);
        
        // 메모리 누수 방지 및 모달 닫기
        URL.revokeObjectURL(tempImage);
        setTempImage(null);
      }
    } catch (e) {
      console.error('이미지 편집 실패:', e);
    }
  };

  // 최종 발행 로직 (현재는 콘솔 로그)
  const handlePublish = () => {
    const postData = {
      title,
      tags,
      content,
      coverImage,
      updatedAt: new Date().toISOString(),
    };
    console.log('발행될 데이터:', postData);
    // TODO: Firebase 또는 서버 API 호출
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* 상단 액션 바 */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          뒤로가기
        </button>
        <Button 
          onClick={handlePublish}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg shadow-emerald-100 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          발행하기
        </Button>
      </div>

      {/* 커버 이미지 영역 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <CoverImageUploader 
        image={coverImage} 
        onUpload={handleUploadClick} 
        onRemove={() => setCoverImage(undefined)} 
      />

      {/* 이미지 편집 모달 */}
      {tempImage && (
        <CoverImageEditorModal
          tempImage={tempImage}
          onClose={() => {
            URL.revokeObjectURL(tempImage);
            setTempImage(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}

      {/* 제목 입력 영역 */}
      <EditorTitle 
        value={title} 
        onChange={(val) => setTitle(val)}
      />

      {/* 태그 입력 영역 */}
      <TagInput 
        tags={tags} 
        onChange={setTags}
      />

      <hr className="my-8 border-slate-100" />

      {/* 본문 에디터 영역 */}
      <BodyEditor 
        content={content} 
        onChange={setContent} 
        placeholder="당신의 이야기를 들려주세요..."
      />
    </div>
  );
}