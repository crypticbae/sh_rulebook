import React from 'react';
import * as Icons from 'lucide-react';

const ICON_MAP: { [key: string]: keyof typeof Icons } = {
  'book': 'Book',
  'users': 'Users',
  'file-text': 'FileText',
  'shield': 'Shield',
  'scroll': 'Scroll',
  'sword': 'Sword',
  'flag': 'Flag',
  'crown': 'Crown',
  'gavel': 'Gavel',
  'scale': 'Scale',
  'landmark': 'Landmark',
  'briefcase': 'Briefcase',
  'building': 'Building',
  'clipboard': 'Clipboard',
  'folder': 'Folder',
  'heart': 'Heart',
  'help-circle': 'HelpCircle',
  'info': 'Info',
  'list': 'List',
  'map': 'Map',
  'message-circle': 'MessageCircle',
  'star': 'Star',
  'trophy': 'Trophy',
  'user': 'User',
  'users-2': 'Users2',
  'warning': 'AlertTriangle',
  'check': 'Check',
  'x': 'X',
  'skull': 'Skull'
};

export const getIconComponent = (iconName: string): React.ReactNode => {
  if (!iconName) {
    return <Icons.Book className="w-5 h-5 text-[#911111]" />;
  }
  
  const IconComponent = Icons[ICON_MAP[iconName] || 'Book'];
  return <IconComponent className="w-5 h-5 text-[#911111]" />;
};