import React from 'react';
import { Rule } from '../lib/storage';

interface RuleContentProps {
  rule: Rule;
}

const RuleContent: React.FC<RuleContentProps> = ({ rule }) => {
  return (
    <div id={rule.id} className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{rule.title}</h2>
      <div className="prose prose-invert">
        <p className="text-gray-300">{rule.content}</p>
      </div>
    </div>
  );
};

export default RuleContent;