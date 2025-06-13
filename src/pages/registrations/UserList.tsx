import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: 'admin',
    department: 'TI',
    status: 'active',
    lastLogin: new Date('2024-01-15T14:30:00')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    role: 'manager',
    department: 'Atendimento',
    status: 'active',
    lastLogin: new Date('2024-01-14T16:45:00')
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    role: 'user',
    department: 'Suporte',
    status: 'inactive',
    lastLogin: new Date('2024-01-10T09:20:00')
  }
];

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      manager: 'Gestor',
      user: 'Usuário',
      support: 'Suporte'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      user: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      support: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[role as keyof typeof config] || config.user}`}>
        <Shield className="w-3 h-3 mr-1" />
        {getRoleLabel(role)}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Perfil',
      render: (value: string) => getRoleBadge(value)
    },
    {
      key: 'department',
      label: 'Departamento'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {value === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Último Acesso',
      render: (value: Date) => value.toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/registrations/users/${row.id}`)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/registrations/users/${row.id}/edit`)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {/* Handle delete */}}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const roleOptions = [
    { value: '', label: 'Todos os perfis' },
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gestor' },
    { value: 'user', label: 'Usuário' },
    { value: 'support', label: 'Suporte' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuários</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/registrations/users/new')}
        >
          Novo Usuário
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
              className="min-w-48"
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="min-w-32"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          onRowClick={(user) => navigate(`/registrations/users/${user.id}`)}
          emptyMessage="Nenhum usuário encontrado"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockUsers.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ativos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockUsers.filter(u => u.status === 'active').length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Administradores</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {mockUsers.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gestores</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockUsers.filter(u => u.role === 'manager').length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserList;