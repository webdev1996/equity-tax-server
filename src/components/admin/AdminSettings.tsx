import React, { useState } from 'react';
import { Save, Shield, Bell, Globe, Database, Mail, Key, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Equity Tax',
      siteDescription: 'Professional Tax Management System',
      supportEmail: 'support@equitytax1.com',
      supportPhone: '(555) 123-4567',
      timezone: 'America/New_York',
      currency: 'USD'
    },
    security: {
      requireTwoFactor: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enableAuditLog: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminAlerts: true,
      userRegistrationAlerts: true,
      returnSubmissionAlerts: true,
      systemMaintenanceAlerts: true
    },
    integrations: {
      enableStripe: true,
      enablePayPal: false,
      enableGoogleAuth: true,
      enableFacebookAuth: false,
      enableTwitterAuth: false,
      apiRateLimit: 1000
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ];

  const handleInputChange = (section: string, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = (section: string) => {
    // In real app, this would make an API call
    console.log('Saving settings:', section, settings[section as keyof typeof settings]);
    toast.success(`${section} settings saved successfully!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings.general} onChange={handleInputChange} onSave={handleSave} />;
      case 'security':
        return <SecuritySettings settings={settings.security} onChange={handleInputChange} onSave={handleSave} />;
      case 'notifications':
        return <NotificationSettings settings={settings.notifications} onChange={handleInputChange} onSave={handleSave} />;
      case 'integrations':
        return <IntegrationSettings settings={settings.integrations} onChange={handleInputChange} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Admin Settings</h2>
        <p className="text-secondary-600">Configure system settings and preferences.</p>
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

const GeneralSettings: React.FC<{ settings: any; onChange: (section: string, field: string, value: string) => void; onSave: (section: string) => void }> = ({ settings, onChange, onSave }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">General Settings</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Site Name</label>
            <input
              type="text"
              className="input-field"
              value={settings.siteName}
              onChange={(e) => onChange('general', 'siteName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Currency</label>
            <select
              className="input-field"
              value={settings.currency}
              onChange={(e) => onChange('general', 'currency', e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Site Description</label>
          <textarea
            className="input-field"
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => onChange('general', 'siteDescription', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Support Email</label>
            <input
              type="email"
              className="input-field"
              value={settings.supportEmail}
              onChange={(e) => onChange('general', 'supportEmail', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Support Phone</label>
            <input
              type="tel"
              className="input-field"
              value={settings.supportPhone}
              onChange={(e) => onChange('general', 'supportPhone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Timezone</label>
          <select
            className="input-field"
            value={settings.timezone}
            onChange={(e) => onChange('general', 'timezone', e.target.value)}
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onSave('general')}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save General Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC<{ settings: any; onChange: (section: string, field: string, value: boolean | number) => void; onSave: (section: string) => void }> = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Security Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Require Two-Factor Authentication</p>
              <p className="text-sm text-secondary-600">Force all users to enable 2FA</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.requireTwoFactor}
                onChange={(e) => onChange('security', 'requireTwoFactor', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                className="input-field"
                value={settings.sessionTimeout}
                onChange={(e) => onChange('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Password Min Length</label>
              <input
                type="number"
                className="input-field"
                value={settings.passwordMinLength}
                onChange={(e) => onChange('security', 'passwordMinLength', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Max Login Attempts</label>
              <input
                type="number"
                className="input-field"
                value={settings.maxLoginAttempts}
                onChange={(e) => onChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Lockout Duration (minutes)</label>
              <input
                type="number"
                className="input-field"
                value={settings.lockoutDuration}
                onChange={(e) => onChange('security', 'lockoutDuration', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Enable Audit Logging</p>
              <p className="text-sm text-secondary-600">Log all admin actions and system changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableAuditLog}
                onChange={(e) => onChange('security', 'enableAuditLog', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onSave('security')}
              className="btn-primary flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Save Security Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC<{ settings: any; onChange: (section: string, field: string, value: boolean) => void; onSave: (section: string) => void }> = ({ settings, onChange, onSave }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">Notification Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-sm text-secondary-600">
                {key === 'emailNotifications' && 'Send notifications via email'}
                {key === 'smsNotifications' && 'Send notifications via SMS'}
                {key === 'adminAlerts' && 'Send alerts to admin users'}
                {key === 'userRegistrationAlerts' && 'Alert when new users register'}
                {key === 'returnSubmissionAlerts' && 'Alert when returns are submitted'}
                {key === 'systemMaintenanceAlerts' && 'Alert about system maintenance'}
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
            onClick={() => onSave('notifications')}
            className="btn-primary flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Save Notification Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const IntegrationSettings: React.FC<{ settings: any; onChange: (section: string, field: string, value: boolean | number) => void; onSave: (section: string) => void }> = ({ settings, onChange, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Payment Integrations</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Stripe</p>
              <p className="text-sm text-secondary-600">Enable Stripe payment processing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableStripe}
                onChange={(e) => onChange('integrations', 'enableStripe', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">PayPal</p>
              <p className="text-sm text-secondary-600">Enable PayPal payment processing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enablePayPal}
                onChange={(e) => onChange('integrations', 'enablePayPal', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Social Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Google</p>
              <p className="text-sm text-secondary-600">Enable Google OAuth login</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableGoogleAuth}
                onChange={(e) => onChange('integrations', 'enableGoogleAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Facebook</p>
              <p className="text-sm text-secondary-600">Enable Facebook OAuth login</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableFacebookAuth}
                onChange={(e) => onChange('integrations', 'enableFacebookAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Twitter</p>
              <p className="text-sm text-secondary-600">Enable Twitter OAuth login</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enableTwitterAuth}
                onChange={(e) => onChange('integrations', 'enableTwitterAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">API Settings</h3>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">API Rate Limit (requests per hour)</label>
          <input
            type="number"
            className="input-field"
            value={settings.apiRateLimit}
            onChange={(e) => onChange('integrations', 'apiRateLimit', parseInt(e.target.value))}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => onSave('integrations')}
            className="btn-primary flex items-center space-x-2"
          >
            <Database className="h-4 w-4" />
            <span>Save Integration Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
