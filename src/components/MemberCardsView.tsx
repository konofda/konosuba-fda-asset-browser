import React from 'react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface MemberCardsViewProps {
  assets: string[];
}

export const MemberCardsView: React.FC<MemberCardsViewProps> = ({ assets }) => {
  const memberCardImages = assets.filter(path => 
    path.includes('MemberCardFull') && getFileType(path) === 'image'
  );

  const assetGroups = [{
    title: 'Member Cards',
    assets: memberCardImages
  }];

  return <GalleryView assetGroups={assetGroups} />;
};