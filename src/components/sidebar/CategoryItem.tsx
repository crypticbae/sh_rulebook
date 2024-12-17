import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Rule } from '../../lib/storage';

interface CategoryItemProps {
  icon: React.ReactNode;
  title: string;
  id: string;
  rules?: Rule[];
  isExpanded?: boolean;
  onToggle?: () => void;
  isSubcategory?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  icon,
  title,
  id,
  rules,
  isExpanded = false,
  onToggle,
  isSubcategory = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(isSubcategory);

  const isActive = () => {
    const path = location.pathname;
    if (isSubcategory) {
      return path === `/rulebook/${id}`;
    } else {
      return path === `/category/${id}`;
    }
  };

  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else if (title === 'Staatsfraktionen' || title === 'Legale Fraktionen' || title === 'Illegale Fraktionen') {
      navigate(`/factions/${id}`);
    } else {
      const path = isSubcategory ? `/rulebook/${id}` : `/category/${id}`;
      navigate(path);
    }
  };

  return (
    <div className="mb-2">
      <div
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 rounded ${isActive() ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : ''} ${
          isSubcategory ? 'text-sm' : ''
        } cursor-pointer`}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </div>
        {!isSubcategory && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              (isSubcategory ? isOpen : isExpanded) ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryItem;