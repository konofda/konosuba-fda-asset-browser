import { Volume2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useSounds } from '../hooks/useSounds';

interface SoundsViewProps {
  assets: string[]; // Required by component interface but not used
}

interface ParsedSound {
  path: string;
  category: string;
  name: string;
  displayName: string;
}

function parseSoundPath(path: string): ParsedSound {
  // Remove SE/ prefix and .wav extension
  const cleanPath = path.replace(/^SE\//, '').replace(/\.wav$/, '');
  const parts = cleanPath.split('/');

  // Get the category (second folder)
  const category = parts[0];

  // Get everything after the second folder for display
  const displayName = parts.slice(2).join('/');

  // Get the full name without the repeated folder
  const name = parts.slice(1).join('/');

  return { path, category, name, displayName };
}

function SoundListItem({
  sound,
  isSelected,
  onClick,
}: {
  sound: ParsedSound;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={sound.path} // Show full path on hover
      className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-white/20 transition-colors
        ${isSelected ? 'bg-white/30 text-purple-900' : 'text-purple-800'}`}
    >
      <div className='flex items-center gap-1.5'>
        <Volume2 className='w-3.5 h-3.5 opacity-60 flex-shrink-0' />
        <span className='font-medium truncate'>{sound.displayName}</span>
      </div>
    </button>
  );
}

export const SoundsView: React.FC<SoundsViewProps> = () => {
  const { data: sounds = [], isLoading: isLoadingList } = useSounds();
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  const groupedSounds = useMemo(() => {
    const parsed = sounds.map(parseSoundPath);

    // Group by category
    const groups = parsed.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ParsedSound[]>);

    // Sort categories and items within categories
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({
        category,
        items: items.sort((a, b) => a.displayName.localeCompare(b.displayName)),
      }));
  }, [sounds]);

  const renderContent = () => {
    if (!selectedSound) {
      return (
        <div className='h-full flex items-center justify-center text-purple-800/60'>
          Select a sound to play
        </div>
      );
    }

    const audioUrl = `https://raw.githubusercontent.com/HaiKonofanDesu/konofan-audio/refs/heads/main/${selectedSound}`;
    const parsedSound = parseSoundPath(selectedSound);

    return (
      <div className='h-full flex items-center justify-center'>
        <div className='max-w-lg w-full p-8'>
          <div className='bg-white/10 backdrop-blur-md rounded-lg p-6'>
            <div className='flex justify-center mb-6'>
              <Volume2 className='w-16 h-16 text-purple-900/40' />
            </div>
            <div className='text-center mb-6'>
              <div className='text-sm text-purple-900/60 mb-1'>{parsedSound.category}</div>
              <div className='text-lg font-medium text-purple-900'>{parsedSound.displayName}</div>
            </div>
            <audio controls autoPlay className='w-full' src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 flex min-h-0'>
      <div className='w-[280px] bg-white/10 border-r border-white/20 flex flex-col'>
        <div className='flex-none p-2 text-sm font-medium text-purple-900 border-b border-white/10'>
          Sound Effects
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          {isLoadingList ? (
            <div className='flex items-center justify-center h-32'>
              <div className='w-8 h-8 border-3 border-purple-400 border-t-purple-600 rounded-full animate-spin' />
            </div>
          ) : (
            <div className='divide-y divide-white/5'>
              {groupedSounds.map(({ category, items }) => (
                <div key={category}>
                  <div className='px-2 py-1.5 text-[11px] font-medium text-purple-900/70 bg-white/5'>
                    {category}
                  </div>
                  <div className='p-2 space-y-0.5'>
                    {items.map(sound => (
                      <SoundListItem
                        key={sound.path}
                        sound={sound}
                        isSelected={selectedSound === sound.path}
                        onClick={() => setSelectedSound(sound.path)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 bg-white/5'>{renderContent()}</div>
    </div>
  );
};
