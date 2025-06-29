import { apiRequest, ApiError } from './api';
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

// Fetch all users with optional filters
export async function fetchUsers(filters: UserFilters = {}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `Autenticacao/GetAllUsers${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await apiRequest<any>(endpoint);
    
    // Transform Oracle response to match our User interface
    const transformedUsers = (response.data || response || []).map((oracleUser: any) => ({
      id: oracleUser.emailsist || oracleUser.EMAILSIST,
      email: oracleUser.emailsist || oracleUser.EMAILSIST,
      name: oracleUser.nome || oracleUser.NOME,
      status: (oracleUser.status || oracleUser.STATUS) === 1 ? 'active' : 'inactive',
      department: getDepartmentName(oracleUser.departamento || oracleUser.DEPARTAMENTO),
      role: getUserRole(oracleUser.departamento || oracleUser.DEPARTAMENTO),
      // Keep original Oracle fields
      emailsist: oracleUser.emailsist || oracleUser.EMAILSIST,
      nome: oracleUser.nome || oracleUser.NOME,
      departamento: oracleUser.departamento || oracleUser.DEPARTAMENTO
    }));

    return {
      users: transformedUsers,
      total: transformedUsers.length,
      page: filters.page || 1,
      limit: filters.limit || 10
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

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

// Fetch a single user by email
export async function fetchUserByEmail(email: string): Promise<User> {
  try {
    const response = await apiRequest<any>(`Autenticacao/GetUser?email=${encodeURIComponent(email)}`);
    
    // Transform Oracle response
    const oracleUser = response.data || response;
    return {
      id: oracleUser.emailsist || oracleUser.EMAILSIST,
      email: oracleUser.emailsist || oracleUser.EMAILSIST,
      name: oracleUser.nome || oracleUser.NOME,
      status: (oracleUser.status || oracleUser.STATUS) === 1 ? 'active' : 'inactive',
      department: getDepartmentName(oracleUser.departamento || oracleUser.DEPARTAMENTO),
      role: getUserRole(oracleUser.departamento || oracleUser.DEPARTAMENTO),
      emailsist: oracleUser.emailsist || oracleUser.EMAILSIST,
      nome: oracleUser.nome || oracleUser.NOME,
      departamento: oracleUser.departamento || oracleUser.DEPARTAMENTO
    };
  } catch (error) {
    console.error(`Error fetching user ${email}:`, error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: CreateUserRequest): Promise<User> {
  try {
    const response = await apiRequest<any>('Autenticacao/PostUser', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Transform response to User interface
    const createdUser = response.data || response;
    return {
      id: createdUser.emailsist || userData.emailsist,
      email: createdUser.emailsist || userData.emailsist,
      name: createdUser.nome || userData.nome,
      status: (createdUser.status || userData.status) === 1 ? 'active' : 'inactive',
      department: getDepartmentName(createdUser.departamento || userData.departamento || 0),
      role: getUserRole(createdUser.departamento || userData.departamento || 0),
      emailsist: createdUser.emailsist || userData.emailsist,
      nome: createdUser.nome || userData.nome,
      departamento: createdUser.departamento || userData.departamento
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update an existing user
export async function updateUser(email: string, userData: Partial<UpdateUserRequest>): Promise<User> {
  try {
    const response = await apiRequest<any>(`Autenticacao/PutUser?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    // Transform response
    const updatedUser = response.data || response;
    return {
      id: updatedUser.emailsist || email,
      email: updatedUser.emailsist || email,
      name: updatedUser.nome || userData.nome || '',
      status: (updatedUser.status || userData.status) === 1 ? 'active' : 'inactive',
      department: getDepartmentName(updatedUser.departamento || userData.departamento || 0),
      role: getUserRole(updatedUser.departamento || userData.departamento || 0),
      emailsist: updatedUser.emailsist || email,
      nome: updatedUser.nome || userData.nome,
      departamento: updatedUser.departamento || userData.departamento
    };
  } catch (error) {
    console.error(`Error updating user ${email}:`, error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(email: string): Promise<void> {
  try {
    await apiRequest<void>(`Autenticacao/DeleteUser?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting user ${email}:`, error);
    throw error;
  }
}

// Reset user password
export async function resetUserPassword(email: string, newPassword: string): Promise<void> {
  try {
    await apiRequest<void>(`Autenticacao/ResetPassword`, {
      method: 'POST',
      body: JSON.stringify({ 
        emailsist: email, 
        senha: newPassword 
      }),
    });
  } catch (error) {
    console.error(`Error resetting password for user ${email}:`, error);
    throw error;
  }
}

// Upload user avatar (if supported by your backend)
export async function uploadUserAvatar(email: string, file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('email', email);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/users/avatar`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || 'Failed to upload avatar',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error uploading avatar for user ${email}:`, error);
    throw error;
  }
}

// Bulk operations
export async function bulkUpdateUsers(emails: string[], updates: Partial<CreateUserRequest>): Promise<User[]> {
  try {
    const response = await apiRequest<any[]>('Autenticacao/BulkUpdateUsers', {
      method: 'POST',
      body: JSON.stringify({ emails, updates }),
    });

    return response.map(user => ({
      id: user.emailsist,
      email: user.emailsist,
      name: user.nome,
      status: user.status === 1 ? 'active' : 'inactive',
      department: getDepartmentName(user.departamento),
      role: getUserRole(user.departamento),
      emailsist: user.emailsist,
      nome: user.nome,
      departamento: user.departamento
    }));
  } catch (error) {
    console.error('Error bulk updating users:', error);
    throw error;
  }
}

export async function bulkDeleteUsers(emails: string[]): Promise<void> {
  try {
    await apiRequest<void>('Autenticacao/BulkDeleteUsers', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
}