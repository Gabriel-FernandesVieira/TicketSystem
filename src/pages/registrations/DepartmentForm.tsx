import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Hash, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import { useDepartments, useDepartment } from '../../hooks/useDepartments';
import { CreateDepartmentRequest } from '../../services/departmentApi';

interface DepartmentFormData {
  descricao: string; // Required field from HNDEPARTAMENTO table
}

const DepartmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { createNewDepartment, updateExistingDepartment } = useDepartments();
  const { department: existingDepartment, loading: loadingDepartment, error: departmentError } = useDepartment(id);

  const [formData, setFormData] = useState<DepartmentFormData>({
    descricao: ''
  });

  const [errors, setErrors] = useState<Partial<DepartmentFormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nextCode, setNextCode] = useState<number>(1);

  // Load existing department data for editing
  useEffect(() => {
    if (isEditing && existingDepartment) {
      setFormData({
        descricao: existingDepartment.descricao || ''
      });
    }
  }, [isEditing, existingDepartment]);

  // Load next available code
  useEffect(() => {
    // In a real application, this would come from the API
    setNextCode(Math.floor(Math.random() * 1000) + 100); // Mock next code
  }, []);

  const handleInputChange = (field: keyof DepartmentFormData, value: string) => {
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

    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (formData.descricao.length < 2) newErrors.descricao = 'Descrição deve ter pelo menos 2 caracteres';
    if (formData.descricao.length > 40) newErrors.descricao = 'Descrição deve ter no máximo 40 caracteres';

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
        descricao: formData.descricao.trim()
      };

      if (isEditing && id) {
        await updateExistingDepartment(id, {
          departamento: existingDepartment?.departamento || 0,
          descricao: departmentData.descricao
        });
        alert('Departamento atualizado com sucesso!');
      } else {
        await createNewDepartment(departmentData);
        alert('Departamento criado com sucesso!');
      }
      
      navigate('/registrations/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Erro ao salvar departamento. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            <Card title="Informações do Departamento">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Código do Departamento
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {isEditing ? existingDepartment?.departamento : nextCode}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isEditing ? '(Atual)' : '(Próximo disponível)'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      O código é gerado automaticamente em sequência
                    </p>
                  </div>
                </div>

                <Input
                  label="Descrição do Departamento"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Digite a descrição do departamento"
                  required
                  error={errors.descricao}
                  maxLength={40}
                />
                
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.descricao.length}/40 caracteres
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Informações da Tabela Oracle">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Tabela HNDEPARTAMENTO
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                      Esta tela gerencia os dados da tabela HNDEPARTAMENTO do Oracle Database.
                    </p>
                    <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                      <p><strong>DEPARTAMENTO:</strong> Código numérico único (chave primária)</p>
                      <p><strong>DESCRICAO:</strong> Descrição do departamento (máximo 40 caracteres)</p>
                    </div>
                  </div>
                </div>
              </div>
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
                    {formData.descricao || 'Descrição do Departamento'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Código: {isEditing ? existingDepartment?.departamento : nextCode}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Descrição
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {formData.descricao || 'Digite a descrição...'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Caracteres
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          formData.descricao.length > 40 ? 'bg-red-500' :
                          formData.descricao.length > 30 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((formData.descricao.length / 40) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      formData.descricao.length > 40 ? 'text-red-600 dark:text-red-400' :
                      formData.descricao.length > 30 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {formData.descricao.length}/40
                    </span>
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
                  <Building2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">Tabela Oracle</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    HNDEPARTAMENTO
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