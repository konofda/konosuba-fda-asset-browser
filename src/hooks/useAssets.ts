import { useQuery } from '@tanstack/react-query';

async function fetchAssets(): Promise<string[]> {
  const response = await fetch('/data/assets.txt');
  if (!response.ok) {
    throw new Error('Failed to load assets');
  }
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    staleTime: Infinity, // Assets don't change during the session
    retry: 2,
  });
}