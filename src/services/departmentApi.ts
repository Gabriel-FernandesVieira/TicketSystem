import { Department } from '../types';

export interface CreateDepartmentRequest {
  descricao: string; // Required field from HNDEPARTAMENTO table
}

export interface UpdateDepartmentRequest {
  departamento: number; // Primary key
  descricao: string;
}

export interface DepartmentsResponse {
  departments: Department[];
  total: number;
  page: number;
  limit: number;
}

export interface DepartmentFilters {
  search?: string;
  page?: number;
  limit?: number;
}

// Mock data store following HNDEPARTAMENTO table structure
let mockDepartments: Department[] = [
  {
    departamento: 1,
    descricao: 'Tecnologia da Informação',
    // Compatibility fields
    id: '1',
    code: 1,
    name: 'Tecnologia da Informação',
    status: 'active',
    userCount: 12,
    createdAt: new Date('2024-01-15')
  },
  {
    departamento: 2,
    descricao: 'Atendimento ao Cliente',
    id: '2',
    code: 2,
    name: 'Atendimento ao Cliente',
    status: 'active',
    userCount: 8,
    createdAt: new Date('2024-01-10')
  },
  {
    departamento: 3,
    descricao: 'Comercial',
    id: '3',
    code: 3,
    name: 'Comercial',
    status: 'active',
    userCount: 6,
    createdAt: new Date('2024-01-20')
  },
  {
    departamento: 4,
    descricao: 'Financeiro',
    id: '4',
    code: 4,
    name: 'Financeiro',
    status: 'active',
    userCount: 4,
    createdAt: new Date('2024-01-25')
  },
  {
    departamento: 5,
    descricao: 'Recursos Humanos',
    id: '5',
    code: 5,
    name: 'Recursos Humanos',
    status: 'active',
    userCount: 3,
    createdAt: new Date('2024-02-01')
  },
  {
    departamento: 6,
    descricao: 'Marketing',
    id: '6',
    code: 6,
    name: 'Marketing',
    status: 'inactive',
    userCount: 0,
    createdAt: new Date('2024-02-05')
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all departments with optional filters
export async function fetchDepartments(filters: DepartmentFilters = {}): Promise<DepartmentsResponse> {
  await delay(300);

  let filteredDepartments = [...mockDepartments];

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredDepartments = filteredDepartments.filter(dept =>
      dept.descricao.toLowerCase().includes(searchTerm) ||
      dept.departamento.toString().includes(searchTerm)
    );
  }

  // Apply pagination
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
}

// Fetch a single department by code
export async function fetchDepartmentById(departamento: string): Promise<Department> {
  await delay(200);

  const dept = mockDepartments.find(d => d.departamento.toString() === departamento || d.id === departamento);
  
  if (!dept) {
    throw new Error('Department not found');
  }

  return dept;
}

// Create a new department
export async function createDepartment(departmentData: CreateDepartmentRequest): Promise<Department> {
  await delay(400);

  // Generate next department code
  const maxCode = Math.max(...mockDepartments.map(d => d.departamento), 0);
  const nextCode = maxCode + 1;

  // Check if description already exists
  const existingDept = mockDepartments.find(d => 
    d.descricao.toLowerCase() === departmentData.descricao.toLowerCase()
  );
  if (existingDept) {
    throw new Error('Department with this description already exists');
  }

  const newDepartment: Department = {
    departamento: nextCode,
    descricao: departmentData.descricao,
    // Compatibility fields
    id: nextCode.toString(),
    code: nextCode,
    name: departmentData.descricao,
    status: 'active',
    userCount: 0,
    createdAt: new Date()
  };

  mockDepartments.push(newDepartment);
  return newDepartment;
}

// Update an existing department
export async function updateDepartment(departamento: string, departmentData: Partial<UpdateDepartmentRequest>): Promise<Department> {
  await delay(350);

  const deptIndex = mockDepartments.findIndex(d => 
    d.departamento.toString() === departamento || d.id === departamento
  );
  
  if (deptIndex === -1) {
    throw new Error('Department not found');
  }

  const existingDept = mockDepartments[deptIndex];
  
  // Check if new description conflicts with existing departments
  if (departmentData.descricao && departmentData.descricao !== existingDept.descricao) {
    const conflictingDept = mockDepartments.find(d => 
      d.descricao.toLowerCase() === departmentData.descricao.toLowerCase() &&
      d.departamento !== existingDept.departamento
    );
    if (conflictingDept) {
      throw new Error('Department with this description already exists');
    }
  }

  const updatedDepartment: Department = {
    ...existingDept,
    descricao: departmentData.descricao || existingDept.descricao,
    // Update compatibility fields
    name: departmentData.descricao || existingDept.descricao
  };

  mockDepartments[deptIndex] = updatedDepartment;
  return updatedDepartment;
}

// Delete a department
export async function deleteDepartment(departamento: string): Promise<void> {
  await delay(300);

  const deptIndex = mockDepartments.findIndex(d => 
    d.departamento.toString() === departamento || d.id === departamento
  );
  
  if (deptIndex === -1) {
    throw new Error('Department not found');
  }

  const dept = mockDepartments[deptIndex];
  
  // Check if department has users
  if (dept.userCount && dept.userCount > 0) {
    throw new Error('Cannot delete department with active users');
  }

  mockDepartments.splice(deptIndex, 1);
}

// Get next available department code
export async function getNextDepartmentCode(): Promise<number> {
  await delay(100);

  const maxCode = Math.max(...mockDepartments.map(d => d.departamento), 0);
  return maxCode + 1;
}

// Bulk operations
export async function bulkUpdateDepartments(departmentCodes: number[], updates: Partial<Department>): Promise<Department[]> {
  await delay(600);

  const updatedDepartments: Department[] = [];

  for (const code of departmentCodes) {
    const deptIndex = mockDepartments.findIndex(d => d.departamento === code);
    if (deptIndex !== -1) {
      const updatedDepartment = {
        ...mockDepartments[deptIndex],
        ...updates,
        departamento: mockDepartments[deptIndex].departamento, // Ensure primary key doesn't change
      };
      mockDepartments[deptIndex] = updatedDepartment;
      updatedDepartments.push(updatedDepartment);
    }
  }

  return updatedDepartments;
}

export async function bulkDeleteDepartments(departmentCodes: number[]): Promise<void> {
  await delay(500);

  for (const code of departmentCodes) {
    const dept = mockDepartments.find(d => d.departamento === code);
    if (dept && dept.userCount && dept.userCount > 0) {
      throw new Error(`Cannot delete department "${dept.descricao}" with active users`);
    }
  }

  mockDepartments = mockDepartments.filter(d => !departmentCodes.includes(d.departamento));
}