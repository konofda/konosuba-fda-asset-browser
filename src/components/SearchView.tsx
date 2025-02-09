import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { getFileType } from '../utils/assetUtils';
import { GalleryView } from './GalleryView';

interface SearchViewProps {
  assets: string[];
}
const EXAMPLE_QUERIES_STR = `
CharacterImage
top_bg
stage_info_
BattleBG bg_battle
EnemyImage
IconEnemy
IconWeapon
IconAccessory
IconMaterial
IconAssist
IconBackground
IconStill
StoryChapterImage
MainQuestBg
IconQuestStageBg
CharacterEnhance_Stage
IconHonor
stamp
Num
IconSkill
IconPiece
IconExchange
Icon Ticket
UnitIcon
shop_item
eyecatching
EyecatchLoading
GachaAnim4Star !Default-ParticleSystem !eft_star !eyecatch
GachaAnim4Star eyecatch
GachaContinuationWindow
loginbonus_logo_
dungeon_banner
bg_dungeon
WindowAnime
/Unit/
boss button
grade
event btn
StateIconList
/Screen
`
const EXAMPLE_QUERIES = EXAMPLE_QUERIES_STR.split('\n').map(s => s.trim()).filter(Boolean);

export const SearchView: React.FC<SearchViewProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentQuery('');
      return;
    }

    const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
    const includeTerms: string[] = [];
    const excludeTerms: string[] = [];

    // Separate include and exclude terms
    searchWords.forEach(word => {
      if (word.startsWith('!')) {
        excludeTerms.push(word.slice(1)); // Remove the ! prefix
      } else {
        includeTerms.push(word);
      }
    });
    
    const results = assets.filter(path => {
      const pathLower = path.toLowerCase();
      
      // Check if path includes all required terms
      const hasAllIncludeTerms = includeTerms.every(term => pathLower.includes(term));
      
      // Check if path excludes all negative terms
      const hasNoExcludeTerms = excludeTerms.every(term => !pathLower.includes(term));
      
      return hasAllIncludeTerms && hasNoExcludeTerms && getFileType(path) === 'image';
    });

    setSearchResults(results);
    setCurrentQuery(query);
  };

  const handleSearch = () => {
    performSearch(searchTerm);
  };

  const handleExampleClick = (query: string) => {
    setSearchTerm(query);
    // Immediately trigger search
    setTimeout(() => performSearch(query), 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentQuery('');
    setSearchResults([]);
  };

  const showSearchButton = searchTerm.trim() && searchTerm !== currentQuery;
  const showClearButton = searchTerm && searchTerm === currentQuery;

  const resultsCount = searchResults.length.toLocaleString();
  const assetGroups = searchResults.length > 0 
  ? [{ 
      title: `${resultsCount} Search Results for "${currentQuery}"`, 
      assets: searchResults 
    }]
  : [];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 bg-white/10 border-b border-white/20">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Search for images... (Use "!" to exclude terms, e.g. "unit !thmb")'
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-purple-900 placeholder-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {showSearchButton && (
                <button
                  onClick={handleSearch}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-purple-900"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
              {showClearButton && (
                <button
                  onClick={clearSearch}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-purple-900/60"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        {currentQuery ? (
          <GalleryView assetGroups={assetGroups} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-purple-800/60 mb-6">
              Try searching for one of these examples:
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4">
              {EXAMPLE_QUERIES.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(query)}
                  className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 text-purple-900 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 active:scale-95"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};