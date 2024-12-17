import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users2, ExternalLink } from 'lucide-react';
import { storage, Category, Faction } from '../lib/storage';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const FactionView = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [factions, setFactions] = useState<Faction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, factionsData] = await Promise.all([
          storage.getCategories(),
          storage.getFactions()
        ]);
        
        const currentCategory = categoriesData.find(c => c.id === categoryId);
        setCategory(currentCategory || null);
        
        setFactions(factionsData.filter(f => f.category_id === categoryId));
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, [categoryId]);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      <div className="relative flex-1">
        <Navbar />
        <Sidebar />
        <main className="flex justify-center">
          <div className="w-full max-w-7xl px-8 py-12 ml-64">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Users2 className="w-8 h-8 text-[#911111]" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#911111] to-[#b92a2a] bg-clip-text text-transparent">
                {category.title}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {factions.map(faction => (
              <div
                key={faction.id}
                className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-md overflow-hidden group hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="aspect-square relative w-full">
                  <img
                    src={faction.image_url}
                    alt={faction.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 truncate">
                    {faction.name}
                  </h3>
                  <a
                    href={faction.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-[#911111] hover:text-[#b92a2a] transition-colors bg-[#911111]/10 px-1.5 py-0.5 rounded"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Join Discord</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FactionView;