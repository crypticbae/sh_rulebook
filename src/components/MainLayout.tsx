import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { storage, Rule, Category } from '../lib/storage';
import { toast } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CollapsibleRule from './CollapsibleRule';
import Footer from './Footer';

const MainLayout = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [categories, setCategories] = useState<Category[] | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rulesData, categoriesData] = await Promise.all([
          storage.getRules(),
          storage.getCategories()
        ]);
        setRules(rulesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const getCategoryTitle = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.title || '';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      <div className="relative flex-1 pt-16">
        <Navbar />
        <Sidebar />
        <main className="flex justify-center">
          <div className="w-full max-w-7xl px-8 py-12 ml-64">
          <div className="flex items-center space-x-2 mb-8">
            <Book className="w-8 h-8 text-[#911111]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#911111] to-[#b92a2a] bg-clip-text text-transparent">
              SwisshubRP Regelwerke
            </h1>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400">
              Willkommen bei den offiziellen SwisshubRP Regelwerken. Bitte wähle eine Kategorie aus der Seitenleiste aus.
            </p>
            <div className="mt-8">
              <p className="text-xl text-gray-900 dark:text-white">Bitte wähle eine Kategorie aus der Seitenleiste aus.</p>
            </div>
          </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;