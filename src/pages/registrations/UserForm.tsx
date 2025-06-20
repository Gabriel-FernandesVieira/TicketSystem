import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Lock, Shield, Building2, Phone, MapPin, Calendar, Eye, EyeOff, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'manager' | 'user' | 'support';
  department: string;
  phone: string;
  position: string;
  location: string;
  startDate: string;
  status: 'active' | 'inactive';
  permissions: string[];
  notes: string;
  avatar?: File;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    department: '',
    phone: '',
    position: '',
    location: '',
    startDate: '',
    status: 'active',
    permissions: [],
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'permissions' | 'details'>('basic');

  // Mock data for existing user (when editing)
  useEffect(() => {
    if (isEditing && id) {
      // Simulate loading existing user data
      setLoading(true);
      setTimeout(() => {
        setFormData({
          name: 'João Silva',
          email: 'joao.silva@empresa.com',
          password: '',
          confirmPassword: '',
          role: 'admin',
          department: 'TI',
          phone: '(11) 99999-9999',
          position: 'Desenvolvedor Senior',
          location: 'São Paulo - SP',
          startDate: '2023-01-15',
          status: 'active',
          permissions: ['tickets.create', 'tickets.edit', 'projects.view'],
          notes: 'Usuário experiente com conhecimento em React e Node.js'
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const handleInputChange = (field: keyof UserFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!isEditing) {
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      else if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    if (!formData.department) newErrors.department = 'Departamento é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('User data:', formData);
      
      // Show success message
      alert(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      navigate('/registrations/users');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Usuário' },
    { value: 'support', label: 'Suporte' },
    { value: 'manager', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' }
  ];

  const departmentOptions = [
    { value: 'TI', label: 'Tecnologia da Informação' },
    { value: 'Atendimento', label: 'Atendimento ao Cliente' },
    { value: 'Suporte', label: 'Suporte Técnico' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'RH', label: 'Recursos Humanos' },
    { value: 'Diretoria', label: 'Diretoria' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const permissionOptions = [
    { value: 'tickets.create', label: 'Criar Tickets' },
    { value: 'tickets.edit', label: 'Editar Tickets' },
    { value: 'tickets.delete', label: 'Excluir Tickets' },
    { value: 'tickets.assign', label: 'Atribuir Tickets' },
    { value: 'projects.view', label: 'Visualizar Projetos' },
    { value: 'projects.create', label: 'Criar Projetos' },
    { value: 'projects.edit', label: 'Editar Projetos' },
    { value: 'projects.delete', label: 'Excluir Projetos' },
    { value: 'expenses.view', label: 'Visualizar Reembolsos' },
    { value: 'expenses.approve', label: 'Aprovar Reembolsos' },
    { value: 'reports.view', label: 'Visualizar Relatórios' },
    { value: 'users.manage', label: 'Gerenciar Usuários' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 dark:text-red-400';
      case 'manager': return 'text-blue-600 dark:text-blue-400';
      case 'support': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'manager': return Building2;
      case 'support': return User;
      default: return User;
    }
  };

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: User },
    { id: 'permissions', label: 'Permissões', icon: Shield },
    { id: 'details', label: 'Detalhes', icon: Building2 }
  ];

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados do usuário...</p>
        </div>
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome Completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Digite o nome completo"
                        required
                        error={errors.name}
                      />

                      <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="usuario@empresa.com"
                        required
                        error={errors.email}
                      />
                    </div>

                    {!isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Input
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Digite a senha"
                            required
                            error={errors.password}
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
                            required
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Telefone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                      />

                      <Input
                        label="Cargo/Posição"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="Ex: Desenvolvedor Senior"
                      />
                    </div>
                  </div>
                </Card>

                <Card title="Informações Organizacionais">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Perfil de Acesso"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      options={roleOptions}
                      required
                    />

                    <Select
                      label="Departamento"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      options={[{ value: '', label: 'Selecione um departamento' }, ...departmentOptions]}
                      required
                      error={errors.department}
                    />

                    <Input
                      label="Localização"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ex: São Paulo - SP"
                    />

                    <Input
                      label="Data de Início"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'permissions' && (
              <Card title="Permissões do Sistema">
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Configuração de Permissões
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                          Selecione as permissões específicas que este usuário terá no sistema. 
                          As permissões são baseadas no perfil selecionado, mas podem ser personalizadas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionOptions.map((permission) => (
                      <label key={permission.value} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('permissions', [...formData.permissions, permission.value]);
                            } else {
                              handleInputChange('permissions', formData.permissions.filter(p => p !== permission.value));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.permissions.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
                        Permissões Selecionadas ({formData.permissions.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.permissions.map((permission) => {
                          const permissionLabel = permissionOptions.find(p => p.value === permission)?.label;
                          return (
                            <span key={permission} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                              {permissionLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'details' && (
              <Card title="Informações Adicionais">
                <div className="space-y-4">
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    options={statusOptions}
                  />

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
                    {formData.name || 'Nome do Usuário'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.email || 'email@empresa.com'}
                  </p>
                </div>

                {formData.role && (
                  <div className="text-center">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      formData.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      formData.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      formData.role === 'support' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {React.createElement(getRoleIcon(formData.role), { className: 'w-4 h-4' })}
                      <span>{roleOptions.find(r => r.value === formData.role)?.label}</span>
                    </div>
                  </div>
                )}

                {formData.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Departamento
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.department}</p>
                  </div>
                )}

                {formData.position && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cargo
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.position}</p>
                  </div>
                )}

                {formData.permissions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Permissões
                    </label>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {formData.permissions.length} permissões configuradas
                      </span>
                    </div>
                  </div>
                )}
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
                      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                      setActiveTab('basic');
                      alert('Formulário de redefinição de senha será exibido');
                    }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Redefinir Senha
                  </Button>
                )}
              </div>
            </Card>

            {formData.role && (
              <Card title="Informações do Perfil">
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {React.createElement(getRoleIcon(formData.role), { 
                      className: `w-8 h-8 mx-auto mb-2 ${getRoleColor(formData.role)}` 
                    })}
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {roleOptions.find(r => r.value === formData.role)?.label}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.role === 'admin' && 'Acesso total ao sistema'}
                      {formData.role === 'manager' && 'Gerenciamento de equipe e projetos'}
                      {formData.role === 'support' && 'Atendimento e suporte técnico'}
                      {formData.role === 'user' && 'Acesso básico ao sistema'}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;