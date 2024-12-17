import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Book } from 'lucide-react';
import { storage, Category, Rule } from '../lib/storage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import CollapsibleRule from '../components/CollapsibleRule';

const RulebookView = () => {
  const { rulebookId } = useParams();
  const [searchParams] = useSearchParams();
  const [rulebook, setRulebook] = useState<Category | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const highlightTerm = searchParams.get('highlight');
  const highlightedRuleId = searchParams.get('rule');

  useEffect(() => {
    if (highlightedRuleId) {
      // Add a small delay to allow the page to load and render
      const timer = setTimeout(() => {
        const element = document.getElementById(highlightedRuleId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.classList.add('highlight-pulse');
          setTimeout(() => element.classList.remove('highlight-pulse'), 2000);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedRuleId, rulebookId]);

  useEffect(() => {
    if (rulebookId) {
      const fetchData = async () => {
        try {
          const [categories, allRules] = await Promise.all([
            storage.getCategories(),
            storage.getRules()
          ]);
          
          const currentRulebook = categories?.find(c => 
            c.id === rulebookId || c.title.toLowerCase() === rulebookId.toLowerCase()
          );
          setRulebook(currentRulebook || null);
          
          setRules(allRules?.filter(rule => 
            rule.category_id === (currentRulebook?.id || rulebookId)
          ) || []);
        } catch (error) {
          console.error('Error loading rulebook:', error);
          toast.error('Failed to load rulebook');
          console.error('Error loading rulebook:', error);
          toast.error('Failed to load rulebook');
          console.error('Error loading data:', error);
          toast.error('Failed to load data');
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [rulebookId]);

  if (!rulebook) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      <div className="relative flex-1">
        <Navbar />
        <Sidebar />
        <main className="flex justify-center">
          <div className="w-full max-w-7xl px-8 py-12 ml-64">
          <div className="flex items-center space-x-2 mb-8">
            <Book className="w-8 h-8 text-[#911111]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#911111] to-[#b92a2a] bg-clip-text text-transparent">
              {rulebook.title}
            </h1>
          </div>

          <div className="space-y-4">
            {rules.length > 0 ? (
              rules.map(rule => (
                <CollapsibleRule 
                  key={rule.id}
                  rule={rule}
                  categoryTitle={rulebook.title}
                  highlightTerm={highlightTerm || undefined}
                  autoExpand={rule.id === highlightedRuleId}
                />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No rules found in this rulebook.</p>
            )}
          </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RulebookView;