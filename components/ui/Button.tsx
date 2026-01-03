import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, variant = 'primary', className = '', onClick }: ButtonProps) => {
  const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all active:scale-95";
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
    secondary: "border border-slate-200 hover:bg-slate-50 text-slate-900",
    ghost: "text-slate-500 hover:text-emerald-500 bg-transparent"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};