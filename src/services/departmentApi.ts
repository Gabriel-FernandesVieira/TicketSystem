import { apiRequest, ApiError } from './api';
import { Department } from '../types';

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  manager?: string;
  location?: string;
  budget?: number;
  costCenter?: string;
  notes?: string;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  id: string;
}

export interface DepartmentsResponse {
  departments: Department[];
  total: number;
  page: number;
  limit: number;
}

export interface DepartmentFilters {
  search?: string;
  status?: string;
  manager?: string;
  location?: string;
  page?: number;
  limit?: number;
}

// Mock data for demonstration
const mockDepartments: Department[] = [
  {
    id: '1',
    code: 1,
    name: 'Tecnologia da Informação',
    description: 'Responsável pelo desenvolvimento, manutenção e suporte de sistemas e infraestrutura tecnológica da empresa.',
    status: 'active',
    manager: 'Carlos Oliveira',
    location: 'São Paulo - SP',
    budget: 500000,
    costCenter: 'CC001',
    notes: 'Departamento estratégico para inovação e transformação digital.',
    userCount: 12,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    code: 2,
    name: 'Atendimento ao Cliente',
    description: 'Equipe dedicada ao suporte e atendimento aos clientes, garantindo excelência no relacionamento.',
    status: 'active',
    manager: 'Ana Lima',
    location: 'Rio de Janeiro - RJ',
    budget: 300000,
    costCenter: 'CC002',
    notes: 'Foco na satisfação do cliente e resolução eficiente de problemas.',
    userCount: 8,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    code: 3,
    name: 'Comercial',
    description: 'Responsável pelas vendas, prospecção de novos clientes e expansão de negócios.',
    status: 'active',
    manager: 'Pedro Santos',
    location: 'São Paulo - SP',
    budget: 400000,
    costCenter: 'CC003',
    notes: 'Departamento focado no crescimento e expansão da empresa.',
    userCount: 6,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    code: 4,
    name: 'Financeiro',
    description: 'Gestão financeira, contabilidade, controladoria e planejamento orçamentário.',
    status: 'active',
    manager: 'Maria Silva',
    location: 'Brasília - DF',
    budget: 250000,
    costCenter: 'CC004',
    notes: 'Controle rigoroso das finanças e compliance fiscal.',
    userCount: 4,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '5',
    code: 5,
    name: 'Recursos Humanos',
    description: 'Gestão de pessoas, recrutamento, treinamento e desenvolvimento organizacional.',
    status: 'active',
    manager: 'João Costa',
    location: 'São Paulo - SP',
    budget: 200000,
    costCenter: 'CC005',
    notes: 'Foco no desenvolvimento e bem-estar dos colaboradores.',
    userCount: 3,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '6',
    code: 6,
    name: 'Marketing',
    description: 'Estratégias de marketing, comunicação e branding da empresa.',
    status: 'inactive',
    manager: 'Carla Mendes',
    location: 'São Paulo - SP',
    budget: 150000,
    costCenter: 'CC006',
    notes: 'Departamento temporariamente inativo devido a reestruturação.',
    userCount: 0,
    createdAt: new Date('2024-02-05')
  }
];

// Fetch all departments with optional filters
export async function fetchDepartments(filters: DepartmentFilters = {}): Promise<DepartmentsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let filteredDepartments = [...mockDepartments];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDepartments = filteredDepartments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm) ||
        dept.description.toLowerCase().includes(searchTerm) ||
        dept.code.toString().includes(searchTerm)
      );
    }

    if (filters.status) {
      filteredDepartments = filteredDepartments.filter(dept => dept.status === filters.status);
    }

    if (filters.manager) {
      filteredDepartments = filteredDepartments.filter(dept => dept.manager === filters.manager);
    }

    if (filters.location) {
      filteredDepartments = filteredDepartments.filter(dept => dept.location === filters.location);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

    return {
      departments: paginatedDepartments,
      total: filteredDepartments.length,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new ApiError('Failed to fetch departments', 500);
  }
}

