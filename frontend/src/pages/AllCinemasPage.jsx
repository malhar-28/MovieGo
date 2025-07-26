import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import cinemaService from '../services/cinemaService';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import { FaMapMarkerAlt, FaSearch, FaCity, FaFilm, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
const API_KEY=import.meta.env.VITE_API_KEY;

const AllCinemasPage = () => {
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState([]);
    const [movies, setMovies] = useState([]);
    const [showtimesByCinema, setShowtimesByCinema] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [movieFilter, setMovieFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [drivingDistances, setDrivingDistances] = useState({});

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
        // This key is a placeholder and may not be valid or functional.
        const apiKey = `${API_KEY}=`; 
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
            }
        } catch (error) {
            console.error('ORS distance error:', error);
            return null;
        }
    }, []);

    // Fetch driving distances for all cinemas once user location and cinemas data are available
    useEffect(() => {
        const fetchDistances = async () => {
            if (userLocation && cinemas.length > 0) {
                const distances = {};
                for (const cinema of cinemas) {
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

        fetchDistances();
    }, [userLocation, cinemas, fetchDrivingDistance]);

    // Handle search query from Navbar
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Fetch initial cinema and movie data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [cinemasData, nowPlayingMovies, upcomingMovies] = await Promise.all([
                    cinemaService.getAllCinemas(),
                    movieService.getNowPlayingMovies(),
                    movieService.getUpcomingMovies(),
                ]);
                const allMovies = [...nowPlayingMovies, ...upcomingMovies];
                setCinemas(cinemasData);
                setMovies(allMovies);
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch data';
                setError(errorMessage);
                toast.error(errorMessage, { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch showtimes based on movie, cinema, and date filters
    useEffect(() => {
        const fetchShowtimes = async () => {
            if (cinemas.length === 0 || !movieFilter) {
                setShowtimesByCinema({});
                return;
            }
            try {
                const showtimesPromises = cinemas.map(cinema =>
                    showtimeService.getShowtimesForMovieAndCinema(parseInt(movieFilter), cinema.cinema_id, dateFilter)
                );
                const allShowtimes = await Promise.all(showtimesPromises);
                const groupedShowtimes = {};
                cinemas.forEach((cinema, index) => {
                    groupedShowtimes[cinema.cinema_id] = allShowtimes[index];
                });
                setShowtimesByCinema(groupedShowtimes);
            } catch (err) {
                console.error("Error fetching showtimes:", err);
                setShowtimesByCinema({});
            }
        };
        fetchShowtimes();
    }, [dateFilter, movieFilter, cinemas]);

    // Memoized filtered cinemas based on search and filter criteria
    const filteredCinemas = useMemo(() => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        return cinemas.filter(cinema => {
            // Check if cinema name, city, or address matches the global search query
            const matchesCinemaDetails =
                cinema.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                cinema.city.toLowerCase().includes(lowerCaseSearchQuery) ||
                cinema.address.toLowerCase().includes(lowerCaseSearchQuery);

            // Check if any movie shown at this cinema matches the global search query
            let matchesMovieTitle = false;
            if (lowerCaseSearchQuery) {
                const matchingMovieIds = movies
                    .filter(movie => movie.title.toLowerCase().includes(lowerCaseSearchQuery))
                    .map(movie => movie.movie_id);

                if (matchingMovieIds.length > 0) {
                    const cinemaShowtimes = showtimesByCinema[cinema.cinema_id] || [];
                    matchesMovieTitle = cinemaShowtimes.some(showtime =>
                        matchingMovieIds.includes(showtime.movie_id)
                    );
                }
            }

            // Combine all search criteria for the global search input
            const matchesGlobalSearch = matchesCinemaDetails || matchesMovieTitle;

            // Apply city filter from the dropdown
            const matchesCityFilter = cityFilter ? cinema.city === cityFilter : true;

            // Apply movie filter from the dropdown
            let matchesMovieDropdownFilter = true;
            if (movieFilter) {
                const cinemaShowtimes = showtimesByCinema[cinema.cinema_id] || [];
                matchesMovieDropdownFilter = cinemaShowtimes.some(showtime =>
                    showtime.movie_id === parseInt(movieFilter)
                );
            }

            // A cinema is shown if it matches the global search AND any applied dropdown filters
            return matchesGlobalSearch && matchesCityFilter && matchesMovieDropdownFilter;
        });
    }, [cinemas, searchQuery, cityFilter, movieFilter, dateFilter, showtimesByCinema, movies]);

    // Loading state UI
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
                            Loading Cinemas...
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
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <Navbar onSearch={handleSearch} />

            <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20">
                <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    All Cinemas
                </h1>

                {locationError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
                        <FaInfoCircle className="inline-block mr-2 text-lg" />
                        <span className="block sm:inline">{locationError}</span>
                    </div>
                )}

                {/* Filter Section */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 p-4 bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-lg border border-gray-200">
                    <div className="relative w-full md:w-auto flex-1 min-w-[200px]">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Cinema/City"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                        />
                    </div>

                    <div className="relative w-full md:w-auto flex-1 min-w-[200px]">
                        <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                        >
                            <option value="">All Cities</option>
                            {Array.from(new Set(cinemas.map(cinema => cinema.city))).map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <div className="relative w-full md:w-auto flex-1 min-w-[200px]">
                        <FaFilm className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={movieFilter}
                            onChange={(e) => setMovieFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                        >
                            <option value="">All Movies</option>
                            {movies.map(movie => (
                                <option key={movie.movie_id} value={movie.movie_id}>{movie.title}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <div className="relative w-full md:w-auto flex-1 min-w-[180px]">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Cinemas Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCinemas.length > 0 ? (
                        filteredCinemas.map(cinema => {
                            const distance = drivingDistances[cinema.cinema_id];
                            return (
                                <div
                                    key={cinema.cinema_id}
                                    className="group relative h-full flex flex-col cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 w-full mx-auto transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-100 backdrop-blur-sm"
                                    onClick={() => navigate(`/cinemas/${cinema.cinema_id}`)}
                                >
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 rounded-2xl z-10"></div>

                                    <div className="flex-grow flex flex-col p-5 bg-gradient-to-br from-white to-gray-50/50 text-left min-h-[100px] z-20 backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                                            {cinema.name}
                                        </h3>
                                        {distance && (
                                            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold self-start mb-2 shadow-sm">
                                                <FaMapMarkerAlt className="text-blue-500 mr-1 text-xs" />
                                                {distance}
                                            </div>
                                        )}
                                        <p className="text-gray-600 text-sm mb-1">
                                            {cinema.city}
                                        </p>
                                        <p className="text-gray-500 text-xs mb-3">
                                            Address: {cinema.address}
                                        </p>

                                        <p className="text-base font-semibold text-gray-700 mt-2 mb-2">
                                            {movieFilter ?
                                                `Showtimes for ${movies.find(m => m.movie_id === parseInt(movieFilter))?.title || 'Selected Movie'} on ${new Date(dateFilter).toLocaleDateString()}:`
                                                : `Select a movie to view showtimes.`
                                            }
                                        </p>

                                        {movieFilter ? (
                                            (() => {
                                                const relevantShowtimes = (showtimesByCinema[cinema.cinema_id] || [])
                                                    .filter(st => st.movie_id === parseInt(movieFilter))
                                                    .sort((a, b) => new Date(`1970/01/01 ${a.show_time}`) - new Date(`1970/01/01 ${b.show_time}`));
                                                if (relevantShowtimes.length === 0) {
                                                    return <p className="text-gray-500 text-sm">No showtimes available for this movie on selected date.</p>;
                                                }
                                                const selectedMovie = movies.find(m => m.movie_id === parseInt(movieFilter));
                                                if (selectedMovie) {
                                                    const times = relevantShowtimes.map(st => st.show_time);
                                                    return (
                                                        <div className="mb-2">
                                                            <p className="font-bold text-gray-700 text-sm">
                                                                {selectedMovie.title}:
                                                            </p>
                                                            <p className="text-gray-800 text-sm">
                                                                {times.join(', ')}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()
                                        ) : (
                                            <p className="text-gray-500 text-sm">
                                                Please select a movie from the filter above to see available showtimes.
                                            </p>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click from navigating twice
                                                navigate(`/cinemas/${cinema.cinema_id}`);
                                            }}
                                            className="mt-4 self-start group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-base font-bold px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 backdrop-blur-sm"
                                        >
                                            View Details
                                            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl text-gray-300 mb-4">📍</div>
                            <p className="text-gray-600 text-xl font-medium">
                                No cinemas found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllCinemasPage;
