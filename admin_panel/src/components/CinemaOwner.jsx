import React, { useState, useEffect } from 'react';
import { Eye, ToggleLeft, ToggleRight, Search, UserCheck, CheckCircle, Clock, Building, X, Users } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
  }).replace(',', '');
};


// Notification Component
const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <span className="text-xl">×</span>
        </button>
      </div>
    </div>
  );
};

// Updated Modal Component
const OwnerDetailsModal = ({ owner, onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header with Background */}
        <div className="relative overflow-hidden h-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10"></div>
          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
            <div>
              <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Cinema Owner Details</h3>
              <div className="w-12 h-1 bg-blue-300 rounded-full"></div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 group backdrop-blur-sm"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow">
          <div className="p-4">
            {/* Owner Header Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-shrink-0 text-center lg:text-left">
                {owner.image ? (
                  <img
                    className="h-40 w-40 mx-auto lg:mx-0 object-cover rounded-xl shadow-xl ring-2 ring-blue-100"
                    src={`${BASE_URL}/CinemaOwnerImage/${owner.image}`}
                    alt={owner.name}
                  />
                ) : (
                  <div className="h-40 w-40 mx-auto lg:mx-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-xl ring-2 ring-blue-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white drop-shadow-lg">
                      {owner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {owner.name}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${owner.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                      : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${owner.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                    {owner.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${owner.is_verified
                      ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                      : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                    }`}>
                    {owner.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                    <div className="text-blue-600 text-xs font-semibold mb-1">Email</div>
                    <div className="text-gray-900 font-medium text-sm break-words whitespace-pre-wrap">
                      {owner.email}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                    <div className="text-blue-600 text-xs font-semibold mb-1">Contact</div>
                    <div className="text-gray-900 font-medium text-sm">{owner.contact}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Detailed Information */}
            <div className="space-y-4">
               <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h5 className="text-base font-bold text-gray-900">Record History</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
                    <span className="text-gray-900 font-semibold text-sm">{owner.create_user || 'N/A'}</span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(owner.created_at)}</p>
                  </div>
                  {owner.update_user && (
                    <div>
                      <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                      <span className="text-gray-900 font-semibold text-sm">{owner.update_user}</span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(owner.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-3 border-t border-blue-200/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CinemaOwner = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [currentSection, setCurrentSection] = useState('owners');
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prevNotifications => [...prevNotifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    }, 2000);
  };

  const removeNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
  };

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/cinema-owner/get-all-owners`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cinema owners');
      }
      const data = await response.json();
      // Sort data by owner_id in descending order
      const sortedData = data.sort((a, b) => b.owner_id - a.owner_id);
      setOwners(sortedData);
    } catch (error) {
      console.error('Error fetching cinema owners:', error);
      showNotification(`Error fetching cinema owners: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleOwnerStatus = async (ownerId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/cinema-owner/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: ownerId })
      });
      if (!response.ok) {
        throw new Error('Failed to toggle owner status');
      }
      const result = await response.json();
      showNotification(result.message);
      setOwners(owners.map(owner =>
        owner.owner_id === ownerId
          ? { ...owner, status: owner.status === 'Active' ? 'Inactive' : 'Active' }
          : owner
      ));
      if (selectedOwner && selectedOwner.owner_id === ownerId) {
        setSelectedOwner({
          ...selectedOwner,
          status: selectedOwner.status === 'Active' ? 'Inactive' : 'Active'
        });
      }
    } catch (error) {
      console.error('Error toggling owner status:', error);
      showNotification(`Error toggling owner status: ${error.message}`, 'error');
    }
  };

  const toggleVerification = async (ownerId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/cinema-owner/toggle-verification`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: ownerId })
      });
      if (!response.ok) {
        throw new Error('Failed to toggle verification status');
      }
      const result = await response.json();
      showNotification(result.message);
      // Refetch owners to get the most up-to-date list after verification
      fetchOwners();
      if (selectedOwner && selectedOwner.owner_id === ownerId) {
        setSelectedOwner({
          ...selectedOwner,
          is_verified: !selectedOwner.is_verified
        });
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      showNotification(`Error toggling verification: ${error.message}`, 'error');
    }
  };

  const getOwnerDetails = (ownerId) => {
    const owner = owners.find(o => o.owner_id === ownerId);
    if (owner) {
      setSelectedOwner(owner);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, verificationFilter, itemsPerPage]);

  const filteredOwners = owners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || owner.status === statusFilter;
    const matchesVerification = verificationFilter === 'All' ||
      (verificationFilter === 'Verified' && owner.is_verified) ||
      (verificationFilter === 'Pending' && !owner.is_verified);
    return matchesSearch && matchesStatus && matchesVerification;
  });
  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);

  const pendingVerificationOwners = owners.filter(owner => !owner.is_verified);
  const totalOwners = owners.length;
  const activeOwners = owners.filter(owner => owner.status === 'Active').length;
  const verifiedOwners = owners.filter(owner => owner.is_verified).length;
  const pendingOwners = owners.filter(owner => !owner.is_verified).length;

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20', color: color }}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Cinema Owner Management</h2>
              <p className="text-gray-600 mt-1">Manage cinema owners and verification approvals</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentSection('owners')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentSection === 'owners'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All Owners
              </button>
              <button
                onClick={() => setCurrentSection('verification')}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentSection === 'verification'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Verification Approvals
                {pendingOwners > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                      {pendingOwners}
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Owners" value={totalOwners} icon={Building} color="#3B82F6" />
            <StatCard title="Active Owners" value={activeOwners} icon={UserCheck} color="#10B981" />
            <StatCard title="Verified Owners" value={verifiedOwners} icon={CheckCircle} color="#3B82F6" />
            <StatCard title="Pending Verification" value={pendingOwners} icon={Clock} color="#F59E0B" />
          </div>
        </div>
      </div>
      {/* Filters */}
      {currentSection === 'owners' && (
        <div className="bg-white border-b border-blue-100 px-6 py-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
              <input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="All">All Verification</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
             <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
          </div>
        </div>
      )}
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
            <div className="overflow-x-auto">
              {currentSection === 'owners' ? (
                <>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    {currentOwners.map((owner, index) => (
                      <tr key={owner.owner_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              {owner.image ? (
                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-200" src={`${BASE_URL}/CinemaOwnerImage/${owner.image}`} alt={owner.name} />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                                  <span className="text-lg font-bold text-white">{owner.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{owner.name}</div>
                              <div className="text-xs font-medium  text-gray-600">{owner.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{owner.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${owner.status === 'Active'
                              ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                              : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                            }`}>
                            {owner.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${owner.is_verified
                              ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                              : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                            }`}>
                            {owner.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div>{owner.create_user || 'N/A'}</div>
                            <div className="text-xs font-medium text-gray-600">{formatDate(owner.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div>{owner.update_user || 'N/A'}</div>
                            <div className="text-xs font-medium text-gray-600">{formatDate(owner.updated_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => getOwnerDetails(owner.owner_id)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleOwnerStatus(owner.owner_id)}
                              className={`p-2 rounded-lg transition-all duration-200 ${owner.status === 'Active'
                                  ? 'text-red-600 hover:text-red-800 hover:bg-red-100'
                                  : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                }`}
                              title={`${owner.status === 'Active' ? 'Deactivate' : 'Activate'} Owner`}
                            >
                              {owner.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {currentOwners.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-12">
                          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No owners found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                 {totalPages > 1 && (
                    <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-blue-100">
                        <span className="text-sm text-gray-700">
                            Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                </>
              ) : (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Pending Verification Approvals</h3>
                  {pendingVerificationOwners.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No pending verifications</p>
                      <p className="text-gray-400 text-sm">All owners are verified</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingVerificationOwners.map((owner) => (
                        <div key={owner.owner_id} className="bg-white border-2 border-yellow-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                          <div className="flex items-center space-x-4 mb-4">
                            {owner.image ? (
                              <img className="h-16 w-16 rounded-full object-cover ring-2 ring-yellow-200" src={`${BASE_URL}/CinemaOwnerImage/${owner.image}`} alt={owner.name} />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ring-2 ring-yellow-200">
                                <span className="text-xl font-bold text-white">{owner.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{owner.name}</h4>
                              <p className="text-sm text-gray-600">{owner.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-sm"><span className="font-medium">Contact:</span> {owner.contact}</p>
                            <p className="text-sm"><span className="font-medium">Status:</span>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${owner.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {owner.status}
                              </span>
                            </p>
                            <p className="text-sm"><span className="font-medium">Registered:</span> {formatDate(owner.created_at)}</p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => getOwnerDetails(owner.owner_id)}
                              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => toggleVerification(owner.owner_id)}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Owner Details Modal */}
      {isModalOpen && selectedOwner && (
        <OwnerDetailsModal owner={selectedOwner} onClose={() => setIsModalOpen(false)} />
      )}
      {/* Notification Container */}
      <div className="fixed top-0 right-0 z-50 p-4">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CinemaOwner;
