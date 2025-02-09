import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KonoTabProps {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const KonoTab: React.FC<KonoTabProps> = ({ icon: Icon, isActive, onClick, children }) => {
  return (
    <button 
      onClick={onClick}
      className={`h-full px-2.5 border-b-2 transition-colors flex items-center gap-1.5
        ${isActive 
          ? 'border-purple-600 text-purple-900 bg-white/10' 
          : 'border-transparent text-purple-900/60 hover:text-purple-900 hover:bg-white/5'}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {children}
    </button>
  );
};