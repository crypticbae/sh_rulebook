import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RuleSectionProps {
  icon: LucideIcon;
  title: string;
  rules: string[];
}

const RuleSection: React.FC<RuleSectionProps> = ({ icon: Icon, title, rules }) => {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#911111]/50 transition-colors duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-[#911111]" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      <ul className="space-y-3">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block w-5 h-5 bg-[#911111]/20 text-[#911111] rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-300">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleSection;