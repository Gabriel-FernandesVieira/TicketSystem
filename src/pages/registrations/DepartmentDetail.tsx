import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Hash, User, MapPin, DollarSign, Calendar, Users, FileText, Trash2, AlertTriangle, Eye } from 'lucide-react';
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
    
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${department.name}"?`)) {
      try {
        await deleteExistingDepartment(department.id);
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
    avgSalary: 8500,
    totalBudgetUsed: department.budget ? department.budget * 0.75 : 0
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
              {department.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Código: {department.code} • {department.description}
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
            onClick={() => navigate(`/registrations/departments/${department.id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Informações do Departamento">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {department.description}
              </p>
              
              {department.notes && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Observações Adicionais
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {department.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Usuários do Departamento">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Membros da Equipe ({departmentUsers.length})
                </h3>
                <Button size="sm" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
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
                        onClick={() => navigate(`/registrations/users/${user.id}`)}
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
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{departmentStats.totalUsers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <User className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{departmentStats.activeUsers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  R$ {(departmentStats.avgSalary / 1000).toFixed(1)}k
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Salário Médio</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((departmentStats.totalBudgetUsed / (department.budget || 1)) * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orçamento Usado</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Informações Gerais">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Código</label>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium">{department.code}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  department.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    department.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {department.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {department.manager && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Gestor Responsável</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{department.manager}</span>
                  </div>
                </div>
              )}

              {department.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Localização</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{department.location}</span>
                  </div>
                </div>
              )}

              {department.budget && department.budget > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento Anual</label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      R$ {department.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {departmentStats.totalBudgetUsed > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Usado</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          R$ {departmentStats.totalBudgetUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((departmentStats.totalBudgetUsed / department.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {department.costCenter && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Centro de Custo</label>
                  <span className="text-gray-900 dark:text-white font-mono">{department.costCenter}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {department.createdAt ? format(new Date(department.createdAt), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
              
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
              
              <Button variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Controle Orçamentário
              </Button>

              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Organograma
              </Button>
            </div>
          </Card>

          <Card title="Resumo Financeiro">
            <div className="space-y-4">
              {department.budget && department.budget > 0 ? (
                <>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento Total</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      R$ {(department.budget / 1000).toFixed(0)}k
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Usado</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        R$ {(departmentStats.totalBudgetUsed / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Disponível</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        R$ {((department.budget - departmentStats.totalBudgetUsed) / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Orçamento não definido
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;