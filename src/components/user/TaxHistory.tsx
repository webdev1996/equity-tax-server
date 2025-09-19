import React, { useState } from 'react';
import { Calendar, Download, Eye, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaxReturn {
  id: string;
  year: number;
  status: 'completed' | 'processing' | 'rejected';
  refundAmount: number;
  filedDate: string;
  dueDate: string;
  documents: number;
}

const TaxHistory: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Mock data - in real app, this would come from your API
  const taxReturns: TaxReturn[] = [
    {
      id: '1',
      year: 2022,
      status: 'completed',
      refundAmount: 1250.00,
      filedDate: '2023-03-15',
      dueDate: '2023-04-18',
      documents: 8
    },
    {
      id: '2',
      year: 2021,
      status: 'completed',
      refundAmount: 850.00,
      filedDate: '2022-03-10',
      dueDate: '2022-04-15',
      documents: 6
    },
    {
      id: '3',
      year: 2020,
      status: 'completed',
      refundAmount: 2100.00,
      filedDate: '2021-03-20',
      dueDate: '2021-05-17',
      documents: 10
    }
  ];

  const getStatusIcon = (status: TaxReturn['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = (status: TaxReturn['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'rejected':
        return 'Rejected';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Tax History</h2>
        <p className="text-secondary-600">View your previous tax returns and filings.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Returns</p>
              <p className="text-2xl font-bold text-secondary-900">{taxReturns.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Refunds</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(taxReturns.reduce((sum, ret) => sum + ret.refundAmount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Latest Filing</p>
              <p className="text-2xl font-bold text-secondary-900">
                {taxReturns[0]?.year || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Returns List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Previous Returns</h3>
        
        <div className="space-y-4">
          {taxReturns.map(return_ => (
            <div key={return_.id} className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(return_.status)}
                    <div>
                      <h4 className="font-semibold text-secondary-900">Tax Year {return_.year}</h4>
                      <p className="text-sm text-secondary-600">
                        Filed on {formatDate(return_.filedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-600">Refund Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(return_.refundAmount)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => toast.success('Viewing tax return details')}
                      className="p-2 text-secondary-400 hover:text-primary-600 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => toast.success('Downloading tax return PDF')}
                      className="p-2 text-secondary-400 hover:text-primary-600 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-secondary-600">
                <div className="flex items-center space-x-4">
                  <span>Status: {getStatusText(return_.status)}</span>
                  <span>Documents: {return_.documents}</span>
                </div>
                <span>Due Date: {formatDate(return_.dueDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => toast.success('Downloading all tax returns...')}
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
          >
            <Download className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-secondary-900">Download All Returns</h4>
            <p className="text-sm text-secondary-600">Get a complete archive of your tax history</p>
          </button>
          
          <button 
            onClick={() => toast.success('Opening tax calendar...')}
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
          >
            <Calendar className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-secondary-900">Tax Calendar</h4>
            <p className="text-sm text-secondary-600">View important tax dates and deadlines</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxHistory;
