import React, { useState, useMemo } from 'react';
import { Video } from 'lucide-react';
import { useVideos } from '../hooks/useVideos';
import { ListItemButton } from './shared/ListItemButton';

interface VideosViewProps {
  assets: string[]; // Required by component interface but not used
}

interface ParsedVideo {
  path: string;
  category: string;
  name: string;
}

function parseVideoPath(path: string): ParsedVideo {
  const parts = path.split('/');
  const name = parts.pop() || '';
  const category = parts.join('/');
  return { path, category, name };
}

function VideoListItem({ video, isSelected, onClick }: { 
  video: ParsedVideo; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-white/20 transition-colors
        ${isSelected ? 'bg-white/30 text-purple-900' : 'text-purple-800'}`}
    >
      <div className="flex items-center gap-1.5">
        <Video className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
        <span className="opacity-60 truncate">{video.category}/</span>
        <span className="font-medium truncate">{video.name}</span>
      </div>
    </button>
  );
}

export const VideosView: React.FC<VideosViewProps> = () => {
  const { data: videos = [], isLoading: isLoadingList } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const parsedVideos = useMemo(() => {
    return videos
      .map(parseVideoPath)
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare !== 0) return categoryCompare;
        return a.name.localeCompare(b.name);
      });
  }, [videos]);

  const renderContent = () => {
    if (!selectedVideo) {
      return (
        <div className="h-full flex items-center justify-center text-purple-800/60">
          Select a video to play
        </div>
      );
    }

    const videoUrl = `https://raw.githubusercontent.com/HaiKonofanDesu/konofan-videos/refs/heads/main/${selectedVideo}`;

    return (
      <div className="h-full flex items-center justify-center bg-black/90">
        <video
          key={videoUrl}
          controls
          autoPlay
          className="max-h-full max-w-full"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <div className="flex-1 flex min-h-0">
      <div className="w-[280px] bg-white/10 border-r border-white/20 flex flex-col">
        <div className="flex-none p-2 text-sm font-medium text-purple-900 border-b border-white/10">
          Video Files
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoadingList ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-3 border-purple-400 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {parsedVideos.map((video) => (
                <VideoListItem
                  key={video.path}
                  video={video}
                  isSelected={selectedVideo === video.path}
                  onClick={() => setSelectedVideo(video.path)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white/5">
        {renderContent()}
      </div>
    </div>
  );
};