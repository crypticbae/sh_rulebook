import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from 'lucide-react';
import { storage, Category, Rule } from '../lib/storage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import CollapsibleRule from '../components/CollapsibleRule';

const CategoryView = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [rulebooks, setRulebooks] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    if (categoryId) {
      const categories = storage.getCategories();
      // Find category by ID or by title (for backward compatibility)
      const currentCategory = categories.find(c => 
        c.id === categoryId || c.title.toLowerCase() === categoryId.toLowerCase()
      );
      setCategory(currentCategory || null);
      
      // Get rulebooks (subcategories) for this category
      const categoryRulebooks = categories.filter(c => 
        c.parentId === (currentCategory?.id || categoryId)
      );
      setRulebooks(categoryRulebooks);

      // Get all rules for these rulebooks
      const allRules = storage.getRules();
      const relevantRules = allRules.filter(rule => 
        categoryRulebooks.some(rulebook => rulebook.id === rule.categoryId)
      );
      setRules(relevantRules);
    }
  }, [categoryId]);

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      <div className="relative flex-1">
        <Navbar />
        <Sidebar />
        <main className="flex justify-center">
          <div className="w-full max-w-7xl px-8 py-12 ml-64">
          <div className="flex items-center space-x-2 mb-8">
            <Book className="w-8 h-8 text-[#911111]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#911111] to-[#b92a2a] bg-clip-text text-transparent">
              {category.title}
            </h1>
          </div>

          {rulebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rulebooks.map(rulebook => {
                return (
                  <div 
                    key={rulebook.id}
                    className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:border-[#911111]/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/rulebook/${rulebook.id}`)}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{rulebook.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">Click to view rules</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No rulebooks found in this category.</p>
          )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryView;