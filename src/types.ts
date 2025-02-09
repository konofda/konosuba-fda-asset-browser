import type { DivideIcon as LucideIcon } from 'lucide-react';

export type View = 'files' | 'image-folders' | 'member-cards' | 'member-icons' | 'story-backgrounds' | 'story-stills' | 'search' | 'spine-animations' | 'stories' | 'videos' | 'music' | 'sounds';

export interface TabConfig {
  id: View;
  icon: LucideIcon;
  label: string;
  component: React.FC<{ assets: string[] }> | null;
}