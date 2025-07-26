import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaInfoCircle } from 'react-icons/fa'; // Using react-icons for consistent icons
import newsService from '../services/newsService';
import Navbar from '../components/Navbar';

// Define BASE_BACKEND_URL for image paths
// const BASE_BACKEND_URL = 'http://localhost:5000'; // IMPORTANT: Adjust this to your actual backend URL
  const BASE_BACKEND_URL =  import.meta.env.VITE_BASE_URL;

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to highlight text within a string
  const highlightText = (text, query) => {
    if (!text || !query) return text;

    const lowerText = String(text).toLowerCase();
    const lowerQuery = String(query).toLowerCase();

    if (!lowerText.includes(lowerQuery)) {
      return text;
    }

    const parts = [];
    let lastIndex = 0;
    let index;

    while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
      parts.push(text.substring(lastIndex, index));
      parts.push(
        <span key={index} className="bg-yellow-200 font-bold"> {/* Tailwind classes for highlight */}
          {text.substring(index, index + query.length)}
        </span>
      );
      lastIndex = index + query.length;
    }
    parts.push(text.substring(lastIndex));

    return <>{parts}</>;
  };

  // Callback to handle search input from Navbar
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNewsById(newsId);
        setNewsItem(response);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch news details';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [newsId]);

  // Logic to determine if the current news item matches the search query for conditional display
  const doesNewsItemContentMatch = (item, query) => {
    if (!query || !item) return true;

    const lowerQuery = String(query).toLowerCase();

    const titleMatch = item.title?.toLowerCase().includes(lowerQuery);
    const descriptionMatch = item.description?.toLowerCase().includes(lowerQuery);
    const statusMatch = item.status?.toLowerCase().includes(lowerQuery);

    const createdAtDate = item.created_at ? new Date(item.created_at) : null;
    const formattedCreatedAtLong = createdAtDate
      ? createdAtDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase()
      : '';
    const formattedCreatedAtShort = createdAtDate
      ? `${createdAtDate.getFullYear()}-${(createdAtDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${createdAtDate.getDate().toString().padStart(2, '0')}`
      : '';

    const createdAtMatch = formattedCreatedAtLong.includes(lowerQuery) || formattedCreatedAtShort.includes(lowerQuery);

    // Also check context content for a match
    const contextMatch = item.context?.some((block) => {
      switch (block.type) {
        case 'Description':
        case 'Quote':
        case 'Embed Link':
          return block.content?.toLowerCase().includes(lowerQuery);
        case 'Left and Right Content':
          return (
            block.leftText?.toLowerCase().includes(lowerQuery) ||
            block.rightText?.toLowerCase().includes(lowerQuery)
          );
        case 'Point':
          return block.content?.some((point) => point.toLowerCase().includes(lowerQuery));
        default:
          return false;
      }
    });

    return titleMatch || descriptionMatch || statusMatch || createdAtMatch || contextMatch;
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
              Loading news details...
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
            <button
              onClick={() => navigate('/news')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <FaArrowLeft className="mr-2" /> Back to News List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!newsItem || !doesNewsItemContentMatch(newsItem, searchQuery)) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar onSearch={handleSearch} />
        <div className="flex-grow flex items-center justify-center text-center py-5 container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-red-400 font-semibold">
              {newsItem && searchQuery
                ? 'The content of this news item does not match your current search query. Try another term.'
                : 'News item not found. It might have been removed or the ID is incorrect.'}
            </p>
            <button
              onClick={() => navigate('/news')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <FaArrowLeft className="mr-2" /> Back to News List
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

      <Navbar onSearch={handleSearch} />

      <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20">
        <button
          onClick={() => navigate('/news')}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-lg font-semibold mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to News
        </button>

        {/* Main News Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center w-full transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
          <img
            className="w-full h-auto max-h-[400px] rounded-t-xl object-cover"
            src={`${BASE_BACKEND_URL}/NewsImage/${newsItem.image}`}
            alt={newsItem.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x400/E0E0E0/333333?text=No+Image+Available';
            }}
          />
          <div className="p-4 sm:p-6 w-full">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-3 leading-tight">
              {highlightText(newsItem.title, searchQuery)}
            </h1>
            <p className="text-gray-700 leading-relaxed text-base mb-3">
              {highlightText(newsItem.description, searchQuery)}
            </p>
            <p className="text-gray-500 text-sm italic">
              Posted on:{' '}
              {highlightText(
                new Date(newsItem.created_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
                searchQuery
              )}
              {newsItem.status && ` | Status: ${highlightText(newsItem.status, searchQuery)}`}
            </p>

            {/* Render Context Blocks */}
            {newsItem.context && newsItem.context.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  News Content:
                </h2>
                {newsItem.context.map((block, index) => (
                  <div key={index} className="mb-6">
                    {block.type === 'Description' && (
                      <p
                        className="text-gray-700 leading-relaxed text-base mb-2"
                        dangerouslySetInnerHTML={{ __html: highlightText(block.content, searchQuery) }}
                      />
                    )}

                    {block.type === 'Left and Right Content' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-gray-700 leading-relaxed text-base">
                            {highlightText(block.leftText, searchQuery)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-700 leading-relaxed text-base">
                            {highlightText(block.rightText, searchQuery)}
                          </p>
                        </div>
                      </div>
                    )}

                    {block.type === 'Single Image' && block.image && (
                      <div className="w-full mt-4 mb-4 flex justify-center">
                        <img
                          className="max-w-full h-auto max-h-[350px] object-contain rounded-lg shadow-md"
                          src={`${BASE_BACKEND_URL}/NewsImage/${block.image}`}
                          alt="Context Image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x300/E0E0E0/333333?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}

                    {block.type === 'Double Image' && (block.leftImage || block.rightImage) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                        {block.leftImage && (
                          <div>
                            <img
                              className="w-full h-auto max-h-[250px] object-contain rounded-lg shadow-md"
                              src={`${BASE_BACKEND_URL}/NewsImage/${block.leftImage}`}
                              alt="Left Context Image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/300x200/E0E0E0/333333?text=Left+Image';
                              }}
                            />
                          </div>
                        )}
                        {block.rightImage && (
                          <div>
                            <img
                              className="w-full h-auto max-h-[250px] object-contain rounded-lg shadow-md"
                              src={`${BASE_BACKEND_URL}/NewsImage/${block.rightImage}`}
                              alt="Right Context Image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/300x200/E0E0E0/333333?text=Right+Image';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'Point' && block.content && block.content.length > 0 && (
                      <ul className="list-disc pl-8 my-4 space-y-2">
                        {block.content.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-gray-700 text-base">
                            {highlightText(point, searchQuery)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {block.type === 'Embed Link' && block.content && (
                      <p className="my-4">
                        <a
                          href={block.content.startsWith('http') ? block.content : `https://${block.content}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                        >
                          {highlightText(block.content, searchQuery)}
                        </a>
                      </p>
                    )}

                    {block.type === 'Quote' && block.content && (
                      <div className="border-l-4 border-[#0B193F] pl-4 italic text-gray-600 my-4 bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-base">{highlightText(block.content, searchQuery)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsDetailPage;
