import React, { useMemo } from 'react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface MemberIconsViewProps {
  assets: string[];
}

export const MemberIconsView: React.FC<MemberIconsViewProps> = ({ assets }) => {
  const assetGroups = useMemo(() => {
    // First, filter for member icon images
    const iconImages = assets.filter(path => 
      path.includes('Icon') && 
      path.includes('Member') && 
      !path.includes('Ticket') && 
      getFileType(path) === 'image'
    );

    // Group by folder
    const groupedByFolder = iconImages.reduce((groups: Record<string, string[]>, path) => {
      const folderPath = path.split('/').slice(0, -1).join('/');
      if (!groups[folderPath]) {
        groups[folderPath] = [];
      }
      groups[folderPath].push(path);
      return groups;
    }, {});

    // Convert to array of groups and sort by folder name
    return Object.entries(groupedByFolder)
      .map(([folder, paths]) => ({
        title: folder,
        assets: paths.sort()
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [assets]);

  return <GalleryView assetGroups={assetGroups} />;
};