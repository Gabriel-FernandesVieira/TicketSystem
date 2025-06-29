import { User } from '../types';

export interface CreateUserRequest {
  emailsist: string;
  nome: string;
  senha: string;
  status: number; // 0 = inactive, 1 = active
  departamento?: number;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  emailsist: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  search?: string;
  status?: number;
  departamento?: number;
  page?: number;
  limit?: number;
}

// Mock data store
let mockUsers: User[] = [
  {
    id: 'admin@empresa.com',
    email: 'admin@empresa.com',
    name: 'Administrador Sistema',
    status: 'active',
    department: 'Tecnologia da Informação',
    role: 'admin',
    emailsist: 'admin@empresa.com',
    nome: 'Administrador Sistema',
    departamento: 1
  },
  {
    id: 'joao.silva@empresa.com',
    email: 'joao.silva@empresa.com',
    name: 'João Silva',
    status: 'active',
    department: 'Comercial',
    role: 'user',
    emailsist: 'joao.silva@empresa.com',
    nome: 'João Silva',
    departamento: 3
  },
  {
    id: 'maria.santos@empresa.com',
    email: 'maria.santos@empresa.com',
    name: 'Maria Santos',
    status: 'active',
    department: 'Financeiro',
    role: 'manager',
    emailsist: 'maria.santos@empresa.com',
    nome: 'Maria Santos',
    departamento: 4
  },
  {
    id: 'pedro.costa@empresa.com',
    email: 'pedro.costa@empresa.com',
    name: 'Pedro Costa',
    status: 'inactive',
    department: 'Atendimento ao Cliente',
    role: 'support',
    emailsist: 'pedro.costa@empresa.com',
    nome: 'Pedro Costa',
    departamento: 2
  },
  {
    id: 'ana.oliveira@empresa.com',
    email: 'ana.oliveira@empresa.com',
    name: 'Ana Oliveira',
    status: 'active',
    department: 'Recursos Humanos',
    role: 'manager',
    emailsist: 'ana.oliveira@empresa.com',
    nome: 'Ana Oliveira',
    departamento: 5
  },
  {
    id: 'carlos.ferreira@empresa.com',
    email: 'carlos.ferreira@empresa.com',
    name: 'Carlos Ferreira',
    status: 'active',
    department: 'Marketing',
    role: 'user',
    emailsist: 'carlos.ferreira@empresa.com',
    nome: 'Carlos Ferreira',
    departamento: 6
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to map department number to name
function getDepartmentName(departmentCode: number): string {
  const departments: Record<number, string> = {
    1: 'Tecnologia da Informação',
    2: 'Atendimento ao Cliente',
    3: 'Comercial',
    4: 'Financeiro',
    5: 'Recursos Humanos',
    6: 'Marketing'
  };
  return departments[departmentCode] || 'Não definido';
}

// Helper function to determine user role based on department
function getUserRole(departmentCode: number): 'admin' | 'manager' | 'user' | 'support' {
  const roleMapping: Record<number, 'admin' | 'manager' | 'user' | 'support'> = {
    1: 'admin', // TI
    2: 'support', // Atendimento
    3: 'user', // Comercial
    4: 'manager', // Financeiro
    5: 'manager', // RH
    6: 'user' // Marketing
  };
  return roleMapping[departmentCode] || 'user';
}

// Fetch all users with optional filters
export async function fetchUsers(filters: UserFilters = {}): Promise<UsersResponse> {
  await delay(300); // Simulate network delay

  let filteredUsers = [...mockUsers];

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status !== undefined) {
    const statusFilter = filters.status === 1 ? 'active' : 'inactive';
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  if (filters.departamento !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.departamento === filters.departamento);
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    total: filteredUsers.length,
    page,
    limit
  };
}

// Fetch a single user by email
export async function fetchUserByEmail(email: string): Promise<User> {
  await delay(200);

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  return user;
}

// Create a new user
export async function createUser(userData: CreateUserRequest): Promise<User> {
  await delay(400);

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === userData.emailsist);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: userData.emailsist,
    email: userData.emailsist,
    name: userData.nome,
    status: userData.status === 1 ? 'active' : 'inactive',
    department: getDepartmentName(userData.departamento || 0),
    role: getUserRole(userData.departamento || 0),
    emailsist: userData.emailsist,
    nome: userData.nome,
    departamento: userData.departamento
  };

  mockUsers.push(newUser);
  return newUser;
}

// Update an existing user
export async function updateUser(email: string, userData: Partial<UpdateUserRequest>): Promise<User> {
  await delay(350);

  const userIndex = mockUsers.findIndex(u => u.email === email);
  if (userIndex === -1) {
    throw new Error(`User with email ${email} not found`);
  }

  const existingUser = mockUsers[userIndex];
  const updatedUser: User = {
    ...existingUser,
    name: userData.nome || existingUser.name,
    status: userData.status !== undefined ? (userData.status === 1 ? 'active' : 'inactive') : existingUser.status,
    department: userData.departamento !== undefined ? getDepartmentName(userData.departamento) : existingUser.department,
    role: userData.departamento !== undefined ? getUserRole(userData.departamento) : existingUser.role,
    nome: userData.nome || existingUser.nome,
    departamento: userData.departamento !== undefined ? userData.departamento : existingUser.departamento
  };

  mockUsers[userIndex] = updatedUser;
  return updatedUser;
}

// Delete a user
export async function deleteUser(email: string): Promise<void> {
  await delay(300);

  const userIndex = mockUsers.findIndex(u => u.email === email);
  if (userIndex === -1) {
    throw new Error(`User with email ${email} not found`);
  }

  mockUsers.splice(userIndex, 1);
}

// Reset user password
export async function resetUserPassword(email: string, newPassword: string): Promise<void> {
  await delay(250);

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  // In a real implementation, this would update the password in the database
  console.log(`Password reset for user ${email}`);
}

// Upload user avatar (mock implementation)
export async function uploadUserAvatar(email: string, file: File): Promise<{ avatarUrl: string }> {
  await delay(800);

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  // Mock avatar URL
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
  
  return { avatarUrl };
}

// Bulk operations
export async function bulkUpdateUsers(emails: string[], updates: Partial<CreateUserRequest>): Promise<User[]> {
  await delay(600);

  const updatedUsers: User[] = [];

  for (const email of emails) {
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      const existingUser = mockUsers[userIndex];
      const updatedUser: User = {
        ...existingUser,
        name: updates.nome || existingUser.name,
        status: updates.status !== undefined ? (updates.status === 1 ? 'active' : 'inactive') : existingUser.status,
        department: updates.departamento !== undefined ? getDepartmentName(updates.departamento) : existingUser.department,
        role: updates.departamento !== undefined ? getUserRole(updates.departamento) : existingUser.role,
        nome: updates.nome || existingUser.nome,
        departamento: updates.departamento !== undefined ? updates.departamento : existingUser.departamento
      };

      mockUsers[userIndex] = updatedUser;
      updatedUsers.push(updatedUser);
    }
  }

  return updatedUsers;
}

export async function bulkDeleteUsers(emails: string[]): Promise<void> {
  await delay(500);

  mockUsers = mockUsers.filter(user => !emails.includes(user.email));
}