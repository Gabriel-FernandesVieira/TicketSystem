import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Lock, Shield, Building2, Phone, MapPin, Calendar, Eye, EyeOff, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import { useUsers, useUser } from '../../hooks/useUsers';
import { CreateUserRequest, uploadUserAvatar } from '../../services/userApi';
import { ApiError } from '../../services/api';

interface UserFormData {
  emailsist: string;
  nome: string;
  senha: string;
  confirmPassword: string;
  status: number; // 0 = inactive, 1 = active
  departamento: number;
  notes: string;
  avatar?: File;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { createNewUser, updateExistingUser } = useUsers();
  const { user: existingUser, loading: loadingUser, error: userError } = useUser(id);

  const [formData, setFormData] = useState<UserFormData>({
    emailsist: '',
    nome: '',
    senha: '',
    confirmPassword: '',
    status: 1, // Active by default
    departamento: 1, // Default to TI department
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details'>('basic');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load existing user data for editing
  useEffect(() => {
    if (isEditing && existingUser) {
      setFormData({
        emailsist: existingUser.emailsist || existingUser.email || '',
        nome: existingUser.nome || existingUser.name || '',
        senha: '',
        confirmPassword: '',
        status: existingUser.status === 'active' ? 1 : 0,
        departamento: existingUser.departamento || 1,
        notes: ''
      });

      if (existingUser.avatar) {
        setAvatarPreview(existingUser.avatar);
      }
    }
  }, [isEditing, existingUser]);

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Arquivo deve ter no máximo 2MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Arquivo deve ser uma imagem' }));
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous avatar errors
      if (errors.avatar) {
        setErrors(prev => ({ ...prev, avatar: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Basic validation
    if (!formData.emailsist.trim()) newErrors.emailsist = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.emailsist)) newErrors.emailsist = 'Email inválido';
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    
    if (!isEditing) {
      if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
      else if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
      
      if (formData.senha !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    } else if (formData.senha && formData.senha !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.departamento) newErrors.departamento = 'Departamento é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError(null);
    
    try {
      const userData: CreateUserRequest = {
        emailsist: formData.emailsist,
        nome: formData.nome,
        senha: formData.senha,
        status: formData.status,
        departamento: formData.departamento
      };

      let savedUser;
      if (isEditing && id) {
        // For editing, don't include password if it's empty
        const updateData = { ...userData };
        if (!formData.senha) {
          delete updateData.senha;
        }
        savedUser = await updateExistingUser(id, updateData);
      } else {
        savedUser = await createNewUser(userData);
      }

      // Upload avatar if provided
      if (formData.avatar && savedUser) {
        try {
          await uploadUserAvatar(savedUser.email, formData.avatar);
        } catch (avatarError) {
          console.warn('Failed to upload avatar:', avatarError);
          // Don't fail the entire operation for avatar upload issues
        }
      }
      
      // Show success message
      alert(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      navigate('/registrations/users');
    } catch (error) {
      console.error('Error saving user:', error);
      
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Erro ao salvar usuário. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: '1', label: 'Ativo' },
    { value: '0', label: 'Inativo' }
  ];

  const departmentOptions = [
    { value: '1', label: 'Tecnologia da Informação' },
    { value: '2', label: 'Atendimento ao Cliente' },
    { value: '3', label: 'Comercial' },
    { value: '4', label: 'Financeiro' },
    { value: '5', label: 'Recursos Humanos' },
    { value: '6', label: 'Marketing' }
  ];

  const getDepartmentName = (code: number): string => {
    const dept = departmentOptions.find(d => d.value === code.toString());
    return dept?.label || 'Não definido';
  };

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: User },
    { id: 'details', label: 'Detalhes', icon: Building2 }
  ];

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Erro ao carregar usuário
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{userError}</p>
            <Button onClick={() => navigate('/registrations/users')} className="mt-4">
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
            onClick={() => navigate('/registrations/users')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Modifique as informações do usuário' : 'Preencha os dados para criar um novo usuário'}
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
                Erro ao salvar usuário
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

      {/* Tab Navigation */}
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
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                      : isCompleted
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {isCompleted && <CheckCircle className="w-4 h-4" />}
                </button>
                {index < tabs.length - 1 && (
                  <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
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
                <Card title="Informações Pessoais">
                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                          <Camera className="w-4 h-4" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Foto do Perfil</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Clique no ícone da câmera para adicionar uma foto
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          JPG, PNG ou GIF. Máximo 2MB.
                        </p>
                        {errors.avatar && (
                          <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome Completo"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Digite o nome completo"
                        required
                        error={errors.nome}
                      />

                      <Input
                        label="Email"
                        type="email"
                        value={formData.emailsist}
                        onChange={(e) => handleInputChange('emailsist', e.target.value)}
                        placeholder="usuario@empresa.com"
                        required
                        error={errors.emailsist}
                        disabled={isEditing} // Email shouldn't be changed in edit mode
                      />
                    </div>

                    {(!isEditing || formData.senha) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Input
                            label={isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                            type={showPassword ? 'text' : 'password'}
                            value={formData.senha}
                            onChange={(e) => handleInputChange('senha', e.target.value)}
                            placeholder="Digite a senha"
                            required={!isEditing}
                            error={errors.senha}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            label="Confirmar Senha"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="Confirme a senha"
                            required={!isEditing || !!formData.senha}
                            error={errors.confirmPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card title="Informações Organizacionais">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Departamento"
                      value={formData.departamento.toString()}
                      onChange={(e) => handleInputChange('departamento', Number(e.target.value))}
                      options={[{ value: '', label: 'Selecione um departamento' }, ...departmentOptions]}
                      required
                      error={errors.departamento}
                    />

                    <Select
                      label="Status"
                      value={formData.status.toString()}
                      onChange={(e) => handleInputChange('status', Number(e.target.value))}
                      options={statusOptions}
                    />
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'details' && (
              <Card title="Informações Adicionais">
                <div className="space-y-4">
                  <TextArea
                    label="Observações"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Adicione observações sobre o usuário, habilidades, responsabilidades especiais, etc."
                    rows={4}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Resumo do Usuário">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {formData.nome || 'Nome do Usuário'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.emailsist || 'email@empresa.com'}
                  </p>
                </div>

                {formData.departamento && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Departamento
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{getDepartmentName(formData.departamento)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.status === 1
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      formData.status === 1 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    {formData.status === 1 ? 'Ativo' : 'Inativo'}
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
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Usuário' : 'Criar Usuário')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/registrations/users')}
                  className="w-full"
                >
                  Cancelar
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, senha: '', confirmPassword: '' }));
                      setActiveTab('basic');
                    }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Redefinir Senha
                  </Button>
                )}
              </div>
            </Card>

            <Card title="Informações do Sistema">
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Tabela UNUSRSIST</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Dados armazenados no Oracle
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Building2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">Departamento</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Código: {formData.departamento}
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

export default UserForm;