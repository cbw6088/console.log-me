interface EditorTitleProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  }
  
  export const EditorTitle = ({ value, onChange, placeholder = "제목을 입력하세요" }: EditorTitleProps) => {
    return (
      <div className="group mb-8">
        <textarea 
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder={placeholder}
          rows={1}
          className="w-full text-2xl md:text-3xl font-extrabold placeholder:text-slate-200 border-none focus:ring-0 resize-none overflow-hidden bg-transparent p-0 transition-all"
        />
        {/* 포커스 시 길어지는 밑선 */}
        <div className="h-1 w-20 bg-slate-100 group-focus-within:w-full group-focus-within:bg-emerald-500 transition-all duration-500" />
      </div>
    );
  };