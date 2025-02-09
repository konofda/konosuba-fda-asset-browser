import { useQuery } from '@tanstack/react-query';

async function fetchSounds(): Promise<string[]> {
  const response = await fetch('/data/sounds.txt');
  if (!response.ok) {
    throw new Error('Failed to load sounds list');
  }
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

export function useSounds() {
  return useQuery({
    queryKey: ['sounds'],
    queryFn: fetchSounds,
    staleTime: Infinity,
    retry: 2,
  });
}