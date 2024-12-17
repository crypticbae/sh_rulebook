import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ChevronDown, BookText, Users2 } from 'lucide-react';
import { storage, Category } from '../../lib/storage';
import { getIconComponent } from '../sidebar/IconSelector';

const AdminSidebar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await storage.getCategories();
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isActive = (path: string) => location.pathname === path;

  const mainCategories = categories?.filter(cat => cat.parent_id === null) || [];

  return (
    <div className="w-64 h-[calc(100vh-4rem)] bg-white/80 dark:bg-black/50 backdrop-blur-sm border-r border-gray-200 dark:border-white/10 fixed left-0 top-16 overflow-y-auto z-40">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm uppercase text-gray-600 dark:text-gray-500 font-semibold px-4">Navigation</h2>
        </div>

        <Link
          to="/admin/categories"
          className={`flex items-center space-x-2 px-4 py-2 rounded-md mb-2 ${
            isActive('/admin/categories')
              ? 'bg-[#911111]/10 text-[#911111]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Kategorien verwalten</span>
        </Link>

        <div className="mt-6">
          <h2 className="text-sm uppercase text-gray-600 dark:text-gray-500 font-semibold px-4 mb-4">Factions</h2>
          {categories
            ?.filter(cat => cat.title === 'Fraktionen')
            .flatMap(mainCat => 
              categories
                ?.filter(subCat => subCat.parent_id === mainCat.id)
                .map(subCat => (
                  <Link
                    key={subCat.id}
                    to={`/admin/factions?category=${subCat.id}`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md mb-2 ${
                      location.pathname === '/admin/factions' && location.search === `?category=${subCat.id}`
                        ? 'bg-[#911111]/10 text-[#911111]'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {getIconComponent(subCat.icon)}
                    <span>{subCat.title}</span>
                  </Link>
                ))
            )}
        </div>

        <div className="mt-6">
          <h2 className="text-sm uppercase text-gray-600 dark:text-gray-500 font-semibold px-4 mb-4">Kategorien & Regeln</h2>
          {mainCategories.map((category) => (
            <div key={category.id} className="mb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded"
              >
                <div className="flex items-center space-x-2">
                  {getIconComponent(category.icon)}
                  <span>{category.title}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedCategories.has(category.id) ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {expandedCategories.has(category.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {categories
                    .filter(cat => cat.parent_id === category.id)
                    .map(rulebook => (
                      <Link
                        key={rulebook.id}
                        to={`/admin/rules?category=${rulebook.id}`}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm rounded ${
                          location.search === `?category=${rulebook.id}`
                            ? 'bg-[#911111]/10 text-[#911111]'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {getIconComponent(rulebook.icon)}
                        <span>{rulebook.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;