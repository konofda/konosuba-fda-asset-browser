import React from 'react';
import { X } from 'lucide-react';
import type { TabConfig } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabConfig[];
  currentView: string;
  onViewChange: (view: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  tabs,
  currentView,
  onViewChange,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-xl shadow-lg z-50 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="font-medium text-purple-900">Navigation</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-purple-900" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onViewChange(tab.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                      ${currentView === tab.id 
                        ? 'bg-purple-600/10 text-purple-900' 
                        : 'text-purple-900/60 hover:bg-white/40 hover:text-purple-900'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};