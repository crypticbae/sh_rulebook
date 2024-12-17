import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage, Rule, Category } from '../lib/storage';

interface SearchResult {
  id: string;
  title: string;
  type: 'rule' | 'category' | 'rulebook' | 'faction';
  categoryId?: string;
  rulebookId?: string;
  content?: string;
  imageUrl?: string;
  discordUrl?: string;
}

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, rulesData, factionsData] = await Promise.all([
          storage.getCategories(),
          storage.getRules(),
          storage.getFactions()
        ]);
        setCategories(categoriesData);
        setRules(rulesData);
        setFactions(factionsData);
      } catch (error) {
        console.error('Error loading search data:', error);
        toast.error('Failed to load search data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-[#911111]/20 text-[#911111] px-1 rounded">{part}</mark> : 
        part
    );
  };

  const getContentPreview = (content: string, searchTerm: string) => {
    const cleanContent = content.replace(/<[^>]*>/g, '');
    const index = cleanContent.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return cleanContent.slice(0, 150) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(cleanContent.length, index + searchTerm.length + 50);
    const preview = cleanContent.slice(start, end);
    
    return (start > 0 ? '...' : '') + preview + (end < cleanContent.length ? '...' : '');
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search in main categories
    categories?.filter(cat => cat.parent_id === null)
      .forEach(category => {
        if (category.title.toLowerCase().includes(searchTerm)) {
          searchResults.push({
            id: category.id,
            title: category.title,
            type: 'category'
          });
        }
      });

    // Search in rulebooks (subcategories)
    categories
      .filter(cat => cat.parent_id !== null)
      .forEach(rulebook => {
        if (rulebook.title.toLowerCase().includes(searchTerm)) {
          searchResults.push({
            id: rulebook.id,
            title: rulebook.title,
            type: 'rulebook',
            categoryId: rulebook.parent_id
          });
        }
      });

    // Search in rules
    rules.forEach(rule => {
      if (
        rule.title.toLowerCase().includes(searchTerm) ||
        rule.content.toLowerCase().replace(/<[^>]*>/g, '').includes(searchTerm)
      ) {
        const rulebook = categories.find(c => c.id === rule.category_id);
        if (rulebook) {
          searchResults.push({
            id: rule.id,
            title: rule.title,
            type: 'rule',
            rulebookId: rulebook.id,
            categoryId: rulebook.parent_id,
            content: rule.content
          });
        }
      }
    });

    // Search in factions
    factions.forEach(faction => {
      if (faction.name.toLowerCase().includes(searchTerm)) {
        searchResults.push({
          id: faction.id,
          title: faction.name,
          type: 'faction',
          categoryId: faction.category_id,
          imageUrl: faction.image_url,
          discordUrl: faction.discord_url
        });
      }
    });

    setResults(searchResults);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(-1);
    const searchTerm = query;

    switch (result.type) {
      case 'category':
        navigate(`/category/${result.id}`);
        break;
      case 'rulebook':
        navigate(`/rulebook/${result.id}`);
        break;
      case 'rule':
        if (result.rulebookId) {
          navigate(`/rulebook/${result.rulebookId}?highlight=${encodeURIComponent(searchTerm)}&rule=${result.id}`);
        }
        break;
      case 'faction':
        if (result.categoryId) {
          navigate(`/factions/${result.categoryId}`);
        }
        break;
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Suche nach Regeln, Kategorien oder Regelwerken..."
          className="w-full bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-[#911111]/50"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="fixed top-[calc(4rem+0.5rem)] left-1/2 -translate-x-1/2 w-[calc(100vw-32rem)] bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-md shadow-lg max-h-96 overflow-y-auto z-[100]">
          {results.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/5 last:border-0 cursor-pointer transition-all duration-300 animate-slide-down ${
                highlightedIndex === index ? 'bg-gray-100 dark:bg-white/5' : ''
              }`}
            >
              <div className="flex items-center">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  result.type === 'category' ? 'bg-[#911111]/20 text-[#911111]' :
                  result.type === 'rulebook' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                } mr-2`}>
                  {result.type === 'category' ? 'Kategorie' :
                   result.type === 'rulebook' ? 'Regelwerk' :
                   result.type === 'rule' ? 'Regel' :
                   'Fraktion'}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {highlightText(result.title, query)}
                </span>
              </div>
              {result.type === 'rule' && result.content ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {highlightText(
                    getContentPreview(result.content, query),
                    query
                  )}
                </p>
              ) : result.type === 'faction' && result.imageUrl && (
                <div className="flex items-center mt-1 space-x-2">
                  <img 
                    src={result.imageUrl} 
                    alt={result.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Klicke zum Anzeigen der Fraktion
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;