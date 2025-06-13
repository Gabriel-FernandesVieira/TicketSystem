import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, FolderPen as FolderProject, Receipt, Settings, Users, Building2, GitBranch, Tag, AlertCircle, Package, Truck, MapPin, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = React.useState<string[]>(['registrations']);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Ticket, label: 'Tickets', path: '/tickets' },
    { icon: FolderProject, label: 'Projetos', path: '/projects' },
    { icon: Receipt, label: 'Reembolsos', path: '/expenses' }
  ];

  const registrationItems = [
    { icon: Users, label: 'Usuários', path: '/registrations/users' },
    { icon: Building2, label: 'Empresas', path: '/registrations/companies' },
    { icon: GitBranch, label: 'Departamentos', path: '/registrations/departments' },
    { icon: Tag, label: 'Categorias', path: '/registrations/categories' },
    { icon: AlertCircle, label: 'Status', path: '/registrations/status' },
    { icon: AlertCircle, label: 'Prioridades', path: '/registrations/priorities' },
    { icon: Package, label: 'Produtos/Serviços', path: '/registrations/products' },
    { icon: Truck, label: 'Fornecedores', path: '/registrations/suppliers' },
    { icon: FileText, label: 'Templates de Projeto', path: '/registrations/project-templates' },
    { icon: MapPin, label: 'Localizações', path: '/registrations/locations' }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-gray-900 dark:text-white">Sistema</span>
          )}
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600 text-blue-600 dark:text-blue-400' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <div className="mt-6">
            <div 
              className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => toggleMenu('registrations')}
            >
              <Settings className="w-5 h-5" />
              {!isCollapsed && (
                <>
                  <span className="ml-3">Cadastros</span>
                  {openMenus.includes('registrations') ? 
                    <ChevronDown className="w-4 h-4 ml-auto" /> : 
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  }
                </>
              )}
            </div>

            {(!isCollapsed && openMenus.includes('registrations')) && (
              <div className="ml-4">
                {registrationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;