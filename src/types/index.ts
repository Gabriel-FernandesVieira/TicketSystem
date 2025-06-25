export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user' | 'support';
  department?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  cnpj?: string;
  codusuario?: number;
}

export interface Client {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataCadastro: Date;
  grupo?: string;
  status: 'active' | 'inactive';
}

export interface Ticket {
  id: string;
  number: number;
  cnpj: string;
  clientName: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'awaiting-customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  classification: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  assignedTo?: string;
  totalHours: number;
  tag?: string;
  project?: number;
  stage?: number;
  history: TicketHistory[];
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  date: Date;
  message: string;
  author: string;
  authorType: 'internal' | 'client';
  department?: string;
  isExternal: boolean;
}

export interface Project {
  id: string;
  number: number;
  description: string;
  createdAt: Date;
  client?: string;
  responsible?: string;
  totalHours: number;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  stages: ProjectStage[];
}

export interface ProjectStage {
  id: string;
  projectId: string;
  stageId: number;
  description: string;
  estimatedHours: number;
  actualHours: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ExpenseReimbursement {
  id: string;
  code: number;
  ticketId?: string;
  startDate: Date;
  endDate: Date;
  vehicle?: string;
  objective: string;
  totalValue: number;
  status: 'requested' | 'under-review' | 'approved' | 'rejected' | 'paid';
  invoiced: boolean;
  expenses: ExpenseDetail[];
}

export interface ExpenseDetail {
  id: string;
  reimbursementId: string;
  expenseType: string;
  date: Date;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface Department {
  id: string;
  code: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  manager?: string;
  location?: string;
  budget?: number;
  costCenter?: string;
  notes?: string;
  userCount?: number;
  createdAt?: Date;
}

export interface Classification {
  id: string;
  code: number;
  description: string;
  billable: boolean;
}

export interface Status {
  id: string;
  name: string;
  closesTicket: boolean;
  color: string;
}

export interface DashboardStats {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    avgResolutionTime: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    avgProgress: number;
  };
  expenses: {
    totalPending: number;
    totalApproved: number;
    avgProcessingTime: number;
  };
  revenue: {
    monthly: number;
    quarterly: number;
    growth: number;
  };
}