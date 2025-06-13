import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStage } from '../types';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (projectData: Omit<Project, 'id' | 'number' | 'createdAt' | 'progress'>) => Promise<Project>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  getNextProjectNumber: () => number;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Enhanced mock data with more projects for testing
const initialProjects: Project[] = [
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
  },
  {
    id: '3',
    number: 2003,
    description: 'Sistema de gestão de estoque - Empresa DEF',
    createdAt: new Date('2024-01-20'),
    client: 'Empresa DEF',
    responsible: 'Pedro Santos',
    totalHours: 80,
    status: 'completed',
    progress: 100,
    stages: []
  },
  {
    id: '4',
    number: 2004,
    description: 'Integração com API de pagamentos - StartupTech',
    createdAt: new Date('2024-02-01'),
    client: 'StartupTech',
    responsible: 'Maria Silva',
    totalHours: 40,
    status: 'on-hold',
    progress: 30,
    stages: []
  }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects).map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt)
        }));
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const getNextProjectNumber = (): number => {
    const maxNumber = projects.reduce((max, project) => 
      project.number > max ? project.number : max, 2000
    );
    return maxNumber + 1;
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'number' | 'createdAt' | 'progress'>): Promise<Project> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      number: getNextProjectNumber(),
      createdAt: new Date(),
      progress: 0
    };

    setProjects(prev => [...prev, newProject]);
    setLoading(false);
    
    return newProject;
  };

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedProject = projects.find(p => p.id === id);
    if (!updatedProject) {
      setLoading(false);
      throw new Error('Projeto não encontrado');
    }

    const updated: Project = {
      ...updatedProject,
      ...projectData,
      id: updatedProject.id, // Ensure ID doesn't change
      number: updatedProject.number, // Ensure number doesn't change
      createdAt: updatedProject.createdAt // Ensure creation date doesn't change
    };

    setProjects(prev => prev.map(project => 
      project.id === id ? updated : project
    ));
    
    setLoading(false);
    return updated;
  };

  const deleteProject = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const projectExists = projects.find(p => p.id === id);
    if (!projectExists) {
      setLoading(false);
      throw new Error('Projeto não encontrado');
    }

    setProjects(prev => prev.filter(project => project.id !== id));
    setLoading(false);
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      createProject,
      updateProject,
      deleteProject,
      getProject,
      getNextProjectNumber
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};