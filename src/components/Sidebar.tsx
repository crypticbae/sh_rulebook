import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { storage, Category, Rule, isMainCategory } from '../lib/storage';
import { toast } from 'react-hot-toast';
import CategoryItem from './sidebar/CategoryItem';
import { getIconComponent } from './sidebar/IconSelector';

const Sidebar = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await storage.getCategories();
        const rulesData = await storage.getRules();
        setCategories(categoriesData || []);
        setRules(rulesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  // Automatically expand parent category when a rulebook is active
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/rulebook/')) {
      if (!categories) return;
      
      const rulebookId = path.split('/').pop();
      const rulebook = categories.find(c => c.id === rulebookId);
      if (rulebook?.parent_id) {
        setExpandedCategories(prev => new Set([...prev, rulebook.parent_id]));
      }
    }
  }, [location.pathname, categories]);

  const mainCategories = categories?.filter(isMainCategory) || [];

  const getRulesForCategory = (categoryId: string) => {
    return rules.filter(rule => rule.category_id === categoryId);
  };

  return (
    <div className="w-64 h-[calc(100vh-4rem)] bg-white/80 dark:bg-black/50 backdrop-blur-sm border-r border-gray-200 dark:border-white/10 fixed left-0 top-16 overflow-y-auto z-40">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm uppercase text-gray-600 dark:text-gray-500 font-semibold px-4">Navigation</h2>
        </div>
        {mainCategories.map((mainCategory) => (
          <div key={mainCategory.id}>
            <CategoryItem
              key={mainCategory.id}
              icon={getIconComponent(mainCategory.icon)}
              id={mainCategory.id}
              title={mainCategory.title}
              isExpanded={expandedCategories.has(mainCategory.id)}
              onToggle={() => {
                const newExpanded = new Set(expandedCategories);
                if (expandedCategories.has(mainCategory.id)) {
                  newExpanded.delete(mainCategory.id);
                } else {
                  newExpanded.add(mainCategory.id);
                }
                setExpandedCategories(newExpanded);
              }}
            />
            {expandedCategories.has(mainCategory.id) && (
              <div className="ml-4">
                {categories
                  ?.filter(cat => cat.parent_id === mainCategory.id)
                  .map(subcategory => (
                    <CategoryItem
                      key={subcategory.id}
                      icon={getIconComponent(subcategory.icon)}
                      title={subcategory.title}
                      id={subcategory.id}
                      rules={getRulesForCategory(subcategory.id)}
                      isSubcategory
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;