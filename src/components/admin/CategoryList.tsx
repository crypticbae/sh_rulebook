import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoveUp, MoveDown, Users2 } from 'lucide-react';
import { Category, storage, isMainCategory, isSubcategory } from '../../lib/storage';
import { toast } from 'react-hot-toast';
import IconSelector from './IconSelector';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await storage.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSave = () => {
    if (!editingCategory.title) {
      toast.error('Title is required');
      return;
    }

    if (!categories) return;

    const newCategory = {
      id: editingCategory.id || crypto.randomUUID(),
      title: editingCategory.title,
      icon: editingCategory.icon || '',
      parent_id: selectedParentId,
      order_position: editingCategory.id ? 
        editingCategory.order_position : 
        Math.max(...categories.map(c => c.order_position), 0) + 1
    } as Category;
    
    const updatedCategories = [...categories];
    
    if (editingCategory.id) {
      const index = updatedCategories.findIndex(c => c.id === editingCategory.id);
      updatedCategories[index] = newCategory;
    } else {
      updatedCategories.push(newCategory);
    }

    storage.saveCategories(updatedCategories)
      .then(() => {
        setCategories(updatedCategories);
        setIsEditing(false);
        setEditingCategory({});
        toast.success('Category saved successfully');
      })
      .catch(() => {
        toast.error('Failed to save category');
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    if (!categories) return;

    const updatedCategories = categories.filter(c => c.id !== id);
    storage.saveCategories(updatedCategories);
    setCategories(updatedCategories);
    toast.success('Category deleted successfully');
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    if (!categories) return;
    
    const filteredCategories = Array.isArray(categories) ? categories.filter(cat => 
      selectedParentId ? cat.parent_id === selectedParentId : !cat.parent_id
    ) : [];
    
    const index = filteredCategories.findIndex(c => c.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === filteredCategories.length - 1)
    ) return;

    const newCategories = [...categories];
    const current = filteredCategories[index];
    const other = direction === 'up' ? 
      filteredCategories[index - 1] : 
      filteredCategories[index + 1];
    
    // Swap order positions
    const tempOrder = current.order_position;
    current.order_position = other.order_position;
    other.order_position = tempOrder;
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === current.id) return current;
      if (cat.id === other.id) return other;
      return cat;
    });

    storage.saveCategories(updatedCategories)
      .then(() => {
        setCategories(updatedCategories);
        toast.success('Order updated successfully');
      })
      .catch(() => {
        toast.error('Failed to update order');
      });
  };

  return (
    <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-6 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {selectedParentId ? 'Regelwerke' : 'Kategorien'}
          </h2>
          {selectedParentId && (
            <button
              onClick={() => setSelectedParentId(null)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              ← Zurück zu Kategorien
            </button>
          )}
          <button
            onClick={async () => {
              try {
                await storage.addFraktionenCategories();
                const updatedCategories = await storage.getCategories();
                setCategories(updatedCategories);
              } catch (error) {
                console.error('Error adding Fraktionen:', error);
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <Users2 className="w-4 h-4" />
            <span>Add Fraktionen Categories</span>
          </button>
        </div>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditingCategory({ parent_id: selectedParentId });
          }}
          className="flex items-center space-x-2 bg-[#911111] text-white px-6 py-2 rounded-md hover:bg-[#b92a2a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{selectedParentId ? 'Add Rulebook' : 'Add Category'}</span>
        </button>
      </div>

      {isEditing && (
        <div className="mb-6 p-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
          <input
            type="text"
            value={editingCategory.title || ''}
            onChange={e => setEditingCategory({ ...editingCategory, title: e.target.value })}
            placeholder={selectedParentId ? 'Regelwerk Titel' : 'Kategorie Titel'}
            className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2 mb-4 focus:border-[#911111] focus:ring-1 focus:ring-[#911111] transition-colors"
          />
          <IconSelector
            value={editingCategory.icon || ''}
            onChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}
          />
          <div className="flex space-x-2 mt-6">
            <button
              onClick={handleSave}
              className="bg-[#911111] text-white px-6 py-2 rounded-md hover:bg-[#b92a2a] transition-colors shadow-sm font-medium"
            >
              Speichern
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingCategory({});
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors shadow-sm font-medium"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories
          ?.filter(cat => 
            selectedParentId 
              ? cat.parent_id === selectedParentId 
              : isMainCategory(cat)
          )
          ?.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 transition-all duration-200 hover:border-[#911111]/30"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gray-900 dark:text-white font-medium">{category.title}</span>
              {!selectedParentId && (
                <button
                  onClick={() => setSelectedParentId(category.id)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#911111] transition-colors"
                >
                  View Rulebooks →
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMove(category.id, 'up')}
                disabled={index === 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(category.id, 'down')}
                disabled={index === categories.length - 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditingCategory(category);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 text-gray-400 hover:text-[#911111]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;