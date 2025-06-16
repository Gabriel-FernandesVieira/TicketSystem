import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, DollarSign, Receipt, Car, Target, FileText, Download, AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { mockExpenseReimbursements, mockTickets } from '../../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExpenseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const expense = mockExpenseReimbursements.find(e => e.id === id);
  const relatedTicket = expense?.ticketId ? mockTickets.find(t => t.id === expense.ticketId) : null;

  const handleStatusChange = async (newStatus: string) => {
    if (!expense) return;
    
    const confirmMessage = newStatus === 'approved' 
      ? 'Tem certeza que deseja aprovar este reembolso?'
      : newStatus === 'rejected'
      ? 'Tem certeza que deseja rejeitar este reembolso?'
      : `Tem certeza que deseja alterar o status para ${newStatus}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Status changed to: ${newStatus}`);
        // In a real app, this would update the expense status
        alert(`Status alterado para: ${newStatus}`);
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Erro ao atualizar status. Tente novamente.');
      }
    }
  };

  const handleDelete = async () => {
    if (!expense) return;
    
    if (window.confirm(`Tem certeza que deseja excluir este reembolso?`)) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/expenses');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Erro ao excluir reembolso. Tente novamente.');
      }
    }
  };

  if (!expense) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          Reembolso não encontrado
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          O reembolso que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/expenses')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  const totalDays = Math.ceil((expense.endDate.getTime() - expense.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const canApprove = expense.status === 'under-review' || expense.status === 'requested';
  const canReject = expense.status === 'under-review' || expense.status === 'requested';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/expenses')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reembolso #{expense.code}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {expense.objective}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {canReject && (
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => handleStatusChange('rejected')}
            >
              Rejeitar
            </Button>
          )}
          {canApprove && (
            <Button
              variant="secondary"
              icon={CheckCircle}
              onClick={() => handleStatusChange('approved')}
            >
              Aprovar
            </Button>
          )}
          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleDelete}
          >
            Excluir
          </Button>
          <Button
            icon={Edit}
            onClick={() => navigate(`/expenses/${expense.id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Objetivo da Viagem/Despesa">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {expense.objective}
              </p>
            </div>
          </Card>

          <Card title="Detalhamento das Despesas">
            <div className="space-y-4">
              {expense.expenses.map((expenseDetail, index) => (
                <div key={expenseDetail.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {expenseDetail.expenseType} - {format(expenseDetail.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </h4>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      R$ {expenseDetail.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Quantidade:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{expenseDetail.quantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Valor Unitário:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        R$ {expenseDetail.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        R$ {expenseDetail.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Comprovante:</span>
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="w-3 h-3" />
                        <span className="text-xs">Baixar</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {expenseDetail.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Histórico de Status">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Solicitação criada
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(expense.startDate, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Reembolso solicitado para o período de {format(expense.startDate, 'dd/MM/yyyy', { locale: ptBR })} a {format(expense.endDate, 'dd/MM/yyyy', { locale: ptBR })}.
                </p>
              </div>

              {expense.status !== 'requested' && (
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Em análise
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Reembolso em processo de análise pela equipe financeira.
                  </p>
                </div>
              )}

              {(expense.status === 'approved' || expense.status === 'paid') && (
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Aprovado
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Reembolso aprovado e autorizado para pagamento.
                  </p>
                </div>
              )}

              {expense.status === 'rejected' && (
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rejeitado
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Reembolso rejeitado. Entre em contato com o financeiro para mais informações.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Informações do Reembolso">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <StatusBadge status={expense.status} variant="expense" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Período</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {format(expense.startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(expense.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {totalDays} {totalDays === 1 ? 'dia' : 'dias'}
                </p>
              </div>

              {expense.vehicle && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Veículo</label>
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{expense.vehicle}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Valor Total</label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {expense.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Faturamento</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  expense.invoiced 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {expense.invoiced ? 'Faturado' : 'Não faturado'}
                </span>
              </div>
            </div>
          </Card>

          {relatedTicket && (
            <Card title="Ticket Relacionado">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Número
                  </label>
                  <button
                    onClick={() => navigate(`/tickets/${relatedTicket.id}`)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    #{relatedTicket.number}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Assunto
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{relatedTicket.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cliente
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{relatedTicket.clientName}</p>
                </div>
              </div>
            </Card>
          )}

          <Card title="Estatísticas">
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Receipt className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{expense.expenses.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Itens de Despesa</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ {(expense.totalValue / totalDays).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Média por Dia</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDays}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dias de Viagem</p>
              </div>
            </div>
          </Card>

          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Baixar Comprovantes
              </Button>
              
              {expense.status === 'approved' && (
                <Button variant="outline" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Marcar como Pago
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;