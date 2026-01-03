'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CoverImageUploader } from '@/components/editor/CoverImageUploader';
import { EditorTitle } from '@/components/editor/EditorTitle';
import { TagInput } from '@/components/editor/TagInput';
import { BodyEditor } from '@/components/editor/BodyEditor'; // 추가

export default function BlogWritePage() {
  const router = useRouter();
  
  // 상태 관리 (이 상태들이 나중에 Firebase/GitHub로 전송됩니다)
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 액션 바 */}
      <nav className="h-16 border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">나가기</span>
        </button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="border-none hover:bg-slate-100">임시저장</Button>
          <Button variant="primary" className="px-6 shadow-lg shadow-emerald-100">발행하기</Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 1. 커버 이미지 섹션 */}
        <CoverImageUploader 
          image={coverImage}
          onUpload={() => {}} 
          onRemove={() => setCoverImage(undefined)}
        />

        {/* 2. 제목 & 태그 섹션 */}
        <section className="mb-4">
          <EditorTitle value={title} onChange={setTitle} />
          <TagInput tags={tags} onChange={setTags} />
        </section>

        {/* 3. 본문 에디터 섹션 (컴포넌트로 교체) */}
        <BodyEditor 
          content={content} 
          onChange={setContent} 
          placeholder="이곳에 당신의 이야기를 들려주세요..." 
        />
      </main>
    </div>
  );
}