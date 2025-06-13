import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { mockTickets } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.number.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    {
      key: 'number',
      label: 'Número',
      render: (value: number) => `#${value}`
    },
    {
      key: 'subject',
      label: 'Assunto',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'clientName',
      label: 'Cliente'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} variant="ticket" />
    },
    {
      key: 'priority',
      label: 'Prioridade',
      render: (value: string) => <PriorityBadge priority={value as any} />
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: Date) => format(value, 'dd/MM/yyyy HH:mm', { locale: ptBR })
    },
    {
      key: 'assignedTo',
      label: 'Responsável',
      render: (value: string) => value || 'Não atribuído'
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/tickets/${row.id}`)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/tickets/${row.id}/edit`)}
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
    { value: 'open', label: 'Aberto' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'awaiting-customer', label: 'Aguardando Cliente' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Fechado' }
  ];

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todos os tickets de suporte do sistema
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/tickets/new')}
        >
          Novo Ticket
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar tickets..."
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
            
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
              className="min-w-48"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredTickets}
          onRowClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
          emptyMessage="Nenhum ticket encontrado"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTickets.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Abertos</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockTickets.filter(t => t.status === 'open').length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Progresso</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {mockTickets.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolvidos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockTickets.filter(t => t.status === 'resolved').length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketList;