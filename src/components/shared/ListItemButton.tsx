import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ListItemButtonProps {
  icon: LucideIcon;
  path: string;
  isSelected?: boolean;
  onClick: () => void;
}

export const ListItemButton: React.FC<ListItemButtonProps> = ({
  icon: Icon,
  path,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-0 py-1 rounded text-xs hover:bg-white/20 transition-colors
        ${isSelected ? 'bg-white/30 text-purple-900' : 'text-purple-800'}
        flex items-center gap-1`}
    >
      <Icon className="w-4 h-4 opacity-60 flex-shrink-0" />
      <span title={path} className="block truncate-left w-full">
        {path}
      </span>
    </button>
  );
};