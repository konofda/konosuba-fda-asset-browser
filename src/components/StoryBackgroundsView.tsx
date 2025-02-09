import React from 'react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface StoryBackgroundsViewProps {
  assets: string[];
}

export const StoryBackgroundsView: React.FC<StoryBackgroundsViewProps> = ({ assets }) => {
  const backgroundImages = assets.filter(path => 
    path.includes('Story/Prefab/Background') && getFileType(path) === 'image'
  );

  const assetGroups = [{
    title: 'Story Backgrounds',
    assets: backgroundImages
  }];

  return <GalleryView assetGroups={assetGroups} />;
};