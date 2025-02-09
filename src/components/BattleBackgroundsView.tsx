import React from 'react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface BattleBackgroundsViewProps {
  assets: string[];
}

export const BattleBackgroundsView: React.FC<BattleBackgroundsViewProps> = ({ assets }) => {
  const battleBGImages = assets.filter(
    path =>
      path.includes('BattleBG/Prefabs') &&
      path.includes('bg_battle') &&
      getFileType(path) === 'image'
  );

  const assetGroups = [
    {
      title: 'Battle Backgrounds',
      assets: battleBGImages,
    },
  ];

  return <GalleryView assetGroups={assetGroups} />;
};
