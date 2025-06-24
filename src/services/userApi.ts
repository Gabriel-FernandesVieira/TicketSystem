import { apiRequest, ApiError } from './api';
import { User } from '../types';
import { UNSAFE_DataRouterStateContext } from 'react-router-dom';

export interface  CreateUserRequest {
  emailsist: string;
  nome: string;
  senha?: string;
  status: 0;
  departamento: 1;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
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
    const  teste =  await apiRequest<UsersResponse>(endpoint);
    console.log(teste);
    return teste;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Fetch a single user by ID
export async function fetchUserById(email: string): Promise<User> {
  try {
    return await apiRequest<User>(`/Autenticacao/GetAllUsers`);
  } catch (error) {
    console.error(`Error fetching user ${email}:`, error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: CreateUserRequest): Promise<User> {
  try {

    console.log(userData);
    return await apiRequest<User>('Autenticacao/PostUser', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Erro ao criar o usuario: ', error);
    throw error;
  }
}

// Update an existing user
export async function updateUser(id: string, userData: Partial<UpdateUserRequest>): Promise<User> {
  try {
    return await apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<void> {
  try {
    await apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
}

// Reset user password
export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  try {
    await apiRequest<void>(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
  } catch (error) {
    console.error(`Error resetting password for user ${id}:`, error);
    throw error;
  }
}

// Upload user avatar
export async function uploadUserAvatar(id: string, file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/users/${id}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
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
    console.error(`Error uploading avatar for user ${id}:`, error);
    throw error;
  }
}

// Bulk operations
export async function bulkUpdateUsers(userIds: string[], updates: Partial<User>): Promise<User[]> {
  try {
    return await apiRequest<User[]>('/users/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ userIds, updates }),
    });
  } catch (error) {
    console.error('Error bulk updating users:', error);
    throw error;
  }
}

export async function bulkDeleteUsers(userIds: string[]): Promise<void> {
  try {
    await apiRequest<void>('/users/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
}