// Fetch a single department by ID
export async function fetchDepartmentById(id: string): Promise<Department> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const department = mockDepartments.find(dept => dept.id === id);
    
    if (!department) {
      throw new ApiError('Department not found', 404);
    }

    return department;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch department', 500);
  }
}

// Create a new department
export async function createDepartment(departmentData: CreateDepartmentRequest): Promise<Department> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // Generate next code
    const maxCode = Math.max(...mockDepartments.map(d => d.code), 0);
    const nextCode = maxCode + 1;

    const newDepartment: Department = {
      id: Date.now().toString(),
      code: nextCode,
      name: departmentData.name,
      description: departmentData.description,
      status: departmentData.status,
      manager: departmentData.manager,
      location: departmentData.location,
      budget: departmentData.budget,
      costCenter: departmentData.costCenter,
      notes: departmentData.notes,
      userCount: 0,
      createdAt: new Date()
    };

    // Add to mock data
    mockDepartments.push(newDepartment);

    return newDepartment;
  } catch (error) {
    console.error('Error creating department:', error);
    throw new ApiError('Failed to create department', 500);
  }
}

// Update an existing department
export async function updateDepartment(id: string, departmentData: Partial<UpdateDepartmentRequest>): Promise<Department> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const departmentIndex = mockDepartments.findIndex(dept => dept.id === id);
    
    if (departmentIndex === -1) {
      throw new ApiError('Department not found', 404);
    }

    const updatedDepartment = {
      ...mockDepartments[departmentIndex],
      ...departmentData,
      id, // Ensure ID doesn't change
      code: mockDepartments[departmentIndex].code, // Ensure code doesn't change
      createdAt: mockDepartments[departmentIndex].createdAt // Ensure creation date doesn't change
    };

    mockDepartments[departmentIndex] = updatedDepartment;

    return updatedDepartment;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to update department', 500);
  }
}

// Delete a department
export async function deleteDepartment(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const departmentIndex = mockDepartments.findIndex(dept => dept.id === id);
    
    if (departmentIndex === -1) {
      throw new ApiError('Department not found', 404);
    }

    // Check if department has users
    const department = mockDepartments[departmentIndex];
    if (department.userCount && department.userCount > 0) {
      throw new ApiError('Cannot delete department with active users', 400);
    }

    mockDepartments.splice(departmentIndex, 1);
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to delete department', 500);
  }
}

// Get next available department code
export async function getNextDepartmentCode(): Promise<number> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const maxCode = Math.max(...mockDepartments.map(d => d.code), 0);
    return maxCode + 1;
  } catch (error) {
    console.error('Error getting next department code:', error);
    throw new ApiError('Failed to get next department code', 500);
  }
}

// Bulk operations
export async function bulkUpdateDepartments(departmentIds: string[], updates: Partial<Department>): Promise<Department[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const updatedDepartments: Department[] = [];

    for (const id of departmentIds) {
      const departmentIndex = mockDepartments.findIndex(dept => dept.id === id);
      if (departmentIndex !== -1) {
        const updatedDepartment = {
          ...mockDepartments[departmentIndex],
          ...updates,
          id, // Ensure ID doesn't change
          code: mockDepartments[departmentIndex].code, // Ensure code doesn't change
          createdAt: mockDepartments[departmentIndex].createdAt // Ensure creation date doesn't change
        };
        mockDepartments[departmentIndex] = updatedDepartment;
        updatedDepartments.push(updatedDepartment);
      }
    }

    return updatedDepartments;
  } catch (error) {
    console.error('Error bulk updating departments:', error);
    throw new ApiError('Failed to bulk update departments', 500);
  }
}

export async function bulkDeleteDepartments(departmentIds: string[]): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    for (const id of departmentIds) {
      const departmentIndex = mockDepartments.findIndex(dept => dept.id === id);
      if (departmentIndex !== -1) {
        const department = mockDepartments[departmentIndex];
        if (department.userCount && department.userCount > 0) {
          throw new ApiError(`Cannot delete department "${department.name}" with active users`, 400);
        }
        mockDepartments.splice(departmentIndex, 1);
      }
    }
  } catch (error) {
    console.error('Error bulk deleting departments:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to bulk delete departments', 500);
  }
}