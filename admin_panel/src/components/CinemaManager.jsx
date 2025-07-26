import React, { useState, useEffect } from 'react';
import { Eye, ToggleLeft, ToggleRight, Search, UserCheck, UserX, TrendingUp, Users, X, Info, UserCircle, Calendar } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Reusable Notification Component
const Notification = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
        <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4"><span className="text-xl">×</span></button>
        </div>
    </div>
);

// Reusable Statistics Card Component
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

// Redesigned Attractive Manager Details Modal
const ManagerDetailsModal = ({ manager, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        }).replace(',', '');
    };

    const DetailCard = ({ icon: Icon, title, children }) => (
        <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-blue-600">
                <Icon className="w-6 h-6" />
                <h5 className="text-lg font-bold text-gray-800">{title}</h5>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );

    const InfoRow = ({ icon: Icon, label, value, date }) => (
        <div className="flex items-start space-x-3">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-sm text-gray-600">{value || 'N/A'}</p>
                {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-50 rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 border-b bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{manager.email}</h3>
                            <p className="text-blue-600 font-medium">{manager.cinema_name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow p-6 space-y-6">
                    <DetailCard icon={Info} title="Audit Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow icon={UserCircle} label="Created By" value={manager.create_user} date={formatDate(manager.created_at)} />
                            <InfoRow icon={UserCircle} label="Last Updated By" value={manager.update_user} date={formatDate(manager.updated_at)} />
                        </div>
                    </DetailCard>
                </div>
                <div className="bg-white p-4 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const CinemaManager = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const ownerId = sessionStorage.getItem('ownerId');

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            let url = '';
            let options = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            };

            if (isAdmin) {
                url = `${BASE_URL}/api/cinema-manager/managers`;
            } else if (isOwner) {
                url = `${BASE_URL}/api/cinema-manager/managers-by-owner`;
                options.method = 'POST';
                options.body = JSON.stringify({ owner_id: ownerId });
            }

            if (!url) { setLoading(false); return; }

            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to fetch managers');
            const data = await response.json();
            const sortedData = data.sort((a, b) => b.manager_id - a.manager_id);
            setManagers(sortedData);
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, [isAdmin, isOwner, ownerId]);

    const toggleManagerStatus = async (managerId) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const response = await fetch(`${BASE_URL}/api/cinema-manager/toggle-status`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: managerId })
            });
            if (!response.ok) throw new Error('Failed to toggle status');
            const result = await response.json();
            showNotification(result.message, 'success');
            fetchManagers();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleViewDetails = (manager) => {
        setSelectedManager(manager);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    const filteredManagers = managers.filter(manager => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = manager.email.toLowerCase().includes(searchLower) ||
            (manager.cinema_name && manager.cinema_name.toLowerCase().includes(searchLower));
        const matchesStatus = statusFilter === 'All' || manager.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentManagers = filteredManagers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

    const totalManagers = managers.length;
    const activeManagers = managers.filter(m => m.status === 'active').length;
    const inactiveManagers = managers.filter(m => m.status === 'inactive').length;

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {notifications.map(n => <Notification key={n.id} {...n} onClose={() => setNotifications(p => p.filter(notif => notif.id !== n.id))} />)}
            {isModalOpen && selectedManager && <ManagerDetailsModal manager={selectedManager} onClose={() => setIsModalOpen(false)} />}

            <div className="bg-white shadow-sm border-b border-blue-100">
                <div className="px-6 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Cinema Manager Management</h2>
                            <p className="text-gray-600 mt-1">Manage and monitor manager accounts</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or cinema..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-64 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="All">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={15}>15 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Managers" value={totalManagers} icon={TrendingUp} color="#3B82F6" />
                        <StatCard title="Active Managers" value={activeManagers} icon={UserCheck} color="#10B981" />
                        <StatCard title="Inactive Managers" value={inactiveManagers} icon={UserX} color="#EF4444" />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                {loading ? <div className="text-center p-12">Loading...</div> : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Manager</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Assigned Cinema</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Created</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Updated</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentManagers.map((manager, index) => (
                                        <tr key={manager.manager_id} className="hover:bg-blue-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{manager.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{manager.cinema_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {manager.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="font-medium text-gray-900">{manager.create_user || 'N/A'}</div>
                                                <div className="text-xs font-medium text-gray-500">{formatDate(manager.created_at)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="font-medium text-gray-900">{manager.update_user || 'N/A'}</div>
                                                <div className="text-xs font-medium text-gray-500">{formatDate(manager.updated_at)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleViewDetails(manager)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-100" title="View Details">
                                                        <Eye size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleManagerStatus(manager.manager_id)}
                                                        className={`p-2 rounded-lg ${manager.status === 'active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                                                        title={manager.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {manager.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredManagers.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-12 text-gray-500">
                                                <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                                No managers found.
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
        </div>
    );
};

export default CinemaManager;
