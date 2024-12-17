import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Rule } from '../lib/storage';

interface CollapsibleRuleProps {
  rule: Rule;
  categoryTitle: string;
  highlightTerm?: string;
  autoExpand?: boolean;
}

const CollapsibleRule: React.FC<CollapsibleRuleProps> = ({ 
  rule, 
  categoryTitle, 
  highlightTerm,
  autoExpand
}) => {
  const [isOpen, setIsOpen] = useState(autoExpand || false);

  // Update isOpen when autoExpand changes
  useEffect(() => {
    setIsOpen(autoExpand || false);
  }, [autoExpand]);

  const highlightContent = (content: string) => {
    if (!highlightTerm) return content;
    return content.replace(
      new RegExp(`(${highlightTerm})`, 'gi'),
      '<mark class="bg-[#911111]/20 text-[#911111] px-1 rounded">$1</mark>'
    );
  };

  return (
    <div 
      id={rule.id}
      className="mb-4 group"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 flex items-center justify-between text-left transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg ${
          isOpen ? 'rounded-b-none border-b-0' : 'hover:border-[#911111]/30'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isOpen ? 'bg-[#911111]' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-[#911111]'
          }`} />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{rule.title}</h2>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-out overflow-hidden bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-t-0 border-gray-200 dark:border-white/10 rounded-b-lg ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4">
          <div
            className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ 
              __html: highlightTerm ? highlightContent(rule.content) : rule.content 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollapsibleRule;