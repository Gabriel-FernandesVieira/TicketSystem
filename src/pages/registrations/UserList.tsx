import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, User, Shield, Download, Filter, MoreVertical, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import { useUsers } from '../../hooks/useUsers';
import { UserFilters } from '../../services/userApi';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    users,
    loading,
    error,
    total,
    page,
    limit,
    loadUsers,
    deleteExistingUser,
    clearError,
    refreshUsers
  } = useUsers({
    page: currentPage,
    limit: 10
  });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters: UserFilters = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.status = Number(statusFilter);
      if (departmentFilter) filters.departamento = Number(departmentFilter);

      loadUsers(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, departmentFilter, currentPage, loadUsers]);

  const getDepartmentName = (code: number): string => {
    const departments: Record<number, string> = {
      1: 'Tecnologia da Informação',
      2: 'Atendimento ao Cliente',
      3: 'Comercial',
      4: 'Financeiro',
      5: 'Recursos Humanos',
      6: 'Marketing'
    };
    return departments[code] || 'Não definido';
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-1 ${
          status === 'active' ? 'bg-green-500' : 'bg-red-500'
        }`} />
        {status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const handleDelete = async (userEmail: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      setDeletingId(userEmail);
      try {
        await deleteExistingUser(userEmail);
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao excluir usuário. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`);
    alert(`Ação em lote: ${action}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDepartmentFilter('');
    setCurrentPage(1);
  };

  const columns = [
    {
      key: 'user',
      label: 'Usuário',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Departamento',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value || 'Não definido'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Código: {row.departamento || 'N/A'}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/registrations/users/${row.email}`)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/registrations/users/${row.email}/edit`)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.email, row.name)}
            disabled={deletingId === row.email}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
            title="Excluir"
          >
            {deletingId === row.email ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          <div className="relative group">
            <button className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Redefinir Senha
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Histórico de Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: '1', label: 'Ativo' },
    { value: '0', label: 'Inativo' }
  ];

  const departmentOptions = [
    { value: '', label: 'Todos os departamentos' },
    { value: '1', label: 'Tecnologia da Informação' },
    { value: '2', label: 'Atendimento ao Cliente' },
    { value: '3', label: 'Comercial' },
    { value: '4', label: 'Financeiro' },
    { value: '5', label: 'Recursos Humanos' },
    { value: '6', label: 'Marketing' }
  ];

  const stats = {
    total: total || 0,
    active: (users || []).filter(u => u.status === 'active').length,
    ti: (users || []).filter(u => u.departamento === 1).length,
    atendimento: (users || []).filter(u => u.departamento === 2).length
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuários do Sistema</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todos os usuários da tabela UNUSRSIST ({total} usuários)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={refreshUsers}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="outline"
            icon={Download}
            onClick={() => handleBulkAction('export')}
          >
            Exportar
          </Button>
          <Button
            icon={Plus}
            onClick={() => navigate('/registrations/users/new')}
          >
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-900 dark:text-red-300">
                Erro ao carregar usuários
              </h3>
              <p className="text-sm text-red-800 dark:text-red-400 mt-1">{error}</p>
              <div className="mt-3 flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshUsers}
                  disabled={loading}
                >
                  Tentar Novamente
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearError}
                >
                  Dispensar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ativos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">TI</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.ti}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Atendimento</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.atendimento}</p>
            </div>
            <User className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
              >
                Filtros
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="w-full"
              />

              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                options={departmentOptions}
                className="w-full"
              />
            </div>
          )}

          {/* Results Summary */}
          {(searchTerm || statusFilter || departmentFilter) && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Mostrando {users.length} de {total} usuários
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Limpar filtros
              </button>
            </div>
          )}

          <Table
            columns={columns}
            data={users || []}
            onRowClick={(user) => navigate(`/registrations/users/${user.email}`)}
            loading={loading}
            emptyMessage="Nenhum usuário encontrado"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, total)} de {total} usuários
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || loading}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Oracle Database Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Tabela Oracle UNUSRSIST
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Os dados dos usuários são armazenados na tabela UNUSRSIST do Oracle Database. 
              Campos: EMAILSIST (email), NOME (nome), SENHA (senha), STATUS (0/1), DEPARTAMENTO (código).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserList;