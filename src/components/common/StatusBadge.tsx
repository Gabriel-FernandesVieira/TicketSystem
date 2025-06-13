import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'ticket' | 'project' | 'expense';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'ticket' }) => {
  const getStatusConfig = (status: string, variant: string) => {
    const configs = {
      ticket: {
        'open': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'Aberto' },
        'in-progress': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'Em Progresso' },
        'awaiting-customer': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-800 dark:text-purple-400', label: 'Aguardando Cliente' },
        'resolved': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Resolvido' },
        'closed': { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400', label: 'Fechado' }
      },
      project: {
        'planning': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'Planejamento' },
        'active': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Ativo' },
        'on-hold': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'Pausado' },
        'completed': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Concluído' },
        'cancelled': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', label: 'Cancelado' }
      },
      expense: {
        'requested': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'Solicitado' },
        'under-review': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'Em Análise' },
        'approved': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Aprovado' },
        'rejected': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', label: 'Rejeitado' },
        'paid': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Pago' }
      }
    };

    return configs[variant as keyof typeof configs]?.[status as keyof typeof configs[variant]] || 
           { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400', label: status };
  };

  const config = getStatusConfig(status, variant);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;