import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';
import newsService from '../services/newsService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaStar, FaPlay, FaCalendarAlt, FaNewspaper, FaShare } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const useResponsiveBreakpoints = () => {
  const [isXs, setIsXs] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isMdUp, setIsMdUp] = useState(false);
   const [isLgUp, setIsLgUp] = useState(false);

  const checkBreakpoints = useCallback(() => {
    const width = window.innerWidth;
    setIsXs(width < 640);
    setIsSm(width >= 640 && width < 768);
    setIsMdUp(width >= 768);
    setIsLgUp(width >= 1024);
  }, []);

  useEffect(() => {
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, [checkBreakpoints]);

  return { isXs, isSm, isMdUp, isLgUp };
};

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
 const { isXs, isSm, isMdUp, isLgUp } = useResponsiveBreakpoints();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredNowPlayingMovies = nowPlayingMovies.filter(movie => {
    const query = searchQuery.toLowerCase();
    return (
      movie.title.toLowerCase().includes(query) ||
      (movie.genre && movie.genre.toLowerCase().includes(query)) ||
      (movie.rating && String(movie.rating).toLowerCase().includes(query))
    );
  });

  const filteredUpcomingMovies = upcomingMovies.filter(movie => {
    const query = searchQuery.toLowerCase();
    return (
      movie.title.toLowerCase().includes(query) ||
      (movie.genre && movie.genre.toLowerCase().includes(query)) ||
      (movie.rating && String(movie.rating).toLowerCase().includes(query))
    );
  });

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageError = useCallback((id, type) => {
    setImageErrors(prevErrors => ({
      ...prevErrors,
      [`${type}-${id}`]: true,
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    setImageErrors({});
    try {
      const [nowPlaying, upcoming, latestNews] = await Promise.all([
        movieService.getNowPlayingMovies(),
        movieService.getUpcomingMovies(),
        newsService.getAllNews(),
      ]);
      setNowPlayingMovies(nowPlaying || []);
      setUpcomingMovies(upcoming || []);
      setNews(latestNews || []);
    } catch (err) {
      console.error("Error fetching homepage data:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load content. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || dataLoading) {
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
              {loading ? 'Authenticating...' : 'Loading MovieGo...'}
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

  const renderMovieCard = (movie, isRecommended = false) => {
    const imageUrl = `${movieService.BASE_BACKEND_URL}/MovieImages/${movie.poster_image}`;
    const hasImageError = imageErrors[`movie-${movie.movie_id}`];
    return (
      <div
        className="group relative h-full flex flex-col cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 w-full mx-auto min-w-[200px] transform transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-100 backdrop-blur-sm"
        onClick={() => navigate(`/movies/${movie.movie_id}`)}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 rounded-2xl z-10"></div>
        
        {/* Image container */}
        <div className="relative w-full h-[320px] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-200 to-gray-300">
          {hasImageError ? (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-4">
                <FaPlay className="text-4xl text-gray-400 mb-2 mx-auto" />
                <p className="text-sm text-gray-500 font-medium">Image Not Available</p>
              </div>
            </div>
          ) : (
            <>
              <img
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                src={imageUrl}
                alt={movie.title}
                onError={() => handleImageError(movie.movie_id, 'movie')}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                  <FaPlay className="text-2xl text-purple-600 ml-1" />
                </div>
              </div>
            </>
          )}
          
          {/* Rating badge */}
          {isRecommended && movie.rating && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg z-20 backdrop-blur-sm">
              <FaStar className="text-white text-xs" />
              <span className="font-bold">{movie.rating}</span>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transform hover:scale-110 transition-all duration-200 shadow-lg">
              <FaShare className="text-blue-500 text-sm" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow flex flex-col p-5 bg-gradient-to-br from-white to-gray-50/50 text-left min-h-[100px] z-20 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight min-h-[3rem] line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
              {movie.genre}
            </span>
            <FaCalendarAlt className="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    );
  };

  const renderNewsCard = (item) => {
    const imageUrl = `${newsService.BASE_BACKEND_URL}/NewsImage/${item.image}`;
    const hasImageError = imageErrors[`news-${item.news_id}`];
    return (
      <div
        className="group relative h-auto flex cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 w-full mx-auto p-4 items-start gap-4 min-h-[100px] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 hover:scale-[1.02] backdrop-blur-sm"
        onClick={() => navigate(`/news/${item.news_id}`)}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-500 rounded-2xl z-10"></div>
        
        {/* Image container */}
        <div className="relative w-[100px] h-[80px] rounded-xl border border-gray-200 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
          {hasImageError ? (
            <div className="h-full flex items-center justify-center">
              <FaNewspaper className="text-2xl text-gray-400" />
            </div>
          ) : (
            <>
              <img
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                src={imageUrl}
                alt={item.title}
                onError={() => handleImageError(item.news_id, 'news')}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-transparent group-hover:from-blue-600/20 transition-all duration-300"></div>
            </>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-grow flex flex-col justify-between min-h-[80px] z-20">
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {item.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              {item.create_user || 'MovieGo'}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {new Date(item.created_at).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSliderSection = (title, items, renderCardFunc, showMorePath, uniqueId) => {
    const sectionIcons = {
      'Now Playing': <FaPlay className="text-purple-500" />,
      'Upcoming Movies': <FaCalendarAlt className="text-blue-500" />,
      'Latest News': <FaNewspaper className="text-green-500" />
    };

    if (!items || items.length === 0) {
      return (
        <section className="mb-20 relative px-4">
          <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-gradient-to-r from-purple-500 to-blue-500">
            <div className="flex items-center gap-3">
              {sectionIcons[title]}
              <h2 className="text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
            <button
              onClick={() => navigate(showMorePath)}
              className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 backdrop-blur-sm"
            >
              See All
              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-6xl text-gray-300 mb-4">🎬</div>
            <p className="text-gray-600 text-xl font-medium">
              No "{title.replace(' Movies', '').replace('Latest ', '')}" available at the moment.
            </p>
          </div>
        </section>
      );
    }

    const isMovieSection = (uniqueId === "nowplaying" || uniqueId === "upcoming");

    if (isXs) {
      return (
        <section className="mb-20 relative px-4">
          <div className="flex justify-between items-center mb-10 pb-6">
            <div className="flex items-center gap-3">
              {sectionIcons[title]}
              <h2 className="text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
            <button
              onClick={() => navigate(showMorePath)}
              className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              See All
              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
            {items.map((item, index) => (
              <div key={`${item.movie_id || item.news_id}-${index}`} className="flex justify-center w-full">
                <div className="w-full" style={{ maxWidth: isMovieSection ? '280px' : '400px' }}>
                  {renderCardFunc(item, uniqueId === "nowplaying")}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    } else if (isSm) {
      return (
        <section className="mb-20 relative px-4">
          <div className="flex justify-between items-center mb-10 pb-6">
            <div className="flex items-center gap-3">
              {sectionIcons[title]}
              <h2 className="text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
            <button
              onClick={() => navigate(showMorePath)}
              className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              See All
              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <div className="relative">
            <Swiper
              navigation={{
                nextEl: `.swiper-button-next-${uniqueId}`,
                prevEl: `.swiper-button-prev-${uniqueId}`,
                disabledClass: 'swiper-button-disabled',
              }}
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={isSm ? 2 : isMdUp ? 4 : 1}
              slidesPerGroup={isSm ? 2 : isMdUp ? 4 : 1}
              loop={false}
              className="mySwiper py-10"
            >
              {items.map((item, index) => (
                <SwiperSlide key={`${item.movie_id || item.news_id}-${index}`} className="flex justify-center items-stretch h-auto pb-4">
                  {renderCardFunc(item, uniqueId === "nowplaying")}
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={`swiper-button-prev-${uniqueId} custom-swiper-button custom-swiper-button-prev`} />
            <div className={`swiper-button-next-${uniqueId} custom-swiper-button custom-swiper-button-next`} />
          </div>
        </section>
      );
    }

    return (
      <section className="mb-20 relative px-4">
        <div className="flex justify-between items-center mb-10 pb-6">
          <div className="flex items-center gap-3">
            {sectionIcons[title]}
            <h2 className="text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
          <button
            onClick={() => navigate(showMorePath)}
            className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            See All
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
        <div className="relative">
          <Swiper
            navigation={{
              nextEl: `.swiper-button-next-${uniqueId}`,
              prevEl: `.swiper-button-prev-${uniqueId}`,
              disabledClass: 'swiper-button-disabled',
            }}
            modules={[Navigation]}
            loop={false}
            className="mySwiper py-10"
            // --- UPDATED BREAKPOINTS FOR RESPONSIVENESS ---
            breakpoints={{
              0: { // xs screens
                slidesPerView: 1,
                spaceBetween: 24,
                slidesPerGroup: 1,
              },
              640: { // sm screens
                slidesPerView: 2,
                spaceBetween: 24,
                slidesPerGroup: 2,
              },
              768: { // md screens (768px to 1023px)
                slidesPerView: isMovieSection ? 3 : 2, // 3 movies, 2 news cards
                spaceBetween: 28,
                slidesPerGroup: isMovieSection ? 3 : 2,
              },
              1024: { // lg screens (1024px and up)
                slidesPerView: isMovieSection ? 4 : 3, // 4 movies, 3 news cards
                spaceBetween: 32,
                slidesPerGroup: isMovieSection ? 4 : 3,
              },
            }}
            // --- END UPDATED BREAKPOINTS ---
          >
            {items.map((item, index) => (
              <SwiperSlide key={`${item.movie_id || item.news_id}-${index}`} className="flex justify-center items-stretch h-auto pb-4">
                {renderCardFunc(item, uniqueId === "nowplaying")}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={`swiper-button-prev-${uniqueId} custom-swiper-button custom-swiper-button-prev`} />
          <div className={`swiper-button-next-${uniqueId} custom-swiper-button custom-swiper-button-next`} />
        </div>
      </section>
    );
  };

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
        {currentUser && (
          <div className="text-center mb-16 relative">
            <div className="inline-block relative">
              <h1 className="text-5xl font-black text-gray-800 mb-4">
                Welcome back, 
                <span className="block mt-2 text-6xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  {currentUser.name}!
                </span>
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-2xl blur-2xl -z-10"></div>
            </div>
            <p className="text-xl text-gray-600 mt-4 font-medium">Ready to explore amazing movies and latest news?</p>
          </div>
        )}
        
        <style jsx>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .custom-swiper-button {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.4s ease;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 50;
            opacity: 0.9;
            box-shadow: 0 8px 32px rgba(147, 51, 234, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .custom-swiper-button:hover {
            background: linear-gradient(135deg, rgba(147, 51, 234, 1) 0%, rgba(59, 130, 246, 1) 100%);
            opacity: 1;
            transform: translateY(-50%) scale(1.15);
            box-shadow: 0 12px 40px rgba(147, 51, 234, 0.5);
          }
          
          .custom-swiper-button-prev {
            left: -28px;
          }
          
          .custom-swiper-button-next {
            right: -28px;
          }
          
          .custom-swiper-button::before {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-weight: bold;
          }
          
          .custom-swiper-button-prev::before {
            content: '←';
            font-size: 1.75rem;
          }
          
          .custom-swiper-button-next::before {
            content: '→';
            font-size: 1.75rem;
          }
          
          .swiper-button-disabled {
            opacity: 0.3 !important;
            cursor: not-allowed;
            box-shadow: none;
            transform: translateY(-50%) scale(0.9);
          }
          
          .swiper-button-prev, 
          .swiper-button-next {
            background-image: none !important;
          }
          
          .swiper-button-prev::after, 
          .swiper-button-next::after {
            content: '' !important;
          }
          
          @media (max-width: 640px) {
            .custom-swiper-button {
              display: none;
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        
        {renderSliderSection(
          "Now Playing",
          filteredNowPlayingMovies,
          renderMovieCard,
          "/movies",
          "nowplaying"
        )}
        
        {renderSliderSection(
          "Upcoming Movies",
          filteredUpcomingMovies,
          renderMovieCard,
          "/movies",
          "upcoming"
        )}
        
        {renderSliderSection(
          "Latest News",
          filteredNews,
          renderNewsCard,
          "/news",
          "news"
        )}
      </main>
    </div>
  );
};

export default HomePage;