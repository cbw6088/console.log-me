'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core'; 
import { EditorToolbar } from './EditorToolbar';
import { Maximize, Minimize, StretchHorizontal, RefreshCcw } from 'lucide-react';

/* --- 1. 이미지 확장: 너비 조절 및 원본 크기 유지 --- */
const ExtendedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 'auto',
        renderHTML: attributes => ({
          style: `width: ${attributes.width}; height: auto; max-width: 100%;`,
        }),
      },
    };
  },
});

/* --- 2. 폰트 사이즈 확장: setFontSize 명령어 등록 --- */
const CustomFontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      // 💡 툴바에서 호출하는 바로 그 함수입니다.
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

export const BodyEditor = ({ content, onChange, placeholder, isPublic, onPublicChange }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3, 4] } 
      }),
      TextStyle, // 💡 폰트 사이즈 적용을 위한 필수 확장
      CustomFontSize, // 💡 직접 만든 폰트 사이즈 명령어 등록
      ExtendedImage.configure({ allowBase64: true }),
      Placeholder.configure({ 
        placeholder: placeholder || '내용을 입력하세요...' 
      }),
      BubbleMenuExtension,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // prose-p:my-1 로 줄바꿈 간격을 자연스럽게 조정했습니다.
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] text-slate-700 p-4 prose-headings:font-bold',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="relative group">
      {/* 상단 툴바 */}
      <EditorToolbar editor={editor} isPublic={isPublic} onPublicChange={onPublicChange} />

      {/* 이미지 클릭 시 나타나는 버블 메뉴 */}
      {editor && (
        <BubbleMenu 
          editor={editor}
          shouldShow={({ editor }) => editor.isActive('image')}
        >
          {/* globals.css에 설정한 z-index와 간격이 적용됩니다. */}
          <div className="relative z-[9999] flex items-center gap-1 p-1.5 bg-white border border-slate-200 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            >
              <Minimize className="w-3.5 h-3.5" /> 25%
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            >
              <StretchHorizontal className="w-3.5 h-3.5" /> 50%
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            >
              <Maximize className="w-3.5 h-3.5" /> 100%
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().updateAttributes('image', { width: 'auto' }).run()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> 원본
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* 에디터 본문 영역 */}
      <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 min-h-[600px] transition-all group-focus-within:bg-white group-focus-within:border-emerald-100">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};