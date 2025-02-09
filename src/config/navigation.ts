import { FileText, Grid, Users, Mountain as Mountains, Camera, UserCircle, Search as SearchIcon, Play, Book, Video, Music, Volume2 } from 'lucide-react';
import { ImageFoldersView } from '../components/ImageFoldersView';
import { MemberCardsView } from '../components/MemberCardsView';
import { MemberIconsView } from '../components/MemberIconsView';
import { StoryBackgroundsView } from '../components/StoryBackgroundsView';
import { StoryStillsView } from '../components/StoryStillsView';
import { SearchView } from '../components/SearchView';
import { SpineAnimationsView } from '../components/SpineAnimationsView';
import { StoriesView } from '../components/StoriesView';
import { VideosView } from '../components/VideosView';
import { MusicView } from '../components/MusicView';
import { SoundsView } from '../components/SoundsView';
import type { TabConfig } from '../types';

export const TABS: TabConfig[] = [
  { id: 'files', icon: FileText, label: 'Files', component: null },
  { id: 'image-folders', icon: Grid, label: 'Images', component: ImageFoldersView },
  { id: 'member-cards', icon: Users, label: 'Member Cards', component: MemberCardsView },
  { id: 'member-icons', icon: UserCircle, label: 'Member Icons', component: MemberIconsView },
  { id: 'story-backgrounds', icon: Mountains, label: 'Story BG', component: StoryBackgroundsView },
  { id: 'story-stills', icon: Camera, label: 'Story Stills', component: StoryStillsView },
  { id: 'spine-animations', icon: Play, label: 'Spines', component: SpineAnimationsView },
  { id: 'stories', icon: Book, label: 'Stories', component: StoriesView },
  { id: 'videos', icon: Video, label: 'Videos', component: VideosView },
  { id: 'music', icon: Music, label: 'Music', component: MusicView },
  { id: 'sounds', icon: Volume2, label: 'Sounds', component: SoundsView },
  { id: 'search', icon: SearchIcon, label: 'Search', component: SearchView },
];

export function getDefaultView(): string {
  return 'files';
}

export function isValidView(view: string): view is TabConfig['id'] {
  return TABS.some(tab => tab.id === view);
}