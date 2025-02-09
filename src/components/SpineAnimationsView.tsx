import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import { getFullAssetUrl } from '../utils/assetUtils';
import { ListItemButton } from './shared/ListItemButton';

interface SpineAnimationsViewProps {
  assets: string[];
}

declare global {
  interface Window {
    spine: {
      SpinePlayer: new (containerId: string, config: any) => any;
    };
  }
}

export const SpineAnimationsView: React.FC<SpineAnimationsViewProps> = ({ assets }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const txtFiles = useMemo(() => {
    return assets
      .filter(path => 
        path.endsWith('.txt') && 
        !path.endsWith('/.txt')
      )
      .sort();
  }, [assets]);

  useEffect(() => {
    // Cleanup function to destroy the previous player instance
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []); // Run only on component unmount

  useEffect(() => {
    if (!selectedPath || !containerRef.current) return;

    // Cleanup previous player instance
    if (playerRef.current) {
      playerRef.current.stopRendering?.();
      playerRef.current.dispose?.();
      playerRef.current = null;

      containerRef.current.innerHTML='';
    }

    const skeletonUrl = getFullAssetUrl(selectedPath);
    
    const createPlayer = (withAnimation = true) => {
      const config = {
        error: (e: Error) => {
          console.warn(e);
          if (withAnimation) {
            dispose();
            // If initial attempt with animation fails, try without it
            createPlayer(false);
          }
        },
        jsonUrl: skeletonUrl,
        atlasUrl: skeletonUrl.replace('.txt', '.atlas'),
        premultipliedAlpha: true,
        backgroundColor: "#00000000",
        alpha: true,
        showControls: true,
        ...(withAnimation && { animation: "Wait1Loop" })
      };

      playerRef.current = new window.spine.SpinePlayer(containerRef.current, config);
    };

    // Start with the full config including animation
    createPlayer(true);

    const dispose = () => {
      if (playerRef.current) {
        playerRef.current.stopRendering?.();
        playerRef.current.dispose?.();
        playerRef.current = null;
      }
      
      containerRef.current.innerHTML='';
    }

    return dispose;
  }, [selectedPath]); // Re-run when selected path changes

  return (
    <div className="flex-1 flex min-h-0">
      {/* File List */}
      <div className="w-[280px] bg-white/10 border-r border-white/20 flex flex-col">
        <div className="flex-none p-2 text-sm font-medium text-purple-900 border-b border-white/10">
          Spine Animation Files
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-2 space-y-0.5">
            {txtFiles.map((path) => (
              <ListItemButton
                key={path}
                icon={FileText}
                path={path}
                isSelected={selectedPath === path}
                onClick={() => setSelectedPath(path)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-white/5">
        {selectedPath ? (
          <div ref={containerRef} className="w-full h-full" />
        ) : (
          <div className="h-full flex items-center justify-center text-purple-800/60">
            Select a file to preview its animation
          </div>
        )}
      </div>
    </div>
  );
};