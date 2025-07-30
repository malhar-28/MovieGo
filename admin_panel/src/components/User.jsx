import React, { useState, useEffect } from 'react';
import { Eye, ToggleLeft, ToggleRight, Search, UserCheck, UserX, TrendingUp, Users, Mail, Phone, Cake, PersonStanding, MapPin, CalendarPlus, CalendarClock, ShieldCheck } from 'lucide-react';
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


const BASE_URL = import.meta.env.VITE_BASE_URL;

// Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl ">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">User Profile</h3>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white hover:bg-blue-800 rounded-full p-1 transition-all"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* --- Profile Header --- */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user.image ? (
              <img
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-blue-200 shadow-lg"
                src={`${BASE_URL}/UserImage/${user.image}`}
                alt={user.name}
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-4 ring-blue-200 shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="text-center sm:text-left">
              <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-blue-600 font-medium">
                <Mail className="w-4 h-4 mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* --- User Details Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact & Personal Details */}
            <InfoCard icon={Phone} label="Mobile Number" value={user.mobile || 'N/A'} />
            <InfoCard icon={Cake} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
            <InfoCard icon={PersonStanding} label="Gender" value={user.gender || 'N/A'} />
            <InfoCard icon={MapPin} label="Location" value={user.city && user.pincode ? `${user.city} - ${user.pincode}` : (user.city || 'N/A')} />
            
            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center col-span-1 md:col-span-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-600">Account Status</p>
                    <span className={`inline-flex px-3 py-1 mt-1 text-sm font-bold rounded-full ${
                        user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                        {user.status}
                    </span>
                </div>
            </div>

            <InfoCard icon={CalendarPlus} label="Created By" value={user.create_user || 'N/A'} subValue={formatDate(user.created_at)} />
            <InfoCard icon={CalendarClock} label="Last Updated By" value={user.update_user || 'N/A'} subValue={formatDate(user.updated_at)} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for displaying info cards
const InfoCard = ({ icon: Icon, label, value, subValue }) => (
  <div className="bg-gray-50 p-4 rounded-lg flex items-start">
    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-1">
      <Icon className="w-5 h-5" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-md font-medium text-gray-900">{value}</p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </div>
  </div>
);


const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/user/users`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      // Sort data by ID in descending order to show newest first
      const sortedData = data.sort((a, b) => b.id - a.id);
      setUsers(sortedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification(`Error fetching users: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/user/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }

      const result = await response.json();
      showNotification(result.message);

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      ));

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          status: selectedUser.status === 'Active' ? 'Inactive' : 'Active'
        });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showNotification(`Error toggling user status: ${error.message}`, 'error');
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/user/get-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      setSelectedUser(userData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showNotification(`Error fetching user details: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const inactiveUsers = users.filter(user => user.status === 'Inactive').length;

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
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search users..."
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={totalUsers} icon={TrendingUp} color="#3B82F6" />
            <StatCard title="Active Users" value={activeUsers} icon={UserCheck} color="#10B981" />
            <StatCard title="Inactive Users" value={inactiveUsers} icon={UserX} color="#EF4444" />
          </div>
        </div>
      </div>

      {/* Users List */}
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
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {currentUsers.map((user, index) => (
                    <tr key={user.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {user.image ? (
                              <img className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-200" src={`${BASE_URL}/UserImage/${user.image}`} alt={user.name} />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                                <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                            : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                         <div>{user.create_user || 'N/A'}</div>
                         <div className="text-xs font-medium text-gray-600">{formatDate(user.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>{user.update_user || 'N/A'}</div>
                        <div className="text-xs font-medium text-gray-600">{formatDate(user.updated_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => getUserDetails(user.id)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              user.status === 'Active'
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-100'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                            }`}
                            title={`${user.status === 'Active' ? 'Deactivate' : 'Activate'} User`}
                          >
                            {user.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentUsers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No users found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setIsModalOpen(false)} />
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

export default User;