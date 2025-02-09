import { useQuery } from '@tanstack/react-query';

async function fetchVideos(): Promise<string[]> {
  const response = await fetch('/data/videos.txt');
  if (!response.ok) {
    throw new Error('Failed to load videos list');
  }
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: Infinity,
    retry: 2,
  });
}