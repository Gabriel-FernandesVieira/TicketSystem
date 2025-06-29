import { useState, useEffect, useCallback } from 'react';
import { Department } from '../types';
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment, 
  fetchDepartmentById,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilters,
  DepartmentsResponse 
} from '../services/departmentApi';

interface UseDepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

interface UseDepartmentsActions {
  loadDepartments: (filters?: DepartmentFilters) => Promise<void>;
  createNewDepartment: (departmentData: CreateDepartmentRequest) => Promise<Department>;
  updateExistingDepartment: (departamento: string, departmentData: Partial<UpdateDepartmentRequest>) => Promise<Department>;
  deleteExistingDepartment: (departamento: string) => Promise<void>;
  clearError: () => void;
  refreshDepartments: () => Promise<void>;
}

export function useDepartments(initialFilters: DepartmentFilters = {}): UseDepartmentsState & UseDepartmentsActions {
  const [state, setState] = useState<UseDepartmentsState>({
    departments: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  });

  const [currentFilters, setCurrentFilters] = useState<DepartmentFilters>(initialFilters);

  const loadDepartments = useCallback(async (filters: DepartmentFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const mergedFilters = { ...currentFilters, ...filters };
      setCurrentFilters(mergedFilters);
      
      const response: DepartmentsResponse = await fetchDepartments(mergedFilters);
      
      setState(prev => ({
        ...prev,
        departments: response.departments,
        total: response.total,
        page: response.page,
        limit: response.limit,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load departments';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [currentFilters]);

  const createNewDepartment = useCallback(async (departmentData: CreateDepartmentRequest): Promise<Department> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newDepartment = await createDepartment(departmentData);
      
      // Refresh the departments list to include the new department
      await loadDepartments();
      
      setState(prev => ({ ...prev, loading: false }));
      return newDepartment;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create department';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [loadDepartments]);

  const updateExistingDepartment = useCallback(async (departamento: string, departmentData: Partial<UpdateDepartmentRequest>): Promise<Department> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedDepartment = await updateDepartment(departamento, departmentData);
      
      // Update the department in the local state
      setState(prev => ({
        ...prev,
        departments: prev.departments.map(department => 
          department.departamento.toString() === departamento || department.id === departamento 
            ? updatedDepartment 
            : department
        ),
        loading: false,
      }));
      
      return updatedDepartment;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update department';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const deleteExistingDepartment = useCallback(async (departamento: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await deleteDepartment(departamento);
      
      // Remove the department from the local state
      setState(prev => ({
        ...prev,
        departments: prev.departments.filter(department => 
          department.departamento.toString() !== departamento && department.id !== departamento
        ),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete department';
      
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

  const refreshDepartments = useCallback(async () => {
    await loadDepartments(currentFilters);
  }, [loadDepartments, currentFilters]);

  // Load departments on mount
  useEffect(() => {
    loadDepartments(initialFilters);
  }, []); // Only run on mount

  return {
    ...state,
    loadDepartments,
    createNewDepartment,
    updateExistingDepartment,
    deleteExistingDepartment,
    clearError,
    refreshDepartments,
  };
}

// Hook for fetching a single department
export function useDepartment(departamento: string | undefined) {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDepartment = useCallback(async () => {
    if (!departamento) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const departmentData = await fetchDepartmentById(departamento);
      setDepartment(departmentData);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load department';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [departamento]);

  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  return {
    department,
    loading,
    error,
    refetch: loadDepartment,
  };
}