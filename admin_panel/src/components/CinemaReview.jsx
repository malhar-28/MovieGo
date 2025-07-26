import React, { useState, useEffect } from 'react';
import { Eye, ToggleLeft, ToggleRight, Search, Star, X, User, Film, CheckCircle, XCircle, Users, Info, UserCircle, Calendar } from 'lucide-react';
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
const ReviewDetailsModal = ({ review, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
        }).replace(',', '');
    };

    const RatingStars = ({ rating }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i < rating ? 'currentColor' : 'none'}
                />
            ))}
            <span className="ml-2 text-xl font-bold text-gray-700">{rating}.0</span>
        </div>
    );

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Review Details</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-blue-100 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow bg-gray-50">
                    <div className="p-6 space-y-6">
                        {/* Rating and Comment Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="mb-4">
                                <h5 className="text-lg font-bold text-gray-800 mb-3">Rating & Comment</h5>
                                <RatingStars rating={review.rating} />
                            </div>
                            {review.comment && (
                                <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                                    <p className="text-gray-700 italic">"{review.comment}"</p>
                                </blockquote>
                            )}
                        </div>

                        {/* User and Cinema Info Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h5 className="text-lg font-bold text-gray-800 mb-4">Author & Cinema</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-4">
                                    {review.user_image ? (
                                        <img className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-200" src={`${BASE_URL}/UserImage/${review.user_image}`} alt={review.user_name} />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                                            <span className="text-2xl font-bold text-white">{review.user_name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500">User</p>
                                        <p className="font-semibold text-gray-900">{review.user_name}</p>
                                        <p className="text-sm text-gray-600">{review.user_email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Cinema</p>
                                        <p className="font-semibold text-gray-900">{review.cinema_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Info Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h5 className="text-lg font-bold text-gray-800 mb-4">System Information</h5>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    <span className={`inline-flex items-center px-3 py-1 font-bold rounded-full ${review.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {review.status === 'Active' ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                                        {review.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Created At:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(review.created_at)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Last Updated:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(review.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main CinemaReview Component
const CinemaReview = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Check user type and get IDs
    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const isManager = !!sessionStorage.getItem('managerToken');
    const ownerId = sessionStorage.getItem('ownerId');
    const cinemaId = sessionStorage.getItem('cinemaId');
    const userEmail = sessionStorage.getItem('adminEmail') || sessionStorage.getItem('ownerEmail') || sessionStorage.getItem('managerEmail');

    // Notification handlers
    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 3000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
        });
    };

    // Fetch reviews based on user type
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');
            let endpoint = '';
            let options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (isAdmin) {
                endpoint = `${BASE_URL}/api/review/get-all-review`;
            } else if (isOwner) {
                endpoint = `${BASE_URL}/api/review/get-by-owner`;
                options.method = 'POST';
                options.body = JSON.stringify({ owner_id: ownerId });
            } else if (isManager) {
                endpoint = `${BASE_URL}/api/review/cinema-reviews`;
                options.method = 'POST';
                options.body = JSON.stringify({ cinema_id: cinemaId });
            }

            if (!endpoint) {
                setLoading(false);
                return;
            }

            const response = await fetch(endpoint, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch reviews');
            }

            const data = await response.json();
            const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.review_id - a.review_id);
            setReviews(sortedData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Toggle review status
    const toggleReviewStatus = async (reviewId) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');
            const response = await fetch(`${BASE_URL}/api/review/toggle-review`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    review_id: reviewId,
                    update_user: userEmail
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to toggle status');
            }

            const result = await response.json();
            showNotification(result.message);
            fetchReviews(); // Re-fetch to ensure data consistency
        } catch (error) {
            console.error('Error toggling status:', error);
            showNotification(error.message, 'error');
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, isOwner, isManager]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    // Filter reviews based on search and status
    const filteredReviews = reviews.filter(review => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch =
            (review.user_name && review.user_name.toLowerCase().includes(searchTermLower)) ||
            (review.user_email && review.user_email.toLowerCase().includes(searchTermLower)) ||
            (review.cinema_name && review.cinema_name.toLowerCase().includes(searchTermLower)) ||
            (review.comment && review.comment.toLowerCase().includes(searchTermLower));
        const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-blue-100">
                <div className="px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isAdmin ? 'All Cinema Reviews' : isOwner ? "My Cinemas' Reviews" : 'My Cinema Reviews'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {isAdmin ? 'Manage all cinema reviews' : 'Manage reviews for your cinema(s)'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, cinema..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={15}>15 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Reviews"
                            value={reviews.length}
                            icon={Star}
                            color="#3B82F6"
                        />
                        <StatCard
                            title="Active Reviews"
                            value={reviews.filter(r => r.status === 'Active').length}
                            icon={Star}
                            color="#10B981"
                        />
                        <StatCard
                            title="Inactive Reviews"
                            value={reviews.filter(r => r.status === 'Inactive').length}
                            icon={Star}
                            color="#EF4444"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
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
                                        {(isAdmin || isOwner) && <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Cinema</th>}
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Comment</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentReviews.length > 0 ? (
                                        currentReviews.map((review, index) => (
                                            <tr key={review.review_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 flex-shrink-0">
                                                            {review.user_image ? (
                                                                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-200" src={`${BASE_URL}/UserImage/${review.user_image}`} alt={review.user_name} />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                                                                    <span className="text-lg font-bold text-white">{review.user_name.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{review.user_name}</div>
                                                            <div className="text-xs font-medium  text-gray-500">{review.user_email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {(isAdmin || isOwner) && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900">{review.cinema_name}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <div className="flex items-center">
                                                        {review.rating}
                                                        <Star className="ml-1 w-4 h-4 text-yellow-400 fill-current" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-sm text-gray-900 max-w-sm">
                                                    {review.comment && review.comment.length > 100
                                                        ? `${review.comment.substring(0, 100)}...`
                                                        : review.comment}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatDate(review.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${review.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                                                        }`}>
                                                        {review.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedReview(review);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                                                            title="View details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleReviewStatus(review.review_id)}
                                                            className={`p-2 rounded-lg transition-all ${review.status === 'Active'
                                                                ? 'text-red-600 hover:text-red-800 hover:bg-red-100'
                                                                : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                                                }`}
                                                            title={review.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {review.status === 'Active' ? (
                                                                <ToggleRight className="w-5 h-5" />
                                                            ) : (
                                                                <ToggleLeft className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin || isOwner ? 8 : 7} className="py-12 text-center text-gray-500">
                                                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-lg">No reviews found</p>
                                                <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
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

            {/* Review Details Modal */}
            {isModalOpen && selectedReview && (
                <ReviewDetailsModal
                    review={selectedReview}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Notifications */}
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

export default CinemaReview;
