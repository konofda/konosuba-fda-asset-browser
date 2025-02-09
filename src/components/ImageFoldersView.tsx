import { Folder } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';
import { ListItemButton } from './shared/ListItemButton';

interface ImageFoldersViewProps {
  assets: string[];
}

export const ImageFoldersView: React.FC<ImageFoldersViewProps> = ({ assets }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Get unique directory paths and their image files
  const { directories, directoryFiles } = useMemo(() => {
    const dirMap = new Map<string, string[]>();

    assets.forEach(path => {
      const parts = path.split('/');
      // Remove the file name to get the directory path
      const dirPath = parts.slice(0, -1).join('/');

      if (getFileType(path) === 'image') {
        if (!dirMap.has(dirPath)) {
          dirMap.set(dirPath, []);
        }
        dirMap.get(dirPath)!.push(path);
      }
    });

    // Convert to arrays and sort
    const dirs = Array.from(dirMap.keys()).sort();
    const files = Object.fromEntries(dirMap.entries());

    return {
      directories: dirs,
      directoryFiles: files,
    };
  }, [assets]);

  const selectedImages = selectedPath ? directoryFiles[selectedPath] : [];
  const assetGroups = selectedPath ? [{ title: selectedPath, assets: selectedImages }] : [];

  return (
    <div className='flex-1 flex min-h-0'>
      {/* Directory List */}
      <div className='w-[280px] bg-white/10 border-r border-white/20 flex flex-col'>
        <div className='flex-none p-2 text-sm font-medium text-purple-900 border-b border-white/10'>
          Image Folders
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='p-2 space-y-0.5'>
            {directories.map(dir => (
              <ListItemButton
                key={dir}
                icon={Folder}
                path={dir}
                isSelected={selectedPath === dir}
                onClick={() => setSelectedPath(dir)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className='flex-1 bg-white/5'>
        {selectedPath ? (
          <GalleryView assetGroups={assetGroups} />
        ) : (
          <div className='h-full flex items-center justify-center text-purple-800/60'>
            Select a folder to view images
          </div>
        )}
      </div>
    </div>
  );
};
