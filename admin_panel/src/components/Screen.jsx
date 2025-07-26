import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, Monitor, Layout, X, Tag, ChevronLeft, ChevronRight, Film } from 'lucide-react';
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

// Modal Component for Screen Details
const ScreenDetailsModal = ({ screen, onClose }) => {
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
                <div className="relative overflow-hidden h-48">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
                        <div>
                            <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Screen Details</h3>
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
                <div className="overflow-y-auto flex-grow">
                    <div className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {screen.screen_name}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${screen.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                                            : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                                        <div className={`w-2 h-2 rounded-full mr-1 ${screen.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {screen.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Cinema Name</div>
                                        <div className="text-gray-900 font-medium text-sm">{screen.cinema_name}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Total Seats</div>
                                        <div className="text-gray-900 font-medium text-sm">{screen.total_seats}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Screen Type</div>
                                        <div className="text-gray-900 font-medium text-sm">{screen.screen_type || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Creator Information</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{screen.create_user}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{formatDate(screen.created_at)}</span>
                                    </div>
                                    {screen.update_user && (
                                        <>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{screen.update_user}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{formatDate(screen.updated_at)}</span>
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

// Modal Component for Seat Layout Details
const SeatLayoutDetailsModal = ({ seatLayout, onClose }) => {
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
                <div className="relative overflow-hidden h-48">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
                        <div>
                            <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Seat Layout Details</h3>
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
                <div className="overflow-y-auto flex-grow">
                    <div className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    Seat: {seatLayout.seat_label}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${seatLayout.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                                            : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                                        <div className={`w-2 h-2 rounded-full mr-1 ${seatLayout.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {seatLayout.status}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-blue-100 text-blue-800 ring-1 ring-blue-200">
                                        {seatLayout.seat_type}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-purple-100 text-purple-800 ring-1 ring-purple-200">
                                        {seatLayout.position}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Row Character</div>
                                        <div className="text-gray-900 font-medium text-sm">{seatLayout.row_char || 'N/A'}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
                                        <div className="text-blue-600 text-xs font-semibold mb-1">Column Number</div>
                                        <div className="text-gray-900 font-medium text-sm">{seatLayout.col_number || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-base font-bold text-gray-900">Creator Information</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{seatLayout.create_user}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
                                        <span className="text-gray-900 font-semibold text-sm">{formatDate(seatLayout.created_at)}</span>
                                    </div>
                                    {seatLayout.update_user && (
                                        <>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{seatLayout.update_user}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
                                                <span className="text-gray-900 font-semibold text-sm">{formatDate(seatLayout.updated_at)}</span>
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

const generateAutoSeatLabels = (data = {}) => {
    const {
        start_row_char,
        end_row_char,
        start_seat_num,
        end_seat_num,
        bulk_seat_type,
        bulk_position
    } = data;

    if (!start_row_char || !end_row_char || !start_seat_num || !end_seat_num) return [];

    const seats = [];
    const startCharCode = start_row_char.toUpperCase().charCodeAt(0);
    const endCharCode = end_row_char.toUpperCase().charCodeAt(0);
    const startNum = parseInt(start_seat_num, 10);
    const endNum = parseInt(end_seat_num, 10);

    if (isNaN(startNum) || isNaN(endNum) || startCharCode > endCharCode || startNum > endNum) {
        return [];
    }

    for (let i = startCharCode; i <= endCharCode; i++) {
        const rowChar = String.fromCharCode(i);
        for (let j = startNum; j <= endNum; j++) {
            seats.push({
                seat_label: `${rowChar}${j}`,
                seat_type: bulk_seat_type,
                position: bulk_position,
                row_char: rowChar,
                col_number: j
            });
        }
    }

    return seats;
};


// Modal Component for Add/Edit Seat Layout

const SeatLayoutFormModal = ({ seatLayout, screenId, onClose, onSubmit, isBulkAdd = false, showNotification }) => {
    const [formData, setFormData] = useState({
        screen_id: seatLayout?.screen_id || screenId || '',
        seat_label: seatLayout?.seat_label || '',
        seat_type: seatLayout?.seat_type || 'CLASSIC',
        position: seatLayout?.position || 'full',
        row_char: seatLayout?.row_char || '',
        col_number: seatLayout?.col_number || '',
        seat_labels: '',
        start_row_char: '',
        end_row_char: '',
        start_seat_num: '',
        end_seat_num: '',
        bulk_add_type: 'manual',
        bulk_seat_type: 'CLASSIC',
        bulk_position: 'full'
    });

    const [loading, setLoading] = useState(false);
    const [screenTotalSeats, setScreenTotalSeats] = useState(0);

    useEffect(() => {
        const fetchScreenDetails = async () => {
            if (formData.screen_id) {
                try {
                   const token =
  sessionStorage.getItem('adminToken') ||
  sessionStorage.getItem('ownerToken') ||
  sessionStorage.getItem('managerToken');

                    const response = await fetch(`${BASE_URL}/api/screen/get`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: formData.screen_id })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch screen details for total seats validation');
                    }
                    const data = await response.json();
                    setScreenTotalSeats(data.total_seats);
                } catch (error) {
                    console.error('Error fetching screen total seats:', error);
                    showNotification(`Error fetching screen details: ${error.message}`, 'error');
                    setScreenTotalSeats(0);
                }
            } else {
                setScreenTotalSeats(0);
            }
        };

        if (isBulkAdd && formData.screen_id) {
            fetchScreenDetails();
        }
    }, [formData.screen_id, isBulkAdd, showNotification]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateFormData = (isBulkAddForm) => {
        const errors = [];
        if (!formData.screen_id) {
            errors.push('Screen ID is required');
        }
        if (isBulkAddForm) {
            if (formData.bulk_add_type === 'manual') {
                if (!formData.seat_labels) {
                    errors.push('Seat labels are required for manual bulk add');
                }
            } else if (formData.bulk_add_type === 'auto') {
                if (!formData.start_row_char || !formData.end_row_char || !formData.start_seat_num || !formData.end_seat_num) {
                    errors.push('All fields for automatic seat generation are required');
                } else if (formData.start_row_char.length !== 1 || formData.end_row_char.length !== 1) {
                    errors.push('Row characters must be a single letter');
                } else if (formData.start_row_char.toUpperCase().charCodeAt(0) > formData.end_row_char.toUpperCase().charCodeAt(0)) {
                    errors.push('Start row character cannot be after end row character');
                } else if (parseInt(formData.start_seat_num, 10) > parseInt(formData.end_seat_num, 10)) {
                    errors.push('Start seat number cannot be greater than end seat number');
                }
            }
        } else {
            if (!formData.seat_label) {
                errors.push('Seat label is required');
            }
            if (!formData.seat_type) {
                errors.push('Seat type is required');
            }
            if (!formData.position) {
                errors.push('Position is required');
            }
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFormData(isBulkAdd);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => showNotification(error, 'error'));
            return;
        }
        setLoading(true);
        let submitData = {};
        let finalSeats = [];

        if (isBulkAdd) {
            if (formData.bulk_add_type === 'manual') {
                finalSeats = formData.seat_labels.split(',').map(label => label.trim()).filter(label => label !== '').map(label => ({
                    seat_label: label,
                    seat_type: formData.bulk_seat_type,
                    position: formData.bulk_position,
                    row_char: label.match(/^[A-Za-z]+/)?.[0] || null,
                    col_number: parseInt(label.match(/\d+/)?.[0]) || null
                }));
            } else {
                finalSeats = generateAutoSeatLabels(formData);
            }

            if (screenTotalSeats > 0 && finalSeats.length > screenTotalSeats) {
                showNotification(`The number of seats (${finalSeats.length}) exceeds the screen's total capacity (${screenTotalSeats}).`, 'error');
                setLoading(false);
                return;
            }
            submitData = {
                screen_id: screenId,
                seats: finalSeats,
            };
        } else {
            submitData = {
                screen_id: screenId,
                seat_label: formData.seat_label,
                seat_type: formData.seat_type,
                position: formData.position,
                row_char: formData.row_char,
                col_number: formData.col_number
            };
            if (seatLayout) {
                submitData.seat_id = seatLayout.seat_id;
            }
        }
        await onSubmit(submitData, isBulkAdd);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Layout className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {isBulkAdd ? 'Bulk Add Seats' : (seatLayout ? 'Edit Seat Layout' : 'Add New Seat Layout')}
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
                            <div className="grid grid-cols-1 gap-6">
                                {isBulkAdd && (
                                    <div className="col-span-full">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <Plus className="w-4 h-4 text-blue-600" />
                                            <span>Bulk Add Type</span>
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="bulk_add_type"
                                                    value="manual"
                                                    checked={formData.bulk_add_type === 'manual'}
                                                    onChange={handleChange}
                                                    className="form-radio text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Manual Entry (comma-separated)</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="bulk_add_type"
                                                    value="auto"
                                                    checked={formData.bulk_add_type === 'auto'}
                                                    onChange={handleChange}
                                                    className="form-radio text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Automatic Generation (e.g., A1-B5)</span>
                                            </label>
                                        </div>
                                        {screenTotalSeats > 0 && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                * This screen has a total capacity of {screenTotalSeats} seats.
                                            </p>
                                        )}
                                    </div>
                                )}
                                {isBulkAdd && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span>Seat Type</span>
                                            </label>
                                            <select
                                                name="bulk_seat_type"
                                                value={formData.bulk_seat_type}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                            >
                                                <option value="CLASSIC">Classic</option>
                                                <option value="PRIME">Prime</option>
                                                <option value="PRIME_PLUS">Prime Plus</option>
                                                <option value="RECLINER">Recliner</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span>Position</span>
                                            </label>
                                            <select
                                                name="bulk_position"
                                                value={formData.bulk_position}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                            >
                                                <option value="full">Full</option>
                                                <option value="left">Left</option>
                                                <option value="middle">Middle</option>
                                                <option value="right">Right</option>

                                            </select>
                                        </div>
                                    </div>
                                )}
                                {isBulkAdd ? (
                                    formData.bulk_add_type === 'manual' ? (
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span>Seat Labels (comma-separated)</span>
                                            </label>
                                            <textarea
                                                name="seat_labels"
                                                value={formData.seat_labels}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 min-h-[100px]"
                                                placeholder="e.g., A1, A2, B1, B2"
                                                required={formData.bulk_add_type === 'manual'}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <span>Start Row (Char)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="start_row_char"
                                                    value={formData.start_row_char}
                                                    onChange={handleChange}
                                                    maxLength="1"
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., A"
                                                    required={formData.bulk_add_type === 'auto'}
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <span>End Row (Char)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="end_row_char"
                                                    value={formData.end_row_char}
                                                    onChange={handleChange}
                                                    maxLength="1"
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., C"
                                                    required={formData.bulk_add_type === 'auto'}
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <span>Start Seat (Number)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="start_seat_num"
                                                    value={formData.start_seat_num}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., 1"
                                                    required={formData.bulk_add_type === 'auto'}
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <span>End Seat (Number)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="end_seat_num"
                                                    value={formData.end_seat_num}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., 10"
                                                    required={formData.bulk_add_type === 'auto'}
                                                />
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span>Seat Label</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="seat_label"
                                                value={formData.seat_label}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                placeholder="Enter seat label (e.g., A1)"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                    <span>Seat Type</span>
                                                </label>
                                                <select
                                                    name="seat_type"
                                                    value={formData.seat_type}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                >
                                                    <option value="CLASSIC">Classic</option>
                                                    <option value="PRIME">Prime</option>
                                                    <option value="PRIME_PLUS">Prime Plus</option>
                                                    <option value="RECLINER">Recliner</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                    <span>Position</span>
                                                </label>
                                                <select
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                >
                                                    <option value="full">Full</option>
                                                    <option value="left">Left</option>
                                                    <option value="middle">Middle</option>
                                                    <option value="right">Right</option>

                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                    <span>Row Character</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="row_char"
                                                    value={formData.row_char}
                                                    onChange={handleChange}
                                                    maxLength="1"
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., A"
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                                    <Tag className="w-4 h-4 text-blue-600" />
                                                    <span>Column Number</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="col_number"
                                                    value={formData.col_number}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                    placeholder="e.g., 1"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
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
                                    {loading ? 'Processing...' : (isBulkAdd ? 'Bulk Add Seats' : (seatLayout ? 'Update Seat' : 'Add Seat'))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal Component for Add/Edit Screen

const ScreenFormModal = ({ screen, onClose, onSubmit, showNotification }) => {
    const [formData, setFormData] = useState({
        cinema_id: screen?.cinema_id || '',
        screen_name: screen?.screen_name || '',
        total_seats: screen?.total_seats || '',
        screen_type: screen?.screen_type || '2D',
    });

    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cinemaSearchTerm, setCinemaSearchTerm] = useState('');
    const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
    const cinemaDropdownRef = useRef(null);


    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const isManager = !!sessionStorage.getItem('managerToken');
    const ownerId = sessionStorage.getItem('ownerId');
    const cinemaId = sessionStorage.getItem('cinemaId');

    useEffect(() => {
        const fetchCinemas = async () => {
            const token = sessionStorage.getItem('adminToken') || sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken');
            let url = '';
            let method = 'GET';
            let body;

            if (isAdmin) {
                url = `${BASE_URL}/api/cinema/get-all-cinema`;
            } else if (isOwner) {
                url = `${BASE_URL}/api/cinema/get-by-owner`;
                method = 'POST';
                body = JSON.stringify({ ownerId: ownerId });
            } else if (isManager) {
                url = `${BASE_URL}/api/cinema/get-cinema`;
                method = 'POST';
                body = JSON.stringify({ id: cinemaId });
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch cinemas');
                }
                const data = await response.json();
                const cinemasArray = Array.isArray(data) ? data : [data];
                setCinemas(cinemasArray);

                if (isManager && cinemasArray.length > 0) {
                    setFormData(prev => ({ ...prev, cinema_id: cinemasArray[0].cinema_id }));
                    setCinemaSearchTerm(cinemasArray[0].name);
                }

                if (screen && screen.cinema_id) {
                    const selectedCinema = cinemasArray.find(c => c.cinema_id === screen.cinema_id);
                    if (selectedCinema) {
                        setCinemaSearchTerm(selectedCinema.name);
                    }
                }

            } catch (error) {
                console.error('Error fetching cinemas:', error);
                showNotification('Could not load cinema data.', 'error');
            }
        };

        fetchCinemas();
    }, [isAdmin, isOwner, isManager, ownerId, cinemaId, showNotification, screen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target)) {
                setIsCinemaDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCinemaSearchChange = (e) => {
        setCinemaSearchTerm(e.target.value);
        setFormData(prev => ({ ...prev, cinema_id: '' })); // Clear ID on new search
        setIsCinemaDropdownOpen(true);
    };

    const handleSelectCinema = (cinema) => {
        setFormData(prev => ({ ...prev, cinema_id: cinema.cinema_id }));
        setCinemaSearchTerm(cinema.name);
        setIsCinemaDropdownOpen(false);
    };

    const filteredCinemas = cinemas.filter(cinema =>
        cinema.name.toLowerCase().includes(cinemaSearchTerm.toLowerCase())
    );


    const validateFormData = () => {
        const errors = [];
        if (!formData.cinema_id) errors.push('Cinema is required');
        if (!formData.screen_name) errors.push('Screen name is required');
        if (!formData.total_seats) errors.push('Total seats are required');
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
        await onSubmit(formData);
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
                                <Monitor className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {screen ? 'Edit Screen' : 'Add New Screen'}
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
                                <div className="md:col-span-2" ref={cinemaDropdownRef}>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <Monitor className="w-4 h-4 text-blue-600" />
                                        <span>Cinema</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cinemaSearchTerm}
                                            onChange={handleCinemaSearchChange}
                                            onFocus={() => setIsCinemaDropdownOpen(true)}
                                            placeholder="Search for a cinema..."
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                            disabled={isManager}
                                        />
                                        {isCinemaDropdownOpen && filteredCinemas.length > 0 && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                                {filteredCinemas.map(cinema => (
                                                    <li
                                                        key={cinema.cinema_id}
                                                        onClick={() => handleSelectCinema(cinema)}
                                                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                    >
                                                        {cinema.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <Monitor className="w-4 h-4 text-blue-600" />
                                        <span>Screen Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="screen_name"
                                        value={formData.screen_name}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter screen name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <Monitor className="w-4 h-4 text-blue-600" />
                                        <span>Total Seats</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="total_seats"
                                        value={formData.total_seats}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        placeholder="Enter total seats"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                        <Monitor className="w-4 h-4 text-blue-600" />
                                        <span>Screen Type</span>
                                    </label>
                                    <select
                                        name="screen_type"
                                        value={formData.screen_type}
                                        onChange={handleChange}
                                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                    >
                                        <option value="2D">2D</option>
                                        <option value="3D">3D</option>
                                        <option value="4DX">4DX</option>
                                        <option value="IMAX">IMAX</option>

                                    </select>
                                </div>
                            </div>
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
                                    {loading ? 'Processing...' : screen ? 'Update Screen' : 'Add Screen'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Seat Layout Visualization Component
const SeatLayoutVisualization = ({ screenId, seats, onSeatAction, showNotification, totalSeats }) => {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');

    // Group seats by seat_type and then by position
    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.seat_type]) {
            acc[seat.seat_type] = {};
        }
        if (!acc[seat.seat_type][seat.position]) {
            acc[seat.seat_type][seat.position] = [];
        }
        acc[seat.seat_type][seat.position].push(seat);
        return acc;
    }, {});

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat);
    };

    const handleAction = (action) => {
        switch (action) {
            case 'view':
                if (!selectedSeat) {
                    showNotification('Please select a seat first', 'error');
                    return;
                }
                setIsDetailsModalOpen(true);
                break;
            case 'edit':
                if (!selectedSeat) {
                    showNotification('Please select a seat first', 'error');
                    return;
                }
                setFormMode('edit');
                setIsFormModalOpen(true);
                break;
            case 'delete':
                if (!selectedSeat) {
                    showNotification('Please select a seat first', 'error');
                    return;
                }
                onSeatAction('delete', selectedSeat);
                setSelectedSeat(null);
                break;
            case 'toggle':
                if (!selectedSeat) {
                    showNotification('Please select a seat first', 'error');
                    return;
                }
                onSeatAction('toggle', selectedSeat);
                setSelectedSeat(null);
                break;
            case 'add':
                setFormMode('add');
                setIsFormModalOpen(true);
                break;
            case 'bulk-add':
                setIsBulkAddModalOpen(true);
                break;
            default:
                break;
        }
    };

    const remainingSeats = totalSeats - seats.length;

    const getSeatColor = (seatType) => {
        switch (seatType) {
            case 'PRIME': return 'bg-purple-500';
            case 'PRIME_PLUS': return 'bg-yellow-500';
            case 'RECLINER': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };
    const renderSeatRows = (seatsArray, align) => {
        const groupedByRow = seatsArray.reduce((acc, seat) => {
            const row = seat.row_char || seat.seat_label.match(/^[A-Za-z]+/)?.[0] || 'Other';
            if (!acc[row]) acc[row] = [];
            acc[row].push(seat);
            return acc;
        }, {});

        const sortedRows = Object.keys(groupedByRow).sort();

        return sortedRows.map((row) => {
            const sortedSeats = groupedByRow[row].sort((a, b) => {
                const numA = a.col_number || parseInt(a.seat_label.match(/\d+/)?.[0]) || 0;
                const numB = b.col_number || parseInt(b.seat_label.match(/\d+/)?.[0]) || 0;
                return numA - numB;
            });

            return (
                <div key={row} className={`flex items-center mb-2 ${align === 'center' ? 'justify-center' : ''}`}>
                    <div className="w-8 text-center font-semibold text-gray-700">{row}</div>
                    <div className="flex space-x-2">
                        {sortedSeats.map((seat) => (
                            <button
                                key={seat.seat_id}
                                onClick={() => setSelectedSeat(seat)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${seat.seat_id === selectedSeat?.seat_id
                                        ? 'ring-2 ring-blue-500 ring-offset-1'
                                        : ''
                                    } ${seat.status === 'Active'
                                        ? `${getSeatColor(seat.seat_type)} hover:opacity-90 text-white`
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    } transition-all duration-200`}
                                title={`${seat.seat_label} - ${seat.seat_type} (${seat.status})`}
                            >
                                {seat.col_number || seat.seat_label.replace(row, '')}
                            </button>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-2xl">
                <div className="w-[70%] p-6 overflow-y-auto border-r border-gray-200">
                    <div className="bg-gray-800 text-white text-center py-3 mb-8 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold">SCREEN</h3>
                    </div>
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-800">
                                Total Capacity: {totalSeats} seats
                            </span>
                            <span className={`text-sm font-medium ${remainingSeats < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {remainingSeats >= 0
                                    ? `${remainingSeats} seats remaining`
                                    : `${Math.abs(remainingSeats)} seats over capacity!`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className={`h-2.5 rounded-full ${remainingSeats >= 0 ? 'bg-blue-600' : 'bg-red-600'}`}
                                style={{ width: `${Math.min(100, (seats.length / totalSeats) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center overflow-x-auto w-full">
                        <div className="min-w-fit mx-auto">
                            {Object.entries(groupedSeats).map(([seatType, positions]) => {
                                const hasLeft = !!positions.left;
                                const hasMiddle = !!positions.middle;
                                const hasRight = !!positions.right;
                                const hasMultiple = [hasLeft, hasMiddle, hasRight].filter(Boolean).length > 1;

                                return (
                                    <div key={seatType} className="w-full mb-10">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 capitalize text-center">{seatType}</h4>

                                        {/* Render 'full' row first */}
                                        {positions.full && (
                                            <div className="mb-4 flex flex-col items-center">
                                                {renderSeatRows(positions.full, 'center')}
                                            </div>
                                        )}

                                        {/* Render left / middle / right conditionally with correct alignment */}
                                        {(hasLeft || hasMiddle || hasRight) && (
                                            <div className="mb-4 flex justify-between gap-6 w-full px-10">
                                                {/* Left Block */}
                                                {hasLeft && (
                                                    <div className={`flex flex-col ${hasMultiple ? 'items-end flex-1' : 'items-start w-full'}`}>
                                                        {renderSeatRows(positions.left, 'left')}
                                                    </div>
                                                )}

                                                {/* Middle Block */}
                                                {hasMiddle && (
                                                    <div className={`flex flex-col ${hasMultiple ? 'items-center flex-1' : 'items-center w-full'}`}>
                                                        {renderSeatRows(positions.middle, 'center')}
                                                    </div>
                                                )}

                                                {/* Right Block */}
                                                {hasRight && (
                                                    <div className={`flex flex-col ${hasMultiple ? 'items-start flex-1' : 'items-end w-full'}`}>
                                                        {renderSeatRows(positions.right, 'right')}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Seat Type Legend</h4>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Classic</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm bg-purple-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Prime</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm bg-yellow-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Prime Plus</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm bg-blue-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Recliner</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Inactive</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[30%] p-6 bg-gray-50 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Seat Actions</h3>
                    {selectedSeat ? (
                        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                            <h4 className="font-semibold text-gray-700 mb-2">Selected Seat</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Label:</span>
                                    <span className="font-medium ml-1">{selectedSeat.seat_label}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Type:</span>
                                    <span className="font-medium ml-1 capitalize">{selectedSeat.seat_type}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Position:</span>
                                    <span className="font-medium ml-1 capitalize">{selectedSeat.position}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`font-medium ml-1 ${selectedSeat.status === 'Active' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {selectedSeat.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 text-sm">
                            No seat selected. Click on a seat to perform actions.
                        </div>
                    )}
                    <div className="space-y-3 flex-grow">
                        <button
                            onClick={() => {
                                if (remainingSeats <= 0) {
                                    showNotification('Cannot add more seats - screen capacity reached!', 'error');
                                    return;
                                }
                                handleAction('add');
                            }}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Single Seat</span>
                        </button>
                        <button
                            onClick={() => {
                                if (remainingSeats <= 0) {
                                    showNotification('Cannot add more seats - screen capacity reached!', 'error');
                                    return;
                                }
                                handleAction('bulk-add');
                            }}
                            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Bulk Add Seats</span>
                        </button>
                        <button
                            onClick={() => handleAction('edit')}
                            disabled={!selectedSeat}
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${selectedSeat ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Edit className="w-5 h-5" />
                            <span>Edit Selected Seat</span>
                        </button>
                        <button
                            onClick={() => handleAction('toggle')}
                            disabled={!selectedSeat}
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${selectedSeat
                                    ? selectedSeat.status === 'Active'
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {selectedSeat?.status === 'Active' ? (
                                <ToggleRight className="w-5 h-5" />
                            ) : (
                                <ToggleLeft className="w-5 h-5" />
                            )}
                            <span>{selectedSeat?.status === 'Active' ? 'Deactivate' : 'Activate'} Seat</span>
                        </button>
                        <button
                            onClick={() => handleAction('delete')}
                            disabled={!selectedSeat}
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${selectedSeat ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Selected Seat</span>
                        </button>
                        <button
                            onClick={() => handleAction('view')}
                            disabled={!selectedSeat}
                            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${selectedSeat ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Eye className="w-5 h-5" />
                            <span>View Seat Details</span>
                        </button>
                    </div>
                    <button
                        onClick={() => onSeatAction('close')}
                        className="mt-6 w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    >
                        Close Seat Layout
                    </button>
                </div>
            </div>
            {isDetailsModalOpen && selectedSeat && (
                <SeatLayoutDetailsModal
                    seatLayout={selectedSeat}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            )}
            {isFormModalOpen && (
                <SeatLayoutFormModal
                    seatLayout={formMode === 'edit' ? selectedSeat : null}
                    screenId={screenId}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={(data, isBulk) => {
                        if (!isBulk && seats.length >= totalSeats) {
                            showNotification('Cannot add more seats - screen capacity reached!', 'error');
                            return;
                        }
                        onSeatAction(formMode === 'edit' ? 'update' : 'add', data);
                        setIsFormModalOpen(false);
                        setSelectedSeat(null);
                    }}
                    isBulkAdd={false}
                    showNotification={showNotification}
                />
            )}
            {isBulkAddModalOpen && (
                <SeatLayoutFormModal
                    seatLayout={null}
                    screenId={screenId}
                    onClose={() => setIsBulkAddModalOpen(false)}
                    onSubmit={(data, isBulk) => {
                        const seatsToAdd = data.bulk_add_type === 'manual'
                            ? data.seat_labels.split(',').filter(label => label.trim() !== '').length
                            : generateAutoSeatLabels(data).length;
                        if (seats.length + seatsToAdd > totalSeats) {
                            showNotification(`Adding ${seatsToAdd} seats would exceed screen capacity!`, 'error');
                            return;
                        }
                        onSeatAction('bulk-add', data);
                        setIsBulkAddModalOpen(false);
                    }}
                    isBulkAdd={true}
                    showNotification={showNotification}
                />
            )}
        </div>
    );
};

// Bulk Add Modal Component for Screens
const BulkAddModal = ({ onClose, onSubmit, showNotification }) => {
    const initialScreenState = {
        cinema_id: '',
        screen_name: '',
        total_seats: '',
        screen_type: '2D'
    };

    const [bulkCount, setBulkCount] = useState(1);
    const [bulkForms, setBulkForms] = useState([{ ...initialScreenState }]);
    const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cinemas, setCinemas] = useState([]);
    const [cinemaSearchTerms, setCinemaSearchTerms] = useState(['']); // Array to track search terms for each form
    const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
    const cinemaDropdownRef = useRef(null);

    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const isManager = !!sessionStorage.getItem('managerToken');
    const ownerId = sessionStorage.getItem('ownerId');
    const cinemaId = sessionStorage.getItem('cinemaId');

    // Fetch cinemas when component mounts
    useEffect(() => {
        const fetchCinemas = async () => {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');
            let url = '';
            let method = 'GET';
            let body;

            if (isAdmin) {
                url = `${BASE_URL}/api/cinema/get-all-cinema`;
            } else if (isOwner) {
                url = `${BASE_URL}/api/cinema/get-by-owner`;
                method = 'POST';
                body = JSON.stringify({ ownerId: ownerId });
            } else if (isManager) {
                url = `${BASE_URL}/api/cinema/get-cinema`;
                method = 'POST';
                body = JSON.stringify({ id: cinemaId });
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch cinemas');
                }
                const data = await response.json();
                const cinemasArray = Array.isArray(data) ? data : [data];
                setCinemas(cinemasArray);

                // If manager, pre-fill the cinema ID for all forms
                if (isManager && cinemasArray.length > 0) {
                    const cinema = cinemasArray[0];
                    setBulkForms(prevForms => 
                        prevForms.map(form => ({
                            ...form,
                            cinema_id: cinema.cinema_id
                        }))
                    );
                    // Initialize search terms for all forms
                    setCinemaSearchTerms(Array(bulkCount).fill(cinema.name));
                }
            } catch (error) {
                console.error('Error fetching cinemas:', error);
                showNotification('Could not load cinema data.', 'error');
            }
        };

        fetchCinemas();
    }, [isAdmin, isOwner, isManager, ownerId, cinemaId, bulkCount]);

    // Update forms when bulkCount changes
    useEffect(() => {
        if (bulkCount > bulkForms.length) {
            // Add new forms with initial state
            const newForms = Array.from({ length: bulkCount - bulkForms.length }, () => ({ ...initialScreenState }));
            setBulkForms(prev => [...prev, ...newForms]);
            
            // Add empty search terms for new forms
            setCinemaSearchTerms(prev => [...prev, ...Array(bulkCount - prev.length).fill('')]);
            
            // If manager, pre-fill cinema_id for new forms
            if (isManager && cinemas.length > 0) {
                const cinema = cinemas[0];
                setBulkForms(prevForms => 
                    prevForms.map((form, index) => 
                        index >= bulkForms.length 
                            ? { ...form, cinema_id: cinema.cinema_id } 
                            : form
                    )
                );
                setCinemaSearchTerms(prev => 
                    prev.map((term, index) => 
                        index >= bulkForms.length 
                            ? cinema.name
                            : term
                    )
                );
            }
        } else if (bulkCount < bulkForms.length) {
            // Remove forms from the end
            setBulkForms(prev => prev.slice(0, bulkCount));
            setCinemaSearchTerms(prev => prev.slice(0, bulkCount));
            
            // Adjust current index if needed
            if (currentBulkIndex >= bulkCount) {
                setCurrentBulkIndex(Math.max(0, bulkCount - 1));
            }
        }
    }, [bulkCount, cinemas, isManager, initialScreenState]);

    const handleBulkCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        const newCount = Math.min(Math.max(count, 1), 50);
        setBulkCount(newCount);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBulkForms(prevForms => {
            const newForms = [...prevForms];
            newForms[currentBulkIndex] = {
                ...newForms[currentBulkIndex],
                [name]: value
            };
            return newForms;
        });
    };

    const handleCinemaSearchChange = (e) => {
        const newSearchTerms = [...cinemaSearchTerms];
        newSearchTerms[currentBulkIndex] = e.target.value;
        setCinemaSearchTerms(newSearchTerms);
        setIsCinemaDropdownOpen(true);
    };

    const handleSelectCinema = (cinema) => {
        setBulkForms(prevForms => {
            const newForms = [...prevForms];
            newForms[currentBulkIndex] = {
                ...newForms[currentBulkIndex],
                cinema_id: cinema.cinema_id
            };
            return newForms;
        });
        
        const newSearchTerms = [...cinemaSearchTerms];
        newSearchTerms[currentBulkIndex] = cinema.name;
        setCinemaSearchTerms(newSearchTerms);
        setIsCinemaDropdownOpen(false);
    };

    const filteredCinemas = cinemas.filter(cinema =>
        (cinema.name).toLowerCase()
            .includes(cinemaSearchTerms[currentBulkIndex]?.toLowerCase() || '')
    );

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
        bulkForms.forEach((screen, index) => {
            if (!screen.cinema_id || !screen.screen_name || !screen.total_seats) {
                allErrors.push(`Screen ${index + 1} is missing required fields`);
            }
        });

        if (allErrors.length > 0) {
            setLoading(false);
            allErrors.forEach(err => showNotification(err, 'error'));
            return;
        }

        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken'); 
            const userEmail = sessionStorage.getItem('adminEmail') ||
                sessionStorage.getItem('ownerEmail') || sessionStorage.getItem('managerEmail')

            const response = await fetch(`${BASE_URL}/api/screen/bulk-add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    screens: bulkForms,
                    create_user: userEmail
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to bulk add screens');
            }

            const result = await response.json();
            showNotification(result.message);
            onSubmit(result);
            setLoading(false);
            onClose();
        } catch (error) {
            console.error('Error bulk adding screens:', error);
            showNotification(`Error bulk adding screens: ${error.message}`, 'error');
            setLoading(false);
        }
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
                                Bulk Add Screens
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
                                Number of Screens to Add (1-50)
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
                                Currently editing screen {currentBulkIndex + 1} of {bulkCount}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-4">
                                    <h4 className="text-lg font-semibold text-blue-700">
                                        Screen {currentBulkIndex + 1} of {bulkCount}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2" ref={cinemaDropdownRef}>
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <Monitor className="w-4 h-4 text-blue-600" />
                                            <span>Cinema</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cinemaSearchTerms[currentBulkIndex] || ''}
                                                onChange={handleCinemaSearchChange}
                                                onFocus={() => setIsCinemaDropdownOpen(true)}
                                                placeholder="Search for a cinema..."
                                                className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                                disabled={isManager}
                                            />
                                            {isCinemaDropdownOpen && filteredCinemas.length > 0 && (
                                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                                    {filteredCinemas.map(cinema => (
                                                        <li
                                                            key={cinema.cinema_id}
                                                            onClick={() => handleSelectCinema(cinema)}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                        >
                                                            {cinema.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <Monitor className="w-4 h-4 text-blue-600" />
                                            <span>Screen Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="screen_name"
                                            value={bulkForms[currentBulkIndex]?.screen_name || ''}
                                            onChange={handleChange}
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                            placeholder="Enter screen name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <Monitor className="w-4 h-4 text-blue-600" />
                                            <span>Total Seats</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="total_seats"
                                            value={bulkForms[currentBulkIndex]?.total_seats || ''}
                                            onChange={handleChange}
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                            placeholder="Enter total seats"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <Monitor className="w-4 h-4 text-blue-600" />
                                            <span>Screen Type</span>
                                        </label>
                                        <select
                                            name="screen_type"
                                            value={bulkForms[currentBulkIndex]?.screen_type || '2D'}
                                            onChange={handleChange}
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
                                        >
                                            <option value="2D">2D</option>
                                            <option value="3D">3D</option>
                                            <option value="4DX">4DX</option>
                                            <option value="IMAX">IMAX</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation for bulk forms */}
                            {bulkCount > 1 && (
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-200">
                                    <button
                                        type="button"
                                        onClick={prevBulkForm}
                                        disabled={currentBulkIndex === 0}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentBulkIndex === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Previous</span>
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">
                                        Screen {currentBulkIndex + 1} of {bulkCount}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={nextBulkForm}
                                        disabled={currentBulkIndex === bulkCount - 1}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentBulkIndex === bulkCount - 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
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
                                    {loading ? 'Processing...' : `🎬 Add ${bulkCount} Screen${bulkCount > 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Main Screen Component

const Screen = () => {
    const [screens, setScreens] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [seatLayouts, setSeatLayouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [screenLoading, setScreenLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isSeatLayoutOpen, setIsSeatLayoutOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Get user type and IDs
    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const isManager = !!sessionStorage.getItem('managerToken');
    const ownerId = sessionStorage.getItem('ownerId');
    const cinemaId = sessionStorage.getItem('cinemaId');

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 2000);
    };

    const removeNotification = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    };

    const fetchScreens = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            let url, method, body;

            if (isAdmin) {
                // Admin can see all screens
                url = `${BASE_URL}/api/screen/get-all`;
                method = 'GET';
            } else if (isOwner) {
                // Owner can see screens of cinemas they own
                url = `${BASE_URL}/api/screen/by-owner`;
                method = 'POST';
                body = JSON.stringify({ owner_id: ownerId });
            } else if (isManager) {
                // Manager can see screens of their assigned cinema
                url = `${BASE_URL}/api/screen/by-cinema`;
                method = 'POST';
                body = JSON.stringify({ cinema_id: cinemaId });
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: method === 'POST' ? body : undefined
            });

            if (!response.ok) {
                throw new Error('Failed to fetch screens');
            }
            const data = await response.json();
            const sortedScreens = data.sort((a, b) => b.screen_id - a.screen_id);
            setScreens(sortedScreens);
        } catch (error) {
            console.error('Error fetching screens:', error);
            showNotification(`Error fetching screens: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSeatLayouts = async (screenId) => {
        setScreenLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            const response = await fetch(`${BASE_URL}/api/seats/get-by-screen`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ screen_id: screenId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch seat layouts');
            }
            const data = await response.json();
            setSeatLayouts(data);
        } catch (error) {
            console.error('Error fetching seat layouts:', error);
            showNotification(`Error fetching seat layouts: ${error.message}`, 'error');
        } finally {
            setScreenLoading(false);
        }
    };

    const toggleScreenStatus = async (screenId) => {
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            const response = await fetch(`${BASE_URL}/api/screen/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: screenId })
            });

            if (!response.ok) {
                throw new Error('Failed to toggle screen status');
            }

            const result = await response.json();
            showNotification(result.message);
            fetchScreens();


            if (selectedScreen?.screen_id === screenId) {
                setSelectedScreen({
                    ...selectedScreen,
                    status: selectedScreen.status === 'Active' ? 'Inactive' : 'Active'
                });
            }
        } catch (error) {
            console.error('Error toggling screen status:', error);
            showNotification(`Error toggling screen status: ${error.message}`, 'error');
        }
    };

    const getScreenDetails = async (screenId) => {
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            const response = await fetch(`${BASE_URL}/api/screen/get`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: screenId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch screen details');
            }

            const screenData = await response.json();
            setSelectedScreen(screenData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching screen details:', error);
            showNotification(`Error fetching screen details: ${error.message}`, 'error');
        }
    };

    const handleAddOrUpdateScreen = async (formData) => {
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') || sessionStorage.getItem('managerToken'); 
            const userEmail = sessionStorage.getItem('adminEmail') ||
                sessionStorage.getItem('ownerEmail') || sessionStorage.getItem('managerEmail')
            const url = formMode === 'add'
                ? `${BASE_URL}/api/screen/add`
                : `${BASE_URL}/api/screen/update`;

            const method = formMode === 'add' ? 'POST' : 'PUT';

            const screenData = { ...formData };

            if (formMode === 'add') {
                screenData.create_user = userEmail;
            } else {
                screenData.update_user = userEmail;
                screenData.id = selectedScreen.screen_id;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(screenData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to ${formMode} screen`);
            }

            const result = await response.json();
            showNotification(result.message);
            fetchScreens();
            setIsFormModalOpen(false);
        } catch (error) {
            console.error(`Error ${formMode}ing screen:`, error);
            showNotification(`Error ${formMode}ing screen: ${error.message}`, 'error');
        }
    };

    const handleDeleteScreen = async (screenId) => {
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            const response = await fetch(`${BASE_URL}/api/screen/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: screenId })
            });

            if (!response.ok) {
                throw new Error('Failed to delete screen');
            }

            const result = await response.json();
            showNotification(result.message);
            fetchScreens();
        } catch (error) {
            console.error('Error deleting screen:', error);
            showNotification(`Error deleting screen: ${error.message}`, 'error');
        }
    };

    const handleSeatAction = async (action, data) => {
        try {
            const token = sessionStorage.getItem('adminToken') ||
                sessionStorage.getItem('ownerToken') ||
                sessionStorage.getItem('managerToken');

            const userEmail = sessionStorage.getItem('adminEmail') ||
                sessionStorage.getItem('ownerEmail') ||
                sessionStorage.getItem('managerEmail');

            let url, method, body;

            if (action === 'close') {
                setIsSeatLayoutOpen(false);
                setSelectedScreen(null);
                setSeatLayouts([]);
                return;
            }

            switch (action) {
                case 'add':
                    url = `${BASE_URL}/api/seats/add`;
                    method = 'POST';
                    body = JSON.stringify({
                        ...data,
                        create_user: userEmail
                    });
                    break;
                case 'update':
                    url = `${BASE_URL}/api/seats/update`;
                    method = 'PUT';
                    body = JSON.stringify({
                        ...data,
                        update_user: userEmail
                    });
                    break;
                case 'delete':
                    url = `${BASE_URL}/api/seats/delete`;
                    method = 'DELETE';
                    body = JSON.stringify({ seat_id: data.seat_id });
                    break;
                case 'toggle':
                    url = `${BASE_URL}/api/seats/toggle-status`;
                    method = 'PATCH';
                    body = JSON.stringify({ seat_id: data.seat_id });
                    break;
                case 'bulk-add':
                    url = `${BASE_URL}/api/seats/bulk`;
                    method = 'POST';
                    body = JSON.stringify({
                        ...data,
                        create_user: userEmail
                    });
                    break;
                default:
                    throw new Error('Invalid seat action');
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to ${action} seat`);
            }

            const result = await response.json();
            showNotification(result.message);
            fetchSeatLayouts(selectedScreen.screen_id);
        } catch (error) {
            console.error(`Error ${action}ing seat:`, error);
            showNotification(`Error ${action}ing seat: ${error.message}`, 'error');
        }
    };

    const openSeatLayout = (screen) => {
        setSelectedScreen(screen);
        fetchSeatLayouts(screen.screen_id);
        setIsSeatLayoutOpen(true);
    };

    useEffect(() => {
        fetchScreens();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);


    const filteredScreens = screens.filter(screen => {
        const matchesSearch = screen.screen_name.toLowerCase().includes(searchTerm.toLowerCase()) || screen.cinema_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || screen.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScreens = filteredScreens.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScreens.length / itemsPerPage);

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
                            <h2 className="text-2xl font-bold text-gray-800">Screen Management</h2>
                            <p className="text-gray-600 mt-1">Manage and monitor screens</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search screens..."
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

                            {(isAdmin || isOwner || isManager) && (
                                <>
                                    <button
                                        onClick={() => {
                                            setFormMode('add');
                                            setSelectedScreen(null);
                                            setIsFormModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Add Screen</span>
                                    </button>

                                    <button
                                        onClick={() => setIsBulkAddModalOpen(true)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Bulk Add</span>
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Screens" value={screens.length} icon={Monitor} color="#3B82F6" />
                        <StatCard title="Active Screens" value={screens.filter(screen => screen.status === 'Active').length} icon={Monitor} color="#10B981" />
                        <StatCard title="Inactive Screens" value={screens.filter(screen => screen.status === 'Inactive').length} icon={Monitor} color="#EF4444" />
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
                ) : isSeatLayoutOpen ? (
                    <SeatLayoutVisualization
                        screenId={selectedScreen.screen_id}
                        seats={seatLayouts}
                        onSeatAction={handleSeatAction}
                        showNotification={showNotification}
                        totalSeats={selectedScreen.total_seats}
                    />
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Screen Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Cinema</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Total Seats</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Screen Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentScreens.map((screen, index) => (
                                        <tr key={screen.screen_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{screen.screen_name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{screen.cinema_name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{screen.total_seats}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{screen.screen_type || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${screen.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                                                    {screen.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => openSeatLayout(screen)}
                                                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                                                        title="View Seat Layout"
                                                    >
                                                        <Layout className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => getScreenDetails(screen.screen_id)}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {(isAdmin || isOwner || isManager) && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setFormMode('edit');
                                                                    setSelectedScreen(screen);
                                                                    setIsFormModalOpen(true);
                                                                }}
                                                                className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200"
                                                                title="Edit Screen"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteScreen(screen.screen_id)}
                                                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                                                                title="Delete Screen"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
    onClick={() => toggleScreenStatus(screen.screen_id)}
    className={`p-2 rounded-lg transition-all duration-200 ${
    screen.status === 'Active'
        ? 'text-red-600 hover:text-red-800 hover:bg-red-100'
        : 'text-green-600 hover:text-green-800 hover:bg-green-100'
    }`}
    title={`${screen.status === 'Active' ? 'Deactivate' : 'Activate'} Screen`}
>
    {screen.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
</button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                    {currentScreens.length === 0 && (
                                      <tr>
                                        <td colSpan="7" className="text-center py-12">
                                          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                          <p className="text-gray-500 text-lg">No screens found</p>
                                          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                         {totalPages > 1 && (
                            <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-purple-100">
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

            {/* Modals */}
            {isModalOpen && selectedScreen && (
                <ScreenDetailsModal screen={selectedScreen} onClose={() => setIsModalOpen(false)} />
            )}
            {isFormModalOpen && (
                <ScreenFormModal
                    screen={selectedScreen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleAddOrUpdateScreen}
                    showNotification={showNotification}
                />
            )}
            {isBulkAddModalOpen && (
                <BulkAddModal
                    onClose={() => setIsBulkAddModalOpen(false)}
                    onSubmit={() => {
                        fetchScreens();
                        setIsBulkAddModalOpen(false);
                    }}
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



export default Screen;