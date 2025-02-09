import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { getFullAssetUrl } from '../utils/assetUtils';

interface AssetGroup {
  title: string;
  assets: string[];
}

interface GalleryViewProps {
  assetGroups: AssetGroup[];
}

type ImageSize = 'xs' | 'sm' | 'md';

const SIZE_CLASSES: Record<ImageSize, string> = {
  xs: 'max-h-24',
  sm: 'max-h-48',
  md: 'max-h-64'
};

export const GalleryView: React.FC<GalleryViewProps> = ({ assetGroups }) => {
  const [imageSize, setImageSize] = useState<ImageSize>('md');

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Floating Size Controls */}
      <div className="sticky top-4 z-10 flex justify-end px-4">
        <div className="inline-flex items-center font-bold gap-1 px-3 py-1.5 bg-purple-100/70 backdrop-blur-md border border-white/40 rounded-full shadow-md">
          <div className="text-xs text-purple-900/60 mr-1">Size:</div>
          <button
            onClick={() => setImageSize('xs')}
            className={`px-2 py-0.5 rounded-full text-xs transition-colors flex items-center gap-1
              ${imageSize === 'xs' 
                ? 'bg-purple-600/20 text-purple-900' 
                : 'text-purple-900/60 hover:bg-white/30 hover:text-purple-900'}`}
          >
            <Minimize2 className="w-3 h-3" />
            XS
          </button>
          <button
            onClick={() => setImageSize('sm')}
            className={`px-2 py-0.5 rounded-full text-xs transition-colors
              ${imageSize === 'sm' 
                ? 'bg-purple-600/20 text-purple-900' 
                : 'text-purple-900/60 hover:bg-white/30 hover:text-purple-900'}`}
          >
            SM
          </button>
          <button
            onClick={() => setImageSize('md')}
            className={`px-2 py-0.5 rounded-full text-xs transition-colors flex items-center gap-1
              ${imageSize === 'md' 
                ? 'bg-purple-600/20 text-purple-900' 
                : 'text-purple-900/60 hover:bg-white/30 hover:text-purple-900'}`}
          >
            <Maximize2 className="w-3 h-3" />
            MD
          </button>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {assetGroups.map((group, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-purple-900 mb-4">{group.title}</h2>
            <div className="flex flex-wrap gap-4">
              {group.assets.map((path) => (
                <div
                  key={path}
                  className="inline-block bg-white/10 rounded-lg overflow-hidden hover:ring-2 ring-purple-400 transition-all"
                >
                  <img
                    src={getFullAssetUrl(path)}
                    alt={path.split('/').pop()}
                    className={`w-auto object-contain ${SIZE_CLASSES[imageSize]}`}
                    title={path}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom spacing div - 50vh height */}
        <div className="h-[50vh]" />
      </div>
    </div>
  );
};