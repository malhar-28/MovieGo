import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import movieService from '../services/movieService';
import Navbar from '../components/Navbar';

const AllMoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [nowPlaying, upcoming] = await Promise.all([
          movieService.getNowPlayingMovies(),
          movieService.getUpcomingMovies(),
        ]);

        const uniqueMoviesMap = new Map();
        [...(nowPlaying || []), ...(upcoming || [])].forEach(movie => uniqueMoviesMap.set(movie.movie_id, movie));
        setMovies(Array.from(uniqueMoviesMap.values()));
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch movies';
        setError(errorMessage);
        toast.error(errorMessage, { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const query = searchQuery.toLowerCase();
    return (
      movie.title.toLowerCase().includes(query) ||
      (movie.genre && movie.genre.toLowerCase().includes(query)) ||
      (movie.rating && String(movie.rating).toLowerCase().includes(query)) ||
      (movie.synopsis && movie.synopsis.toLowerCase().includes(query))
    );
  });

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
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
              Loading movies...
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
    <>
      <Navbar onSearch={handleSearch} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col text-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20">
          <h1 className="text-5xl font-black text-gray-800 mb-12 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            All Movies
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <div
                  key={movie.movie_id}
                  className="group relative h-full flex flex-col cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 w-full mx-auto transform transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-100 backdrop-blur-sm"
                  onClick={() => navigate(`/movies/${movie.movie_id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 rounded-2xl z-10"></div>

                  <div className="relative w-full h-[320px] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-200 to-gray-300">
                    <img
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                      src={`${movieService.BASE_BACKEND_URL}/MovieImages/${movie.poster_image}`}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/300x450/E0E0E0/333333?text=No+Poster';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="flex-grow flex flex-col p-5 bg-gradient-to-br from-white to-gray-50/50 text-left min-h-[100px] z-20 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight min-h-[3rem] line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {movie.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {movie.genre}
                    </p>
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                        {movie.rating}
                      </span>
                    </div>
                    <p className="flex-grow text-base text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {truncateText(movie.synopsis, 120)}
                    </p>
                    <button
                      className="mt-auto w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movies/${movie.movie_id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-600 font-medium">
                  No movies found matching your search.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AllMoviesPage;
