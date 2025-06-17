import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, User, Building2, Calendar, Clock, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import PriorityBadge from '../../components/common/PriorityBadge';
import { mockTickets } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  bgColor: string;
  count: number;
}

const TicketKanban: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null);

  const columns: KanbanColumn[] = [
    {
      id: 'open',
      title: 'Aberto',
      status: 'open',
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      count: 0
    },
    {
      id: 'in-progress',
      title: 'Em Progresso',
      status: 'in-progress',
      color: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      count: 0
    },
    {
      id: 'awaiting-customer',
      title: 'Aguardando Cliente',
      status: 'awaiting-customer',
      color: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      count: 0
    },
    {
      id: 'resolved',
      title: 'Resolvido',
      status: 'resolved',
      color: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      count: 0
    },
    {
      id: 'closed',
      title: 'Fechado',
      status: 'closed',
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      count: 0
    }
  ];

  const filteredTickets = useMemo(() => {
    return mockTickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.number.toString().includes(searchTerm);
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
      const matchesAssigned = !assignedFilter || 
        (assignedFilter === 'unassigned' ? !ticket.assignedTo : ticket.assignedTo === assignedFilter);
      
      return matchesSearch && matchesPriority && matchesAssigned;
    });
  }, [mockTickets, searchTerm, priorityFilter, assignedFilter]);

  const ticketsByStatus = useMemo(() => {
    const grouped = filteredTickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {} as Record<string, typeof filteredTickets>);

    // Sort tickets within each column by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    Object.keys(grouped).forEach(status => {
      grouped[status].sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });

    return grouped;
  }, [filteredTickets]);

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggedTicket(ticketId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTicket) {
      // In a real application, you would update the ticket status here
      console.log(`Moving ticket ${draggedTicket} to status ${newStatus}`);
      setDraggedTicket(null);
      
      // Show a success message or update the UI
      alert(`Ticket movido para: ${columns.find(c => c.status === newStatus)?.title}`);
    }
  };

  const handleDragEnd = () => {
    setDraggedTicket(null);
  };

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'urgent', label: 'Urgente' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' }
  ];

  const assignedOptions = [
    { value: '', label: 'Todos os responsáveis' },
    { value: 'unassigned', label: 'Não atribuído' },
    { value: 'Maria Santos', label: 'Maria Santos' },
    { value: 'João Silva', label: 'João Silva' },
    { value: 'Pedro Costa', label: 'Pedro Costa' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/tickets')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban de Tickets</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Gerencie tickets por status ({filteredTickets.length} tickets)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/tickets/queue')}
          >
            Visualizar Fila
          </Button>
          <Button
            icon={Plus}
            onClick={() => navigate('/tickets/new')}
          >
            Novo Ticket
          </Button>
        </div>
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
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              options={assignedOptions}
              className="min-w-48"
            />
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columns.map((column) => {
          const columnTickets = ticketsByStatus[column.status] || [];
          
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className={`rounded-lg p-4 ${column.bgColor} border-2 border-dashed border-transparent transition-colors ${
                draggedTicket ? 'border-gray-300 dark:border-gray-600' : ''
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold text-lg ${column.color}`}>
                    {column.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${column.color} bg-white dark:bg-gray-800`}>
                    {columnTickets.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {columnTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <Filter className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Nenhum ticket
                      </p>
                    </div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-all duration-200 ${
                          draggedTicket === ticket.id ? 'opacity-50 transform rotate-2' : ''
                        }`}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              #{ticket.number}
                            </span>
                            <PriorityBadge priority={ticket.priority} />
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tickets/${ticket.id}`);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tickets/${ticket.id}/edit`);
                              }}
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {ticket.subject}
                        </h4>

                        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{ticket.clientName}</span>
                          </div>
                          
                          {ticket.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span className="truncate">{ticket.assignedTo}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(ticket.createdAt, 'dd/MM', { locale: ptBR })}</span>
                            </div>
                            
                            {ticket.totalHours > 0 && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{ticket.totalHours}h</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {ticket.classification && (
                          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              {ticket.classification}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Como usar o Kanban
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Arraste e solte os tickets entre as colunas para alterar seus status. 
              Os tickets são ordenados automaticamente por prioridade (urgente → baixa) e data de criação.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TicketKanban;