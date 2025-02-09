import { ChevronRight, FileText, Folder } from 'lucide-react';
import React from 'react';
import { getFullAssetUrl } from '../utils/assetUtils';
import { AssetViewer } from './AssetViewer';
import { ListItemButton } from './shared/ListItemButton';

interface FileNode {
  path: string;
  type: 'directory' | 'file';
  children?: FileNode[];
}

interface FilesViewProps {
  assets: string[];
  fileTree: FileNode | null;
  currentPath: string[];
  selectedAsset: string | null;
  contents: FileNode[];
  onNavigate: (node: FileNode) => void;
  onNavigateToPath: (index: number) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  currentPath,
  selectedAsset,
  contents,
  onNavigate,
  onNavigateToPath,
}) => {
  return (
    <div className='flex-1 flex min-h-0'>
      {/* File Browser */}
      <div className='w-[280px] bg-white/10 border-r border-white/20 flex flex-col'>
        {/* Breadcrumb Navigation */}
        <div className='flex-none p-1 text-xs text-purple-800/80 border-b border-pink-600/10'>
          <div className='flex items-center flex-wrap gap-1'>
            <button
              onClick={() => onNavigateToPath(-1)}
              className='hover:bg-white/20 px-0.5 py-0 rounded transition-colors inline-flex items-center'
            >
              root
            </button>
            {currentPath.map((folder, index) => (
              <React.Fragment key={index}>
                <ChevronRight className='w-4 h-4 opacity-40' />
                <button
                  onClick={() => onNavigateToPath(index)}
                  className='hover:bg-white/20 px-0.5 py-0 rounded transition-colors'
                >
                  {folder}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='p-2 space-y-0.5'>
            {contents.map(node => (
              <ListItemButton
                key={node.path}
                icon={node.type === 'directory' ? Folder : FileText}
                path={node.path}
                isSelected={selectedAsset === node.path}
                onClick={() => onNavigate(node)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Asset Preview */}
      <div className='flex-1 bg-white/5 overflow-hidden'>
        {selectedAsset ? (
          <AssetViewer url={getFullAssetUrl(selectedAsset)} path={selectedAsset} />
        ) : (
          <div className='h-full flex items-center justify-center text-purple-800/60'>
            Select an asset to preview
          </div>
        )}
      </div>
    </div>
  );
};
