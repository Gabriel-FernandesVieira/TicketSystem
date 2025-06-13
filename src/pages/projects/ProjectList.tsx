import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { useProjects } from '../../context/ProjectContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.number.toString().includes(searchTerm) ||
                         (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, projectDescription: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${projectDescription}"?`)) {
      setDeletingId(id);
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erro ao excluir projeto. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const columns = [
    {
      key: 'number',
      label: 'Número',
      render: (value: number) => `#${value}`
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (value: string) => value || 'Não definido'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} variant="project" />
    },
    {
      key: 'progress',
      label: 'Progresso',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[60px]">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[35px]">{value}%</span>
        </div>
      )
    },
    {
      key: 'responsible',
      label: 'Responsável',
      render: (value: string) => value || 'Não atribuído'
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: Date) => format(value, 'dd/MM/yyyy', { locale: ptBR })
    },
    {
      key: 'totalHours',
      label: 'Horas',
      render: (value: number) => `${value}h`
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${row.id}`);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${row.id}/edit`);
            }}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id, row.description);
            }}
            disabled={deletingId === row.id}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
            title="Excluir"
          >
            {deletingId === row.id ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'planning', label: 'Planejamento' },
    { value: 'active', label: 'Ativo' },
    { value: 'on-hold', label: 'Pausado' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projetos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gerencie todos os projetos da empresa ({projects.length} projetos)
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/projects/new')}
        >
          Novo Projeto
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="min-w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando projetos...</span>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredProjects}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
            emptyMessage="Nenhum projeto encontrado"
          />
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ativos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activeProjects}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Concluídos</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completedProjects}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progresso Médio</p>
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {avgProgress}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {projects.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Nenhum projeto cadastrado
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Comece criando seu primeiro projeto para organizar o trabalho da equipe.
            </p>
            <Button
              icon={Plus}
              onClick={() => navigate('/projects/new')}
              className="mt-4"
            >
              Criar Primeiro Projeto
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProjectList;