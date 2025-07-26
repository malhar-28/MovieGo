import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, MapPin, Calendar, Clock, Star, BookOpen, Image as ImageIcon, X, Tag, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

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

// Modal Component for Cinema Details
const CinemaDetailsModal = ({ cinema, onClose }) => {
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
                    {cinema.image && (
                        <img
                            src={`${BASE_URL}/CinemaImage/${cinema.image}`}
                            alt="Cinema Background"
                            className="w-full h-full object-cover absolute inset-0 z-0"
                        />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
                    {/* Content and Close Button */}
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
                        <div>
                            <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Cinema Details</h3>
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
                        {/* Cinema Header Section */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            {/* Image */}
                            <div className="flex-shrink-0 text-center lg:text-left">
                                {cinema.image ? (
                                    <img
                                        className="h-48 w-32 mx-auto lg:mx-0 object-cover rounded-xl shadow-xl ring-2 ring-blue-100"
                                        src={`${BASE_URL}/CinemaImage/${cinema.image}`}
                                        alt={cinema.name}
                                    />
                                ) : (
                                    <div className="h-48 w-32 mx-auto lg:mx-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-xl ring-2 ring-blue-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                                            {cinema.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Title and Status */}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {cinema.name}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${cinema.status === 'Active'
                                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                                        : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full mr-1 ${cinema.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                                            }`}></div>
                                        {cinema.status}
                                    </span>
                                </div>
                                {/* Quick Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">City</div>
                                        <div className="text-gray-900 font-medium text-sm break-words whitespace-pre-wrap">
                                            {cinema.city}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">State</div>
                                        <div className="text-gray-900 font-medium text-sm">{cinema.state}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Zip Code</div>
                                        <div className="text-gray-900 font-medium text-sm">{cinema.zip_code}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Average Rating</div>
                                        <div className="text-gray-900 font-medium text-sm">{cinema.avg_rating}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Total Reviews</div>
                                        <div className="text-gray-900 font-medium text-sm">{cinema.total_reviews}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Information */}
                        <div className="space-y-4">
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">System Information</h5>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className='flex flex-wrap  gap-2'>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm ">Manager Email:</span>
                                        <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-xs">{cinema.manager_email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Owner Information</h5>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Owner Name:</span>
                                        <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-xs">{cinema.owner_name}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Location Information */}
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Location Information</h5>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium text-sm">Address:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{cinema.address}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium text-sm">Longitude:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{cinema.longitude}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium text-sm">Latitude:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{cinema.latitude}</span>
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
                                        <span className="text-gray-900 font-semibold text-sm">{cinema.create_user}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{formatDate(cinema.created_at)}</span>
                                    </div>
                                    {cinema.update_user && (
                                        <>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{cinema.update_user}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{formatDate(cinema.updated_at)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
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

// Modal Component for Add/Edit Cinema
const CinemaFormModal = ({ cinema, onClose, onSubmit, owners }) => {
    const [formData, setFormData] = useState({
        name: cinema?.name || '',
        address: cinema?.address || '',
        city: cinema?.city || '',
        state: cinema?.state || '',
        zip_code: cinema?.zip_code || '',
        longitude: cinema?.longitude || '',
        latitude: cinema?.latitude || '',
        image: null,
        ownerId: cinema?.owner_id || (sessionStorage.getItem('ownerId') || ''),
        manager_email: cinema?.manager_email || ''
    });
    const isOwner = !!sessionStorage.getItem('ownerId');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const validateFormData = () => {
        const errors = [];
        if (!formData.name) errors.push('Name is required');
        if (!formData.address) errors.push('Address is required');
        if (!formData.city) errors.push('City is required');
        if (!formData.state) errors.push('State is required');
        if (!formData.zip_code) errors.push('Zip Code is required');
        if (!formData.longitude) errors.push('Longitude is required');
        if (!formData.latitude) errors.push('Latitude is required');
        if (!formData.ownerId) errors.push('Owner is required');
        if (!formData.manager_email) errors.push('Manager email is required');
        if (!cinema && !formData.image) errors.push('Image is required');
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
        const submitData = new FormData();

        // Append cinema data
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                submitData.append(key, formData[key]);
            }
        });

        await onSubmit(submitData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {cinema ? 'Edit Cinema' : 'Add New Cinema'}
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
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner
                                </label>
                                {isOwner ? (
                                    <input
                                        type="text"
                                        value={owners.find(o => o.owner_id === formData.ownerId)?.name || sessionStorage.getItem('ownerName')}
                                        className="block w-full pl-3 pr-10 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                                        disabled
                                    />
                                ) : (
                                    <select
                                        id="ownerId"
                                        name="ownerId"
                                        value={formData.ownerId}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">Select Owner</option>
                                        {owners.map((owner) => (
                                            <option key={owner.owner_id} value={owner.owner_id}>
                                                {owner.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Cinema Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter cinema name"
                                        required
                                    />
                                </div>
                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Address</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter cinema address"
                                        required
                                    />
                                </div>
                                {/* City */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>City</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter city"
                                        required
                                    />
                                </div>
                                {/* State */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>State</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter state"
                                        required
                                    />
                                </div>
                                {/* Zip Code */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Zip Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter zip code"
                                        required
                                    />
                                </div>
                                {/* Longitude */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Longitude</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter longitude"
                                        required
                                    />
                                </div>
                                {/* Latitude */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Latitude</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter latitude"
                                        required
                                    />
                                </div>
                                {/* Manager Email */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span>Manager Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="manager_email"
                                        value={formData.manager_email}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter manager email"
                                        required
                                    />
                                </div>
                                {/* Image Upload */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        <span>Image</span>
                                        {cinema && (
                                            <span className="text-xs text-gray-500">(Leave empty to keep current)</span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                                        accept="image/*"
                                        required={!cinema}
                                    />
                                </div>
                            </div>

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
                                    {loading ? 'Processing...' : cinema ? '✨ Update Cinema' : '🎬 Add Cinema'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Single Cinema Form Component (for bulk add)
const CinemaForm = ({ formData, onChange, onFileChange, index, totalForms, onRemove, owners }) => {
    const isOwner = !!sessionStorage.getItem('ownerId');
    const ownerId = sessionStorage.getItem('ownerId');
    const isBulk = totalForms > 1;
    const fieldName = (base) => isBulk ? `${base}_${index}` : base;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-4">
                <h4 className="text-lg font-semibold text-blue-700">
                    Cinema {index + 1} of {totalForms}
                </h4>
                {totalForms > 1 && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                    >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor={`owner_id_${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Owner
                </label>
                {isOwner ? (
                    <input
                        type="text"
                        value={sessionStorage.getItem('ownerName')}
                        className="block w-full pl-3 pr-10 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                        disabled
                    />
                ) : (
                    <select
                        id={`owner_id_${index}`}
                        name={fieldName("owner_id")}
                        value={formData.owner_id}
                        onChange={onChange}
                        required
                        className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option value="">Select Owner</option>
                        {owners.map((owner) => (
                            <option key={owner.owner_id} value={owner.owner_id}>
                                {owner.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Cinema Name</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("name")}
                        value={formData.name}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter cinema name"
                        required
                    />
                </div>
                {/* Address */}
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Address</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("address")}
                        value={formData.address}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter cinema address"
                        required
                    />
                </div>
                {/* City */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>City</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("city")}
                        value={formData.city}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter city"
                        required
                    />
                </div>
                {/* State */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>State</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("state")}
                        value={formData.state}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter state"
                        required
                    />
                </div>
                {/* Zip Code */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Zip Code</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("zip_code")}
                        value={formData.zip_code}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter zip code"
                        required
                    />
                </div>
                {/* Longitude */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Longitude</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("longitude")}
                        value={formData.longitude}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter longitude"
                        required
                    />
                </div>
                {/* Latitude */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Latitude</span>
                    </label>
                    <input
                        type="text"
                        name={fieldName("latitude")}
                        value={formData.latitude}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter latitude"
                        required
                    />
                </div>
                {/* Manager Email */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Manager Email</span>
                    </label>
                    <input
                        type="email"
                        name={fieldName("manager_email")}
                        value={formData.manager_email}
                        onChange={onChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                        placeholder="Enter manager email"
                        required
                    />
                </div>
                {/* Image Upload */}
                <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Image</span>
                    </label>
                    <input
                        type="file"
                        name={`image_${index}`}  // Include index in the name
                        onChange={onFileChange}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                        accept="image/*"
                        required={index === 0}
                        key={`image_${index}_${formData.image ? "file" : "empty"}`}
                    />
                    {formData.image && (
                        <div className="mt-2">
                            <p className="text-sm text-green-600">Selected: {formData.image.name}</p>
                            <img
                                src={URL.createObjectURL(formData.image)}
                                alt="Cinema Preview"
                                className="h-24 mt-2 rounded shadow border border-blue-200"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Bulk Add Modal Component
const BulkAddModal = ({ onClose, onSubmit, owners, showNotification }) => {
    const isOwner = !!sessionStorage.getItem('ownerId');
    const ownerId = sessionStorage.getItem('ownerId');

    const initialCinemaState = {
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        longitude: '',
        latitude: '',
        manager_email: '',
        owner_id: isOwner ? ownerId : '',
        image: null
    };

    const [bulkCount, setBulkCount] = useState(1); // Default to 1 cinema
    const [bulkForms, setBulkForms] = useState([{ ...initialCinemaState }]);
    const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Update forms when bulkCount changes
    useEffect(() => {
        if (bulkCount > bulkForms.length) {
            // Add new forms
            setBulkForms(prev => [
                ...prev,
                ...Array.from({ length: bulkCount - prev.length }, () => ({ ...initialCinemaState }))
            ]);
        } else if (bulkCount < bulkForms.length) {
            // Remove forms from the end
            setBulkForms(prev => prev.slice(0, bulkCount));
            // Adjust current index if needed
            if (currentBulkIndex >= bulkCount) {
                setCurrentBulkIndex(Math.max(0, bulkCount - 1));
            }
        }
    }, [bulkCount]);

    const handleBulkCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        const newCount = Math.min(Math.max(count, 1), 50); // Limit to 1-50 cinemas
        setBulkCount(newCount);
    };

    const handleCinemaChange = (e) => {
        const { name, value } = e.target;
        const baseName = name.replace(/_\d+$/, ''); // Remove index suffix if present

        setBulkForms(prevForms => {
            const newForms = [...prevForms];
            newForms[currentBulkIndex] = {
                ...newForms[currentBulkIndex],
                [baseName]: value
            };
            return newForms;
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        const index = parseInt(name.split('_').pop()); // Extract the index from the field name

        setBulkForms(prevForms => {
            const newForms = [...prevForms];
            newForms[index] = {
                ...newForms[index],
                image: file || null
            };
            return newForms;
        });
    };

    const nextBulkForm = () => {
        if (currentBulkIndex < bulkForms.length - 1) {
            setCurrentBulkIndex(prev => prev + 1);
        }
    };

    const prevBulkForm = () => {
        if (currentBulkIndex > 0) {
            setCurrentBulkIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate all forms
        const allErrors = [];
        bulkForms.forEach((cinema, index) => {
            const errors = [];
            if (!cinema.name) errors.push('Name is required');
            if (!cinema.address) errors.push('Address is required');
            if (!cinema.city) errors.push('City is required');
            if (!cinema.state) errors.push('State is required');
            if (!cinema.zip_code) errors.push('Zip Code is required');
            if (!cinema.longitude) errors.push('Longitude is required');
            if (!cinema.latitude) errors.push('Latitude is required');
            if (!cinema.manager_email) errors.push('Manager email is required');
            if (!cinema.owner_id) errors.push('Owner is required');
            if (!cinema.image) errors.push('Image is required');

            if (errors.length > 0) {
                allErrors.push(`Cinema ${index + 1}: ${errors.join(', ')}`);
            }
        });

        if (allErrors.length > 0) {
            allErrors.forEach(error => showNotification(error, 'error'));
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('bulk_count', bulkCount);

        // Add all form data with proper indexing
        bulkForms.forEach((cinema, index) => {
            Object.entries(cinema).forEach(([key, value]) => {
                if (value !== null) {
                    if (value instanceof File) {
                        formData.append(`${key}_${index}`, value, value.name);
                    } else {
                        formData.append(`${key}_${index}`, value);
                    }
                }
            });
        });

        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                Bulk Add Cinemas
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
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Number of Cinemas to Add (1-50)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={bulkCount}
                                onChange={handleBulkCountChange}
                                className="w-20 p-2 border-2 border-blue-100 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Currently editing cinema {currentBulkIndex + 1} of {bulkCount}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <CinemaForm
                                formData={bulkForms[currentBulkIndex]}
                                onChange={handleCinemaChange}
                                onFileChange={handleFileChange}
                                index={currentBulkIndex}
                                totalForms={bulkCount}
                                onRemove={() => { }} // No remove functionality in this approach
                                owners={owners}
                            />

                            {/* Navigation for bulk forms */}
                            {bulkCount > 1 && (
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
                                        Cinema {currentBulkIndex + 1} of {bulkCount}
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
                                    {loading ? 'Processing...' : `🎬 Add ${bulkCount} Cinema${bulkCount > 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main Cinema Component
const Cinema = () => {
    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cityFilter, setCityFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [owners, setOwners] = useState([]);
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

    const fetchCinemas = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const userType = sessionStorage.getItem('adminToken') ? 'admin' : 'owner';

            let url, options;
            if (userType === 'admin') {
                url = `${BASE_URL}/api/cinema/get-all-cinema`;
                options = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
            } else {
                url = `${BASE_URL}/api/cinema/get-by-owner`;
                const ownerId = sessionStorage.getItem('ownerId');
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ownerId })
                };
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error('Failed to fetch cinemas');
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => b.cinema_id - a.cinema_id);
            setCinemas(sortedData);
        } catch (error) {
            console.error('Error fetching cinemas:', error);
            showNotification(`Error fetching cinemas: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchOwners = async () => {
        const isAdmin = !!sessionStorage.getItem('adminToken');
        if (isAdmin) {
            try {
                const token = sessionStorage.getItem('adminToken');
                const response = await fetch(`${BASE_URL}/api/cinema-owner/get-all-owners`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch owners');
                }
                const data = await response.json();
                setOwners(data);
            } catch (error) {
                console.error('Error fetching owners:', error);
                showNotification(`Error fetching owners: ${error.message}`, 'error');
            }
        }
    };

    const toggleCinemaStatus = async (cinemaId) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const response = await fetch(`${BASE_URL}/api/cinema/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: cinemaId })
            });
            if (!response.ok) {
                throw new Error('Failed to toggle cinema status');
            }
            const result = await response.json();
            showNotification(result.message);
            setCinemas(cinemas.map(cinema =>
                cinema.cinema_id === cinemaId
                    ? { ...cinema, status: cinema.status === 'Active' ? 'Inactive' : 'Active' }
                    : cinema
            ));
            if (selectedCinema && selectedCinema.cinema_id === cinemaId) {
                setSelectedCinema({
                    ...selectedCinema,
                    status: selectedCinema.status === 'Active' ? 'Inactive' : 'Active'
                });
            }
        } catch (error) {
            console.error('Error toggling cinema status:', error);
            showNotification(`Error toggling cinema status: ${error.message}`, 'error');
        }
    };

    const getCinemaDetails = async (cinemaId) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const response = await fetch(`${BASE_URL}/api/cinema/get-cinema`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: cinemaId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cinema details');
            }
            const cinemaData = await response.json();
            setSelectedCinema(cinemaData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching cinema details:', error);
            showNotification(`Error fetching cinema details: ${error.message}`, 'error');
        }
    };

    const handleAddOrUpdateCinema = async (formData) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const url = formMode === 'add' ? `${BASE_URL}/api/cinema/add` : `${BASE_URL}/api/cinema/update`;
            const method = formMode === 'add' ? 'POST' : 'PUT';

            if (formMode === 'edit' && selectedCinema) {
                formData.append('id', selectedCinema.cinema_id);
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to ${formMode} cinema: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
            }

            const result = await response.json();
            showNotification(result.message);
            fetchCinemas();
            setIsFormModalOpen(false);
        } catch (error) {
            console.error(`Error ${formMode}ing cinema:`, error);
            showNotification(`Error ${formMode}ing cinema: ${error.message}`, 'error');
        }
    };

    const handleBulkAddCinemas = async (formData) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const response = await fetch(`${BASE_URL}/api/cinema/bulk-add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to bulk add cinemas: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
            }
            const result = await response.json();
            showNotification(result.message);
            fetchCinemas();
            setIsBulkAddModalOpen(false);
        } catch (error) {
            console.error('Error bulk adding cinemas:', error);
            showNotification(`Error bulk adding cinemas: ${error.message}`, 'error');
        }
    };

    const handleDeleteCinema = async (cinemaId) => {
        try {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken');
            const response = await fetch(`${BASE_URL}/api/cinema/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: cinemaId })
            });
            if (!response.ok) {
                throw new Error('Failed to delete cinema');
            }
            const result = await response.json();
            showNotification(result.message);
            fetchCinemas();
        } catch (error) {
            console.error('Error deleting cinema:', error);
            showNotification(`Error deleting cinema: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        fetchCinemas();
        fetchOwners();
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, cityFilter, itemsPerPage]);

    const filteredCinemas = cinemas.filter(cinema => {
        const matchesSearch = cinema.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || cinema.status === statusFilter;
        const matchesCity = cityFilter === 'All' || cinema.city === cityFilter;
        return matchesSearch && matchesStatus && matchesCity;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCinemas = filteredCinemas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCinemas.length / itemsPerPage);

    const uniqueCities = [...new Set(cinemas.map(cinema => cinema.city))];

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
                            <h2 className="text-2xl font-bold text-gray-800">Cinema Management</h2>
                            <p className="text-gray-600 mt-1">Manage and monitor cinemas</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search cinemas..."
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
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                            >
                                <option value="All">All Cities</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
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
                                        setFormMode('add');
                                        setSelectedCinema(null);
                                        setIsFormModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Cinema</span>
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Cinemas" value={cinemas.length} icon={MapPin} color="#3B82F6" />
                        <StatCard title="Active Cinemas" value={cinemas.filter(cinema => cinema.status === 'Active').length} icon={MapPin} color="#10B981" />
                        <StatCard title="Inactive Cinemas" value={cinemas.filter(cinema => cinema.status === 'Inactive').length} icon={MapPin} color="#EF4444" />
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Owner</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">City</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">State</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Average Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentCinemas.map((cinema, index) => (
                                        <tr key={cinema.cinema_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {cinema.image ? (
                                                    <img className="h-16 w-12 rounded-lg object-cover" src={`${BASE_URL}/CinemaImage/${cinema.image}`} alt={cinema.name} />
                                                ) : (
                                                    <div className="h-16 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg font-bold text-white">{cinema.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{cinema.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{cinema.owner_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cinema.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cinema.city}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cinema.state}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cinema.avg_rating}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${cinema.status === 'Active'
                                                    ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                                                    : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                                                    }`}>
                                                    {cinema.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button onClick={() => getCinemaDetails(cinema.cinema_id)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => {
                                                        setFormMode('edit');
                                                        setSelectedCinema(cinema);
                                                        setIsFormModalOpen(true);
                                                    }} className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200" title="Edit Cinema">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteCinema(cinema.cinema_id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200" title="Delete Cinema">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => toggleCinemaStatus(cinema.cinema_id)} className={`p-2 rounded-lg transition-all duration-200 ${cinema.status === 'Active'
                                                        ? 'text-red-600 hover:text-red-800 hover:bg-red-100'
                                                        : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                                        }`} title={`${cinema.status === 'Active' ? 'Deactivate' : 'Activate'} Cinema`}>
                                                        {cinema.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCinemas.length === 0 && (
                                        <tr>
                                            <td colSpan="10" className="text-center py-12">
                                                <p className="text-gray-500 text-lg">No cinemas found</p>
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
            {isModalOpen && selectedCinema && (
                <CinemaDetailsModal cinema={selectedCinema} onClose={() => setIsModalOpen(false)} />
            )}
            {isFormModalOpen && (
                <CinemaFormModal
                    cinema={selectedCinema}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleAddOrUpdateCinema}
                    owners={owners}
                />
            )}
            {isBulkAddModalOpen && (
                <BulkAddModal
                    onClose={() => setIsBulkAddModalOpen(false)}
                    onSubmit={handleBulkAddCinemas}
                    owners={owners}
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

export default Cinema;
