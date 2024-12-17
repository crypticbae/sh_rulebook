import React from 'react';
import * as Icons from 'lucide-react';
import { getIconComponent } from '../sidebar/IconSelector';

const AVAILABLE_ICONS = [
  { value: 'book', label: 'Book', icon: Icons.Book },
  { value: 'users', label: 'Users', icon: Icons.Users },
  { value: 'file-text', label: 'Document', icon: Icons.FileText },
  { value: 'shield', label: 'Shield', icon: Icons.Shield },
  { value: 'scroll', label: 'Scroll', icon: Icons.Scroll },
  { value: 'sword', label: 'Sword', icon: Icons.Sword },
  { value: 'flag', label: 'Flag', icon: Icons.Flag },
  { value: 'crown', label: 'Crown', icon: Icons.Crown },
  { value: 'gavel', label: 'Gavel', icon: Icons.Gavel },
  { value: 'scale', label: 'Scale', icon: Icons.Scale },
  { value: 'landmark', label: 'Landmark', icon: Icons.Landmark },
  { value: 'briefcase', label: 'Briefcase', icon: Icons.Briefcase },
  { value: 'building', label: 'Building', icon: Icons.Building },
  { value: 'clipboard', label: 'Clipboard', icon: Icons.Clipboard },
  { value: 'folder', label: 'Folder', icon: Icons.Folder },
  { value: 'heart', label: 'Heart', icon: Icons.Heart },
  { value: 'help-circle', label: 'Help', icon: Icons.HelpCircle },
  { value: 'info', label: 'Info', icon: Icons.Info },
  { value: 'list', label: 'List', icon: Icons.List },
  { value: 'map', label: 'Map', icon: Icons.Map },
  { value: 'message-circle', label: 'Message', icon: Icons.MessageCircle },
  { value: 'star', label: 'Star', icon: Icons.Star },
  { value: 'trophy', label: 'Trophy', icon: Icons.Trophy },
  { value: 'user', label: 'User', icon: Icons.User },
  { value: 'users-2', label: 'Users Group', icon: Icons.Users2 },
  { value: 'warning', label: 'Warning', icon: Icons.AlertTriangle },
  { value: 'check', label: 'Check', icon: Icons.Check },
  { value: 'x', label: 'X', icon: Icons.X },
] as const;

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/50 text-white border border-white/10 rounded-md pl-10 pr-8 py-2 appearance-none cursor-pointer"
      >
        <option value="" className="bg-black/90">Select an icon</option>
        {AVAILABLE_ICONS.map((icon) => (
          <option 
            key={icon.value} 
            value={icon.value} 
            className="bg-black/90 flex items-center gap-2 py-2"
          >
            {icon.label}
          </option>
        ))}
      </select>
      
      {/* Current selection preview on the left */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {getIconComponent(value)}
      </div>
      
      {/* Preview of selected icon */}
      {value && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          {getIconComponent(value)}
        </div>
      )}
      
      {/* Dropdown arrow */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

export default IconSelector;