import { Ticket, Project, ExpenseReimbursement, Client, Department, Classification, DashboardStats } from '../types';

export const mockClients: Client[] = [
  {
    cnpj: '12345678000190',
    razaoSocial: 'Empresa ABC Ltda',
    nomeFantasia: 'ABC Company',
    dataCadastro: new Date('2024-01-15'),
    grupo: 'Grupo A',
    status: 'active'
  },
  {
    cnpj: '98765432000199',
    razaoSocial: 'XYZ Corporação SA',
    nomeFantasia: 'XYZ Corp',
    dataCadastro: new Date('2024-02-10'),
    grupo: 'Grupo B',
    status: 'active'
  }
];

export const mockDepartments: Department[] = [
  { id: '1', code: 1, name: 'Suporte Técnico', description: 'Atendimento técnico especializado' },
  { id: '2', code: 2, name: 'Desenvolvimento', description: 'Equipe de desenvolvimento de software' },
  { id: '3', code: 3, name: 'Comercial', description: 'Equipe comercial e vendas' },
  { id: '4', code: 4, name: 'Financeiro', description: 'Departamento financeiro' }
];

export const mockClassifications: Classification[] = [
  { id: '1', code: 1, description: 'Suporte Técnico', billable: true },
  { id: '2', code: 2, description: 'Desenvolvimento', billable: true },
  { id: '3', code: 3, description: 'Consultoria', billable: true },
  { id: '4', code: 4, description: 'Treinamento', billable: false }
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    number: 1001,
    cnpj: '12345678000190',
    clientName: 'ABC Company',
    subject: 'Sistema lento após atualização',
    description: 'Após a última atualização do sistema, está muito lento para carregar os relatórios.',
    status: 'open',
    priority: 'medium',
    classification: 'Suporte Técnico',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    totalHours: 0,
    history: [
      {
        id: '1',
        ticketId: '1',
        date: new Date('2024-01-15T10:30:00'),
        message: 'Ticket criado pelo cliente',
        author: 'João Silva',
        authorType: 'client',
        isExternal: false
      }
    ]
  },
  {
    id: '2',
    number: 1002,
    cnpj: '98765432000199',
    clientName: 'XYZ Corp',
    subject: 'Erro na integração com API',
    description: 'A integração com a API externa está retornando erro 500 intermitentemente.',
    status: 'in-progress',
    priority: 'high',
    classification: 'Desenvolvimento',
    createdAt: new Date('2024-01-16T09:15:00'),
    updatedAt: new Date('2024-01-16T16:45:00'),
    assignedTo: 'Maria Santos',
    totalHours: 4.5,
    history: [
      {
        id: '2',
        ticketId: '2',
        date: new Date('2024-01-16T09:15:00'),
        message: 'Ticket criado - erro na integração',
        author: 'Pedro Costa',
        authorType: 'client',
        isExternal: false
      },
      {
        id: '3',
        ticketId: '2',
        date: new Date('2024-01-16T16:45:00'),
        message: 'Iniciado diagnóstico do problema. Identificado possível timeout na conexão.',
        author: 'Maria Santos',
        authorType: 'internal',
        department: 'Desenvolvimento',
        isExternal: false
      }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    number: 2001,
    description: 'Implementação do novo módulo de relatórios para ABC Company',
    createdAt: new Date('2024-01-10'),
    client: 'ABC Company',
    responsible: 'Carlos Oliveira',
    totalHours: 120,
    status: 'active',
    progress: 65,
    stages: [
      {
        id: '1',
        projectId: '1',
        stageId: 1,
        description: 'Levantamento de requisitos',
        estimatedHours: 20,
        actualHours: 18,
        status: 'completed'
      },
      {
        id: '2',
        projectId: '1',
        stageId: 2,
        description: 'Desenvolvimento das telas',
        estimatedHours: 60,
        actualHours: 45,
        status: 'in-progress'
      }
    ]
  },
  {
    id: '2',
    number: 2002,
    description: 'Migração do sistema legado para nova plataforma - XYZ Corp',
    createdAt: new Date('2024-01-05'),
    client: 'XYZ Corp',
    responsible: 'Ana Lima',
    totalHours: 200,
    status: 'planning',
    progress: 25,
    stages: [
      {
        id: '3',
        projectId: '2',
        stageId: 1,
        description: 'Análise do sistema atual',
        estimatedHours: 40,
        actualHours: 35,
        status: 'completed'
      }
    ]
  }
];

export const mockExpenseReimbursements: ExpenseReimbursement[] = [
  {
    id: '1',
    code: 3001,
    ticketId: '1',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-22'),
    vehicle: 'ABC1234',
    objective: 'Atendimento presencial cliente ABC Company - Configuração de servidor',
    totalValue: 1250.00,
    status: 'under-review',
    invoiced: false,
    expenses: [
      {
        id: '1',
        reimbursementId: '1',
        expenseType: 'Combustível',
        date: new Date('2024-01-20'),
        description: 'Abastecimento ida',
        quantity: 1,
        unitValue: 280.00,
        totalValue: 280.00
      },
      {
        id: '2',
        reimbursementId: '1',
        expenseType: 'Hospedagem',
        date: new Date('2024-01-21'),
        description: 'Hotel - 2 diárias',
        quantity: 2,
        unitValue: 320.00,
        totalValue: 640.00
      }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  tickets: {
    total: 156,
    open: 23,
    inProgress: 31,
    resolved: 102,
    avgResolutionTime: 4.2
  },
  projects: {
    total: 12,
    active: 7,
    completed: 5,
    avgProgress: 68
  },
  expenses: {
    totalPending: 15420.50,
    totalApproved: 89750.00,
    avgProcessingTime: 3.5
  },
  revenue: {
    monthly: 125000.00,
    quarterly: 358000.00,
    growth: 12.5
  }
};