import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Calendar, User, Building2, AlertCircle, Clock, Target, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import { mockClients, mockProjects } from '../../data/mockData';
import { format } from 'date-fns';

interface ProjectFormData {
  description: string;
  client: string;
  responsible: string;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  category: string;
  objectives: string;
  deliverables: string;
  notes: string;
  stages: ProjectStageData[];
}

interface ProjectStageData {
  id: string;
  description: string;
  estimatedHours: number;
  startDate: string;
  endDate: string;
  responsible: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProjectFormData>({
    description: '',
    client: '',
    responsible: '',
    startDate: '',
    endDate: '',
    estimatedHours: 0,
    status: 'planning',
    priority: 'medium',
    budget: 0,
    category: '',
    objectives: '',
    deliverables: '',
    notes: '',
    stages: []
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'stages' | 'details'>('basic');

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addStage = () => {
    const newStage: ProjectStageData = {
      id: Date.now().toString(),
      description: '',
      estimatedHours: 0,
      startDate: '',
      endDate: '',
      responsible: '',
      status: 'pending'
    };
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const updateStage = (stageId: string, field: keyof ProjectStageData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeStage = (stageId: string) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    if (!formData.client) newErrors.client = 'Cliente é obrigatório';
    if (!formData.responsible) newErrors.responsible = 'Responsável é obrigatório';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (formData.estimatedHours <= 0) newErrors.estimatedHours = 'Horas estimadas devem ser maior que zero';

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
      
      console.log('Project data:', formData);
      
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientOptions = mockClients.map(client => ({
    value: client.cnpj,
    label: `${client.nomeFantasia} (${client.cnpj})`
  }));

  const statusOptions = [
    { value: 'planning', label: 'Planejamento' },
    { value: 'active', label: 'Ativo' },
    { value: 'on-hold', label: 'Pausado' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const categoryOptions = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'consulting', label: 'Consultoria' },
    { value: 'support', label: 'Suporte' },
    { value: 'training', label: 'Treinamento' },
    { value: 'maintenance', label: 'Manutenção' }
  ];

  const responsibleOptions = [
    { value: 'carlos.oliveira', label: 'Carlos Oliveira' },
    { value: 'ana.lima', label: 'Ana Lima' },
    { value: 'pedro.santos', label: 'Pedro Santos' },
    { value: 'maria.silva', label: 'Maria Silva' }
  ];

  const selectedClient = mockClients.find(client => client.cnpj === formData.client);
  const totalStageHours = formData.stages.reduce((sum, stage) => sum + stage.estimatedHours, 0);

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: FileText },
    { id: 'stages', label: 'Etapas', icon: Target },
    { id: 'details', label: 'Detalhes', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/projects')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Modifique as informações do projeto' : 'Preencha os dados para criar um novo projeto'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <div className="flex items-center justify-center space-x-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCompleted = index < tabs.findIndex(t => t.id === activeTab);
            
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
                {index < tabs.length - 1 && (
                  <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'basic' && (
              <>
                <Card title="Informações do Projeto">
                  <div className="space-y-4">
                    <TextArea
                      label="Descrição do Projeto"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva detalhadamente o projeto"
                      rows={3}
                      required
                      error={errors.description}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Cliente"
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        options={[{ value: '', label: 'Selecione um cliente' }, ...clientOptions]}
                        required
                        error={errors.client}
                      />

                      <Select
                        label="Responsável"
                        value={formData.responsible}
                        onChange={(e) => handleInputChange('responsible', e.target.value)}
                        options={[{ value: '', label: 'Selecione um responsável' }, ...responsibleOptions]}
                        required
                        error={errors.responsible}
                      />
                    </div>

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
                        label="Data de Término (Estimada)"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Horas Estimadas"
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => handleInputChange('estimatedHours', Number(e.target.value))}
                        placeholder="0"
                        min="1"
                        required
                        error={errors.estimatedHours}
                      />

                      <Input
                        label="Orçamento (R$)"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </Card>

                <Card title="Objetivos e Entregáveis">
                  <div className="space-y-4">
                    <TextArea
                      label="Objetivos do Projeto"
                      value={formData.objectives}
                      onChange={(e) => handleInputChange('objectives', e.target.value)}
                      placeholder="Descreva os principais objetivos e metas do projeto"
                      rows={3}
                    />

                    <TextArea
                      label="Entregáveis"
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange('deliverables', e.target.value)}
                      placeholder="Liste os principais entregáveis do projeto"
                      rows={3}
                    />
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'stages' && (
              <Card title="Etapas do Projeto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Gerenciar Etapas
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Divida o projeto em etapas para melhor controle
                      </p>
                    </div>
                    <Button
                      type="button"
                      icon={Plus}
                      onClick={addStage}
                      size="sm"
                    >
                      Adicionar Etapa
                    </Button>
                  </div>

                  {formData.stages.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <Target className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        Nenhuma etapa definida
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Adicione etapas para organizar melhor o projeto
                      </p>
                      <Button
                        type="button"
                        icon={Plus}
                        onClick={addStage}
                        className="mt-4"
                      >
                        Adicionar Primeira Etapa
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.stages.map((stage, index) => (
                        <div key={stage.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white">
                              Etapa {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeStage(stage.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Input
                                label="Descrição da Etapa"
                                value={stage.description}
                                onChange={(e) => updateStage(stage.id, 'description', e.target.value)}
                                placeholder="Descreva esta etapa"
                              />
                            </div>

                            <Input
                              label="Horas Estimadas"
                              type="number"
                              value={stage.estimatedHours}
                              onChange={(e) => updateStage(stage.id, 'estimatedHours', Number(e.target.value))}
                              placeholder="0"
                              min="0"
                            />

                            <Select
                              label="Responsável"
                              value={stage.responsible}
                              onChange={(e) => updateStage(stage.id, 'responsible', e.target.value)}
                              options={[{ value: '', label: 'Selecione um responsável' }, ...responsibleOptions]}
                            />

                            <Input
                              label="Data de Início"
                              type="date"
                              value={stage.startDate}
                              onChange={(e) => updateStage(stage.id, 'startDate', e.target.value)}
                            />

                            <Input
                              label="Data de Término"
                              type="date"
                              value={stage.endDate}
                              onChange={(e) => updateStage(stage.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}

                      {totalStageHours > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Total de horas das etapas: {totalStageHours}h
                              </p>
                              {formData.estimatedHours > 0 && (
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  {totalStageHours > formData.estimatedHours 
                                    ? `${totalStageHours - formData.estimatedHours}h acima do estimado`
                                    : `${formData.estimatedHours - totalStageHours}h restantes`
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'details' && (
              <>
                <Card title="Configurações Avançadas">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      options={statusOptions}
                    />

                    <Select
                      label="Prioridade"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      options={priorityOptions}
                    />

                    <Select
                      label="Categoria"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      options={[{ value: '', label: 'Selecione uma categoria' }, ...categoryOptions]}
                      className="md:col-span-2"
                    />
                  </div>
                </Card>

                <Card title="Observações">
                  <TextArea
                    label="Notas Adicionais"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Adicione observações, requisitos especiais ou informações importantes sobre o projeto"
                    rows={4}
                  />
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Resumo do Projeto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status Atual
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    formData.status === 'planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    formData.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    formData.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </span>
                </div>

                {formData.estimatedHours > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Horas Estimadas
                    </label>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formData.estimatedHours}h
                    </p>
                  </div>
                )}

                {formData.budget > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Orçamento
                    </label>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      R$ {formData.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {formData.stages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Etapas Definidas
                    </label>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formData.stages.length}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {selectedClient && (
              <Card title="Informações do Cliente">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Razão Social
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.razaoSocial}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nome Fantasia
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.nomeFantasia}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      CNPJ
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.cnpj}</p>
                  </div>
                  {selectedClient.grupo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Grupo
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.grupo}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card title="Ações">
              <div className="space-y-3">
                <Button
                  type="submit"
                  icon={Save}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Projeto' : 'Criar Projeto')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/projects')}
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

export default ProjectForm;