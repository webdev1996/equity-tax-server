import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, User, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../utils/api';

interface TaxReturn {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  year: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  refundAmount: number;
  totalIncome: number;
  documentsCount: number;
  priority: 'low' | 'medium' | 'high';
}

const TaxReturnReview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null);
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tax returns from API
  useEffect(() => {
    const fetchTaxReturns = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getReturns();
        setTaxReturns(response.data.data || []);
      } catch (error) {
        console.error('Error fetching tax returns:', error);
        toast.error('Failed to fetch tax returns');
        setTaxReturns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxReturns();
  }, []);

  const filteredReturns = taxReturns.filter(return_ => {
    const matchesSearch = return_.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         return_.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         return_.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || return_.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || return_.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: TaxReturn['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusText = (status: TaxReturn['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
    }
  };

  const handleReviewReturn = async (returnId: string, action: 'approve' | 'reject', comment?: string) => {
    try {
      await adminAPI.reviewReturn(returnId, action, comment);
      setTaxReturns(prev => prev.map(return_ => 
        return_.id === returnId 
          ? { ...return_, status: action === 'approve' ? 'approved' : 'rejected' }
          : return_
      ));
      toast.success(`Tax return ${action}d successfully`);
      setSelectedReturn(null);
    } catch (error) {
      console.error('Error reviewing tax return:', error);
      toast.error(`Failed to ${action} tax return`);
    }
  };

  const getPriorityColor = (priority: TaxReturn['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApprove = (returnId: string) => {
    // In real app, this would make an API call
    console.log('Approving return:', returnId);
    toast.success(`Tax return ${returnId} approved successfully!`);
  };

  const handleReject = (returnId: string) => {
    // In real app, this would make an API call
    console.log('Rejecting return:', returnId);
    toast.success(`Tax return ${returnId} rejected.`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Tax Return Review</h2>
          <p className="text-secondary-600">Review and process submitted tax returns.</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Loading tax returns...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Tax Return Review</h2>
        <p className="text-secondary-600">Review and process submitted tax returns.</p>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by user name, email, or return ID..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-secondary-400" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              className="input-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Return ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Refund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredReturns.map(return_ => (
                <tr key={return_.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">{return_.id}</div>
                    <div className="text-sm text-secondary-500">{return_.documentsCount} docs</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">{return_.userName}</div>
                    <div className="text-sm text-secondary-500">{return_.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {return_.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(return_.status)}
                      <span className="ml-2 text-sm text-secondary-900">
                        {getStatusText(return_.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(return_.priority)}`}>
                      {return_.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {formatCurrency(return_.refundAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {formatDate(return_.submittedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReturn(return_);
                          toast.success(`Viewing details for return ${return_.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {return_.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(return_.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(return_.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Return Details - {selectedReturn.id}
                </h3>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedReturn.userName}</p>
                      <p><span className="font-medium">Email:</span> {selectedReturn.userEmail}</p>
                      <p><span className="font-medium">User ID:</span> {selectedReturn.userId}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Return Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Tax Year:</span> {selectedReturn.year}</p>
                      <p><span className="font-medium">Status:</span> {getStatusText(selectedReturn.status)}</p>
                      <p><span className="font-medium">Priority:</span> {selectedReturn.priority}</p>
                      <p><span className="font-medium">Submitted:</span> {formatDate(selectedReturn.submittedDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Total Income:</span> {formatCurrency(selectedReturn.totalIncome)}</p>
                      <p><span className="font-medium">Refund Amount:</span> {formatCurrency(selectedReturn.refundAmount)}</p>
                      <p><span className="font-medium">Documents:</span> {selectedReturn.documentsCount}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Actions</h4>
                    <div className="flex space-x-2">
                      <button className="btn-primary text-sm">View Documents</button>
                      <button className="btn-secondary text-sm">Download PDF</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {taxReturns.filter(r => r.status === 'pending').length}
          </div>
          <p className="text-sm text-secondary-600">Pending Review</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {taxReturns.filter(r => r.status === 'approved').length}
          </div>
          <p className="text-sm text-secondary-600">Approved</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {taxReturns.filter(r => r.status === 'rejected').length}
          </div>
          <p className="text-sm text-secondary-600">Rejected</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {formatCurrency(taxReturns.reduce((sum, r) => sum + r.refundAmount, 0))}
          </div>
          <p className="text-sm text-secondary-600">Total Refunds</p>
        </div>
      </div>
    </div>
  );
};

export default TaxReturnReview;
