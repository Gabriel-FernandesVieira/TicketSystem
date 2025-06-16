import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/tickets/TicketList';
import TicketDetail from './pages/tickets/TicketDetail';
import TicketForm from './pages/tickets/TicketForm';
import ProjectList from './pages/projects/ProjectList';
import ProjectForm from './pages/projects/ProjectForm';
import ProjectDetail from './pages/projects/ProjectDetail';
import ExpenseList from './pages/expenses/ExpenseList';
import ExpenseForm from './pages/expenses/ExpenseForm';
import ExpenseDetail from './pages/expenses/ExpenseDetail';
import UserList from './pages/registrations/UserList';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/new" element={<TicketForm />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/tickets/:id/edit" element={<TicketForm />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/new" element={<ExpenseForm />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
        <Route path="/expenses/:id/edit" element={<ExpenseForm />} />
        
        {/* Registration Routes - Admin Only */}
        <Route 
          path="/registrations/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder routes for other registration pages */}
        <Route 
          path="/registrations/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Página em Desenvolvimento
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
                </p>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <Router>
            <div className="dark:bg-gray-900 min-h-screen">
              <AppRoutes />
            </div>
          </Router>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;