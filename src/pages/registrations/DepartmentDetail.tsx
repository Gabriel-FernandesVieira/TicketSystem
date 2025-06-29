import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Hash, User, Calendar, Trash2, AlertTriangle, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useDepartment, useDepartments } from '../../hooks/useDepartments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DepartmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { department, loading, error } = useDepartment(id);
  const { deleteExistingDepartment } = useDepartments();

  const handleDelete = async () => {
    if (!department) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${department.descricao}"?`)) {
      try {
        await deleteExistingDepartment(department.departamento.toString());
        navigate('/registrations/departments');
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Erro ao excluir departamento. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando departamento...</p>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          Departamento não encontrado
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          O departamento que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/registrations/departments')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  // Mock data for demonstration
  const departmentUsers = [
    { id: '1', name: 'Carlos Oliveira', position: 'Gerente de TI', email: 'carlos@empresa.com', status: 'active' },
    { id: '2', name: 'Ana Lima', position: 'Desenvolvedora Senior', email: 'ana@empresa.com', status: 'active' },
    { id: '3', name: 'Pedro Santos', position: 'Analista de Sistemas', email: 'pedro@empresa.com', status: 'active' },
    { id: '4', name: 'Maria Silva', position: 'UX Designer', email: 'maria@empresa.com', status: 'inactive' }
  ];

  const departmentStats = {
    totalUsers: departmentUsers.length,
    activeUsers: departmentUsers.filter(u => u.status === 'active').length,
    inactiveUsers: departmentUsers.filter(u => u.status === 'inactive').length,
    descriptionLength: department.descricao.length
  };

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
              {department.descricao}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Código: {department.departamento}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleDelete}
          >
            Excluir
          </Button>
          <Button
            icon={Edit}
            onClick={() => navigate(`/registrations/departments/${department.departamento}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Informações do Departamento">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Descrição Completa
                </h4>
                <p className="text-blue-800 dark:text-blue-400 text-lg">
                  {department.descricao}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                  {department.descricao.length}/40 caracteres utilizados
                </p>
              </div>
            </div>
          </Card>

          <Card title="Usuários do Departamento">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Membros da Equipe ({departmentUsers.length})
                </h3>
                <Button size="sm" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Gerenciar Usuários
                </Button>
              </div>

              <div className="space-y-3">
                {departmentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.position}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                      <button
                        onClick={() => navigate(`/registrations/users/${user.email}`)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Visualizar usuário"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Estatísticas do Departamento">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{departmentStats.totalUsers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <User className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{departmentStats.activeUsers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <User className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{departmentStats.inactiveUsers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Inativos</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Hash className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{departmentStats.descriptionLength}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Caracteres</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Informações da Tabela">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Código (DEPARTAMENTO)</label>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium text-lg">{department.departamento}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Descrição (DESCRICAO)</label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white break-words">{department.descricao}</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Caracteres utilizados</span>
                  <span className={`font-medium ${
                    department.descricao.length > 35 ? 'text-red-600 dark:text-red-400' :
                    department.descricao.length > 25 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {department.descricao.length}/40
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      department.descricao.length > 35 ? 'bg-red-500' :
                      department.descricao.length > 25 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(department.descricao.length / 40) * 100}%` }}
                  />
                </div>
              </div>

              {department.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(department.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
              
              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Organograma
              </Button>
              
              <Button variant="outline" className="w-full">
                <Hash className="w-4 h-4 mr-2" />
                Relatório de Usuários
              </Button>
            </div>
          </Card>

          <Card title="Informações do Oracle">
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Hash className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Tabela HNDEPARTAMENTO</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Oracle Database
                </p>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>DEPARTAMENTO:</strong> Chave primária numérica</p>
                <p><strong>DESCRICAO:</strong> VARCHAR2(40) NOT NULL</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;