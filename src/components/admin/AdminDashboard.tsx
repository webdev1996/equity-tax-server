import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import UserManagement from './UserManagement';
import TaxReturnReview from './TaxReturnReview';
import Analytics from './Analytics';
import AdminSettings from './AdminSettings';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'returns', label: 'Tax Returns', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'returns':
        return <TaxReturnReview />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-secondary-900">Equity Tax Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-secondary-400 hover:text-secondary-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-secondary-400 hover:text-secondary-600">
                <Search className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-secondary-700">{user?.name}</span>
                <button
                  onClick={logout}
                  className="p-2 text-secondary-400 hover:text-secondary-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Overview: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  // Mock data - in real app, this would come from your API
  const stats = {
    totalUsers: 1247,
    activeReturns: 89,
    completedReturns: 1158,
    pendingReview: 23,
    totalRevenue: 125000,
    monthlyGrowth: 12.5
  };

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Submitted tax return', time: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Uploaded documents', time: '15 minutes ago', type: 'info' },
    { id: 3, user: 'Bob Johnson', action: 'Return rejected', time: '1 hour ago', type: 'error' },
    { id: 4, user: 'Alice Brown', action: 'Return approved', time: '2 hours ago', type: 'success' },
    { id: 5, user: 'Charlie Wilson', action: 'Created account', time: '3 hours ago', type: 'info' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Admin Overview</h2>
        <p className="text-secondary-600">Monitor your tax platform performance and user activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Returns</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.activeReturns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Pending Review</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.pendingReview}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">{activity.user}</p>
                  <p className="text-xs text-secondary-600">{activity.action}</p>
                </div>
                <span className="text-xs text-secondary-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button 
            onClick={() => {
              setActiveTab('returns');
              toast.success('Navigating to tax return review');
            }}
            className="w-full p-3 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-secondary-900">Review Pending Returns</p>
                <p className="text-sm text-secondary-600">{stats.pendingReview} returns need attention</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('users');
              toast.success('Navigating to user management');
            }}
            className="w-full p-3 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-secondary-900">Manage Users</p>
                <p className="text-sm text-secondary-600">View and manage user accounts</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('analytics');
              toast.success('Navigating to analytics');
            }}
            className="w-full p-3 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-secondary-900">View Analytics</p>
                <p className="text-sm text-secondary-600">Platform performance metrics</p>
              </div>
            </div>
          </button>
        </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
            <p className="text-sm text-secondary-600">Success Rate</p>
            <p className="text-xs text-secondary-500">Tax returns processed successfully</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.3 days</div>
            <p className="text-sm text-secondary-600">Avg. Processing Time</p>
            <p className="text-xs text-secondary-500">From submission to approval</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">+{stats.monthlyGrowth}%</div>
            <p className="text-sm text-secondary-600">Monthly Growth</p>
            <p className="text-xs text-secondary-500">New user registrations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
