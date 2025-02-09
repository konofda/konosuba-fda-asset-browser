import { useQuery } from '@tanstack/react-query';

async function fetchStories(): Promise<string[]> {
  const response = await fetch('/data/stories.txt');
  if (!response.ok) {
    throw new Error('Failed to load stories list');
  }
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: Infinity,
    retry: 2,
  });
}

async function fetchStoryContent(filename: string): Promise<string> {
  const response = await fetch(`https://raw.githubusercontent.com/HaiKonofanDesu/konofan-story/refs/heads/main/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load story content for ${filename}`);
  }
  return response.text();
}

export function useStoryContent(filename: string | null) {
  return useQuery({
    queryKey: ['story', filename],
    queryFn: () => fetchStoryContent(filename!),
    enabled: !!filename,
    staleTime: Infinity,
  });
}