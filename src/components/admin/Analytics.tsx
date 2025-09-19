import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../utils/api';

interface MonthlyData {
  month: string;
  users: number;
  returns: number;
  revenue: number;
}

interface TopState {
  state: string;
  users: number;
  returns: number;
}

interface ReturnStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReturns: 0,
    completedReturns: 0,
    pendingReturns: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    userRetention: 0,
    avgProcessingTime: 0,
    successRate: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topStates, setTopStates] = useState<TopState[]>([]);
  const [returnStatuses, setReturnStatuses] = useState<ReturnStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAnalytics({ period: selectedPeriod });
        const data = response.data.data;
        
        setAnalyticsData(data.overview || {
          totalUsers: 0,
          activeUsers: 0,
          totalReturns: 0,
          completedReturns: 0,
          pendingReturns: 0,
          totalRevenue: 0,
          monthlyGrowth: 0,
          userRetention: 0,
          avgProcessingTime: 0,
          successRate: 0
        });
        setMonthlyData(data.monthlyData || []);
        setTopStates(data.topStates || []);
        setReturnStatuses(data.returnStatuses || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h2>
          <p className="text-secondary-600">Platform performance and user insights.</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h2>
          <p className="text-secondary-600">Platform performance and user insights.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="input-field"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            onClick={() => toast.success('Exporting analytics data...')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{analyticsData.monthlyGrowth}% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Returns</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.totalReturns.toLocaleString()}</p>
              <p className="text-xs text-green-600">+8.2% from last month</p>
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
              <p className="text-2xl font-bold text-secondary-900">{formatCurrency(analyticsData.totalRevenue)}</p>
              <p className="text-xs text-green-600">+15.3% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Success Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{analyticsData.successRate}%</p>
              <p className="text-xs text-green-600">+2.1% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Monthly Growth</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium text-secondary-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(data.users / 250) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-secondary-600">{data.users} users</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Return Status Distribution</h3>
          <div className="space-y-4">
            {returnStatuses.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                  <span className="text-sm font-medium text-secondary-900">{status.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-secondary-900">{status.count}</div>
                  <div className="text-xs text-secondary-600">{status.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top States */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top States by Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Returns
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {topStates.map((state) => (
                <tr key={state.state}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {state.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {state.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {state.returns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {((state.returns / state.users) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.userRetention}%</div>
          <p className="text-sm text-secondary-600">User Retention</p>
          <p className="text-xs text-secondary-500">Users who return within 30 days</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.avgProcessingTime} days</div>
          <p className="text-sm text-secondary-600">Avg. Processing Time</p>
          <p className="text-xs text-secondary-500">From submission to approval</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{analyticsData.activeUsers}</div>
          <p className="text-sm text-secondary-600">Active Users</p>
          <p className="text-xs text-secondary-500">Users active in last 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
