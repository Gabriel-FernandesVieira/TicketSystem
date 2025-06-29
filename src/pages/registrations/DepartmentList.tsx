import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Building2, Hash, RefreshCw, AlertCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import { useDepartments } from '../../hooks/useDepartments';

const DepartmentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    departments,
    loading,
    error,
    loadDepartments,
    deleteExistingDepartment,
    clearError,
    refreshDepartments
  } = useDepartments();

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.departamento.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  const handleDelete = async (departamento: string, departmentName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${departmentName}"?`)) {
      setDeletingId(departamento);
      try {
        await deleteExistingDepartment(departamento);
        alert('Departamento excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Erro ao excluir departamento. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`);
    alert(`Ação em lote: ${action}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
  };

  const columns = [
    {
      key: 'departamento',
      label: 'Código',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {value.length}/40 caracteres
          </p>
        </div>
      )
    },
    {
      key: 'userCount',
      label: 'Usuários',
      render: (value: number) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {value || 0} usuários
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/registrations/departments/${row.departamento}`)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/registrations/departments/${row.departamento}/edit`)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.departamento.toString(), row.descricao)}
            disabled={deletingId === row.departamento.toString()}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
            title="Excluir"
          >
            {deletingId === row.departamento.toString() ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: departments.length,
    active: departments.filter(d => d.status === 'active').length,
    inactive: departments.filter(d => d.status === 'inactive').length,
    totalUsers: departments.reduce((acc, d) => acc + (d.userCount || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Departamentos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todos os departamentos da tabela HNDEPARTAMENTO ({departments.length} departamentos)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={refreshDepartments}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('export')}
          >
            Exportar
          </Button>
          <Button
            icon={Plus}
            onClick={() => navigate('/registrations/departments/new')}
          >
            Novo Departamento
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
                Erro ao carregar departamentos
              </h3>
              <p className="text-sm text-red-800 dark:text-red-400 mt-1">{error}</p>
              <div className="mt-3 flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshDepartments}
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
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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

        <Card className="border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inativos</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuários</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsers}</p>
            </div>
            <Hash className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar departamentos por código ou descrição..."
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

          {/* Results Summary */}
          {searchTerm && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Mostrando {filteredDepartments.length} de {departments.length} departamentos
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
            data={filteredDepartments}
            onRowClick={(department) => navigate(`/registrations/departments/${department.departamento}`)}
            loading={loading}
            emptyMessage="Nenhum departamento encontrado"
          />
        </div>
      </Card>

      {departments.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Nenhum departamento cadastrado
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Comece criando seu primeiro departamento para organizar a estrutura da empresa.
            </p>
            <Button
              icon={Plus}
              onClick={() => navigate('/registrations/departments/new')}
              className="mt-4"
            >
              Criar Primeiro Departamento
            </Button>
          </div>
        </Card>
      )}

      {/* Oracle Database Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Tabela Oracle HNDEPARTAMENTO
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Os dados dos departamentos são armazenados na tabela HNDEPARTAMENTO do Oracle Database. 
              Campos: DEPARTAMENTO (código numérico), DESCRICAO (descrição até 40 caracteres).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DepartmentList;