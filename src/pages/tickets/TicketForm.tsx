import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Paperclip, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import { mockClients, mockClassifications } from '../../data/mockData';
import { useProjects } from '../../context/ProjectContext';

interface TicketFormData {
  cnpj: string;
  assunto: string;
  solicitacao: string;
  classificacao: string;
  status: string;
  tag: string;
  projeto: string;
  etapa: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { projects } = useProjects();

  const [formData, setFormData] = useState<TicketFormData>({
    cnpj: '',
    assunto: '',
    solicitacao: '',
    classificacao: '',
    status: 'open',
    tag: '',
    projeto: '',
    etapa: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState<Partial<TicketFormData>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!formData.cnpj) newErrors.cnpj = 'Cliente é obrigatório';
    if (!formData.assunto) newErrors.assunto = 'Assunto é obrigatório';
    if (!formData.solicitacao) newErrors.solicitacao = 'Descrição é obrigatória';
    if (!formData.classificacao) newErrors.classificacao = 'Classificação é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Ticket data:', formData);
      console.log('Attachments:', attachments);
      
      navigate('/tickets');
    } catch (error) {
      console.error('Error saving ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientOptions = mockClients.map(client => ({
    value: client.cnpj,
    label: `${client.nomeFantasia} (${client.cnpj})`
  }));

  const classificationOptions = mockClassifications.map(classification => ({
    value: classification.id,
    label: classification.description
  }));

  const statusOptions = [
    { value: 'open', label: 'Aberto' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'awaiting-customer', label: 'Aguardando Cliente' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Fechado' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: `#${project.number} - ${project.description.substring(0, 50)}...`
  }));

  const selectedClient = mockClients.find(client => client.cnpj === formData.cnpj);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/tickets')}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Ticket' : 'Novo Ticket'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Modifique as informações do ticket' : 'Preencha os dados para criar um novo ticket'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Cliente"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  options={[{ value: '', label: 'Selecione um cliente' }, ...clientOptions]}
                  required
                  error={errors.cnpj}
                />

                <Select
                  label="Classificação"
                  value={formData.classificacao}
                  onChange={(e) => handleInputChange('classificacao', e.target.value)}
                  options={[{ value: '', label: 'Selecione uma classificação' }, ...classificationOptions]}
                  required
                  error={errors.classificacao}
                />
              </div>

              <Input
                label="Assunto"
                value={formData.assunto}
                onChange={(e) => handleInputChange('assunto', e.target.value)}
                placeholder="Digite o assunto do ticket"
                required
                error={errors.assunto}
              />

              <TextArea
                label="Descrição da Solicitação"
                value={formData.solicitacao}
                onChange={(e) => handleInputChange('solicitacao', e.target.value)}
                placeholder="Descreva detalhadamente a solicitação ou problema"
                rows={6}
                required
                error={errors.solicitacao}
              />
            </Card>

            <Card title="Projeto e Etapa (Opcional)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Projeto"
                  value={formData.projeto}
                  onChange={(e) => handleInputChange('projeto', e.target.value)}
                  options={[{ value: '', label: 'Nenhum projeto' }, ...projectOptions]}
                />

                <Input
                  label="Etapa"
                  value={formData.etapa}
                  onChange={(e) => handleInputChange('etapa', e.target.value)}
                  placeholder="Número da etapa"
                  type="number"
                  disabled={!formData.projeto}
                />
              </div>

              {formData.projeto && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Este ticket será vinculado ao projeto selecionado e poderá ter suas horas contabilizadas.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Anexos">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Clique para adicionar arquivos ou arraste e solte
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF até 10MB cada
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Arquivos Anexados ({attachments.length})
                    </h4>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Configurações">
              <div className="space-y-4">
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statusOptions}
                />

                <Select
                  label="Prioridade"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  options={priorityOptions}
                />

                <Input
                  label="Tag (Opcional)"
                  value={formData.tag}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  placeholder="Ex: v2.1.0"
                />
              </div>
            </Card>

            {selectedClient && (
              <Card title="Informações do Cliente">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Razão Social
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.razaoSocial}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nome Fantasia
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.nomeFantasia}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      CNPJ
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.cnpj}</p>
                  </div>
                  {selectedClient.grupo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Grupo
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.grupo}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card title="Ações">
              <div className="space-y-3">
                <Button
                  type="submit"
                  icon={Save}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Salvando...' : (isEditing ? 'Atualizar Ticket' : 'Criar Ticket')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/tickets')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;