import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, Clock, Calendar, Film, X, Tag, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';

const SEAT_TYPE_ORDER = ['CLASSIC', 'PRIME', 'PRIME_PLUS', 'RECLINER'];
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper function to format seat type names for display
const formatSeatTypeName = (type) => {
  switch (type) {
    case 'CLASSIC': return 'Classic';
    case 'PRIME': return 'Prime';
    case 'PRIME_PLUS': return 'Prime Plus';
    case 'RECLINER': return 'Recliner';
    default: return type;
  }
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <span className="text-xl">×</span>
        </button>
      </div>
    </div>
  );
};

// Modal Component for Showtime Details
const ShowtimeDetailsModal = ({ showtime, onClose }) => {
  const formatDate = (dateString, includeTime = false) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      };
      if (includeTime) {
          options.hour = '2-digit';
          options.minute = '2-digit';
      }
      return date.toLocaleString('en-US', options);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Showtime Details</h3>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h5 className="text-base font-bold text-gray-900">Basic Information</h5>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Movie:</span>
                    <span className="text-gray-900 font-semibold text-sm block">{showtime.movie_title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Screen:</span>
                    <span className="text-gray-900 font-semibold text-sm block">{showtime.screen_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Cinema:</span>
                    <span className="text-gray-900 font-semibold text-sm block">{showtime.cinema_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Show Date:</span>
                    <span className="text-gray-900 font-semibold text-sm">{formatDate(showtime.show_date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Show Time:</span>
                    <span className="text-gray-900 font-semibold text-sm">{showtime.show_time}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h5 className="text-base font-bold text-gray-900">Seat Type Prices</h5>
                </div>
                <div className="space-y-2">
                  {showtime.seat_type_prices && showtime.seat_type_prices.map((seatPrice, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm">{formatSeatTypeName(seatPrice.seat_type)}:</span>
                      <span className="text-gray-900 font-semibold text-sm">₹ {seatPrice.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h5 className="text-base font-bold text-gray-900">Creator Information</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
                    <span className="text-gray-900 font-semibold text-sm">{showtime.create_user}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
                    <span className="text-gray-900 font-semibold text-sm">{formatDate(showtime.created_at, true)}</span>
                  </div>
                  {showtime.update_user && (
                    <>
                      <div>
                        <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                        <span className="text-gray-900 font-semibold text-sm">{showtime.update_user}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
                        <span className="text-gray-900 font-semibold text-sm">{formatDate(showtime.updated_at, true)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-3 border-t border-blue-200/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component for Add/Edit Showtime
const ShowtimeFormModal = ({ showtime, onClose, onSubmit, isAdmin, isOwner, isManager, ownerId, cinemaId, screens, showNotification }) => {
  const [formData, setFormData] = useState({
    movie_id: showtime?.movie_id || '',
    screen_id: showtime?.screen_id || '',
    show_date: showtime?.show_date?.slice(0, 10) || '',
    show_time: showtime?.show_time || '',
    prices: showtime?.seat_type_prices || [{ seat_type: 'CLASSIC', price: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [availableScreens, setAvailableScreens] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      setAvailableScreens(screens);
    } else if (isOwner) {
    setAvailableScreens(screens); // Use the pre-filtered list directly
  } else if (isManager) {
      const managerScreens = screens.filter(screen => screen.cinema_id === Number(cinemaId));
      setAvailableScreens(managerScreens);
    }
  }, [screens, isAdmin, isOwner, isManager, ownerId, cinemaId]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = sessionStorage.getItem('adminToken') ||
          sessionStorage.getItem('ownerToken') ||
          sessionStorage.getItem('managerToken');

        const response = await fetch(`${BASE_URL}/api/movies/get-all-movies`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        showNotification(`Error fetching movies: ${error.message}`, 'error');
      }
    };

    fetchMovies();
  }, [showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPrices = [...formData.prices];
    updatedPrices[index][name] = value;
    setFormData(prev => ({ ...prev, prices: updatedPrices }));
  };

  const addPriceField = () => {
    const selectedTypes = formData.prices.map(p => p.seat_type);
    const nextAvailableType = SEAT_TYPE_ORDER.find(type => !selectedTypes.includes(type));

    if (nextAvailableType) {
      setFormData(prev => ({
        ...prev,
        prices: [...prev.prices, { seat_type: nextAvailableType, price: '' }]
      }));
    } else {
      showNotification("All seat types have been added.", "info");
    }
  };

  const removePriceField = (index) => {
    const updatedPrices = [...formData.prices];
    updatedPrices.splice(index, 1);
    setFormData(prev => ({ ...prev, prices: updatedPrices }));
  };

  const getAvailableSeatTypesForIndex = (priceIndex) => {
    const currentSeatType = formData.prices[priceIndex].seat_type;
    const otherSelectedTypes = formData.prices
      .filter((_, i) => i !== priceIndex)
      .map(p => p.seat_type);

    const availableTypes = SEAT_TYPE_ORDER.filter(type => !otherSelectedTypes.includes(type));

    if (!availableTypes.includes(currentSeatType)) {
      availableTypes.push(currentSeatType);
      availableTypes.sort((a, b) => SEAT_TYPE_ORDER.indexOf(a) - SEAT_TYPE_ORDER.indexOf(b));
    }
    return availableTypes;
  };

  const validateFormData = () => {
    const errors = [];
    if (!formData.movie_id) errors.push('Movie is required');
    if (!formData.screen_id) errors.push('Screen is required');
    if (!formData.show_date) errors.push('Show Date is required');
    if (!formData.show_time) errors.push('Show Time is required');
    if (formData.prices.length === 0) errors.push('At least one seat type price is required');
    formData.prices.forEach((price, index) => {
      if (!price.seat_type) errors.push(`Seat Type ${index + 1} is required`);
      if (!price.price || isNaN(price.price) || parseFloat(price.price) <= 0) errors.push(`Price for ${formatSeatTypeName(price.seat_type)} must be a positive number`);
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showNotification(error, 'error'));
      return;
    }
    setLoading(true);

    const submitData = {
      ...formData,
      prices: formData.prices.map(p => ({ seat_type: p.seat_type, price: parseFloat(p.price) }))
    };

    await onSubmit(submitData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {showtime ? 'Edit Showtime' : 'Add New Showtime'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Film className="w-4 h-4 text-blue-600" />
                    <span>Movie</span>
                  </label>
                  <select
                    name="movie_id"
                    value={formData.movie_id}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                    required
                  >
                    <option value="">Select Movie</option>
                    {movies.map(movie => (
                      <option key={movie.movie_id} value={movie.movie_id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Film className="w-4 h-4 text-blue-600" />
                    <span>Screen</span>
                  </label>
                  <select
                    name="screen_id"
                    value={formData.screen_id}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                    required
                  >
                    <option value="">Select Screen</option>
                    {availableScreens.map(screen => (
                      <option key={screen.screen_id} value={screen.screen_id}>
                        {screen.screen_name} ({screen.cinema_name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Show Date</span>
                  </label>
                  <input
                    type="date"
                    name="show_date"
                    value={formData.show_date}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Show Time</span>
                  </label>
                  <input
                    type="time"
                    name="show_time"
                    value={formData.show_time}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span>Seat Type Prices</span>
                  </label>
                  {formData.prices.map((price, index) => {
                    const availableSeatTypes = getAvailableSeatTypesForIndex(index);
                    return (
                      <div key={index} className="flex space-x-2 mb-2">
                        <select
                          name="seat_type"
                          value={price.seat_type}
                          onChange={(e) => handlePriceChange(index, e)}
                          className="w-1/2 p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                          required
                        >
                          {availableSeatTypes.map(type => (
                            <option key={type} value={type}>{formatSeatTypeName(type)}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          name="price"
                          value={price.price}
                          onChange={(e) => handlePriceChange(index, e)}
                          placeholder="Price"
                          className="w-1/2 p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removePriceField(index)}
                          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  {formData.prices.length < SEAT_TYPE_ORDER.length && (
                    <button
                      type="button"
                      onClick={addPriceField}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Seat Type</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-blue-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-transparent hover:border-blue-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {loading ? 'Processing...' : showtime ? '✨ Update Showtime' : '🎬 Add Showtime'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bulk Add Showtime Modal Component
const BulkAddShowtimeModal = ({ onClose, onSubmit, showNotification, movies, screens: allScreens, isAdmin, isOwner, isManager, ownerId, cinemaId }) => {
  const initialShowtimeState = {
    movie_id: '',
    screen_id: '',
    show_date: '',
    show_time: '',
    prices: [{ seat_type: 'CLASSIC', price: '' }]
  };

  const [bulkCount, setBulkCount] = useState(1);
  const [bulkForms, setBulkForms] = useState([{ ...initialShowtimeState }]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keepDateTimeSame, setKeepDateTimeSame] = useState(false);
  const [keepPricesSame, setKeepPricesSame] = useState(false);
  const [keepMovieSame, setKeepMovieSame] = useState(false);
  const [availableScreens, setAvailableScreens] = useState([]);
  const [unifiedFormData, setUnifiedFormData] = useState({ ...initialShowtimeState, selected_screen_ids: [] });

  const allOptionsChecked = keepMovieSame && keepDateTimeSame && keepPricesSame;

  useEffect(() => {
    if (isAdmin) {
      setAvailableScreens(allScreens);
    } else if (isOwner) {
    setAvailableScreens(allScreens); // Use the pre-filtered list directly
  } else if (isManager) {
      const managerScreens = allScreens.filter(screen => screen.cinema_id === Number(cinemaId));
      setAvailableScreens(managerScreens);
    }
  }, [allScreens, isAdmin, isOwner, isManager, ownerId, cinemaId]);

  useEffect(() => {
    if (allOptionsChecked) return;

    const newForms = Array.from({ length: bulkCount }, (_, i) => {
      const existingForm = bulkForms[i];
      const firstForm = bulkForms[0] || initialShowtimeState;
      if (existingForm) {
        return {
          ...existingForm,
          movie_id: (keepMovieSame && i > 0) ? firstForm.movie_id : existingForm.movie_id,
          show_date: (keepDateTimeSame && i > 0) ? firstForm.show_date : existingForm.show_date,
          show_time: (keepDateTimeSame && i > 0) ? firstForm.show_time : existingForm.show_time,
          prices: (keepPricesSame && i > 0) ? JSON.parse(JSON.stringify(firstForm.prices)) : existingForm.prices,
        };
      }
      return {
        ...initialShowtimeState,
        movie_id: (keepMovieSame) ? firstForm.movie_id : '',
        show_date: (keepDateTimeSame) ? firstForm.show_date : '',
        show_time: (keepDateTimeSame) ? firstForm.show_time : '',
        prices: (keepPricesSame) ? JSON.parse(JSON.stringify(firstForm.prices)) : [{ seat_type: 'CLASSIC', price: '' }],
      };
    });
    setBulkForms(newForms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkCount, keepMovieSame, keepDateTimeSame, keepPricesSame, allOptionsChecked]);

  const handleBulkCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    const newCount = Math.min(Math.max(count, 1), 50);
    setBulkCount(newCount);
    if (currentBulkIndex >= newCount) {
      setCurrentBulkIndex(newCount - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (allOptionsChecked) {
      setUnifiedFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const newForms = [...bulkForms];
      newForms[currentBulkIndex][name] = value;

      if (currentBulkIndex === 0) {
        if (name === 'movie_id' && keepMovieSame) {
          for (let i = 1; i < newForms.length; i++) newForms[i][name] = value;
        }
        if ((name === 'show_date' || name === 'show_time') && keepDateTimeSame) {
          for (let i = 1; i < newForms.length; i++) newForms[i][name] = value;
        }
      }
      setBulkForms(newForms);
    }
  };

  const handlePriceChange = (priceIndex, e) => {
    const { name, value } = e.target;
    const source = allOptionsChecked ? unifiedFormData : bulkForms[currentBulkIndex];
    const newPrices = JSON.parse(JSON.stringify(source.prices)); // Deep copy
    newPrices[priceIndex][name] = value;

    if (allOptionsChecked) {
      setUnifiedFormData(prev => ({ ...prev, prices: newPrices }));
    } else {
      const newForms = [...bulkForms];
      newForms[currentBulkIndex].prices = newPrices;
      if (keepPricesSame && currentBulkIndex === 0) {
        for (let i = 1; i < newForms.length; i++) {
          newForms[i].prices = JSON.parse(JSON.stringify(newPrices));
        }
      }
      setBulkForms(newForms);
    }
  };

  const addPriceField = () => {
    const source = allOptionsChecked ? unifiedFormData : bulkForms[currentBulkIndex];
    const selectedTypes = source.prices.map(p => p.seat_type);
    const nextAvailableType = SEAT_TYPE_ORDER.find(type => !selectedTypes.includes(type));

    if (nextAvailableType) {
      const newPrices = [...source.prices, { seat_type: nextAvailableType, price: '' }];
      if (allOptionsChecked) {
        setUnifiedFormData(prev => ({ ...prev, prices: newPrices }));
      } else {
        const newForms = [...bulkForms];
        newForms[currentBulkIndex].prices = newPrices;
        if (keepPricesSame && currentBulkIndex === 0) {
          for (let i = 1; i < newForms.length; i++) {
            newForms[i].prices = JSON.parse(JSON.stringify(newPrices));
          }
        }
        setBulkForms(newForms);
      }
    } else {
      showNotification("All seat types have been added.", "info");
    }
  };

  const removePriceField = (priceIndex) => {
    const source = allOptionsChecked ? unifiedFormData : bulkForms[currentBulkIndex];
    const newPrices = [...source.prices];
    newPrices.splice(priceIndex, 1);
    if (allOptionsChecked) {
      setUnifiedFormData(prev => ({ ...prev, prices: newPrices }));
    } else {
      const newForms = [...bulkForms];
      newForms[currentBulkIndex].prices = newPrices;
      if (keepPricesSame && currentBulkIndex === 0) {
        for (let i = 1; i < newForms.length; i++) {
          newForms[i].prices = JSON.parse(JSON.stringify(newPrices));
        }
      }
      setBulkForms(newForms);
    }
  };

  const getAvailableSeatTypesForIndex = (prices, priceIndex) => {
    const currentSeatType = prices[priceIndex]?.seat_type;
    if (!currentSeatType) return SEAT_TYPE_ORDER;

    const otherSelectedTypes = prices
      .filter((_, i) => i !== priceIndex)
      .map(p => p.seat_type);

    const availableTypes = SEAT_TYPE_ORDER.filter(type => !otherSelectedTypes.includes(type));

    if (!availableTypes.includes(currentSeatType)) {
      availableTypes.push(currentSeatType);
      availableTypes.sort((a, b) => SEAT_TYPE_ORDER.indexOf(a) - SEAT_TYPE_ORDER.indexOf(b));
    }
    return availableTypes;
  };

  const handleScreenSelection = (screenId) => {
    setUnifiedFormData(prev => {
      const selected_screen_ids = prev.selected_screen_ids.includes(screenId)
        ? prev.selected_screen_ids.filter(id => id !== screenId)
        : [...prev.selected_screen_ids, screenId];
      return { ...prev, selected_screen_ids };
    });
  };

  const nextBulkForm = () => currentBulkIndex < bulkForms.length - 1 && setCurrentBulkIndex(prev => prev + 1);
  const prevBulkForm = () => currentBulkIndex > 0 && setCurrentBulkIndex(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalShowtimesData = [];
    let allErrors = [];

    if (allOptionsChecked) {
      const { movie_id, show_date, show_time, prices, selected_screen_ids } = unifiedFormData;
      if (!movie_id || !show_date || !show_time || selected_screen_ids.length === 0) {
        allErrors.push('Movie, Show Date, Show Time, and at least one Screen are required.');
      }
      if (!prices || prices.length === 0 || prices.some(p => !p.price || isNaN(p.price) || p.price <= 0)) {
        allErrors.push('All seat prices must be valid positive numbers.');
      }

      if (allErrors.length === 0) {
        finalShowtimesData = selected_screen_ids.map(screen_id => ({
          movie_id,
          show_date,
          show_time,
          screen_id,
          prices: prices.map(p => ({ seat_type: p.seat_type, price: parseFloat(p.price) })),
        }));
      }
    } else {
      bulkForms.forEach((show, index) => {
        if (!show.movie_id || !show.screen_id || !show.show_date || !show.show_time) {
          allErrors.push(`Showtime ${index + 1}: All fields are required.`);
        }
        if (!show.prices || show.prices.length === 0 || show.prices.some(p => !p.price || isNaN(p.price) || p.price <= 0)) {
          allErrors.push(`Showtime ${index + 1}: All prices must be valid positive numbers.`);
        }
      });
      if (allErrors.length === 0) {
        finalShowtimesData = bulkForms.map(show => ({
          ...show,
          prices: show.prices.map(p => ({ seat_type: p.seat_type, price: parseFloat(p.price) }))
        }));
      }
    }

    if (allErrors.length > 0) {
      setLoading(false);
      allErrors.forEach(err => showNotification(err, 'error'));
      return;
    }

    await onSubmit(finalShowtimesData);
    setLoading(false);
  };

  const currentForm = bulkForms[currentBulkIndex] || initialShowtimeState;

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Bulk Add Showtimes</h3>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-200">
            {!allOptionsChecked && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Showtimes (1-50)</label>
                <input
                  type="number"
                  min="1" max="50"
                  value={bulkCount}
                  onChange={handleBulkCountChange}
                  className="w-24 p-2 border-2 border-blue-200 rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={keepMovieSame}
                  onChange={(e) => setKeepMovieSame(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-blue-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Keep movie same for all</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={keepDateTimeSame}
                  onChange={(e) => setKeepDateTimeSame(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-blue-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Keep date & time same for all</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={keepPricesSame}
                  onChange={(e) => setKeepPricesSame(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-blue-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Keep seat prices same for all</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {allOptionsChecked ? (
              // UNIFIED FORM
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Movie</label>
                  <select name="movie_id" value={unifiedFormData.movie_id} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required>
                    <option value="">Select Movie</option>
                    {movies.map(movie => (<option key={movie.movie_id} value={movie.movie_id}>{movie.title}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Show Date</label>
                  <input type="date" name="show_date" value={unifiedFormData.show_date} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Show Time</label>
                  <input type="time" name="show_time" value={unifiedFormData.show_time} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Seat Type Prices</label>
                  {unifiedFormData.prices.map((price, index) => {
                    const availableSeatTypes = getAvailableSeatTypesForIndex(unifiedFormData.prices, index);
                    return (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <select name="seat_type" value={price.seat_type} onChange={e => handlePriceChange(index, e)} className="w-1/2 p-3 border-2 border-blue-200 rounded-xl">
                          {availableSeatTypes.map(type => (<option key={type} value={type}>{formatSeatTypeName(type)}</option>))}
                        </select>
                        <input type="number" name="price" placeholder="Price" value={price.price} onChange={e => handlePriceChange(index, e)} className="w-1/2 p-3 border-2 border-blue-200 rounded-xl" required />
                        <button type="button" onClick={() => removePriceField(index)} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                  {unifiedFormData.prices.length < SEAT_TYPE_ORDER.length && (
                    <button type="button" onClick={addPriceField} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center space-x-2"><Plus size={16} /> <span>Add Price</span></button>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Screens</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-4 border-2 border-blue-200 rounded-xl">
                    {availableScreens.map(screen => (
                      <div key={screen.screen_id} onClick={() => handleScreenSelection(screen.screen_id)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3 ${unifiedFormData.selected_screen_ids.includes(screen.screen_id) ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100 border-blue-200'}`}>
                        {unifiedFormData.selected_screen_ids.includes(screen.screen_id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                        <div>
                          <p className="font-semibold text-gray-800">{screen.screen_name}</p>
                          <p className="text-xs text-gray-500">{screen.cinema_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // PAGINATED FORM
              <>
                <div className="border-b border-blue-200 pb-4 mb-4">
                  <h4 className="text-lg font-semibold text-blue-700">Showtime {currentBulkIndex + 1} of {bulkCount}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Movie</label>
                    <select name="movie_id" value={currentForm.movie_id} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required disabled={keepMovieSame && currentBulkIndex > 0}>
                      <option value="">Select Movie</option>
                      {movies.map(movie => (<option key={movie.movie_id} value={movie.movie_id}>{movie.title}</option>))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Screen</label>
                    <select name="screen_id" value={currentForm.screen_id} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required>
                      <option value="">Select Screen</option>
                      {availableScreens.map(screen => (<option key={screen.screen_id} value={screen.screen_id}>{screen.screen_name} ({screen.cinema_name})</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Show Date</label>
                    <input type="date" name="show_date" value={currentForm.show_date} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required disabled={keepDateTimeSame && currentBulkIndex > 0} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Show Time</label>
                    <input type="time" name="show_time" value={currentForm.show_time} onChange={handleChange} className="w-full p-3 border-2 border-blue-200 rounded-xl" required disabled={keepDateTimeSame && currentBulkIndex > 0} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Seat Type Prices</label>
                    {currentForm.prices.map((price, index) => {
                      const availableSeatTypes = getAvailableSeatTypesForIndex(currentForm.prices, index);
                      return (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <select name="seat_type" value={price.seat_type} onChange={e => handlePriceChange(index, e)} className="w-1/2 p-3 border-2 border-blue-200 rounded-xl" disabled={keepPricesSame && currentBulkIndex > 0}>
                            {availableSeatTypes.map(type => (<option key={type} value={type}>{formatSeatTypeName(type)}</option>))}
                          </select>
                          <input type="number" name="price" placeholder="Price" value={price.price} onChange={e => handlePriceChange(index, e)} className="w-1/2 p-3 border-2 border-blue-200 rounded-xl" required disabled={keepPricesSame && currentBulkIndex > 0} />
                          <button type="button" onClick={() => removePriceField(index)} className="p-3 bg-red-500 text-white rounded-xl" disabled={keepPricesSame && currentBulkIndex > 0}><Trash2 size={16} /></button>
                        </div>
                      );
                    })}
                    {currentForm.prices.length < SEAT_TYPE_ORDER.length && (
                      <button type="button" onClick={addPriceField} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center space-x-2" disabled={keepPricesSame && currentBulkIndex > 0}><Plus size={16} /> <span>Add Price</span></button>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-blue-200">
              {!allOptionsChecked && bulkCount > 1 && (
                <div className="flex justify-between items-center mb-6">
                  <button
                    type="button"
                    onClick={prevBulkForm}
                    disabled={currentBulkIndex === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center"
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  <span>Editing Showtime {currentBulkIndex + 1} of {bulkCount}</span>
                  <button
                    type="button"
                    onClick={nextBulkForm}
                    disabled={currentBulkIndex === bulkCount - 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 flex items-center"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:opacity-70"
                >
                  {loading ? 'Processing...' : `🎬 Add Showtime(s)`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Showtime Component
const Showtime = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const isAdmin = !!sessionStorage.getItem('adminToken');
  const isOwner = !!sessionStorage.getItem('ownerToken');
  const isManager = !!sessionStorage.getItem('managerToken');

  const ownerId = sessionStorage.getItem('ownerId');
  const cinemaId = sessionStorage.getItem('cinemaId');
  const userEmail = sessionStorage.getItem('adminEmail') || sessionStorage.getItem('ownerEmail') || sessionStorage.getItem('managerEmail');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');

      const [showtimesRes, screensRes, moviesRes] = await Promise.all([
        fetch(
          isAdmin ? `${BASE_URL}/api/showtimes/get-all` :
            isOwner ? `${BASE_URL}/api/showtimes/by-owner` :
              `${BASE_URL}/api/showtimes/by-cinema`,
          {
            method: isAdmin ? 'GET' : 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: isAdmin ? null : JSON.stringify(isOwner ? { owner_id: ownerId } : { cinema_id: cinemaId })
          }
        ),
        fetch(
          isAdmin ? `${BASE_URL}/api/screen/get-all` :
            isOwner ? `${BASE_URL}/api/screen/by-owner` :
              `${BASE_URL}/api/screen/by-cinema`,
          {
            method: isAdmin ? 'GET' : 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: isAdmin ? null : JSON.stringify(isOwner ? { owner_id: ownerId } : { cinema_id: cinemaId })
          }
        ),
        fetch(`${BASE_URL}/api/movies/get-all-movies`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (!showtimesRes.ok) throw new Error('Failed to fetch showtimes');
      if (!screensRes.ok) throw new Error('Failed to fetch screens');
      if (!moviesRes.ok) throw new Error('Failed to fetch movies');

      const showtimesData = await showtimesRes.json();
      const screensData = await screensRes.json();
      const moviesData = await moviesRes.json();
      
      const sortedShowtimes = showtimesData.sort((a,b) => b.showtime_id - a.showtime_id);
      setShowtimes(sortedShowtimes);
      setScreens(screensData);
      setMovies(moviesData);

    } catch (error) {
      console.error('Error fetching initial data:', error);
      showNotification(`Error fetching data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isOwner, isManager, ownerId, cinemaId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);


  const toggleShowtimeStatus = async (showtimeId) => {
    try {
      const token = sessionStorage.getItem('adminToken') ||
        sessionStorage.getItem('ownerToken') ||
        sessionStorage.getItem('managerToken');

      const response = await fetch(`${BASE_URL}/api/showtimes/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: showtimeId })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle showtime status');
      }

      const result = await response.json();
      showNotification(result.message);
      fetchInitialData();
    } catch (error) {
      console.error('Error toggling showtime status:', error);
      showNotification(`Error toggling showtime status: ${error.message}`, 'error');
    }
  };

  const getShowtimeDetails = async (showtimeId) => {
    try {
      const token = sessionStorage.getItem('adminToken') ||
        sessionStorage.getItem('ownerToken') ||
        sessionStorage.getItem('managerToken');

      const response = await fetch(`${BASE_URL}/api/showtimes/detail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: showtimeId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch showtime details');
      }

      const showtimeData = await response.json();
      setSelectedShowtime(showtimeData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching showtime details:', error);
      showNotification(`Error fetching showtime details: ${error.message}`, 'error');
    }
  };

  const handleAddOrUpdateShowtime = async (formData) => {
    try {
      const token = sessionStorage.getItem('adminToken') ||
        sessionStorage.getItem('ownerToken') ||
        sessionStorage.getItem('managerToken');

      const url = formMode === 'add'
        ? `${BASE_URL}/api/showtimes/add`
        : `${BASE_URL}/api/showtimes/update`;

      const method = formMode === 'add' ? 'POST' : 'PUT';

      const payload = {
        ...formData,
        seat_type_prices: formData.prices
      };

      if (formMode === 'add') {
        payload.create_user = userEmail;
      } else {
        payload.id = selectedShowtime.showtime_id;
        payload.update_user = userEmail;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to ${formMode} showtime: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();

      showNotification(result.message);
      fetchInitialData();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error(`Error ${formMode}ing showtime:`, error);
      showNotification(`Error ${formMode}ing showtime: ${error.message}`, 'error');
    }
  };

  const handleBulkSubmit = async (bulkData) => {
    try {
      const token = sessionStorage.getItem('adminToken') ||
        sessionStorage.getItem('ownerToken') ||
        sessionStorage.getItem('managerToken');

      const response = await fetch(`${BASE_URL}/api/showtimes/bulk-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          showtimes: bulkData.map(show => ({
            ...show,
            seat_type_prices: show.prices,
            create_user: userEmail
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to bulk add showtimes');
      }

      const result = await response.json();
      showNotification(result.message);
      fetchInitialData();
      setIsBulkAddModalOpen(false);
    } catch (error) {
      console.error('Error bulk adding showtimes:', error);
      showNotification(`Error bulk adding showtimes: ${error.message}`, 'error');
    }
  };

  const handleDeleteShowtime = async (showtimeId) => {
    // NOTE: A confirmation modal is recommended here instead of deleting directly.
    try {
      const token = sessionStorage.getItem('adminToken') ||
        sessionStorage.getItem('ownerToken') ||
        sessionStorage.getItem('managerToken');

      const response = await fetch(`${BASE_URL}/api/showtimes/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: showtimeId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete showtime');
      }

      const result = await response.json();
      showNotification(result.message);
      fetchInitialData();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      showNotification(`Error deleting showtime: ${error.message}`, 'error');
    }
  };

  const filteredShowtimes = showtimes.filter(showtime => {
    const movieTitle = showtime.movie_title || '';
    const screenName = showtime.screen_name || '';
    const cinemaName = showtime.cinema_name || '';
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch = movieTitle.toLowerCase().includes(searchTermLower) ||
                          screenName.toLowerCase().includes(searchTermLower) ||
                          cinemaName.toLowerCase().includes(searchTermLower);

    const matchesStatus = statusFilter === 'All' || showtime.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShowtimes = filteredShowtimes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);


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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Showtime Management</h2>
              <p className="text-gray-600 mt-1">
                {isAdmin ? 'Manage all showtimes' : `Managing showtimes for your cinema${isManager ? ` (ID: ${cinemaId})` : ''}`}
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search showtimes..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedShowtime(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Showtime</span>
              </button>
              <button
                onClick={() => setIsBulkAddModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Bulk Add</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Showtimes" value={showtimes.length} icon={Film} color="#3B82F6" />
            <StatCard title="Active Showtimes" value={showtimes.filter(showtime => showtime.status === 'Active').length} icon={Film} color="#10B981" />
            <StatCard title="Inactive Showtimes" value={showtimes.filter(showtime => showtime.status === 'Inactive').length} icon={Film} color="#EF4444" />
          </div>
        </div>
      </div>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Movie</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Screen</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Cinema</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Show Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Show Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {currentShowtimes.map((showtime, index) => (
                    <tr key={showtime.showtime_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{showtime.movie_title}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{showtime.screen_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{showtime.cinema_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(showtime.show_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{showtime.show_time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${showtime.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                          {showtime.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => getShowtimeDetails(showtime.showtime_id)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const token = sessionStorage.getItem('adminToken') ||
                                  sessionStorage.getItem('ownerToken') ||
                                  sessionStorage.getItem('managerToken');

                                const response = await fetch(`${BASE_URL}/api/showtimes/detail`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ id: showtime.showtime_id })
                                });

                                if (!response.ok) throw new Error('Failed to fetch showtime details');

                                const fullShowtime = await response.json();
                                setFormMode('edit');
                                setSelectedShowtime(fullShowtime);
                                setIsFormModalOpen(true);
                              } catch (err) {
                                showNotification(`Error fetching showtime details: ${err.message}`, 'error');
                              }
                            }}
                            className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200"
                            title="Edit Showtime"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteShowtime(showtime.showtime_id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                            title="Delete Showtime"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleShowtimeStatus(showtime.showtime_id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${showtime.status === 'Active' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'}`}
                            title={`${showtime.status === 'Active' ? 'Deactivate' : 'Activate'} Showtime`}
                          >
                            {showtime.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentShowtimes.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No showtimes found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
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

      {isBulkAddModalOpen && (
        <BulkAddShowtimeModal
          onClose={() => setIsBulkAddModalOpen(false)}
          onSubmit={handleBulkSubmit}
          showNotification={showNotification}
          movies={movies}
          screens={screens}
          isAdmin={isAdmin}
          isOwner={isOwner}
          isManager={isManager}
          ownerId={ownerId}
          cinemaId={cinemaId}
        />
      )}

      {isModalOpen && selectedShowtime && (
        <ShowtimeDetailsModal
          showtime={selectedShowtime}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isFormModalOpen && (
        <ShowtimeFormModal
          showtime={selectedShowtime}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleAddOrUpdateShowtime}
          isAdmin={isAdmin}
          isOwner={isOwner}
          isManager={isManager}
          ownerId={ownerId}
          cinemaId={cinemaId}
          screens={screens}
          showNotification={showNotification}
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

export default Showtime;