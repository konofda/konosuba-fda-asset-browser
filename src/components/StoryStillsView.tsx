import React from 'react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface StoryStillsViewProps {
  assets: string[];
}

export const StoryStillsView: React.FC<StoryStillsViewProps> = ({ assets }) => {
  const stillImages = assets.filter(
    path => path.includes('Story/Prefab/Sprite/Still') && getFileType(path) === 'image'
  );

  const assetGroups = [
    {
      title: 'Story Stills',
      assets: stillImages,
    },
  ];

  return <GalleryView assetGroups={assetGroups} />;
};
