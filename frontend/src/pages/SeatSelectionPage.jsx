import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'; // Using react-icons for spinner and back arrow
import Navbar from '../components/Navbar';
import showtimeService from '../services/showtimeService';
import movieService from '../services/movieService';
import cinemaService from '../services/cinemaService';
import screenService from '../services/screenService';
import bookingService from '../services/bookingService';

const SeatSelectionPage = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [showtime, setShowtime] = useState(null);
    const [movie, setMovie] = useState(null);
    const [cinema, setCinema] = useState(null);
    const [screen, setScreen] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBooking, setIsBooking] = useState(false); // State to manage booking loading

    // Determines the background color of a seat based on its type, selection status, and reservation status
    const getSeatColor = useCallback((seatType, isSelected, isReserved) => {
        if (isReserved) return 'bg-gray-500'; // Gray for reserved seats
        if (isSelected) return 'bg-blue-600'; // Blue for selected seats
        switch (seatType) {
            case 'CLASSIC': return 'bg-green-500'; // Green for Classic seats
            case 'PRIME': return 'bg-purple-600'; // Purple for Prime seats
            case 'PRIME_PLUS': return 'bg-orange-500'; // Orange for Prime Plus seats
            case 'RECLINER': return 'bg-blue-500'; // Blue for Recliner seats
            default: return 'bg-gray-200'; // Light gray for unknown/default seat types
        }
    }, []);

    // Determines the text color of a seat based on its selection and reservation status
    const getSeatTextColor = useCallback((seat, isSelected, isReserved) => {
        if (isReserved || isSelected) return 'text-white'; // White text for reserved or selected seats
        return 'text-gray-900'; // Dark text for available seats
    }, []);

    // Fetches all necessary details for the showtime, movie, cinema, screen, and available seats
    const fetchShowtimeDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedShowtime = await showtimeService.getShowtimeById(showtimeId);
            setShowtime(fetchedShowtime);

            const pricesMap = {};
            if (fetchedShowtime.seat_type_prices) {
                fetchedShowtime.seat_type_prices.forEach(item => {
                    if (item.seat_type) {
                        pricesMap[item.seat_type.toUpperCase()] = parseFloat(item.price) || 0;
                    }
                });
            }

            const fetchedMovie = await movieService.getMovieById(fetchedShowtime.movie_id);
            setMovie(fetchedMovie);

            // Ensure screen_id is available before fetching screen details
           console.log('Showtime:', fetchedShowtime);
console.log('screen_id:', fetchedShowtime.screen_id);

const currentScreen = fetchedShowtime.screen_id
    ? await screenService.getScreenById(fetchedShowtime.screen_id)
    : null;
console.log('Fetched screen:', currentScreen);

setScreen(currentScreen);


            // Ensure cinema_id is available before fetching cinema details
            const fetchedCinema = currentScreen?.cinema_id
                ? await cinemaService.getCinemaById(currentScreen.cinema_id)
                : null;
            setCinema(fetchedCinema);

            const allSeatsForScreen = currentScreen?.screen_id
                ? await screenService.getSeatsByScreenId(currentScreen.screen_id)
                : [];

            const bookedSeatsResponse = await showtimeService.getBookedSeatsForShowtime(showtimeId);
            const bookedSeatIds = new Set(bookedSeatsResponse.map(seat => seat.seat_id));

            // Combines seat information with their status (available/reserved) and price
            const combinedSeats = allSeatsForScreen.map(seat => {
                const seatType = (seat.seat_type || seat.type || '').toUpperCase();
                return {
                    ...seat,
                    seat_type: seatType,
                    status: bookedSeatIds.has(seat.seat_id) ? 'reserved' : 'available',
                    price: pricesMap[seatType] ?? 0,
                    // Ensure seat_label and row_char are available for rendering
                    seat_label: seat.seat_label || `${seat.row_char}${seat.seat_number}`,
                    row_char: seat.row_char || seat.seat_label.charAt(0).toUpperCase(),
                };
            });

            setAvailableSeats(combinedSeats || []);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to load seat selection.";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    }, [showtimeId]);

    // Effect hook to fetch showtime details on component mount or showtimeId change
    useEffect(() => {
        fetchShowtimeDetails();
    }, [fetchShowtimeDetails]);

    // Handles seat click events, toggling selection or showing a booked message
    const handleSeatClick = useCallback((seat) => {
        if (seat.status === 'reserved') {
            toast.info(`Seat ${seat.seat_label} is already booked.`, { position: "bottom-right" });
            return;
        }

        setSelectedSeats(prev => {
            const isCurrentlySelected = prev.includes(seat.seat_id);
            if (isCurrentlySelected) {
                return prev.filter(s => s !== seat.seat_id);
            } else {
                // Limit selection to 10 seats
                if (prev.length < 10) {
                    return [...prev, seat.seat_id];
                } else {
                    toast.warn('You can select a maximum of 10 seats.', { position: "bottom-right" });
                    return prev;
                }
            }
        });
    }, []);

    // Handles the ticket booking process
    const handleBookTicket = async () => {
        if (selectedSeats.length === 0) {
            toast.warn('Please select at least one seat.', { position: "bottom-right" });
            return;
        }
        setIsBooking(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;
            if (!token) {
                toast.error('You are not authenticated.', { position: "top-center" });
                navigate('/login');
                setIsBooking(false); // Ensure booking state is reset
                return;
            }
            const response = await bookingService.createBooking({
                showtime_id: showtimeId,
                seat_ids: selectedSeats,
                payment_method: 'Card' // Assuming 'Card' as default payment method
            });
            if (response) {
                toast.success('Booking successful!', { position: "top-center" });
                await fetchShowtimeDetails(); // Refresh seat status after booking
                setSelectedSeats([]); // Clear selected seats
                navigate('/booking-history'); // Navigate to booking history
            }
        } catch (err) {
            console.error('Booking failed:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to create booking.';
            toast.error(errorMessage, { position: "top-center" });
        } finally {
            setIsBooking(false);
        }
    };

    // Calculates the total price of selected seats
    const calculateTotalPrice = useMemo(() => {
        let total = 0;
        selectedSeats.forEach(seatId => {
            const seat = availableSeats.find(s => s.seat_id === seatId);
            if (seat?.price) {
                total += parseFloat(seat.price);
            }
        });
        return total;
    }, [selectedSeats, availableSeats]);

    // Structures seats by seat type, then position (e.g., left, center, right), then row character
    const structuredSeats = useMemo(() => {
        const seatsByTypeAndPosition = {};

        availableSeats.forEach(seat => {
            const seatType = (seat.seat_type || 'UNKNOWN').toUpperCase();
            const position = seat.position || 'full'; // Default to 'full' if position is not specified
            // Initialize nested objects if they don't exist
            if (!seatsByTypeAndPosition[seatType]) {
                seatsByTypeAndPosition[seatType] = {};
            }
            if (!seatsByTypeAndPosition[seatType][position]) {
                seatsByTypeAndPosition[seatType][position] = {};
            }
            const rowChar = seat.row_char || seat.seat_label.charAt(0).toUpperCase();
            if (!seatsByTypeAndPosition[seatType][position][rowChar]) {
                seatsByTypeAndPosition[seatType][position][rowChar] = [];
            }
            seatsByTypeAndPosition[seatType][position][rowChar].push(seat);
        });

        // Sort seats within each row by seat number for correct display order
        Object.keys(seatsByTypeAndPosition).forEach(seatType => {
            Object.keys(seatsByTypeAndPosition[seatType]).forEach(position => {
                Object.keys(seatsByTypeAndPosition[seatType][position]).forEach(rowChar => {
                    seatsByTypeAndPosition[seatType][position][rowChar].sort((a, b) => {
                        const aNum = parseInt(a.seat_label.replace(/\D/g, ''));
                        const bNum = parseInt(b.seat_label.replace(/\D/g, ''));
                        return aNum - bNum;
                    });
                });
            });
        });

        return seatsByTypeAndPosition;
    }, [availableSeats]);

    // Defines the preferred order for displaying seat types
    const seatTypeOrder = ['CLASSIC', 'PRIME', 'PRIME_PLUS', 'RECLINER'];

    // Helper function for rendering individual seat buttons
    const renderSeatButton = useCallback((seat) => {
        const isSelected = selectedSeats.includes(seat.seat_id);
        const isReserved = seat.status === 'reserved';
        // Extract just the number from seat_label (e.g., 'A1' -> '1')
        const seatNumberDisplay = seat.seat_label ? seat.seat_label.replace(seat.row_char, '') : '';

        const seatClasses = `
            w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            m-1 rounded-md flex items-center justify-center
            text-xs sm:text-sm font-semibold
            transition-all duration-200 ease-in-out transform
            ${isReserved ? 'bg-gray-500 text-white cursor-not-allowed opacity-70' : ''}
            ${isSelected ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-lg' : ''}
            ${!isReserved && !isSelected ? `${getSeatColor(seat.seat_type, false, false)} ${getSeatTextColor(seat, false, false)} border border-gray-300 hover:opacity-80` : ''}
            ${!isReserved ? 'hover:scale-105' : ''}
        `;

        return (
            <button
                key={seat.seat_id}
                onClick={() => handleSeatClick(seat)}
                disabled={isReserved}
                className={seatClasses}
                title={isReserved ? 'Reserved' : `Seat ${seat.seat_label} (${seat.seat_type}) - ₹${seat.price}`}
            >
                {seatNumberDisplay}
            </button>
        );
    }, [selectedSeats, handleSeatClick, getSeatColor, getSeatTextColor]);

    // Renders rows of seats for a given seat type, handling different positions within a row
    const renderSeatRows = useCallback((seatsByPosition) => {
        // Collect all unique row characters across all positions for the current seat type
        const allRows = new Set();
        Object.values(seatsByPosition).forEach(positionRows => {
            Object.keys(positionRows).forEach(rowChar => allRows.add(rowChar));
        });

        const sortedRowChars = Array.from(allRows).sort();

        return (
            <div className="flex flex-col gap-2">
                {sortedRowChars.map(rowChar => {
                    const leftSeats = seatsByPosition['left']?.[rowChar] || [];
                    const middleSeats = seatsByPosition['middle']?.[rowChar] || [];
                    const rightSeats = seatsByPosition['right']?.[rowChar] || [];
                    const fullSeats = seatsByPosition['full']?.[rowChar] || [];

                    // Determine if this row has split positions (left/middle/right) or is a single 'full' block
                    const hasSplitPositions = leftSeats.length > 0 || middleSeats.length > 0 || rightSeats.length > 0;
                    const isOnlyFull = fullSeats.length > 0 && !hasSplitPositions;

                    return (
                        <div
                            key={rowChar}
                            className={`flex flex-row items-center w-full gap-4
                                ${isOnlyFull ? 'justify-center' : 'justify-between'}
                            `}
                        >
                            {/* Row character label (e.g., 'A', 'B') */}
                            <span className="min-w-[20px] text-center text-gray-300 text-sm font-bold flex-shrink-0">
                                {rowChar}
                            </span>

                            {/* Container for all seat position groups within this row */}
                            <div className={`flex flex-row items-center flex-grow gap-4 flex-nowrap
                                ${isOnlyFull ? 'justify-center' : 'justify-between'}
                            `}>
                                {/* Render left group */}
                                {leftSeats.length > 0 && (
                                    <div className="flex gap-1 justify-start">
                                        {leftSeats.map(seat => renderSeatButton(seat))}
                                    </div>
                                )}

                                {/* Render middle group */}
                                {middleSeats.length > 0 && (
                                    <div className="flex gap-1 flex-grow justify-center">
                                        {middleSeats.map(seat => renderSeatButton(seat))}
                                    </div>
                                )}

                                {/* Render right group */}
                                {rightSeats.length > 0 && (
                                    <div className="flex gap-1 justify-end">
                                        {rightSeats.map(seat => renderSeatButton(seat))}
                                    </div>
                                )}

                                {/* Render full group (only if it's the exclusive content for this row) */}
                                {isOnlyFull && (
                                    <div className="flex gap-1 flex-grow justify-center">
                                        {fullSeats.map(seat => renderSeatButton(seat))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [renderSeatButton]);


    // Displays a loading spinner and message while data is being fetched
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                    <FaSpinner className="animate-spin text-blue-400 text-6xl" />
                    <p className="ml-4 text-xl">Loading seat information...</p>
                </div>
            </>
        );
    }

    // Displays an error message if data fetching fails
    if (error || !movie || !showtime || !cinema || !screen) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4">
                    <p className="text-red-500 text-xl font-semibold mb-4">Error: {error || 'Details not available.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Go to Home
                    </button>
                </div>
            </>
        );
    }

    // Format date and time for display
    const showDateFormatted = showtime?.show_date
        ? new Date(showtime.show_date).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        })
        : 'N/A';

    const showTimeFormatted = showtime?.show_time
        ? new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : 'N/A';


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col">
            <Navbar />

            {/* MODIFICATION: Main content wrapper is now full-width */}
            <div className="relative w-full flex-grow flex flex-col bg-gray-800 overflow-hidden">
                
                {/* Header section (non-scrolling) */}
                <div className="flex-shrink-0 p-6 sm:p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 text-gray-400 hover:text-white transition duration-300 z-10 p-2 rounded-full hover:bg-gray-700"
                        aria-label="Go back"
                    >
                        <FaArrowLeft className="text-2xl" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-2">
                                {movie?.title || 'N/A'}
                            </h1>
                            <p className="text-lg text-gray-300 mb-4">{movie?.genre || 'N/A'}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-200 text-sm sm:text-base max-w-4xl mx-auto">
                                <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
                                    <p className="font-semibold text-blue-300">Cinema:</p>
                                    <p>{cinema?.name || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
                                    <p className="font-semibold text-blue-300">Screen:</p>
                                   <p>{screen?.screen_name || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
                                    <p className="font-semibold text-blue-300">Date:</p>
                                    <p>{showDateFormatted}</p>
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
                                    <p className="font-semibold text-blue-300">Time:</p>
                                    <p>{showTimeFormatted}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODIFICATION: Main body container with padding */}
                <div className="flex-grow flex flex-col lg:flex-row lg:space-x-8 mt-4 overflow-hidden px-6 sm:px-8 pb-8">
                    
                    {/* MODIFICATION: Seat Layout Section is now scrollable and contains the screen indicator */}
                    <div className="flex-grow bg-gray-700 p-6 rounded-xl shadow-inner border border-gray-600 mb-8 lg:mb-0 overflow-auto flex flex-col">
                        <div className="flex-grow">
                            <div className="inline-block min-w-full">
                                {/* MODIFICATION: Screen indicator moved here */}
                                <div className="w-full mb-6">
                                    <div className="bg-gray-900 text-white text-center py-2 rounded-t-lg font-semibold text-md shadow-md">
                                        SCREEN THIS WAY
                                    </div>
                                    <div className="bg-gray-900 h-1.5 rounded-b-full shadow-inner"></div>
                                </div>

                                {seatTypeOrder.map(seatType => {
                                    const seatsByPosition = structuredSeats[seatType];
                                    if (!seatsByPosition || Object.keys(seatsByPosition).length === 0) return null;

                                    return (
                                        <div key={seatType} className="mb-4">
                                            <h3 className="font-bold text-center text-blue-300 text-lg mb-2 uppercase border-b border-dashed border-blue-500 pb-1">
                                                {seatType.replace('_', ' ')}
                                            </h3>
                                            {renderSeatRows(seatsByPosition)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Seat Legend */}
                        <div className="flex-shrink-0 flex flex-wrap justify-center gap-4 mt-8 pt-4 border-t border-gray-600 text-gray-200 text-sm">
                            {['CLASSIC', 'PRIME', 'PRIME_PLUS', 'RECLINER'].map(type => (
                                <div key={type} className="flex items-center">
                                    <span className={`w-5 h-5 ${getSeatColor(type, false, false)} rounded-sm mr-2 shadow-sm`}></span>
                                    <span>{type.replace('_', ' ')}</span>
                                </div>
                            ))}
                            <div className="flex items-center">
                                <span className="w-5 h-5 bg-blue-600 rounded-sm mr-2 shadow-sm"></span>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-5 h-5 bg-gray-500 rounded-sm mr-2 shadow-sm"></span>
                                <span>Reserved</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary Card (Static on the right for large screens) */}
                    <div className="lg:w-96 flex-shrink-0 bg-gray-700 p-6 rounded-xl shadow-inner border border-gray-600">
                        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Booking Summary</h2>

                        <div className="space-y-4 text-gray-200">
                            <div>
                                <p className="font-semibold text-blue-300">Movie:</p>
                                <p>{movie?.title || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Cinema:</p>
                                <p>{cinema?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Screen:</p>
                                 <p>{screen?.screen_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Date & Time:</p>
                                <p>{showDateFormatted} at {showTimeFormatted}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Selected Seats:</p>
                                <p className="flex flex-wrap gap-2">
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map(seatId => {
                                            const seat = availableSeats.find(s => s.seat_id === seatId);
                                            return seat ? (
                                                <span key={seatId} className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm shadow-md">
                                                    {seat.seat_label} ({seat.seat_type})
                                                </span>
                                            ) : null;
                                        })
                                    ) : (
                                        <span className="text-gray-400">No seats selected</span>
                                    )}
                                </p>
                            </div>
                            <div className="border-t border-gray-600 pt-4 flex justify-between items-center text-xl font-bold">
                                <p className="text-blue-300">Total Price:</p>
                                <p className="text-green-400">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(calculateTotalPrice)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleBookTicket}
                            disabled={selectedSeats.length === 0 || isBooking}
                            className={`mt-6 w-full py-3 rounded-lg text-lg font-bold transition-all duration-300 shadow-lg
                                ${selectedSeats.length === 0 || isBooking
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 transform hover:scale-105'
                                }
                            `}
                        >
                            {isBooking ? (
                                <FaSpinner className="animate-spin mx-auto text-xl" />
                            ) : (
                                'Book Ticket'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
