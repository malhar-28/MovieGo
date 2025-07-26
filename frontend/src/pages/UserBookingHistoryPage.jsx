import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingService from '../services/bookingService';
import moment from 'moment';
import Navbar from '../components/Navbar';
import { FaInfoCircle, FaSpinner, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UserBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10); // Default records per page
  const navigate = useNavigate();

  // Define BASE_BACKEND_URL here for consistency with other pages
  // const BASE_BACKEND_URL = 'http://localhost:5000'; // IMPORTANT: Adjust this to your actual backend URL
  const BASE_BACKEND_URL =  import.meta.env.VITE_BASE_URL;
  const formatDateForDisplay = (date, time) => {
    const dateTimeString = `${date} ${time}`;
    const dateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');

    if (!dateTime.isValid()) {
      return { formattedDate: 'Invalid Date', formattedTime: 'Invalid Time' };
    }

    return {
      formattedDate: dateTime.format('ddd, D MMM YYYY'),
      formattedTime: dateTime.format('HH:mm') + ' WIB'
    };
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingsData = await bookingService.getUserBookings();
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to load booking history');
      console.error('Error fetching bookings:', err);
      toast.error(err.response?.data?.error || err.message || 'Failed to load booking history', { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (e, bookingId, showDate, showTime) => {
    e.stopPropagation(); // Prevent row click from triggering
    const showDateTime = moment(`${showDate} ${showTime}`, 'YYYY-MM-DD HH:mm:ss');
    if (!showDateTime.isValid()) {
      toast.error('Invalid showtime information for cancellation.', { position: "top-right" });
      return;
    }

    const currentTime = moment();
    const hoursDifference = showDateTime.diff(currentTime, 'hours');
    if (hoursDifference <= 1) {
      toast.error('Cannot cancel booking less than 1 hour before showtime.', { position: "top-right" });
      return;
    }

    // Using window.confirm as per previous implementation, but ideally replaced with custom modal
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true); // Show loading during cancellation
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully', { position: "top-right" });
        await fetchBookings(); // Re-fetch to update status
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to cancel booking';
        toast.error(errorMessage, { position: "top-right" });
        console.error('Error canceling booking:', err);
      } finally {
        setLoading(false); // Hide loading after cancellation attempt
      }
    }
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/ticket/${bookingId}`);
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const filteredAndSearchedBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (filter === 'booked' && booking.booking_status !== 'Booked') return false;
      if (filter === 'cancelled' && booking.booking_status !== 'Cancelled') return false;

      const query = searchQuery.toLowerCase();
      if (!query) return true;

      const { formattedDate, formattedTime } = formatDateForDisplay(booking.show_date, booking.show_time);
      const bookedSeats = Array.isArray(booking.booked_seats_details) ? booking.booked_seats_details.map(s => s.seat_label).join(', ') : '';
      const bookedOnDate = moment(booking.created_at).format('ddd, D MMM YYYY h:mm A');

      return (
        booking.movie_title.toLowerCase().includes(query) ||
        booking.cinema_name.toLowerCase().includes(query) ||
        booking.screen_name.toLowerCase().includes(query) ||
        formattedDate.toLowerCase().includes(query) ||
        formattedTime.toLowerCase().includes(query) ||
        String(booking.final_amount).toLowerCase().includes(query) ||
        String(booking.booking_id).toLowerCase().includes(query) ||
        bookedOnDate.toLowerCase().includes(query) ||
        bookedSeats.toLowerCase().includes(query)
      );
    });
  }, [bookings, filter, searchQuery]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAndSearchedBookings.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAndSearchedBookings.length / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when records per page changes
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-8 mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Loading bookings...
            </h2>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
        <Navbar onSearch={handleSearch} />
        <div className="flex-grow flex items-center justify-center text-center py-5 container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-red-400 font-semibold">
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col text-gray-800 relative overflow-hidden">
      {/* Background decoration consistent with other pages */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Navbar onSearch={handleSearch} />

      <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Updated "Your Booking History" title with gradient text */}
          <h1 className="text-4xl sm:text-5xl font-black text-[#0B193F] text-center sm:text-left">
            Your Booking History
          </h1>
          <div className="relative w-full sm:w-auto min-w-[150px]">
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }} // Reset to first page on filter change
              className="block w-full px-4 py-2 pr-8 rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 appearance-none"
            >
              <option value="all">All</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {filteredAndSearchedBookings.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-lg">
            <div className="text-6xl text-gray-300 mb-4">
              <FaTicketAlt className="mx-auto" />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-3">
              No bookings found
            </p>
            <p className="text-gray-500 text-lg mb-6">
              You haven't made any bookings yet or your search criteria yielded no results.
            </p>
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Browse Movies
              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Movie Title
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Cinema & Screen
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Show Time
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Seats
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Booked On
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map(booking => {
                  const { formattedDate, formattedTime } = formatDateForDisplay(booking.show_date, booking.show_time);
                  const canCancel = moment(`${booking.show_date} ${booking.show_time}`, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'hours') > 1 && booking.booking_status === 'Booked';
                  const posterUrl = booking.poster_image
                    ? `${BASE_BACKEND_URL}/MovieImages/${booking.poster_image}`
                    : 'https://placehold.co/40x60/E0E0E0/333333?text=No+Poster'; // Smaller placeholder

                  return (
                    <tr
                      key={booking.booking_id}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors duration-200 ${booking.booking_status === 'Cancelled' ? 'bg-gray-50 text-gray-500 opacity-90' : ''}`}
                      onClick={() => handleBookingClick(booking.booking_id)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                            <img className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover" src={posterUrl} alt={booking.movie_title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/40x60/E0E0E0/333333?text=No+Poster';
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{booking.movie_title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {booking.cinema_name} - {booking.screen_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {formattedDate} at {formattedTime}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {Array.isArray(booking.booked_seats_details) ? booking.booked_seats_details.map(s => s.seat_label).join(', ') : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-[#0B193F] whitespace-nowrap">
                        Rp {booking.final_amount}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 whitespace-nowrap">
                        {booking.booking_id}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 whitespace-nowrap">
                        {moment(booking.created_at).format('ddd, D MMM YYYY h:mm A')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.booking_status === 'Booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-col items-start">
                          <button
                            onClick={(e) => handleCancelBooking(e, booking.booking_id, booking.show_date, booking.show_time)}
                            disabled={!canCancel}
                            className={`px-4 py-2 text-sm rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75
                              ${canCancel
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                                : 'bg-gray-400 cursor-not-allowed opacity-70'
                              }`
                            }
                          >
                            {booking.booking_status === 'Cancelled' ? 'Cancelled' : (canCancel ? 'Cancel Booking' : 'Cancellation Closed')}
                          </button>
                          {!canCancel && booking.booking_status === 'Booked' && (
                            <p className="text-red-500 text-xs mt-1">
                              Cannot cancel within 1 hr
                            </p>
                          )}
                          {booking.booking_status === 'Cancelled' && (
                            <p className="text-orange-500 text-xs mt-1">
                              Booking cancelled.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center gap-2 mb-4 sm:mb-0">
                <span className="text-sm text-gray-700">Records per page:</span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="block px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition duration-200"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserBookingHistoryPage;
