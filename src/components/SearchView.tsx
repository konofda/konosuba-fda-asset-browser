import { Search, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

import { getFileType } from "../utils/assetUtils";
import { GalleryView } from "./GalleryView";

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
`;
const EXAMPLE_QUERIES = EXAMPLE_QUERIES_STR.split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * SearchView component for filtering and displaying image assets.
 * Search is triggered only on:
 * - Initial page load (from URL params)
 * - Enter key press
 * - Search button click
 * - Example query click
 *
 * @param assets - Array of asset paths to search through
 */
export const SearchView: React.FC<SearchViewProps> = ({ assets }) => {
  const { searchTerm, updateSearchTerm: updateSearchParam } = useSearchParam();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");

  const performSearch = useCallback(
    (query: string) => {
      console.log("🔎 Performing search for:", query);

      if (!query.trim()) {
        setSearchResults([]);
        setCurrentQuery("");
        return;
      }

      const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
      const includeTerms: string[] = [];
      const excludeTerms: string[] = [];

      // Separate include and exclude terms
      searchWords.forEach((word) => {
        if (word.startsWith("!")) {
          excludeTerms.push(word.slice(1)); // Remove the ! prefix
        } else {
          includeTerms.push(word);
        }
      });

      const results = assets.filter((path) => {
        const pathLower = path.toLowerCase();

        // Check if path includes all required terms
        const hasAllIncludeTerms = includeTerms.every((term) =>
          pathLower.includes(term)
        );

        // Check if path excludes all negative terms
        const hasNoExcludeTerms = excludeTerms.every(
          (term) => !pathLower.includes(term)
        );

        return (
          hasAllIncludeTerms &&
          hasNoExcludeTerms &&
          getFileType(path) === "image"
        );
      });

      console.log(`✨ Found ${results.length} results`);
      setSearchResults(results);
      setCurrentQuery(query);
    },
    [assets]
  );

  // Add effect for initial search on page load
  useEffect(() => {
    console.log("🚀 Performing initial search");
    performSearch(searchTerm);
  }, []);  // Empty deps array means this only runs once on mount

  const handleSearch = () => {
    performSearch(searchTerm);
  };

  const handleExampleClick = (query: string) => {
    updateSearchParam(query);
    // Immediately trigger search
    setTimeout(() => performSearch(query), 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    updateSearchParam("");
    performSearch("");
  };

  const showSearchButton = searchTerm.trim() && searchTerm !== currentQuery;
  const showClearButton = searchTerm && searchTerm === currentQuery;

  const resultsCount = searchResults.length.toLocaleString();
  const assetGroups =
    searchResults.length > 0
      ? [
          {
            title: `${resultsCount} Search Results for "${currentQuery}"`,
            assets: searchResults,
          },
        ]
      : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 bg-white/10 border-b border-white/20">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateSearchParam(e.target.value)}
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

const useSearchParam = (initialSearch = "") => {
  const [searchTerm, setSearchTerm] = useState(() => {
    // Initialize from URL immediately
    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get("q");
    console.log("🏁 Initial URL search term:", queryParam);
    return queryParam || initialSearch;
  });

  const updateSearchTerm = (query: string) => {
    setSearchTerm(query);
    const newUrl = new URL(window.location.href);

    if (query.trim()) {
      newUrl.searchParams.set("q", query);
      console.log("🔄 Updating URL with search:", query);
    } else {
      newUrl.searchParams.delete("q");
      console.log("🧹 Clearing search from URL");
    }

    window.history.pushState({}, "", newUrl);
  };

  return {
    searchTerm,
    updateSearchTerm,
  };
};
