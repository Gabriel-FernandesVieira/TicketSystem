import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, AlertTriangle, ArrowUp, Circle, Eye, Edit, User, Building2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { mockTickets } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TicketQueue: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  // Priority order for sorting (highest to lowest)
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = mockTickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.number.toString().includes(searchTerm);
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
      const matchesStatus = !statusFilter || ticket.status === statusFilter;
      const matchesAssigned = !assignedFilter || 
        (assignedFilter === 'unassigned' ? !ticket.assignedTo : ticket.assignedTo === assignedFilter);
      
      return matchesSearch && matchesPriority && matchesStatus && matchesAssigned;
    });

    // Sort by priority (highest to lowest), then by creation date (newest first)
    return filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [mockTickets, searchTerm, priorityFilter, statusFilter, assignedFilter]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return ArrowUp;
      case 'high': return AlertTriangle;
      case 'medium': return Circle;
      case 'low': return Circle;
      default: return Circle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'urgent', label: 'Urgente' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'open', label: 'Aberto' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'awaiting-customer', label: 'Aguardando Cliente' },
    { value: 'resolved', label: 'Resolvido' }
  ];

  const assignedOptions = [
    { value: '', label: 'Todos os responsáveis' },
    { value: 'unassigned', label: 'Não atribuído' },
    { value: 'Maria Santos', label: 'Maria Santos' },
    { value: 'João Silva', label: 'João Silva' },
    { value: 'Pedro Costa', label: 'Pedro Costa' }
  ];

  const priorityStats = useMemo(() => {
    return {
      urgent: filteredAndSortedTickets.filter(t => t.priority === 'urgent').length,
      high: filteredAndSortedTickets.filter(t => t.priority === 'high').length,
      medium: filteredAndSortedTickets.filter(t => t.priority === 'medium').length,
      low: filteredAndSortedTickets.filter(t => t.priority === 'low').length,
    };
  }, [filteredAndSortedTickets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fila de Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Tickets organizados por prioridade ({filteredAndSortedTickets.length} tickets)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/tickets/kanban')}
          >
            Visualizar Kanban
          </Button>
          <Button
            onClick={() => navigate('/tickets/new')}
          >
            Novo Ticket
          </Button>
        </div>
      </div>

      {/* Priority Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Urgente</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{priorityStats.urgent}</p>
            </div>
            <ArrowUp className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </Card>
        
        <Card className="border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alta</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{priorityStats.high}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>
        
        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Média</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{priorityStats.medium}</p>
            </div>
            <Circle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </Card>
        
        <Card className="border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Baixa</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{priorityStats.low}</p>
            </div>
            <Circle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
              className="min-w-48"
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="min-w-48"
            />
            
            <Select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              options={assignedOptions}
              className="min-w-48"
            />
          </div>
        </div>
      </Card>

      {/* Ticket Queue */}
      <div className="space-y-3">
        {filteredAndSortedTickets.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Nenhum ticket encontrado
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Ajuste os filtros ou crie um novo ticket.
              </p>
            </div>
          </Card>
        ) : (
          filteredAndSortedTickets.map((ticket) => {
            const PriorityIcon = getPriorityIcon(ticket.priority);
            const priorityColor = getPriorityColor(ticket.priority);
            
            return (
              <Card 
                key={ticket.id} 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
                  ticket.priority === 'urgent' ? 'border-red-500' :
                  ticket.priority === 'high' ? 'border-orange-500' :
                  ticket.priority === 'medium' ? 'border-yellow-500' :
                  'border-gray-300'
                }`}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${
                      ticket.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/20' :
                      ticket.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-gray-100 dark:bg-gray-900/20'
                    }`}>
                      <PriorityIcon className={`w-5 h-5 ${priorityColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          #{ticket.number}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} variant="ticket" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {ticket.subject}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{ticket.clientName}</span>
                        </div>
                        
                        {ticket.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{ticket.assignedTo}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(ticket.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                        </div>
                        
                        {ticket.totalHours > 0 && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{ticket.totalHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}`);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}/edit`);
                      }}
                      className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketQueue;