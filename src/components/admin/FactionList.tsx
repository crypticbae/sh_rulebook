import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Faction, Category, storage } from '../../lib/storage';
import { toast } from 'react-hot-toast';

const FactionList = () => {
  const [searchParams] = useSearchParams();
  const [factions, setFactions] = useState<Faction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFaction, setEditingFaction] = useState<Partial<Faction>>({});

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [factionsData, categoriesData] = await Promise.all([
          storage.getFactions(),
          storage.getCategories()
        ]);
        setFactions(factionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editingFaction.name || !editingFaction.image_url || !editingFaction.discord_url) {
      toast.error('All fields are required');
      return;
    }

    try {
      const faction: Faction = {
        id: editingFaction.id || crypto.randomUUID(),
        category_id: selectedCategory,
        name: editingFaction.name,
        image_url: editingFaction.image_url,
        discord_url: editingFaction.discord_url,
        order_position: editingFaction.id ? 
          editingFaction.order_position! : 
          Math.max(...factions.map(f => f.order_position), 0) + 1
      };

      await storage.saveFaction(faction);
      
      const updatedFactions = editingFaction.id
        ? factions.map(f => f.id === faction.id ? faction : f)
        : [...factions, faction];
      
      setFactions(updatedFactions);
      setIsEditing(false);
      setEditingFaction({});
      toast.success('Faction saved successfully');
    } catch (error) {
      console.error('Error saving faction:', error);
      toast.error('Failed to save faction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faction?')) return;

    try {
      await storage.deleteFaction(id);
      setFactions(factions.filter(f => f.id !== id));
      toast.success('Faction deleted successfully');
    } catch (error) {
      console.error('Error deleting faction:', error);
      toast.error('Failed to delete faction');
    }
  };

  const currentCategory = useMemo(() => 
    categories.find(c => c.id === selectedCategory),
    [categories, selectedCategory]
  );

  const filteredFactions = useMemo(() =>
    factions.filter(f => f.category_id === selectedCategory),
    [factions, selectedCategory]
  );

  if (!currentCategory) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Please select a faction category from the sidebar.
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-6 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {currentCategory.title} - Factions
        </h2>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditingFaction({});
          }}
          className="flex items-center space-x-2 bg-[#911111] text-white px-6 py-2 rounded-md hover:bg-[#b92a2a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Fraktion hinzufügen</span>
        </button>
      </div>

      {isEditing && (
        <div className="mb-6 p-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Fraktionsname"
              value={editingFaction.name || ''}
              onChange={e => setEditingFaction({ ...editingFaction, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2"
            />
            <input
              type="url"
              placeholder="Bild URL"
              value={editingFaction.image_url || ''}
              onChange={e => setEditingFaction({ ...editingFaction, image_url: e.target.value })}
              className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2"
            />
            <input
              type="url"
              placeholder="Discord URL"
              value={editingFaction.discord_url || ''}
              onChange={e => setEditingFaction({ ...editingFaction, discord_url: e.target.value })}
              className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-[#911111] text-white px-6 py-2 rounded-md hover:bg-[#b92a2a] transition-colors"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingFaction({});
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFactions.map(faction => (
          <div
            key={faction.id}
            className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden group"
          >
            <div className="aspect-video relative">
              <img
                src={faction.image_url}
                alt={faction.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditingFaction(faction);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faction.id)}
                  className="p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {faction.name}
              </h3>
              <a
                href={faction.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#911111] hover:text-[#b92a2a] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Discord Link</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactionList;