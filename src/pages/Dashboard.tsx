import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Ticket, TrendingUp, FolderPen as FolderProject, Receipt, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';
import { mockDashboardStats } from '../data/mockData';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  // Sample data for charts
  const ticketsByMonth = [
    { month: 'Jan', tickets: 45, resolved: 38 },
    { month: 'Fev', tickets: 52, resolved: 45 },
    { month: 'Mar', tickets: 38, resolved: 42 },
    { month: 'Abr', tickets: 67, resolved: 59 },
    { month: 'Mai', tickets: 43, resolved: 41 },
    { month: 'Jun', tickets: 58, resolved: 52 }
  ];

  const projectStatus = [
    { name: 'Ativo', value: 7, color: '#10B981' },
    { name: 'Concluído', value: 5, color: '#3B82F6' },
    { name: 'Pausado', value: 2, color: '#F59E0B' },
    { name: 'Cancelado', value: 1, color: '#EF4444' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 85000 },
    { month: 'Fev', revenue: 92000 },
    { month: 'Mar', revenue: 78000 },
    { month: 'Abr', revenue: 108000 },
    { month: 'Mai', revenue: 125000 },
    { month: 'Jun', revenue: 118000 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Visão geral dos principais indicadores do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Ticket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tickets.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.tickets.open} abertos, {stats.tickets.inProgress} em progresso
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <FolderProject className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.projects.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.projects.active} ativos, {stats.projects.avgProgress}% progresso médio
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Receipt className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reembolsos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(stats.expenses.totalPending / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pendentes aprovação
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(stats.revenue.monthly / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                +{stats.revenue.growth}% vs mês anterior
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tickets por Mês" subtitle="Comparativo de tickets criados vs resolvidos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" fill="#3B82F6" name="Criados" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolvidos" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Status dos Projetos" subtitle="Distribuição atual dos projetos">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Receita Mensal" subtitle="Evolução da receita nos últimos 6 meses">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Receita']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Indicadores de Performance" subtitle="Métricas principais do período">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tempo Médio de Resolução</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tickets</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.tickets.avgResolutionTime} dias
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Taxa de Resolução</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tickets resolvidos</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.tickets.resolved / stats.tickets.total) * 100)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Projetos Entregues</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No prazo</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.projects.completed / stats.projects.total) * 100)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tempo Processamento</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reembolsos</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.expenses.avgProcessingTime} dias
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;