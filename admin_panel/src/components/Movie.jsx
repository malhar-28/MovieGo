import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, Film, Calendar, Clock, Star, BookOpen, Image as ImageIcon, X, Tag, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Utility function to convert duration to minutes
const convertToMinutes = (duration) => {
    const match = duration.match(/(\d+)hr(\d+)m/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
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

// Modal Component for Movie Details
const MovieDetailsModal = ({ movie, onClose }) => {
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

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
                {/* Header with Background Image */}
                <div className="relative overflow-hidden h-48">
                    {/* Background Image */}
                    {movie.background_image && (
                        <img
                            src={`${BASE_URL}/MovieImages/${movie.background_image}`}
                            alt="Movie Background"
                            className="w-full h-full object-cover absolute inset-0 z-0"
                        />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
                    {/* Content and Close Button */}
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
                        <div>
                            <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Movie Details</h3>
                            <div className="w-12 h-1 bg-blue-300 rounded-full"></div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-blue-100 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 group backdrop-blur-sm"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-grow">
                    <div className="p-4">
                        {/* Movie Header Section */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            {/* Poster */}
                            <div className="flex-shrink-0 text-center lg:text-left">
                                {movie.poster_image ? (
                                    <img
                                        className="h-48 w-32 mx-auto lg:mx-0 object-cover rounded-xl shadow-xl ring-2 ring-blue-100"
                                        src={`${BASE_URL}/MovieImages/${movie.poster_image}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="h-48 w-32 mx-auto lg:mx-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-xl ring-2 ring-blue-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                                            {movie.title.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Title and Status */}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {movie.title}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${movie.status === 'Active'
                                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                                        : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full mr-1 ${movie.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                                            }`}></div>
                                        {movie.status}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ring-1 ring-blue-200 shadow-sm">
                                        {movie.release_status}
                                    </span>
                                </div>
                                {/* Quick Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Genre</div>
                                        <div className="text-gray-900 font-medium text-sm break-words whitespace-pre-wrap">
                                            {movie.genre}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Duration</div>
                                        <div className="text-gray-900 font-medium text-sm">{movie.duration}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Rating</div>
                                        <div className="text-gray-900 font-medium text-sm">{movie.rating}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Detailed Information */}
                        <div className="space-y-4">
                            {/* Release Date with Time */}
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Release Information</h5>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium text-sm">Release Date & Time:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{formatDate(movie.release_date)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium text-sm">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${movie.release_status === 'Now Playing'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {movie.release_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Creator Information */}
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Creator Information</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{movie.create_user}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{formatDate(movie.created_at)}</span>
                                    </div>
                                    {movie.update_user && (
                                        <>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{movie.update_user}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{formatDate(movie.updated_at)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Synopsis */}
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Synopsis</h5>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {movie.synopsis || 'No synopsis available.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
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

// Duration Input Component
const DurationInput = ({ value, onChange }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        if (value) {
            const match = value.match(/(\d+)hr(\d+)m/);
            if (match) {
                setHours(parseInt(match[1]));
                setMinutes(parseInt(match[2]));
            }
        }
    }, [value]);

    const handleHoursChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setHours(val);
        onChange(`${val}hr${minutes}m`);
    };

    const handleMinutesChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setMinutes(val);
        onChange(`${hours}hr${val}m`);
    };

    return (
        <div className="flex gap-2">
            <select
                value={hours}
                onChange={handleHoursChange}
                className="flex-1 p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
            >
                {Array.from({ length: 6 }, (_, i) => (
                    <option key={i} value={i}>{i} hr</option>
                ))}
            </select>
            <select
                value={minutes}
                onChange={handleMinutesChange}
                className="flex-1 p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i * 5} value={i * 5}>{i * 5} m</option>
                ))}
            </select>
        </div>
    );
};

// Genre Select Component
const GenreSelect = ({ value, onChange, formIndex }) => {
    const genreOptions = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
        'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Family'
    ];

    const [selectedGenres, setSelectedGenres] = useState(value ? value.split(',') : []);

    const toggleGenre = (genre) => {
        const newSelected = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];
        setSelectedGenres(newSelected);
        onChange(newSelected.join(','));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mt-2">
                {genreOptions.map(genre => (
                    <button
                        key={`${genre}_${formIndex}`}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${selectedGenres.includes(genre)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <input
                type="hidden"
                name={`genre_${formIndex}`}
                value={selectedGenres.join(',')}
            />
        </div>
    );
};

// Single Movie Form Component (for bulk add)
const MovieForm = ({ formData, onChange, onFileChange, index, totalForms, movie }) => {
    const isBulk = totalForms > 1;
    const fieldName = (base) => isBulk ? `${base}_${index}` : base;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onFileChange(e, index);
        
        // Update the preview immediately
        if (file && e.target.name.includes('poster_image')) {
            onChange({ target: { name: fieldName("poster_image"), value: file } });
        } else if (file && e.target.name.includes('background_image')) {
            onChange({ target: { name: fieldName("background_image"), value: file } });
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-blue-200 pb-4 mb-4">
                <h4 className="text-lg font-semibold text-blue-700">
                    Movie {index + 1} of {totalForms}
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <Film className="w-4 h-4 text-blue-600" />
                        <span>Movie Title</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("title")}
                        value={formData.title}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter movie title"
                        required
                    />
                </div>
                {/* Genre */}
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <span>Genre</span>
                    </label>
                    <GenreSelect
                        value={formData.genre}
                        onChange={(value) =>
                            onChange({ target: { name: fieldName("genre"), value } })
                        }
                        formIndex={index}
                        key={`genre_select_${index}`}
                    />
                </div>
                {/* Duration */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Duration</span>
                    </label>
                    <DurationInput
                        value={formData.duration}
                        onChange={(value) =>
                            onChange({ target: { name: fieldName("duration"), value } })
                        }
                    />
                </div>
                {/* Rating */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span>Rating</span>
                    </label>
                    <select
                        name={fieldName("rating")}
                        value={formData.rating}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        required
                    >
                        <option value="">Select Rating</option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="NC-17">NC-17</option>
                    </select>
                </div>
                {/* Release Date */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Release Date</span>
                    </label>
                    <input
                        type="date"
                        name={fieldName("release_date")}
                        value={formData.release_date}
                        onChange={onChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        required
                    />
                </div>
                {/* Release Status */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                        <span>Release Status</span>
                    </label>
                    <select
                        name={fieldName("release_status")}
                        value={formData.release_status}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        required
                    >
                        <option value="Now Playing">🎬 Now Playing</option>
                        <option value="Upcoming">🔜 Upcoming</option>
                    </select>
                </div>
                {/* Synopsis */}
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Synopsis</span>
                    </label>
                    <textarea
                        name={fieldName("synopsis")}
                        value={formData.synopsis}
                        onChange={onChange}
                        rows="4"
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 resize-none"
                        placeholder="Enter movie synopsis..."
                        required
                    />
                </div>
                {/* Poster Image */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Poster Image</span>
                        {movie && (
                            <span className="text-xs text-gray-500">(Leave empty to keep current)</span>
                        )}
                    </label>
                    <input
                        type="file"
                        name={fieldName("poster_image")}
                        onChange={handleFileChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                        accept="image/*"
                        required={!movie && index === 0}
                    />
                    {formData.poster_image && (
                        <div className="mt-2">
                            <p className="text-sm text-green-600">Selected: {formData.poster_image.name}</p>
                            <img
                                src={URL.createObjectURL(formData.poster_image)}
                                alt="Poster Preview"
                                className="h-24 mt-2 rounded shadow border border-blue-200"
                            />
                        </div>
                    )}
                </div>

                {/* Background Image */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Background Image</span>
                        {movie && (
                            <span className="text-xs text-gray-500">(Leave empty to keep current)</span>
                        )}
                    </label>
                    <input
                        type="file"
                        name={fieldName("background_image")}
                        onChange={handleFileChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                        accept="image/*"
                    />
                    {formData.background_image && (
                        <div className="mt-2">
                            <p className="text-sm text-green-600">Selected: {formData.background_image.name}</p>
                            <img
                                src={URL.createObjectURL(formData.background_image)}
                                alt="Background Preview"
                                className="h-24 mt-2 rounded shadow border border-blue-200 object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Modal Component for Add/Edit Movie (updated with bulk add)
const MovieFormModal = ({ movie, onClose, onSubmit, isBulkAdd, initialBulkCount, showNotification }) => {
    const [formData, setFormData] = useState(
        movie ? {
            title: movie.title || '',
            genre: movie.genre || '',
            duration: movie.duration || '0hr0m',
            rating: movie.rating || '',
            synopsis: movie.synopsis || '',
            release_date: movie.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : '',
            release_status: movie.release_status || 'Now Playing',
            poster_image: null,
            background_image: null,
        } : {
            title: '',
            genre: '',
            duration: '0hr0m',
            rating: '',
            synopsis: '',
            release_date: '',
            release_status: 'Now Playing',
            poster_image: null,
            background_image: null,
        }
    );

    const [bulkForms, setBulkForms] = useState(() => {
        if (isBulkAdd && initialBulkCount > 1) {
            return Array.from({ length: initialBulkCount }, () => ({
                title: '',
                genre: '',
                duration: '0hr0m',
                rating: '',
                synopsis: '',
                release_date: '',
                release_status: 'Now Playing',
                poster_image: null,
                background_image: null,
            }));
        }
        return [];
    });

    const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
    const [bulkCount, setBulkCount] = useState(initialBulkCount || 1);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isBulkAdd && bulkCount > 1) {
            setBulkForms(prevForms => {
                const newForms = [...prevForms];
                const baseName = name.replace(/_\d+$/, '');
                newForms[currentBulkIndex] = {
                    ...newForms[currentBulkIndex],
                    [baseName]: value
                };
                return newForms;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, index) => {
        const { name, files } = e.target;
        const file = files[0];

        if (isBulkAdd && bulkCount > 1) {
            setBulkForms(prevForms => {
                const newForms = [...prevForms];
                const baseName = name.replace(/_\d+$/, '');
                newForms[index] = {
                    ...newForms[index],
                    [baseName]: file || null
                };
                return newForms;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: file || null }));
        }
    };

    const validateFormData = (data) => {
        const errors = [];
        if (!data.title) errors.push('Title is required');
        if (!data.genre) errors.push('Genre is required');
        if (!data.duration) errors.push('Duration is required');
        if (!data.rating) errors.push('Rating is required');
        if (!data.release_date) errors.push('Release date is required');
        if (!data.synopsis) errors.push('Synopsis is required');
        if (!data.release_status) errors.push('Release status is required');

        // Only require images for new movies (not for updates)
        if (!movie && !data.poster_image && (currentBulkIndex === 0 || !isBulkAdd)) {
            errors.push('Poster image is required for new movies');
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isBulkAdd && bulkCount > 1) {
            // Validate all forms
            const allErrors = [];
            bulkForms.forEach((form, index) => {
                const errors = validateFormData(form);
                if (errors.length > 0) {
                    allErrors.push(`Movie ${index + 1}: ${errors.join(', ')}`);
                }
            });
            
            if (allErrors.length > 0) {
                allErrors.forEach(error => showNotification(error, 'error'));
                return;
            }

            setLoading(true);
            try {
                const submitData = new FormData();
                submitData.append('bulk_count', bulkCount);

                bulkForms.forEach((form, index) => {
                    Object.entries(form).forEach(([key, value]) => {
                        if (value !== null) {
                            if (value instanceof File) {
                                submitData.append(`${key}_${index}`, value);
                            } else {
                                submitData.append(`${key}_${index}`, value);
                            }
                        }
                    });
                });

                await onSubmit(submitData);
                setLoading(false);
                onClose();
            } catch (error) {
                setLoading(false);
                showNotification(`Error adding movies: ${error.message}`, 'error');
            }
        } else {
            // Single form submission
            const validationErrors = validateFormData(formData);
            if (validationErrors.length > 0) {
                validationErrors.forEach(error => showNotification(error, 'error'));
                return;
            }

            setLoading(true);
            try {
                const submitData = new FormData();
                submitData.append('bulk_count', 1);

                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null) {
                        if (value instanceof File) {
                            submitData.append(key, value);
                        } else {
                            submitData.append(key, value);
                        }
                    }
                });

                if (movie) {
                    submitData.append('id', movie.movie_id);
                }

                await onSubmit(submitData);
                setLoading(false);
                onClose();
            } catch (error) {
                setLoading(false);
                showNotification(`Error ${movie ? 'updating' : 'adding'} movie: ${error.message}`, 'error');
            }
        }
    };

    const handleBulkCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        const newCount = Math.min(Math.max(count, 1), 10); // Limit to 1-10 movies
        
        setBulkCount(newCount);
        
        if (newCount > bulkCount) {
            // Add new empty forms
            setBulkForms(prev => [
                ...prev,
                ...Array.from({ length: newCount - bulkCount }, () => ({
                    title: '',
                    genre: '',
                    duration: '0hr0m',
                    rating: '',
                    synopsis: '',
                    release_date: '',
                    release_status: 'Now Playing',
                    poster_image: null,
                    background_image: null,
                }))
            ]);
        } else if (newCount < bulkCount) {
            // Remove forms from the end
            setBulkForms(prev => prev.slice(0, newCount));
            if (currentBulkIndex >= newCount) {
                setCurrentBulkIndex(newCount - 1);
            }
        }
    };

    const nextBulkForm = () => {
        if (currentBulkIndex < bulkForms.length - 1) {
            setCurrentBulkIndex(currentBulkIndex + 1);
        }
    };

    const prevBulkForm = () => {
        if (currentBulkIndex > 0) {
            setCurrentBulkIndex(currentBulkIndex - 1);
        }
    };

    const currentFormData = isBulkAdd && bulkCount > 1
        ? bulkForms[currentBulkIndex]
        : formData;

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {movie ? 'Edit Movie' : isBulkAdd ? 'Bulk Add Movies' : 'Add New Movie'}
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
                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="p-8">
                        {isBulkAdd && !movie && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    How many movies do you want to add?
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={bulkCount}
                                    onChange={handleBulkCountChange}
                                    className="w-20 p-2 border-2 border-blue-100 rounded-lg"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    {bulkForms.length > 0
                                        ? `You're adding ${bulkCount} movies. Use the navigation buttons below to fill each form.`
                                        : 'Enter the number of movies you want to add (max 10)'}
                                </p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            {isBulkAdd && bulkCount > 1 && currentFormData ? (
                                <MovieForm
                                    formData={currentFormData}
                                    onChange={handleChange}
                                    onFileChange={handleFileChange}
                                    index={currentBulkIndex}
                                    totalForms={bulkCount}
                                    movie={movie}
                                />
                            ) : (
                                <MovieForm
                                    formData={formData}
                                    onChange={handleChange}
                                    onFileChange={handleFileChange}
                                    index={0}
                                    totalForms={1}
                                    movie={movie}
                                />
                            )}
                            {/* Navigation for bulk forms */}
                            {isBulkAdd && bulkCount > 1 && (
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-200">
                                    <button
                                        type="button"
                                        onClick={prevBulkForm}
                                        disabled={currentBulkIndex === 0}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentBulkIndex === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Previous</span>
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">
                                        Movie {currentBulkIndex + 1} of {bulkCount}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={nextBulkForm}
                                        disabled={currentBulkIndex === bulkCount - 1}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentBulkIndex === bulkCount - 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-blue-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70"
                                >
                                    {loading
                                        ? 'Processing...'
                                        : movie
                                            ? '✨ Update Movie'
                                            : isBulkAdd
                                                ? `🎬 Add ${bulkCount} Movies`
                                                : '🎬 Add Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Movie Component
const Movie = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [releaseFilter, setReleaseFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isBulkAdd, setIsBulkAdd] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prevNotifications => [...prevNotifications, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
        }, 2000);
    };

    const removeNotification = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    };

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken');
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
            const sortedData = data.sort((a, b) => b.movie_id - a.movie_id);
            setMovies(sortedData);
        } catch (error) {
            console.error('Error fetching movies:', error);
            showNotification(`Error fetching movies: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleMovieStatus = async (movieId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/movies/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: movieId })
            });
            if (!response.ok) {
                throw new Error('Failed to toggle movie status');
            }
            const result = await response.json();
            showNotification(result.message);
            setMovies(movies.map(movie =>
                movie.movie_id === movieId
                    ? { ...movie, status: movie.status === 'Active' ? 'Inactive' : 'Active' }
                    : movie
            ));
            if (selectedMovie && selectedMovie.movie_id === movieId) {
                setSelectedMovie({
                    ...selectedMovie,
                    status: selectedMovie.status === 'Active' ? 'Inactive' : 'Active'
                });
            }
        } catch (error) {
            console.error('Error toggling movie status:', error);
            showNotification(`Error toggling movie status: ${error.message}`, 'error');
        }
    };

    const getMovieDetails = async (movieId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/movies/get-movie-byId`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: movieId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movieData = await response.json();
            setSelectedMovie(movieData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            showNotification(`Error fetching movie details: ${error.message}`, 'error');
        }
    };

    const handleAddOrUpdateMovie = async (formData) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const url = formMode === 'add'
                ? `${BASE_URL}/api/movies/add`
                : `${BASE_URL}/api/movies/update`;
            
            const response = await fetch(url, {
                method: formMode === 'add' ? 'POST' : 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to ${formMode} movie: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
            }
            
            const result = await response.json();
            showNotification(result.message);
            fetchMovies();
            setIsFormModalOpen(false);
            setIsBulkAdd(false);
        } catch (error) {
            console.error(`Error ${formMode}ing movie:`, error);
            showNotification(`Error ${formMode}ing movie: ${error.message}`, 'error');
        }
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/movies/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: movieId })
            });
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            const result = await response.json();
            showNotification(result.message);
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
            showNotification(`Error deleting movie: ${error.message}`, 'error');
        }
    };

    const openBulkAddModal = () => {
        setIsBulkAdd(true);
        setFormMode('add');
        setSelectedMovie(null);
        setIsFormModalOpen(true);
    };

    useEffect(() => {
        fetchMovies();
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, releaseFilter, itemsPerPage]);

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || movie.status === statusFilter;
        const matchesRelease = releaseFilter === 'All' || movie.release_status === releaseFilter;
        return matchesSearch && matchesStatus && matchesRelease;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

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
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white shadow-sm border-b border-blue-100">
                <div className="px-6 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Movie Management</h2>
                            <p className="text-gray-600 mt-1">Manage and monitor movies</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search movies..."
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
                                value={releaseFilter}
                                onChange={(e) => setReleaseFilter(e.target.value)}
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                            >
                                <option value="All">All Releases</option>
                                <option value="Now Playing">Now Playing</option>
                                <option value="Upcoming">Upcoming</option>
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
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setIsBulkAdd(false);
                                        setFormMode('add');
                                        setSelectedMovie(null);
                                        setIsFormModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Movie</span>
                                </button>
                                <button
                                    onClick={openBulkAddModal}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Bulk Add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Movies" value={movies.length} icon={Film} color="#3B82F6" />
                        <StatCard title="Active Movies" value={movies.filter(movie => movie.status === 'Active').length} icon={Film} color="#10B981" />
                        <StatCard title="Inactive Movies" value={movies.filter(movie => movie.status === 'Inactive').length} icon={Film} color="#EF4444" />
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Poster</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Genre</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Release Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentMovies.map((movie, index) => (
                                        <tr key={movie.movie_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {movie.poster_image ? (
                                                    <img className="h-16 w-12 rounded-lg object-cover" src={`${BASE_URL}/MovieImages/${movie.poster_image}`} alt={movie.title} />
                                                ) : (
                                                    <div className="h-16 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg font-bold text-white">{movie.title.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{movie.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{movie.genre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{movie.duration}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{movie.rating}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${movie.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                                                    }`}>
                                                    {movie.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{movie.release_status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button onClick={() => getMovieDetails(movie.movie_id)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => {
                                                        setFormMode('edit');
                                                        setSelectedMovie(movie);
                                                        setIsFormModalOpen(true);
                                                    }} className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200" title="Edit Movie">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteMovie(movie.movie_id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200" title="Delete Movie">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => toggleMovieStatus(movie.movie_id)} className={`p-2 rounded-lg transition-all duration-200 ${movie.status === 'Active' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                                        }`} title={`${movie.status === 'Active' ? 'Deactivate' : 'Activate'} Movie`}>
                                                        {movie.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMovies.length === 0 && (
                                        <tr>
                                            <td colSpan="9" className="text-center py-12">
                                                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg">No movies found</p>
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
            {isModalOpen && selectedMovie && (
                <MovieDetailsModal movie={selectedMovie} onClose={() => setIsModalOpen(false)} />
            )}
            {isFormModalOpen && (
                <MovieFormModal
                    movie={selectedMovie}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setIsBulkAdd(false);
                    }}
                    onSubmit={handleAddOrUpdateMovie}
                    isBulkAdd={isBulkAdd}
                    initialBulkCount={5}
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

export default Movie;