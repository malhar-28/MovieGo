import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaMapMarkerAlt, FaSpinner, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'; // Using react-icons
import Navbar from '../components/Navbar';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import cinemaService from '../services/cinemaService';
import screenService from '../services/screenService';
import dayjs from 'dayjs'; // Using dayjs for date manipulation, consistent with other pages
import { useAuth } from '../context/AuthContext'; // <--- ADDED THIS IMPORT
const API_KEY=import.meta.env.VITE_API_KEY;

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const [movie, setMovie] = useState(null);
  const [allCinemas, setAllCinemas] = useState([]);
  const [allScreens, setAllScreens] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Using dayjs for state
  const [loadingMovieDetails, setLoadingMovieDetails] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [error, setError] = useState(null);
  const [cinemaShowtimes, setCinemaShowtimes] = useState({});
  const [tabValue, setTabValue] = useState(0); // 0 for Schedule, 1 for Synopsis
  const [selectedCity, setSelectedCity] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [drivingDistances, setDrivingDistances] = useState({});

  // Define BASE_BACKEND_URL for image paths
  // const BASE_BACKEND_URL = 'http://localhost:5000'; // IMPORTANT: Adjust this to your actual backend URL
  const BASE_BACKEND_URL =  import.meta.env.VITE_BASE_URL;

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
          setLocationError("Location access denied. Showing all cinemas without distance.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation not supported. Showing all cinemas without distance.");
    }
  }, []);

  // Function to fetch driving distance using OpenRouteService API
  const fetchDrivingDistance = useCallback(async (origin, destination) => {
    // NOTE: Replace with your actual OpenRouteService API key.
 const apiKey = `${API_KEY}=`;     
 if (!apiKey || apiKey === 'YOUR_OPENROUTESERVICE_API_KEY') {
        console.warn("OpenRouteService API Key is not set. Distance calculation will not work.");
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
        return null;
      }
    } catch (error) {
      console.error('ORS distance fetch error:', error);
      return null;
    }
  }, []);

  // Format date for API calls (using dayjs)
  const formatDateForApi = (dateObj) => {
    if (!dateObj || !dayjs.isDayjs(dateObj)) return '';
    return dateObj.format('YYYY-MM-DD');
  };

  // Fetch initial movie, cinema, and screen data
  const fetchInitialData = useCallback(async () => {
    setLoadingMovieDetails(true);
    setError(null);
    try {
      const [fetchedMovie, fetchedCinemas, fetchedScreens] = await Promise.all([
        movieService.getMovieById(movieId),
        cinemaService.getAllCinemas(),
        screenService.getAllScreens(),
      ]);
      setMovie(fetchedMovie);
      setAllCinemas(fetchedCinemas || []);
      setAllScreens(fetchedScreens || []);
      setSelectedDate(dayjs()); // Initialize with current date using dayjs
    } catch (err) {
      console.error("Error fetching initial data:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load movie details. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoadingMovieDetails(false);
    }
  }, [movieId]);

  // Fetch showtimes for the selected date and city
  const fetchShowtimesForSelectedDate = useCallback(async () => {
    const formattedDate = formatDateForApi(selectedDate);
    const filteredCinemas = allCinemas.filter(cinema =>
      selectedCity === 'All' || cinema.city === selectedCity
    );

    if (!formattedDate || filteredCinemas.length === 0) {
      setCinemaShowtimes({});
      setLoadingShowtimes(false);
      return;
    }
    setLoadingShowtimes(true);
    setError(null);
    try {
      const showtimesPromises = filteredCinemas.map(async (cinema) => {
        const times = await showtimeService.getShowtimesForMovieAndCinema(movieId, cinema.cinema_id, formattedDate);
        return { cinemaId: cinema.cinema_id, times: times || [] };
      });
      const results = await Promise.all(showtimesPromises);
      const newCinemaShowtimes = results.reduce((acc, current) => {
        if (current.times.length > 0) {
          acc[current.cinemaId] = current.times;
        }
        return acc;
      }, {});
      setCinemaShowtimes(newCinemaShowtimes);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load showtimes. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoadingShowtimes(false);
    }
  }, [movieId, selectedDate, allCinemas, selectedCity]);

  // Effect to fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Effect to fetch showtimes when relevant dependencies change
  useEffect(() => {
    if (selectedDate && allCinemas.length > 0 && !loadingMovieDetails) {
      fetchShowtimesForSelectedDate();
    }
  }, [selectedDate, allCinemas, loadingMovieDetails, fetchShowtimesForSelectedDate, selectedCity]);

  // Effect to calculate driving distances when user location or cinemas change
  useEffect(() => {
    const calculateAllDistances = async () => {
      if (userLocation && allCinemas.length > 0) {
        const distances = {};
        for (const cinema of allCinemas) {
          if (cinema.latitude && cinema.longitude) {
            const distance = await fetchDrivingDistance(userLocation, {
              latitude: parseFloat(cinema.latitude),
              longitude: parseFloat(cinema.longitude)
            });
            distances[cinema.cinema_id] = distance;
          }
        }
        setDrivingDistances(distances);
      }
    };
    calculateAllDistances();
  }, [userLocation, allCinemas, fetchDrivingDistance]);


  // Memoized city options for the filter dropdown
  const cityOptions = useMemo(() => {
    const cities = new Set();
    allCinemas.forEach(cinema => {
      if (cinema.city) {
        cities.add(cinema.city);
      }
    });
    return ['All', ...Array.from(cities).sort()];
  }, [allCinemas]);

  // Handle click on a showtime button to navigate to booking page
  const handleShowtimeClick = (showtimeId) => {
    if (!currentUser) {
      toast.info("Please log in to book tickets.", { position: "top-center" });
      navigate('/login');
      return;
    }
    navigate(`/book/${showtimeId}`);
  };

  // Handle tab change (Schedule/Synopsis)
  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  // Handle city filter change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Construct movie poster URL
  const posterUrl = movie?.poster_image
    ? `${BASE_BACKEND_URL}/MovieImages/${movie.poster_image}`
    : 'https://placehold.co/300x450/E0E0E0/333333?text=No+Poster'; // Placeholder for missing images

  // Loading state UI
  if (loadingMovieDetails || authLoading) {
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
              {authLoading ? 'Authenticating...' : 'Loading movie details...'}
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

  // Error state UI
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center py-5 container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-red-400 font-semibold">
              Error: {error}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Movie not found UI
  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center py-5 container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-red-400 font-semibold">
              Movie not found.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </button>
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

      <Navbar />

      <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20">
        {locationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
            <FaInfoCircle className="inline-block mr-2 text-lg" />
            <span className="block sm:inline">{locationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Left Panel: Movie Details */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center h-full transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] h-auto rounded-lg shadow-md border-4 border-gray-300 mb-4 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/300x450/E0E0E0/333333?text=No+Poster';
              }}
            />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 mb-2 leading-tight">
              {movie.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-1">
              <span className="font-semibold text-gray-700">Genre:</span> {movie.genre}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-1">
              <span className="font-semibold text-gray-700">Duration:</span> {movie.duration} minutes
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-1 flex items-center">
              <span className="font-semibold text-gray-700 mr-2">Rating:</span>
              <span className="bg-[#0B193F] text-white px-3 py-1 rounded-full text-sm font-semibold inline-block shadow-sm">
                {movie.rating}
              </span>
            </p>
          </div>

          {/* Middle Panel: Schedule/Synopsis Tabs and Content */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center h-full overflow-hidden transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
            {/* Tabs */}
            <div className="w-full max-w-sm mx-auto bg-gray-100 rounded-full p-1 flex justify-between items-center shadow-inner mb-6 flex-wrap">
              <button
                onClick={() => handleTabChange(0)}
                className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300
                  ${tabValue === 0
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Schedule
              </button>
              <button
                onClick={() => handleTabChange(1)}
                className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300
                  ${tabValue === 1
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Synopsis
              </button>
            </div>

            {/* City Filter */}
            {tabValue === 0 && (
              <div className="w-full mb-6 relative">
                <label htmlFor="city-select" className="sr-only">Select City</label>
                <select
                  id="city-select"
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="block w-full px-4 py-2 pr-8 rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 appearance-none"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}

            {/* Content based on selected tab */}
            {tabValue === 0 && (
              <div className="w-full flex flex-col items-center">
                {/* Date Picker (HTML input type="date") */}
                <div className="relative w-full max-w-xs mb-6">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate.format('YYYY-MM-DD')}
                    onChange={(e) => {
                      const newDate = dayjs(e.target.value);
                      if (newDate.isBefore(dayjs().startOf('day'))) {
                        toast.info("This day is over. Tickets cannot be booked for past dates.", { position: "top-center" });
                      } else {
                        setSelectedDate(newDate);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                  />
                </div>
              </div>
            )}

            {tabValue === 1 && (
              <div className="w-full p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-y-auto max-h-[400px] md:max-h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Synopsis:</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {movie.synopsis}
                </p>
                {/* Additional Lorem Ipsum content for demonstration */}
                <p className="text-gray-600 leading-relaxed text-sm mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Cinema Showtimes */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-[600px] md:max-h-full"> {/* Added max-h for scrollability */}
            {tabValue === 0 && (
              loadingShowtimes ? (
                <div className="flex justify-center items-center py-8 bg-white rounded-xl shadow-lg">
                  <FaSpinner className="animate-spin text-blue-500 text-3xl mr-3" />
                  <p className="text-lg text-gray-700">Loading showtimes...</p>
                </div>
              ) : Object.keys(cinemaShowtimes).length > 0 ? (
                <>
                  {allCinemas
                    .filter(cinema =>
                      (selectedCity === 'All' || cinema.city === selectedCity) &&
                      cinemaShowtimes[cinema.cinema_id] &&
                      cinemaShowtimes[cinema.cinema_id].length > 0 // Only show cinemas with actual showtimes
                    )
                    .sort((a, b) => {
                      // Sort by distance if available, otherwise by name
                      const distA = drivingDistances[a.cinema_id] ? parseFloat(drivingDistances[a.cinema_id].replace(' km', '')) : Infinity;
                      const distB = drivingDistances[b.cinema_id] ? parseFloat(drivingDistances[b.cinema_id].replace(' km', '')) : Infinity;
                      if (distA !== Infinity && distB !== Infinity) {
                        return distA - distB;
                      }
                      return a.name.localeCompare(b.name); // Fallback to alphabetical sort
                    })
                    .map((cinema) => {
                      const showtimes = cinemaShowtimes[cinema.cinema_id] || [];
                      const distance = drivingDistances[cinema.cinema_id];

                      return (
                        <div
                          key={cinema.cinema_id}
                          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">
                              {cinema.name}
                            </h3>
                            {distance && (
                              <span className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold ml-2">
                                <FaMapMarkerAlt className="mr-1 text-blue-500" /> {distance}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {cinema.address}, {cinema.city}, {cinema.state} - {cinema.zip_code}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {showtimes.map(showtime => (
                              <button
                                key={showtime.showtime_id}
                                onClick={() => handleShowtimeClick(showtime.showtime_id)}
                                className="px-4 py-2 rounded-lg font-semibold text-sm bg-white border border-purple-500 text-purple-600
                                           hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white
                                           transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                              >
                                {dayjs(`2000-01-01T${showtime.show_time}`).format('HH:mm')}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center flex-grow flex flex-col justify-center items-center min-h-[150px]">
                  <FaInfoCircle className="text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-600 text-lg font-medium">
                    No showtimes available for {selectedDate.format('MMM D, YYYY')} in {selectedCity === 'All' ? 'any city' : selectedCity}.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailPage;
