import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, MoveUp, MoveDown, ChevronDown } from 'lucide-react';
import { Rule, Category, storage } from '../../lib/storage';
import { toast } from 'react-hot-toast';
import RuleEditor from './RuleEditor';

const RuleList = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<Rule>>({});
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedCategories = await storage.getCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchRules = async () => {
        const allRules = await storage.getRules();
        setRules(allRules.filter(rule => rule.category_id === selectedCategory));
      };
      fetchRules();
    }
  }, [selectedCategory]);

  const handleSave = () => {
    if (!editingRule.title || !editingRule.content) {
      toast.error('Title and content are required');
      return;
    }

    if (!Array.isArray(rules)) return;

    const newRule = {
      id: editingRule.id || crypto.randomUUID(),
      title: editingRule.title,
      content: editingRule.content,
      category_id: selectedCategory,
      order_position: editingRule.id ? 
        editingRule.order_position : 
        Math.max(...rules.map(r => r.order_position), 0) + 1
    } as Rule;
    
    const updatedRules = [...rules];
    
    if (editingRule.id) {
      const index = rules.findIndex(r => r.id === editingRule.id);
      updatedRules[index] = newRule;
    } else {
      updatedRules.push(newRule);
    }

    storage.saveRules(updatedRules)
      .then(() => {
        setRules(updatedRules);
        setIsEditing(false);
        setEditingRule({});
        toast.success('Rule saved successfully');
      })
      .catch(() => {
        toast.error('Failed to save rule');
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    storage.deleteRule(id)
      .then(() => {
        const updatedRules = rules.filter(r => r.id !== id);
        setRules(updatedRules);
        toast.success('Rule deleted successfully');
      })
      .catch(() => {
        toast.error('Failed to delete rule');
      });
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    if (!rules) return;
    
    const index = rules.findIndex(r => r.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === rules.length - 1)
    ) return;

    const newRules = [...rules];
    const temp = newRules[index];
    if (direction === 'up') {
      newRules[index] = newRules[index - 1];
      newRules[index - 1] = temp;
    } else {
      newRules[index] = newRules[index + 1];
      newRules[index + 1] = temp;
    }

    // Update order values
    newRules.forEach((rule, i) => {
      rule.order_position = i;
    });

    storage.saveRules(newRules)
      .then(() => {
        setRules(newRules);
        toast.success('Order updated successfully');
      })
      .catch(() => {
        toast.error('Failed to update order');
      });

  };

  const toggleExpand = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (expandedRules.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const currentCategory = useMemo(() => 
    categories?.find(c => c.id === selectedCategory),
    [categories, selectedCategory]
  );

  return (
    <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg p-6 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Rules</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditingRule({});
          }}
          className="flex items-center space-x-2 bg-[#911111] text-white px-4 py-2 rounded-md hover:bg-[#b92a2a] transition"
        >
          <Plus className="w-4 h-4" />
          Abbrechen
        </button>
      </div>

      {isEditing && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <input
            type="text"
            value={editingRule.title || ''}
            onChange={e => setEditingRule({ ...editingRule, title: e.target.value })}
            placeholder="Rule Title"
            className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-md px-4 py-2 mb-4"
          />
          <textarea
            value={editingRule.content || ''}
            onChange={e => setEditingRule({ ...editingRule, content: e.target.value })}
            className="hidden"
          />
          <div className="mb-4">
            <RuleEditor
              content={editingRule.content || ''}
              onChange={(content) => setEditingRule({ ...editingRule, content })}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-[#911111] text-white px-4 py-2 rounded-md hover:bg-[#b92a2a] transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingRule({});
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            onClick={() => toggleExpand(rule.id)}
          >
            <div className="flex-1">
              <h3 className="text-white font-medium">{rule.title}</h3>
              {expandedRules.has(rule.id) && (
                <div 
                  className="text-gray-400 text-sm mt-2 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: rule.content }}
                />
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(rule.id);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${
                    expandedRules.has(rule.id) ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <button
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(rule.id, 'up');
                }}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                disabled={index === rules.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(rule.id, 'down');
                }}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setEditingRule(rule);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(rule.id);
                }}
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

export default RuleList;