import { FileText } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useStories, useStoryContent } from '../hooks/useStories';

interface StoriesViewProps {
  assets: string[]; // Required by component interface but not used
}

interface ParsedStory {
  filename: string;
  group: string;
  part: string;
}

function parseStoryFilename(filename: string): ParsedStory {
  const base = filename.replace('.txt', '');
  const part = base.slice(-2);
  const group = base.slice(0, -2);
  return { filename, group, part };
}

function StoryListItem({
  story,
  isSelected,
  onClick,
}: {
  story: ParsedStory;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-white/20 transition-colors
        ${isSelected ? 'bg-white/30 text-purple-900' : 'text-purple-800'}`}
    >
      <div className='flex items-center gap-1.5'>
        <FileText className='w-3.5 h-3.5 opacity-60 flex-shrink-0' />
        <span className='font-medium truncate'>{story.group}</span>
        <span className='font-bold opacity-60 whitespace-nowrap'>p{story.part}</span>
      </div>
    </button>
  );
}

function formatStoryContent(content: string) {
  const lines = content.split('\n');
  if (lines.length === 0) return null;

  const title = lines[0];
  const contentLines = lines.slice(1);

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-purple-900 pb-4 border-b border-purple-200/20'>
        {title}
      </h1>

      <div className='space-y-3'>
        {contentLines.map((line, index) => {
          const dialogueMatch = line.match(/^([^:]+):(.*)/);

          if (dialogueMatch) {
            const [, character, dialogue] = dialogueMatch;
            return (
              <div key={index} className='gap-2'>
                <span className='font-bold text-purple-900 mr-2'>{character}:</span>
                <span className='text-purple-800'>{dialogue.trim()}</span>
              </div>
            );
          }

          if (line.trim()) {
            return (
              <p key={index} className='text-purple-800/70 italic'>
                {line}
              </p>
            );
          }

          return <div key={index} className='h-2' />;
        })}
      </div>
    </div>
  );
}

export const StoriesView: React.FC<StoriesViewProps> = () => {
  const { data: stories = [], isLoading: isLoadingList } = useStories();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const { data: storyContent, isLoading: isLoadingContent, error } = useStoryContent(selectedStory);

  const parsedStories = useMemo(() => {
    return stories.map(parseStoryFilename).sort((a, b) => {
      const groupCompare = a.group.localeCompare(b.group);
      if (groupCompare !== 0) return groupCompare;
      return parseInt(a.part) - parseInt(b.part);
    });
  }, [stories]);

  const renderContent = () => {
    if (!selectedStory) {
      return (
        <div className='h-full flex items-center justify-center text-purple-800/60'>
          Select a story to view its content
        </div>
      );
    }

    if (isLoadingContent) {
      return (
        <div className='h-full flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-12 h-12 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin mb-4' />
            <div className='text-purple-900'>Loading story...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='h-full flex items-center justify-center'>
          <div className='text-center max-w-md mx-auto p-6 bg-white/30 backdrop-blur-md rounded-lg'>
            <div className='text-red-600 text-lg font-semibold mb-2'>Error loading story</div>
            <div className='text-purple-900/80 mb-4'>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </div>
            <button
              onClick={() => setSelectedStory(null)}
              className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
              Go back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className='h-full overflow-auto'>
        <div className='max-w-3xl mx-auto p-8'>{formatStoryContent(storyContent ?? '')}</div>
      </div>
    );
  };

  return (
    <div className='flex-1 flex min-h-0'>
      <div className='w-[280px] bg-white/10 border-r border-white/20 flex flex-col'>
        <div className='flex-none p-2 text-sm font-medium text-purple-900 border-b border-white/10'>
          Story Files
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          {isLoadingList ? (
            <div className='flex items-center justify-center h-32'>
              <div className='w-8 h-8 border-3 border-purple-400 border-t-purple-600 rounded-full animate-spin' />
            </div>
          ) : (
            <div className='p-2 space-y-0.5'>
              {parsedStories.map(story => (
                <StoryListItem
                  key={story.filename}
                  story={story}
                  isSelected={selectedStory === story.filename}
                  onClick={() => setSelectedStory(story.filename)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 bg-white/5'>{renderContent()}</div>
    </div>
  );
};
