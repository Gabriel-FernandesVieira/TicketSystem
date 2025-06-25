import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Hash, FileText, Users, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import { useDepartments, useDepartment } from '../../hooks/useDepartments';
import { CreateDepartmentRequest } from '../../services/departmentApi';
import { ApiError } from '../../services/api';

interface DepartmentFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  manager: string;
  location: string;
  budget: number;
  costCenter: string;
  notes: string;
}

const DepartmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { createNewDepartment, updateExistingDepartment } = useDepartments();
  const { department: existingDepartment, loading: loadingDepartment, error: departmentError } = useDepartment(id);

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    description: '',
    status: 'active',
    manager: '',
    location: '',
    budget: 0,
    costCenter: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<DepartmentFormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nextCode, setNextCode] = useState<number>(1);

  // Load existing department data for editing
  useEffect(() => {
    if (isEditing && existingDepartment) {
      setFormData({
        name: existingDepartment.name || '',
        description: existingDepartment.description || '',
        status: existingDepartment.status || 'active',
        manager: existingDepartment.manager || '',
        location: existingDepartment.location || '',
        budget: existingDepartment.budget || 0,
        costCenter: existingDepartment.costCenter || '',
        notes: existingDepartment.notes || ''
      });
    }
  }, [isEditing, existingDepartment]);

  // Load next available code
  useEffect(() => {
    // In a real application, this would come from the API
    setNextCode(Math.floor(Math.random() * 1000) + 100); // Mock next code
  }, []);

  const handleInputChange = (field: keyof DepartmentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DepartmentFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (formData.name.length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError(null);
    
    try {
      const departmentData: CreateDepartmentRequest = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        manager: formData.manager,
        location: formData.location,
        budget: formData.budget,
        costCenter: formData.costCenter,
        notes: formData.notes
      };

      if (isEditing && id) {
        await updateExistingDepartment(id, departmentData);
        alert('Departamento atualizado com sucesso!');
      } else {
        await createNewDepartment(departmentData);
        alert('Departamento criado com sucesso!');
      }
      
      navigate('/registrations/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Erro ao salvar departamento. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const managerOptions = [
    { value: '', label: 'Selecione um gestor' },
    { value: 'Carlos Oliveira', label: 'Carlos Oliveira' },
    { value: 'Ana Lima', label: 'Ana Lima' },
    { value: 'Pedro Santos', label: 'Pedro Santos' },
    { value: 'Maria Silva', label: 'Maria Silva' },
    { value: 'João Costa', label: 'João Costa' }
  ];

  const locationOptions = [
    { value: '', label: 'Selecione uma localização' },
    { value: 'São Paulo - SP', label: 'São Paulo - SP' },
    { value: 'Rio de Janeiro - RJ', label: 'Rio de Janeiro - RJ' },
    { value: 'Belo Horizonte - MG', label: 'Belo Horizonte - MG' },
    { value: 'Brasília - DF', label: 'Brasília - DF' },
    { value: 'Porto Alegre - RS', label: 'Porto Alegre - RS' },
    { value: 'Remoto', label: 'Trabalho Remoto' }
  ];

  if (loadingDepartment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados do departamento...</p>
        </div>
      </div>
    );
  }

  if (departmentError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Erro ao carregar departamento
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{departmentError}</p>
            <Button onClick={() => navigate('/registrations/departments')} className="mt-4">
              Voltar para lista
            </Button>
          </div>
        </Card>
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
            onClick={() => navigate('/registrations/departments')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Modifique as informações do departamento' : 'Preencha os dados para criar um novo departamento'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {submitError && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-900 dark:text-red-300">
                Erro ao salvar departamento
              </h3>
              <p className="text-sm text-red-800 dark:text-red-400 mt-1">{submitError}</p>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Informações Básicas">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Código do Departamento
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {isEditing ? existingDepartment?.code : nextCode}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isEditing ? '(Atual)' : '(Próximo disponível)'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      O código é gerado automaticamente em sequência
                    </p>
                  </div>

                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    options={statusOptions}
                  />
                </div>

                <Input
                  label="Nome do Departamento"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome do departamento"
                  required
                  error={errors.name}
                />

                <TextArea
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva as responsabilidades e funções do departamento"
                  rows={4}
                  required
                  error={errors.description}
                />
              </div>
            </Card>

            <Card title="Informações Organizacionais">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Gestor Responsável"
                    value={formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    options={managerOptions}
                  />

                  <Select
                    label="Localização"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    options={locationOptions}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Orçamento Anual (R$)"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Centro de Custo"
                    value={formData.costCenter}
                    onChange={(e) => handleInputChange('costCenter', e.target.value)}
                    placeholder="Ex: CC001"
                  />
                </div>
              </div>
            </Card>

            <Card title="Observações">
              <TextArea
                label="Notas Adicionais"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Adicione observações, políticas específicas ou informações importantes sobre o departamento"
                rows={4}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Resumo do Departamento">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {formData.name || 'Nome do Departamento'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Código: {isEditing ? existingDepartment?.code : nextCode}
                  </p>
                </div>

                {formData.manager && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Gestor Responsável
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.manager}</p>
                  </div>
                )}

                {formData.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Localização
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.location}</p>
                  </div>
                )}

                {formData.budget > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Orçamento Anual
                    </label>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      R$ {formData.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      formData.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    {formData.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
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
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Departamento' : 'Criar Departamento')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/registrations/departments')}
                  className="w-full"
                >
                  Cancelar
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/registrations/departments/${id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Departamento
                  </Button>
                )}
              </div>
            </Card>

            <Card title="Informações do Sistema">
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Hash className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Código Sequencial</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Gerado automaticamente pelo sistema
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">Usuários Vinculados</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {isEditing ? (existingDepartment?.userCount || 0) : 0} usuários
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;