import React from 'react';
import { Loader2 } from 'lucide-react';

interface ToonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ton';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const ToonButton: React.FC<ToonButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "relative font-bold py-3 px-6 rounded-2xl transition-all active:translate-y-1 active:shadow-none focus:outline-none flex items-center justify-center gap-2 no-tap-highlight";
  
  const variants = {
    primary: "bg-hyp-purple text-white shadow-[0_6px_0_rgb(109,40,217)] hover:bg-hyp-purple-dark",
    secondary: "bg-slate-600 text-white shadow-[0_6px_0_rgb(51,65,85)] hover:bg-slate-700",
    danger: "bg-hyp-pink text-white shadow-[0_6px_0_rgb(190,24,93)] hover:bg-hyp-pink-dark",
    success: "bg-green-500 text-white shadow-[0_6px_0_rgb(21,128,61)] hover:bg-green-600",
    ton: "bg-[#0098EA] text-white shadow-[0_6px_0_rgb(0,119,181)] hover:bg-[#0088D1]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

export const ToonCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-hyp-card rounded-3xl p-5 border-2 border-slate-600 shadow-lg ${className}`}>
      {title && <h3 className="text-xl font-black text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ToonModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-hyp-dark rounded-3xl w-full max-w-sm border-4 border-hyp-purple p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
