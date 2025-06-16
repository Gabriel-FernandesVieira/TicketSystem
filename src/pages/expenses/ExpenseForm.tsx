import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Calendar, DollarSign, Receipt, Car, Target, Paperclip, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import { mockExpenseReimbursements, mockTickets } from '../../data/mockData';
import { format } from 'date-fns';

interface ExpenseFormData {
  ticketId: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  objective: string;
  status: 'requested' | 'under-review' | 'approved' | 'rejected' | 'paid';
  invoiced: boolean;
  expenses: ExpenseDetailFormData[];
}

interface ExpenseDetailFormData {
  id: string;
  expenseType: string;
  date: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  receipt?: File;
}

const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ExpenseFormData>({
    ticketId: '',
    startDate: '',
    endDate: '',
    vehicle: '',
    objective: '',
    status: 'requested',
    invoiced: false,
    expenses: []
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [loading, setLoading] = useState(false);

  // Load expense data for editing
  useEffect(() => {
    if (isEditing && id) {
      const expense = mockExpenseReimbursements.find(e => e.id === id);
      if (expense) {
        setFormData({
          ticketId: expense.ticketId || '',
          startDate: format(expense.startDate, 'yyyy-MM-dd'),
          endDate: format(expense.endDate, 'yyyy-MM-dd'),
          vehicle: expense.vehicle || '',
          objective: expense.objective,
          status: expense.status,
          invoiced: expense.invoiced,
          expenses: expense.expenses.map(exp => ({
            id: exp.id,
            expenseType: exp.expenseType,
            date: format(exp.date, 'yyyy-MM-dd'),
            description: exp.description,
            quantity: exp.quantity,
            unitValue: exp.unitValue,
            totalValue: exp.totalValue
          }))
        });
      } else {
        navigate('/expenses');
      }
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = (field: keyof ExpenseFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addExpenseDetail = () => {
    const newExpense: ExpenseDetailFormData = {
      id: Date.now().toString(),
      expenseType: '',
      date: formData.startDate || format(new Date(), 'yyyy-MM-dd'),
      description: '',
      quantity: 1,
      unitValue: 0,
      totalValue: 0
    };
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const updateExpenseDetail = (expenseId: string, field: keyof ExpenseDetailFormData, value: string | number | File) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense => {
        if (expense.id === expenseId) {
          const updated = { ...expense, [field]: value };
          
          // Auto-calculate total when quantity or unit value changes
          if (field === 'quantity' || field === 'unitValue') {
            updated.totalValue = updated.quantity * updated.unitValue;
          }
          
          return updated;
        }
        return expense;
      })
    }));
  };

  const removeExpenseDetail = (expenseId: string) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== expenseId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (!formData.endDate) newErrors.endDate = 'Data de término é obrigatória';
    if (!formData.objective.trim()) newErrors.objective = 'Objetivo é obrigatório';
    if (formData.expenses.length === 0) {
      newErrors.expenses = 'Adicione pelo menos uma despesa';
    }

    // Validate expense details
    const hasInvalidExpenses = formData.expenses.some(expense => 
      !expense.expenseType || !expense.description || expense.unitValue <= 0
    );
    
    if (hasInvalidExpenses) {
      newErrors.expenses = 'Preencha todos os campos das despesas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Expense data:', formData);
      
      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Erro ao salvar reembolso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const ticketOptions = mockTickets.map(ticket => ({
    value: ticket.id,
    label: `#${ticket.number} - ${ticket.subject}`
  }));

  const statusOptions = [
    { value: 'requested', label: 'Solicitado' },
    { value: 'under-review', label: 'Em Análise' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'paid', label: 'Pago' }
  ];

  const expenseTypeOptions = [
    { value: 'Combustível', label: 'Combustível' },
    { value: 'Hospedagem', label: 'Hospedagem' },
    { value: 'Alimentação', label: 'Alimentação' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Estacionamento', label: 'Estacionamento' },
    { value: 'Pedágio', label: 'Pedágio' },
    { value: 'Material', label: 'Material' },
    { value: 'Outros', label: 'Outros' }
  ];

  const totalExpenseValue = formData.expenses.reduce((sum, expense) => sum + expense.totalValue, 0);
  const selectedTicket = mockTickets.find(ticket => ticket.id === formData.ticketId);

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
              {isEditing ? 'Editar Reembolso' : 'Nova Solicitação de Reembolso'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Modifique as informações do reembolso' : 'Preencha os dados para solicitar reembolso de despesas'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Informações Gerais">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Data de Início"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                    error={errors.startDate}
                  />

                  <Input
                    label="Data de Término"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                    error={errors.endDate}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Ticket Relacionado (Opcional)"
                    value={formData.ticketId}
                    onChange={(e) => handleInputChange('ticketId', e.target.value)}
                    options={[{ value: '', label: 'Nenhum ticket' }, ...ticketOptions]}
                  />

                  <Input
                    label="Veículo Utilizado"
                    value={formData.vehicle}
                    onChange={(e) => handleInputChange('vehicle', e.target.value)}
                    placeholder="Ex: ABC1234"
                  />
                </div>

                <TextArea
                  label="Objetivo da Viagem/Despesa"
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  placeholder="Descreva o objetivo da viagem ou motivo das despesas"
                  rows={3}
                  required
                  error={errors.objective}
                />
              </div>
            </Card>

            <Card title="Despesas">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Detalhamento das Despesas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adicione todas as despesas relacionadas à viagem ou atividade
                    </p>
                  </div>
                  <Button
                    type="button"
                    icon={Plus}
                    onClick={addExpenseDetail}
                    size="sm"
                  >
                    Adicionar Despesa
                  </Button>
                </div>

                {errors.expenses && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-800 dark:text-red-300">{errors.expenses}</p>
                    </div>
                  </div>
                )}

                {formData.expenses.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      Nenhuma despesa adicionada
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Adicione as despesas para solicitar o reembolso
                    </p>
                    <Button
                      type="button"
                      icon={Plus}
                      onClick={addExpenseDetail}
                      className="mt-4"
                    >
                      Adicionar Primeira Despesa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.expenses.map((expense, index) => (
                      <div key={expense.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white">
                            Despesa {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeExpenseDetail(expense.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Select
                            label="Tipo de Despesa"
                            value={expense.expenseType}
                            onChange={(e) => updateExpenseDetail(expense.id, 'expenseType', e.target.value)}
                            options={[{ value: '', label: 'Selecione o tipo' }, ...expenseTypeOptions]}
                            required
                          />

                          <Input
                            label="Data"
                            type="date"
                            value={expense.date}
                            onChange={(e) => updateExpenseDetail(expense.id, 'date', e.target.value)}
                            required
                          />

                          <Input
                            label="Quantidade"
                            type="number"
                            value={expense.quantity}
                            onChange={(e) => updateExpenseDetail(expense.id, 'quantity', Number(e.target.value))}
                            min="1"
                            step="1"
                            required
                          />

                          <Input
                            label="Valor Unitário (R$)"
                            type="number"
                            value={expense.unitValue}
                            onChange={(e) => updateExpenseDetail(expense.id, 'unitValue', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            required
                          />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Valor Total (R$)
                            </label>
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                R$ {expense.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Comprovante
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateExpenseDetail(expense.id, 'receipt', file);
                              }}
                              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                            />
                          </div>

                          <div className="md:col-span-2 lg:col-span-3">
                            <Input
                              label="Descrição"
                              value={expense.description}
                              onChange={(e) => updateExpenseDetail(expense.id, 'description', e.target.value)}
                              placeholder="Descreva a despesa"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {totalExpenseValue > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                              Total das Despesas:
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            R$ {totalExpenseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Status e Configurações">
              <div className="space-y-4">
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statusOptions}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="invoiced"
                    checked={formData.invoiced}
                    onChange={(e) => handleInputChange('invoiced', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="invoiced" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Já foi faturado
                  </label>
                </div>
              </div>
            </Card>

            {selectedTicket && (
              <Card title="Ticket Relacionado">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Número
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">#{selectedTicket.number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Assunto
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTicket.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cliente
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedTicket.clientName}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card title="Resumo Financeiro">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Despesas</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    R$ {totalExpenseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Itens</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formData.expenses.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Período</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formData.startDate && formData.endDate 
                        ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                        : 0
                      } dias
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Ações">
              <div className="space-y-3">
                <Button
                  type="submit"
                  icon={Save}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Reembolso' : 'Solicitar Reembolso')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/expenses')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;