import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cinemaService from '../services/cinemaService';
import reviewService from '../services/reviewService';
import screenService from '../services/screenService';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import Navbar from '../components/Navbar';
import {
  FaStar, FaRegStar, FaMapMarkerAlt, FaEdit, FaTrashAlt, FaInfoCircle, FaSpinner, FaCalendarAlt
} from 'react-icons/fa';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
const API_KEY=import.meta.env.VITE_API_KEY;

// Define BASE_BACKEND_URL here for demonstration purposes.
// In a real application, this should come from a centralized config or the service file itself.
// This is crucial for the image URL to be constructed correctly.
// const BASE_BACKEND_URL = 'http://localhost:5000'; // <<<--- IMPORTANT: Adjust this to your actual backend URL
const BASE_BACKEND_URL =  import.meta.env.VITE_BASE_URL; // <<<--- IMPORTANT: Adjust this to your actual backend URL

// Custom Star Rating Input Component for fractional values with drag-to-select and direct click
const StarRatingInput = ({ rating, setRating, precision = 0.01 }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const starContainerRef = useRef(null);

  const calculateRatingFromMouseEvent = useCallback((e) => {
    if (!starContainerRef.current) return 0;

    const { left, width } = starContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    // Calculate rating based on mouse position relative to the total width of 5 stars
    let newRating = (mouseX / width) * 5;
    // Clamp the rating between 0 and 5
    newRating = Math.min(5, Math.max(0, newRating));
    // Round to the specified precision
    return parseFloat(newRating.toFixed(precision === 0.01 ? 2 : 0));
  }, [precision]);

  const handleMouseMove = useCallback((e) => {
    const newRating = calculateRatingFromMouseEvent(e);
    setHoverRating(newRating);
    if (isMouseDown) { // Only update actual rating if mouse is down (dragging)
      setRating(newRating);
    }
  }, [calculateRatingFromMouseEvent, isMouseDown, setRating]);

  const handleMouseDown = useCallback((e) => {
    setIsMouseDown(true);
    const newRating = calculateRatingFromMouseEvent(e);
    setRating(newRating); // Set initial rating on mouse down/click
  }, [calculateRatingFromMouseEvent, setRating]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    // Do NOT reset hoverRating here. Let handleMouseLeave do it to maintain visual feedback.
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverRating(0); // Reset hover state when mouse leaves the container
    setIsMouseDown(false); // Ensure mouse down state is reset
  }, []);

  // Determine which rating to display (hovered value or actual state value)
  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div
      ref={starContainerRef}
      className="flex items-center cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role="slider"
      aria-valuenow={rating}
      aria-valuemin="0"
      aria-valuemax="5"
      aria-label="Rating input"
    >
      {[1, 2, 3, 4, 5].map((index) => {
        // Calculate the fill percentage for each star
        const fillPercentage = Math.max(0, Math.min(100, (displayRating - (index - 1)) * 100));

        return (
          <div key={index} className="relative text-3xl"> {/* text-3xl sets the size of the star icon */}
            {/* Background (empty) star */}
            <FaStar className="text-gray-300" />
            {/* Foreground (filled) star with dynamic width for partial fill */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <FaStar className="text-yellow-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
};


const CinemaDetailPage = () => {
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  // All useState, useEffect, useCallback, and useMemo hooks must be declared at the top level
  // before any conditional returns.
  const [cinema, setCinema] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allScreens, setAllScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [editReviewId, setEditReviewId] = useState(null);
  const [filter, setFilter] = useState({ rating: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // For Navbar search
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [drivingDistance, setDrivingDistance] = useState(null);


  // Function to fetch driving distance using OpenRouteService API
  const fetchDrivingDistance = useCallback(async (origin, destination) => {
    // NOTE: Replace with your actual OpenRouteService API key.
    // This key is a placeholder and may not be valid or functional.
     const apiKey = `${API_KEY}=`; 
    if (!apiKey || apiKey === 'YOUR_OPENROUTESERVICE_API_KEY') {
        console.warn("OpenRouteService API Key is not set. Distance calculation will not work.");
        setLocationError("OpenRouteService API Key is missing. Cannot show distance.");
        return null;
    }

    try {
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [origin.longitude, origin.latitude],
            [destination.longitude, destination.latitude]
          ]
        })
      });
      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        const meters = data.routes[0].summary.distance;
        const km = (meters / 1000).toFixed(1);
        return `${km} km`;
      } else {
        console.error('ORS distance error: No routes found', data);
        setLocationError("Could not calculate driving distance.");
        return null;
      }
    } catch (error) {
      console.error('ORS distance fetch error:', error);
      setLocationError("Error fetching driving distance.");
      return null;
    }
  }, []);

  // Fetch user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Location access denied. Cannot show distance.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation not supported. Cannot show distance.");
    }
  }, []);

  // Fetch driving distance to the cinema
  useEffect(() => {
    const fetchDistance = async () => {
      if (userLocation && cinema && cinema.latitude && cinema.longitude) {
        const distance = await fetchDrivingDistance(userLocation, {
          latitude: parseFloat(cinema.latitude),
          longitude: parseFloat(cinema.longitude)
        });
        setDrivingDistance(distance);
      }
    };

    fetchDistance();
  }, [userLocation, cinema, fetchDrivingDistance]); // Added fetchDrivingDistance to dependencies

  // Handle search query from Navbar (though not directly used for filtering on this page, kept for consistency)
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Format date for API calls
  const formatDateForApi = (dateObj) => {
    if (dayjs.isDayjs(dateObj)) {
      return dayjs(dateObj).format('YYYY-MM-DD');
    }
    // Fallback for non-dayjs objects, though dayjs is preferred
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch initial data (cinema details, reviews, screens, movies)
  const fetchData = useCallback(async () => {
    try {
      const cinemaData = await cinemaService.getCinemaById(cinemaId);
      setCinema(cinemaData);
      const reviewsData = await reviewService.getCinemaReviews(cinemaId);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      const screensData = await screenService.getAllScreens();
      setAllScreens(screensData);
      const moviesData = await movieService.getNowPlayingMovies(); // Or get all movies relevant to showtimes
      setMovies(moviesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError('Failed to load some details.');
      toast.error('Failed to load some details.', { position: "top-right" });
    } finally {
      setPageLoading(false);
    }
  }, [cinemaId]);

  // Fetch showtimes for all movies at this cinema for the selected date
  const fetchShowtimesForMovies = useCallback(async () => {
    if (!selectedDate || movies.length === 0) return;
    setLoadingShowtimes(true);
    try {
      const formattedDate = formatDateForApi(selectedDate);
      const showtimesData = {};
      await Promise.all(movies.map(async (movie) => {
        const showtimes = await showtimeService.getShowtimesForMovieAndCinema(movie.movie_id, cinemaId, formattedDate);
        showtimesData[movie.movie_id] = showtimes;
      }));
      setShowtimes(showtimesData);
    } catch (err) {
      console.error("Error fetching showtimes for movies:", err);
      setError('Failed to load showtimes. Please try again later.');
      toast.error('Failed to load showtimes. Please try again later.', { position: "top-right" });
    } finally {
      setLoadingShowtimes(false);
    }
  }, [movies, cinemaId, selectedDate]);

  // Handle click on a showtime button to navigate to booking page
  const handleShowtimeClick = (showtimeId) => {
    if (!currentUser) {
      toast.info("Please log in to book tickets.", { position: "top-center" });
      return;
    }
    navigate(`/book/${showtimeId}`);
  };

  // Clear error/success messages after a delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Initial data fetch on component mount
  useEffect(() => {
    setPageLoading(true);
    fetchData();
  }, [fetchData]);

  // Fetch showtimes whenever movies data or selected date changes
  useEffect(() => {
    if (movies.length > 0 && selectedDate) {
      fetchShowtimesForMovies();
    }
  }, [fetchShowtimesForMovies, movies, selectedDate]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle adding a new review
  const handleAddReview = async () => {
    setError('');
    setSuccess('');
    if (!currentUser?.user_id || !currentUser.email) {
      setError('Please login to add a review.');
      toast.error('Please login to add a review.', { position: "top-right" });
      return;
    }
    if (newReview.rating === 0 || newReview.comment.trim() === '') {
      setError('Rating and comment cannot be empty.');
      toast.error('Rating and comment cannot be empty.', { position: "top-right" });
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await reviewService.addReview({
        cinema_id: cinemaId,
        user_id: currentUser.user_id,
        rating: newReview.rating,
        comment: newReview.comment,
        create_user: currentUser.email,
        update_user: currentUser.email,
      });
      await delay(500); // Simulate network delay
      await fetchData(); // Re-fetch data to update reviews list
      setNewReview({ rating: 0, comment: '' });
      setSuccess('Review added successfully!');
      toast.success('Review added successfully!', { position: "top-right" });
    } catch (err) {
      console.error("Error adding review:", err);
      setError('Failed to add review.');
      toast.error('Failed to add review.', { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing an existing review
  const handleEditReview = async () => {
    setError('');
    setSuccess('');
    if (newReview.rating === 0 || newReview.comment.trim() === '') {
      setError('Rating and comment cannot be empty.');
      toast.error('Rating and comment cannot be empty.', { position: "top-right" });
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await reviewService.updateReview({
        review_id: editReviewId,
        rating: newReview.rating,
        comment: newReview.comment,
        update_user: currentUser.email,
      });
      await delay(500); // Simulate network delay
      await fetchData(); // Re-fetch data to update reviews list
      setEditReviewId(null);
      setNewReview({ rating: 0, comment: '' });
      setSuccess('Review updated successfully!');
      toast.success('Review updated successfully!', { position: "top-right" });
    } catch (err) {
      console.error("Error updating review:", err);
      setError('Failed to update review.');
      toast.error('Failed to update review.', { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    // Replace window.confirm with a custom modal for better UX
    if (window.confirm('Are you sure you want to delete this review?')) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await reviewService.deleteReview({ review_id: reviewId });
        await delay(500); // Simulate network delay
        await fetchData(); // Re-fetch data to update reviews list
        setSuccess('Review deleted successfully!');
        toast.success('Review deleted successfully!', { position: "top-right" });
      } catch (err) {
        console.error("Error deleting review:", err);
        setError('Failed to delete review.');
        toast.error('Failed to delete review.', { position: "top-right" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Set review data for editing
  const handleEditClick = (review) => {
    setEditReviewId(review.review_id);
    setNewReview({ rating: Number(review.rating) || 0, comment: review.comment });
  };

  // Handle change in rating filter
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // Memoized filtered reviews
  const filteredReviews = useMemo(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase(); // For Navbar search
    return reviews.filter((review) => {
      if (review == null || review.rating == null) {
        console.warn('Skipping null or malformed review in filter:', review);
        return false;
      }
      const matchesRatingFilter = filter.rating ? Number(review.rating) >= Number(filter.rating) : true;
      const matchesSearchQueryInReview =
        review.comment.toLowerCase().includes(lowerCaseSearchQuery) ||
        (review.user_name && review.user_name.toLowerCase().includes(lowerCaseSearchQuery));
      return matchesRatingFilter && matchesSearchQueryInReview;
    });
  }, [reviews, filter.rating, searchQuery]);

  // Memoized filtered screens (not directly used for display, but for count)
  const filteredScreens = useMemo(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase(); // For Navbar search
    return allScreens.filter(screen =>
      screen.cinema_id === parseInt(cinemaId) &&
      screen.screen_name.toLowerCase().includes(lowerCaseSearchQuery)
    );
  }, [allScreens, cinemaId, searchQuery]);

  const screenCount = filteredScreens.length;

  // Page loading UI
  if (pageLoading || authLoading) {
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
              {authLoading ? 'Authenticating...' : 'Loading Cinema Details...'}
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

  // Cinema not found UI
  if (!cinema) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar onSearch={handleSearch} />
        <div className="flex-grow flex items-center justify-center text-center py-5 container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-red-400 font-semibold">
              Cinema not found or an error occurred.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Construct the image URL using the BASE_BACKEND_URL
  const cinemaImageUrl = cinema.image ? `${BASE_BACKEND_URL}/CinemaImage/${cinema.image}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col text-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Navbar onSearch={handleSearch} />

      <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20 transform transition-transform duration-300 hover:scale-[1.005]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
            <FaInfoCircle className="inline-block mr-2 text-lg" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center">
            <FaInfoCircle className="inline-block mr-2 text-lg" />
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        {locationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
            <FaInfoCircle className="inline-block mr-2 text-lg" />
            <span className="block sm:inline">{locationError}</span>
          </div>
        )}

        {/* Cinema Header Card */}
        <div
          className="relative mb-8 rounded-2xl shadow-xl overflow-hidden text-white group transform transition-all duration-300 hover:scale-[1.01]"
          style={{
            backgroundImage: cinemaImageUrl
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cinemaImageUrl})`
              : 'linear-gradient(135deg, #FE6B8B 30%, #FF8E53 90%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '250px',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 rounded-2xl z-10"></div>
          <div className="relative z-20 p-6 sm:p-8 w-full">
            <h1 className="text-3xl sm:text-4xl font-black mb-2 leading-tight bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              {cinema.name}
            </h1>
            <p className="text-lg text-gray-200 mb-2">
              {cinema.address}, {cinema.city}, {cinema.state}, {cinema.zip_code}
            </p>
            {drivingDistance && (
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold mb-2 shadow-md">
                <FaMapMarkerAlt className="text-blue-300 mr-1 text-xs" />
                <span className="text-gray-100">{drivingDistance}</span>
              </div>
            )}
            <p className="text-lg text-gray-200 mb-1">
              Total Screens: <span className="font-bold">{screenCount || 'N/A'}</span>
            </p>
            {cinema.avg_rating !== null && !isNaN(parseFloat(cinema.avg_rating)) && (
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-md px-3 py-1 text-sm font-semibold w-fit shadow-md">
                <span className="text-gray-100 mr-2">Average Rating:</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-lg ${
                        star <= Math.floor(Number(cinema.avg_rating))
                          ? 'text-yellow-400'
                          : 'text-gray-400 opacity-50'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-100">
                    {(Number(cinema.avg_rating) || 0).toFixed(2)} / 5
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-md px-3 py-1 text-sm font-semibold w-fit mt-2 shadow-md">
              <span className="text-gray-100 mr-2">Total Reviews:</span>
              <span className="font-bold text-gray-100">{reviews.length}</span>
            </div>
          </div>
        </div>

        <hr className="my-8 border-t-2 border-gray-200" />

        {/* Showtimes Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Showtimes
          </h2>
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-xs">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate.format('YYYY-MM-DD')}
                onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
              />
            </div>
          </div>

          {loadingShowtimes ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-3xl mr-3" />
              <p className="text-lg text-gray-700">Loading showtimes...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movies.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-600 text-lg font-medium italic">
                    No movies currently playing at this cinema.
                  </p>
                </div>
              )}
              {movies.map((movie) => {
                const movieShowtimes = showtimes[movie.movie_id] || [];
                if (movieShowtimes.length > 0) {
                  return (
                    <div
                      key={movie.movie_id}
                      className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{movie.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        {movieShowtimes.map(showtime => (
                          <button
                            key={showtime.showtime_id}
                            onClick={() => handleShowtimeClick(showtime.showtime_id)}
                            className="px-5 py-2 rounded-full font-semibold text-sm bg-white border border-purple-500 text-purple-600
                                       hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white
                                       transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                          >
                            {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {Object.values(showtimes).every(arr => arr.length === 0) && !loadingShowtimes && movies.length > 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-600 text-lg font-medium italic">
                    No showtimes available for the selected date.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <hr className="my-8 border-t-2 border-gray-200" />

        {/* Customer Reviews Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-gray-800 mb-6 text-center bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Customer Reviews
          </h2>
          <div className="mb-6 w-full max-w-xs mx-auto relative">
            <label htmlFor="rating-filter" className="sr-only">Filter by Min Rating</label>
            <select
              id="rating-filter"
              name="rating"
              value={filter.rating}
              onChange={handleFilterChange}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
            >
              <option value="">All Ratings</option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val > 1 && 's'} & Up
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-600 text-lg font-medium italic">
                No reviews found matching your criteria. Be the first to leave one!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.review_id}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center transform hover:scale-[1.005] transition-transform duration-200"
                >
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      {/* Displaying review rating with fractional support */}
                      {[1, 2, 3, 4, 5].map((star) => {
                        const fillPercentage = Math.max(0, Math.min(100, (Number(review.rating) - (star - 1)) * 100));
                        return (
                          <div key={star} className="relative text-xl">
                            <FaStar className="text-gray-300" />
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{ width: `${fillPercentage}%` }}
                            >
                              <FaStar className="text-yellow-500" />
                            </div>
                          </div>
                        );
                      })}
                      <span className="ml-2 text-gray-600 text-sm">
                        {(Number(review.rating) || 0).toFixed(2)} / 5
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-2">
                      "{review.comment}"
                    </p>
                    <p className="text-gray-500 text-xs">
                      By: <span className="font-bold">{review.user_name}</span> on {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {currentUser?.name && review.user_name && currentUser.name === review.user_name && (
                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 shadow-sm"
                        aria-label="edit review"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 shadow-sm"
                        aria-label="delete review"
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="my-8 border-t-2 border-gray-200" />

        {/* Add/Edit Review Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {editReviewId ? 'Edit Your Review' : 'Add a Review'}
          </h2>
          {authLoading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-3xl mr-3" />
              <p className="text-lg text-gray-700">Loading user authentication...</p>
            </div>
          ) : !currentUser ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-6 text-center">
              <FaInfoCircle className="inline-block mr-2 text-lg" />
              <span className="block sm:inline">Please login to add or edit a review.</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="rating-input-manual" className="block text-gray-700 text-sm font-bold mb-2">
                  Enter Rating (0.00 - 5.00)
                </label>
                <input
                  type="number"
                  id="rating-input-manual"
                  min="0"
                  max="5"
                  step="0.01"
                  value={newReview.rating.toFixed(2)} // Display with 2 decimal places
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    // Ensure value is within bounds [0, 5]
                    const clampedValue = Math.min(5, Math.max(0, isNaN(value) ? 0 : value));
                    setNewReview({ ...newReview, rating: clampedValue });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                  placeholder="e.g., 3.75"
                />
              </div>
              <div className="mt-4"> {/* Added margin top for spacing */}
                <label htmlFor="rating-input-stars" className="block text-gray-700 text-sm font-bold mb-2">
                  Or Select Rating with Stars
                </label>
                {/* Use the new StarRatingInput component */}
                <StarRatingInput
                  rating={newReview.rating}
                  setRating={(val) => setNewReview({ ...newReview, rating: val })}
                  precision={0.01} // Allows fractional input
                />
                <span className="ml-4 text-gray-600 text-sm">
                  Selected Rating: {(Number(newReview.rating) || 0).toFixed(2)}
                </span>
              </div>
              <div>
                <label htmlFor="comment-input" className="block text-gray-700 text-sm font-bold mb-2">
                  Your Comment
                </label>
                <textarea
                  id="comment-input"
                  fullWidth
                  placeholder="Share your experience..."
                  rows={5}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                ></textarea>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={editReviewId ? handleEditReview : handleAddReview}
                  disabled={isSubmitting || newReview.rating === 0 || newReview.comment.trim() === ''}
                  className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-base font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin inline-block mr-2" />
                  ) : (
                    editReviewId ? 'Update Review' : 'Submit Review'
                  )}
                </button>
                {editReviewId && (
                  <button
                    onClick={() => {
                      setEditReviewId(null);
                      setNewReview({ rating: 0, comment: '' });
                      setError('');
                      setSuccess('');
                    }}
                    disabled={isSubmitting}
                    className="group bg-gray-200 text-gray-800 text-base font-bold px-8 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CinemaDetailPage;
