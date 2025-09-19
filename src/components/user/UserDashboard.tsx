import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  Settings,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react';
import TaxFiling from './TaxFiling';
import DocumentUpload from './DocumentUpload';
import TaxHistory from './TaxHistory';
import Profile from './Profile';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'filing', label: 'Tax Filing', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'filing':
        return <TaxFiling />;
      case 'documents':
        return <DocumentUpload />;
      case 'history':
        return <TaxHistory />;
      case 'profile':
        return <Profile />;
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
              <h1 className="text-xl font-semibold text-secondary-900">Equity Tax</h1>
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
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Tax Year {currentYear}</h2>
        <p className="text-secondary-600">Welcome back! Here's your tax filing overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Status</p>
              <p className="text-lg font-semibold text-secondary-900">Not Started</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Estimated Refund</p>
              <p className="text-lg font-semibold text-secondary-900">$0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Days Remaining</p>
              <p className="text-lg font-semibold text-secondary-900">90</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Documents</p>
              <p className="text-lg font-semibold text-secondary-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveTab('documents')}
            className="p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-secondary-700">Upload Documents</p>
            <p className="text-xs text-secondary-500">W-2, 1099, receipts</p>
          </button>
          <button 
            onClick={() => setActiveTab('filing')}
            className="p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <FileText className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-secondary-700">Start Tax Filing</p>
            <p className="text-xs text-secondary-500">Begin your return</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-2 h-2 bg-secondary-300 rounded-full mr-3"></div>
            Account created successfully
            <span className="ml-auto text-xs">Today</span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-2 h-2 bg-secondary-300 rounded-full mr-3"></div>
            Welcome to Equity Tax
            <span className="ml-auto text-xs">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
