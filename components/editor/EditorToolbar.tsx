'use client';

import { useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Image as ImageIcon, 
  Type, 
  List 
} from 'lucide-react';

interface EditorToolbarProps {
  editor: any;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  // 숨겨진 file input을 참조하기 위한 useRef
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  // 이미지 버튼 클릭 시 실행
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일이 선택되었을 때 실행되는 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        // Tiptap 에디터에 이미지 삽입
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    }
    
    // 파일 선택 후 초기화 (같은 파일을 다시 선택할 수 있도록)
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 mb-4 bg-white border border-slate-200 rounded-2xl sticky top-20 z-40 shadow-sm">
      
      {/* 1. 글꼴 크기 드롭다운 */}
      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl mr-2 border border-slate-100">
        <Type className="w-4 h-4 text-slate-400" />
        <select 
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size.replace('px', '')}</option>
          ))}
        </select>
      </div>

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      {/* 2. H1 ~ H4 제목 버튼 */}
      {[1, 2, 3, 4].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
            editor.isActive('heading', { level }) 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
        >
          H{level}
        </button>
      ))}

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      {/* 3. 기본 텍스트 스타일 버튼 (Bold, Italic) */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-500'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-500'}`}
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      {/* 4. 리스트 버튼 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-500'}`}
      >
        <List className="w-4 h-4" />
      </button>

      {/* 5. 이미지 삽입 버튼 */}
      <button
        type="button"
        onClick={handleImageClick}
        className="p-2 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors"
        title="이미지 추가"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      {/* 숨겨진 파일 인풋 (화면에는 보이지 않음) */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};