import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, X, DollarSign, Calendar, Clock, User, Film, Armchair } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Notification Component
const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <span className="text-xl">×</span>
        </button>
      </div>
    </div>
  );
};

// Modal Component for Booking Details
const BookingDetailsModal = ({ booking, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Handles 'HH:MM:SS' format
    const timeParts = timeString.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  const formatShowDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${dateStr} at ${formatTime(timeString)}`;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Booking Details</h3>
              <p className="text-purple-100 mt-1">Booking ID: #{booking.booking_id}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <Film className="w-6 h-6 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-blue-800">Movie & Show Details</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-blue-600 font-medium text-sm">Movie</p>
                  <p className="text-blue-900 font-bold text-lg">{booking.movie_title}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium text-sm">Cinema</p>
                  <p className="text-blue-900 font-semibold">{booking.cinema_name}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium text-sm">Screen</p>
                  <p className="text-blue-900 font-semibold">{booking.screen_name}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium text-sm">Show Date & Time</p>
                  <p className="text-blue-900 font-semibold">{formatShowDateTime(booking.show_date, booking.show_time)}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium text-sm">Seat(s)</p>
                  <div className="flex items-center space-x-2">
                    <Armchair className="w-4 h-4 text-blue-600" />
                    <p className="text-blue-900 font-semibold">{booking.seat_labels || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-800">Customer Details</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-green-600 font-medium text-sm">Customer Name</p>
                  <p className="text-green-900 font-semibold">{booking.user_name}</p>
                </div>
                <div>
                  <p className="text-green-600 font-medium text-sm">Email</p>
                  <p className="text-green-900 font-semibold">{booking.user_email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-orange-600 mr-2" />
                <h4 className="text-lg font-semibold text-orange-800">Booking Status</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-orange-600 font-medium text-sm">Booking Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                    booking.booking_status === 'Confirmed' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                    booking.booking_status === 'Cancelled' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
                    'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                  }`}>
                    {booking.booking_status}
                  </span>
                </div>
                <div>
                  <p className="text-orange-600 font-medium text-sm">Booking Date</p>
                  <p className="text-orange-900 font-semibold">{formatDate(booking.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <DollarSign className="w-6 h-6 text-purple-600 mr-2" />
                <h4 className="text-lg font-semibold text-purple-800">Payment Details</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-purple-600 font-medium text-sm">Final Amount</p>
                  <p className="text-purple-900 font-bold text-2xl">₹{booking.final_amount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-t border-blue-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal for Canceling Booking
const CancelConfirmationModal = ({ booking, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white rounded-t-2xl">
          <h3 className="text-xl font-bold">Cancel Booking</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to cancel booking #{booking.booking_id} for "{booking.movie_title}"?
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Customer: {booking.user_name} ({booking.user_email})
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Seats: {booking.seat_labels || 'N/A'}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200"
            >
              Keep Booking
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Booking Component
const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isAdmin = !!sessionStorage.getItem('adminToken');
  const isOwner = !!sessionStorage.getItem('ownerToken');
  const isManager = !!sessionStorage.getItem('managerToken');
  const ownerId = sessionStorage.getItem('ownerId');
  const cinemaId = sessionStorage.getItem('cinemaId');

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prevNotifications => [...prevNotifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');
      let url = '';
      let options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      if (isAdmin) {
        url = `${BASE_URL}/api/booking/get-all`;
      } else if (isOwner) {
        url = `${BASE_URL}/api/booking/get-by-owner`;
        options.method = 'POST';
        options.body = JSON.stringify({ owner_id: ownerId });
      } else if (isManager) {
        url = `${BASE_URL}/api/booking/get-by-cinema`;
        options.method = 'POST';
        options.body = JSON.stringify({ cinema_id: cinemaId });
      }

      if (!url) {
        setLoading(false);
        return;
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }

      const data = await response.json();
      const rawBookings = Array.isArray(data) ? data : data.bookings || [];
      // Sort bookings by ID in descending order
      const sortedBookings = rawBookings.sort((a, b) => b.booking_id - a.booking_id);
      setBookings(sortedBookings);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      showNotification(`Error fetching bookings: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');
      const response = await fetch(`${BASE_URL}/api/booking/cancel-booking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: bookingId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      const result = await response.json();
      showNotification(result.message, 'success');
      
      // Re-fetch bookings to get the latest state from the server
      fetchBookings();

      setBookingToCancel(null);
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
      showNotification(`Error canceling booking: ${error.message}`, 'error');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isOwner, isManager, ownerId, cinemaId]);
  
  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const filteredBookings = bookings.filter(booking => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (booking.movie_title && booking.movie_title.toLowerCase().includes(searchTermLower)) ||
      (booking.user_name && booking.user_name.toLowerCase().includes(searchTermLower)) ||
      (booking.user_email && booking.user_email.toLowerCase().includes(searchTermLower)) ||
      (booking.cinema_name && booking.cinema_name.toLowerCase().includes(searchTermLower)) ||
      (booking.booking_id && booking.booking_id.toString().includes(searchTermLower)) ||
      (booking.seat_labels && booking.seat_labels.toLowerCase().includes(searchTermLower));
    
    const matchesStatus = statusFilter === 'All' || booking.booking_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

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

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const timeParts = timeString.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
              <p className="text-gray-600 mt-1">Manage and monitor movie bookings</p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
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
                <option value="Booked">Booked</option>
                <option value="Cancelled">Cancelled</option>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} color="#3B82F6" />
            <StatCard title="Cancelled" value={bookings.filter(b => b.booking_status === 'Cancelled').length} icon={Calendar} color="#EF4444" />
            <StatCard
              title="Total Revenue"
              value={`₹${bookings
                .filter(booking => booking.booking_status !== 'Cancelled')
                .reduce((sum, booking) => sum + parseFloat(booking.final_amount || 0), 0)
                .toFixed(2)}`}
              icon={DollarSign}
              color="#F59E0B"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Movie</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Cinema</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Show Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Show Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Seats</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Booking Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {currentBookings.map((booking, index) => (
                    <tr key={booking.booking_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div className="font-medium text-gray-900">{booking.user_name}</div>
                          <div className="font-medium text-gray-500 text-xs">{booking.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.movie_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div className="font-medium text-gray-900">{booking.cinema_name}</div>
                          <div className="font-medium text-gray-500 text-xs">{booking.screen_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(booking.show_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatTime(booking.show_time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center space-x-1">
                          <Armchair className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{booking.seat_labels || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">₹{booking.final_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          booking.booking_status === 'Confirmed' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                          booking.booking_status === 'Cancelled' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
                          'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
                        }`}>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(booking.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {booking.booking_status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelClick(booking)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                              title="Cancel Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                   {currentBookings.length === 0 && (
                      <tr>
                        <td colSpan="11" className="text-center py-12">
                          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No bookings found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
             {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-purple-100">
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

      {isDetailsModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {isCancelModalOpen && bookingToCancel && (
        <CancelConfirmationModal
          booking={bookingToCancel}
          onConfirm={() => cancelBooking(bookingToCancel.booking_id)}
          onCancel={() => setIsCancelModalOpen(false)}
        />
      )}

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

export default Booking;
