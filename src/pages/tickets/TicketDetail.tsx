import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, User, Building2, Tag, MessageSquare, Paperclip } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { mockTickets } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const ticket = mockTickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Ticket não encontrado</p>
        <Button onClick={() => navigate('/tickets')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ticket #{ticket.number}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {ticket.subject}
            </p>
          </div>
        </div>
        
        <Button
          icon={Edit}
          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
        >
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Descrição">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </Card>

          <Card title="Histórico do Ticket">
            <div className="space-y-4">
              {ticket.history.map((entry) => (
                <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {entry.author}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.authorType === 'internal' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {entry.authorType === 'internal' ? 'Interno' : 'Cliente'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(entry.date, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {entry.message}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Adicionar Comentário">
            <div className="space-y-4">
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Digite seu comentário..."
              />
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Paperclip className="w-5 h-5" />
                  <span>Anexar arquivo</span>
                </button>
                <Button>Adicionar Comentário</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Informações do Ticket">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <StatusBadge status={ticket.status} variant="ticket" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Prioridade</label>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Classificação</label>
                <p className="text-gray-900 dark:text-white">{ticket.classification}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{ticket.clientName}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Responsável</label>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {ticket.assignedTo || 'Não atribuído'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</label>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {format(ticket.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>

              {ticket.tag && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Tag</label>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{ticket.tag}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Horas Trabalhadas</label>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {ticket.totalHours}h
                </p>
              </div>
            </div>
          </Card>

          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar por Email
              </Button>
              
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Registrar Tempo
              </Button>
              
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Atribuir Responsável
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;