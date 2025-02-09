import { useQuery } from '@tanstack/react-query';

async function fetchMusic(): Promise<string[]> {
  const response = await fetch('/data/music.txt');
  if (!response.ok) {
    throw new Error('Failed to load music list');
  }
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

export function useMusic() {
  return useQuery({
    queryKey: ['music'],
    queryFn: fetchMusic,
    staleTime: Infinity,
    retry: 2,
  });
}