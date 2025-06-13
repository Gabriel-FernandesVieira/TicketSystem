import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { mockExpenseReimbursements } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExpenseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredExpenses = mockExpenseReimbursements.filter(expense => {
    const matchesSearch = expense.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.code.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || expense.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (value: number) => `#${value}`
    },
    {
      key: 'objective',
      label: 'Objetivo',
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Data Início',
      render: (value: Date) => format(value, 'dd/MM/yyyy', { locale: ptBR })
    },
    {
      key: 'endDate',
      label: 'Data Fim',
      render: (value: Date) => format(value, 'dd/MM/yyyy', { locale: ptBR })
    },
    {
      key: 'totalValue',
      label: 'Valor Total',
      render: (value: number) => (
        <span className="font-medium text-gray-900 dark:text-white">
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} variant="expense" />
    },
    {
      key: 'invoiced',
      label: 'Faturado',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {value ? 'Sim' : 'Não'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/expenses/${row.id}`)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/expenses/${row.id}/edit`)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {/* Handle delete */}}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'requested', label: 'Solicitado' },
    { value: 'under-review', label: 'Em Análise' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'paid', label: 'Pago' }
  ];

  const totalPendingValue = filteredExpenses
    .filter(e => ['requested', 'under-review'].includes(e.status))
    .reduce((sum, expense) => sum + expense.totalValue, 0);

  const totalApprovedValue = filteredExpenses
    .filter(e => e.status === 'approved')
    .reduce((sum, expense) => sum + expense.totalValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reembolsos de Despesas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todas as solicitações de reembolso de viagem
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/expenses/new')}
        >
          Nova Solicitação
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar reembolsos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="min-w-48"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredExpenses}
          onRowClick={(expense) => navigate(`/expenses/${expense.id}`)}
          emptyMessage="Nenhum reembolso encontrado"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Solicitações</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockExpenseReimbursements.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Pendente</p>
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                R$ {(totalPendingValue / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Aprovado</p>
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                R$ {(totalApprovedValue / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Análise</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockExpenseReimbursements.filter(e => e.status === 'under-review').length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseList;