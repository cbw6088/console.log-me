'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'; // 💡 필수
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core'; 
import { EditorToolbar } from './EditorToolbar';
import { Maximize, Minimize, StretchHorizontal, RefreshCcw } from 'lucide-react';

/* --- 이미지 확장 (기존 로직 유지) --- */
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

/* --- 폰트 사이즈 확장 (기존 로직 유지) --- */
const CustomFontSize = Extension.create({ /* ...생략... */ });

export const BodyEditor = ({ content, onChange, placeholder }: any) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
        TextStyle,
        CustomFontSize,
        ExtendedImage.configure({ allowBase64: true }),
        Placeholder.configure({ placeholder: placeholder || '내용을 입력하세요...' }),
        BubbleMenuExtension,
      ],
      content: content,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
            class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] text-slate-700 p-4 prose-headings:font-bold prose-p:m-0',
        },
      },
    });
  
    if (!editor) return null;
  
    return (
        <div className="relative group">
          <EditorToolbar editor={editor} />
    
          {editor && (
            <BubbleMenu 
              editor={editor}
              shouldShow={({ editor }) => editor.isActive('image')}
            >
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
    
          <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 min-h-[600px] transition-all group-focus-within:bg-white group-focus-within:border-emerald-100">
            <EditorContent editor={editor} />
          </div>
        </div>
    );
};