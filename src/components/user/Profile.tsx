import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Bell, Shield, CreditCard, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      taxReminders: true,
      securityAlerts: true,
      marketingEmails: false
    }
  });

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = (section: string) => {
    // Simulate save operation
    toast.success(`${section} information updated successfully!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab formData={formData.personal} onChange={handleInputChange} onSave={handleSave} />;
      case 'security':
        return <SecurityTab formData={formData.security} onChange={handleInputChange} onSave={handleSave} />;
      case 'notifications':
        return <NotificationsTab formData={formData.notifications} onChange={handleInputChange} onSave={handleSave} />;
      case 'billing':
        return <BillingTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Profile Settings</h2>
        <p className="text-secondary-600">Manage your account settings and preferences.</p>
      </div>

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

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const PersonalInfoTab: React.FC<{ formData: any; onChange: (section: string, field: string, value: string) => void; onSave: (section: string) => void }> = ({ formData, onChange, onSave }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Personal Information</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">First Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.firstName}
              onChange={(e) => onChange('personal', 'firstName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Last Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.lastName}
              onChange={(e) => onChange('personal', 'lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
          <input
            type="email"
            className="input-field"
            value={formData.email}
            onChange={(e) => onChange('personal', 'email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Phone Number</label>
          <input
            type="tel"
            className="input-field"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => onChange('personal', 'phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Address</label>
          <input
            type="text"
            className="input-field"
            value={formData.address}
            onChange={(e) => onChange('personal', 'address', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">City</label>
            <input
              type="text"
              className="input-field"
              value={formData.city}
              onChange={(e) => onChange('personal', 'city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">State</label>
            <select
              className="input-field"
              value={formData.state}
              onChange={(e) => onChange('personal', 'state', e.target.value)}
            >
              <option value="">Select State</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ZIP Code</label>
            <input
              type="text"
              className="input-field"
              value={formData.zipCode}
              onChange={(e) => onChange('personal', 'zipCode', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onSave('Personal')}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SecurityTab: React.FC<{ formData: any; onChange: (section: string, field: string, value: string) => void; onSave: (section: string) => void }> = ({ formData, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Current Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.currentPassword}
              onChange={(e) => onChange('security', 'currentPassword', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">New Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.newPassword}
              onChange={(e) => onChange('security', 'newPassword', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => onChange('security', 'confirmPassword', e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onSave('Password')}
              className="btn-primary flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-900">Enable 2FA</p>
            <p className="text-sm text-secondary-600">Add an extra layer of security to your account</p>
          </div>
          <button className="btn-secondary">Enable</button>
        </div>
      </div>
    </div>
  );
};

const NotificationsTab: React.FC<{ formData: any; onChange: (section: string, field: string, value: boolean) => void; onSave: (section: string) => void }> = ({ formData, onChange, onSave }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-sm text-secondary-600">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'smsNotifications' && 'Receive notifications via SMS'}
                {key === 'taxReminders' && 'Get reminders about tax deadlines'}
                {key === 'securityAlerts' && 'Get alerts about account security'}
                {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value as boolean}
                onChange={(e) => onChange('notifications', key, e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            onClick={() => onSave('Notification preferences')}
            className="btn-primary flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const BillingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Billing Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <p className="font-medium text-secondary-900">Current Plan</p>
              <p className="text-sm text-secondary-600">Basic Tax Filing - Free</p>
            </div>
            <button className="btn-secondary">Upgrade</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <p className="font-medium text-secondary-900">Payment Method</p>
              <p className="text-sm text-secondary-600">No payment method on file</p>
            </div>
            <button className="btn-secondary">Add Payment</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Billing History</h3>
        <div className="text-center py-8 text-secondary-600">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
          <p>No billing history available</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
