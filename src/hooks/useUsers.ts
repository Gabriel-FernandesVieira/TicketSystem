import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  fetchUserById,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  UsersResponse 
} from '../services/userApi';
import { ApiError } from '../services/api';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

interface UseUsersActions {
  loadUsers: (filters?: UserFilters) => Promise<void>;
  createNewUser: (userData: CreateUserRequest) => Promise<User>;
  updateExistingUser: (id: string, userData: Partial<UpdateUserRequest>) => Promise<User>;
  deleteExistingUser: (id: string) => Promise<void>;
  clearError: () => void;
  refreshUsers: () => Promise<void>;
}

export function useUsers(initialFilters: UserFilters = {}): UseUsersState & UseUsersActions {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  });

  const [currentFilters, setCurrentFilters] = useState<UserFilters>(initialFilters);

  const loadUsers = useCallback(async (filters: UserFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const mergedFilters = { ...currentFilters, ...filters };
      setCurrentFilters(mergedFilters);
      
      const response: UsersResponse = await fetchUsers(mergedFilters);
      
      setState(prev => ({
        ...prev,
        users: response.users,
        total: response.total,
        page: response.page,
        limit: response.limit,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to load users';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [currentFilters]);

  const createNewUser = useCallback(async (userData: CreateUserRequest): Promise<User> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newUser = await createUser(userData);
      
      // Refresh the users list to include the new user
      await loadUsers();
      
      setState(prev => ({ ...prev, loading: false }));
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to create user';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [loadUsers]);

  const updateExistingUser = useCallback(async (id: string, userData: Partial<UpdateUserRequest>): Promise<User> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedUser = await updateUser(id, userData);
      
      // Update the user in the local state
      setState(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        loading: false,
      }));
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to update user';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const deleteExistingUser = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await deleteUser(id);
      
      // Remove the user from the local state
      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to delete user';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshUsers = useCallback(async () => {
    await loadUsers(currentFilters);
  }, [loadUsers, currentFilters]);

  // Load users on mount
  useEffect(() => {
    loadUsers(initialFilters);
  }, []); // Only run on mount

  return {
    ...state,
    loadUsers,
    createNewUser,
    updateExistingUser,
    deleteExistingUser,
    clearError,
    refreshUsers,
  };
}

// Hook for fetching a single user
export function useUser(id: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = await fetchUserById(id);
      setUser(userData);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to load user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    error,
    refetch: loadUser,
  };
}