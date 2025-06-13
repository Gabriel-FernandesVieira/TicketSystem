import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, User, Building2, Calendar, Target, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { useProjects } from '../../context/ProjectContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, deleteProject } = useProjects();
  
  const project = getProject(id!);

  const handleDelete = async () => {
    if (!project) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.description}"?`)) {
      try {
        await deleteProject(project.id);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erro ao excluir projeto. Tente novamente.');
      }
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          Projeto não encontrado
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          O projeto que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  const completedStages = project.stages.filter(stage => stage.status === 'completed').length;
  const totalStages = project.stages.length;
  const stageProgress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/projects')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Projeto #{project.number}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {project.description}
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
            onClick={() => navigate(`/projects/${project.id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Descrição do Projeto">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </Card>

          {project.stages.length > 0 && (
            <Card title="Etapas do Projeto">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Progresso das Etapas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {completedStages} de {totalStages} etapas concluídas ({stageProgress}%)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stageProgress}%
                    </span>
                  </div>
                </div>

                {project.stages.map((stage, index) => (
                  <div key={stage.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Etapa {stage.stageId}: {stage.description}
                      </h4>
                      <StatusBadge status={stage.status} variant="project" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Horas Estimadas:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{stage.estimatedHours}h</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Horas Realizadas:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{stage.actualHours}h</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Progresso:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stage.estimatedHours > 0 
                            ? Math.round((stage.actualHours / stage.estimatedHours) * 100)
                            : 0
                          }%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Estatísticas do Projeto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project.totalHours}h</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Horas</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{project.progress}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progresso</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalStages}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Etapas</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.ceil((new Date().getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dias Ativo</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Informações do Projeto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <StatusBadge status={project.status} variant="project" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{project.client || 'Não definido'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Responsável</label>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {project.responsible || 'Não atribuído'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Data de Criação</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {format(project.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Progresso Geral</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Concluído</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Registrar Tempo
              </Button>
              
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Atribuir Responsável
              </Button>
              
              <Button variant="outline" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Adicionar Etapa
              </Button>

              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Atualizar Progresso
              </Button>
            </div>
          </Card>

          {project.stages.length > 0 && (
            <Card title="Resumo das Etapas">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.stages.filter(s => s.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Em Progresso</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">
                    {project.stages.filter(s => s.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Concluídas</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {completedStages}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;