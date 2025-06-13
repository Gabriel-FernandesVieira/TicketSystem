import React from 'react';
import { AlertTriangle, AlertCircle, Circle, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: { 
        icon: Circle, 
        bg: 'bg-gray-100 dark:bg-gray-900/20', 
        text: 'text-gray-800 dark:text-gray-400', 
        label: 'Baixa' 
      },
      medium: { 
        icon: AlertCircle, 
        bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
        text: 'text-yellow-800 dark:text-yellow-400', 
        label: 'Média' 
      },
      high: { 
        icon: AlertTriangle, 
        bg: 'bg-orange-100 dark:bg-orange-900/20', 
        text: 'text-orange-800 dark:text-orange-400', 
        label: 'Alta' 
      },
      urgent: { 
        icon: ArrowUp, 
        bg: 'bg-red-100 dark:bg-red-900/20', 
        text: 'text-red-800 dark:text-red-400', 
        label: 'Urgente' 
      }
    };

    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default PriorityBadge;