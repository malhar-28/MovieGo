// import React, { useState, useEffect } from 'react';
// import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, Monitor, Tag, X, Layout } from 'lucide-react';

// // Notification Component
// const Notification = ({ message, type, onClose }) => {
//     return (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
//             <div className="flex justify-between items-center">
//                 <span>{message}</span>
//                 <button onClick={onClose} className="ml-4">
//                     <span className="text-xl">×</span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Modal Component for Seat Layout Details
// const SeatLayoutDetailsModal = ({ seatLayout, onClose }) => {
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     return (
//         <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
//                 {/* Header with Background Image */}
//                 <div className="relative overflow-hidden h-48">
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>

//                     {/* Content and Close Button */}
//                     <div className="absolute inset-0 z-20 flex items-center justify-between px-4 py-3 text-white">
//                         <div>
//                             <h3 className="text-xl font-bold mb-1 drop-shadow-lg">Seat Layout Details</h3>
//                             <div className="w-12 h-1 bg-blue-300 rounded-full"></div>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="text-blue-100 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 group backdrop-blur-sm"
//                         >
//                             <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="overflow-y-auto flex-grow">
//                     <div className="p-4">
//                         {/* Seat Layout Header Section */}
//                         <div className="flex flex-col lg:flex-row gap-4 mb-4">
//                             {/* Title and Status */}
//                             <div className="flex-1">
//                                 <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
//                                     Seat: {seatLayout.seat_label}
//                                 </h4>

//                                 <div className="flex flex-wrap gap-2 mb-4">
//                                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${seatLayout.status === 'Active'
//                                         ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
//                                         : 'bg-red-100 text-red-800 ring-1 ring-red-200'
//                                         }`}>
//                                         <div className={`w-2 h-2 rounded-full mr-1 ${seatLayout.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
//                                             }`}></div>
//                                         {seatLayout.status}
//                                     </span>
//                                 </div>

//                                 {/* Quick Info Cards */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                                     <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
//                                         <div className="text-blue-600 text-xs font-semibold mb-1">Screen ID</div>
//                                         <div className="text-gray-900 font-medium text-sm">{seatLayout.screen_id}</div>
//                                     </div>
//                                     <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2 rounded-lg border border-blue-200/50 shadow-sm">
//                                         <div className="text-blue-600 text-xs font-semibold mb-1">Seat Label</div>
//                                         <div className="text-gray-900 font-medium text-sm">{seatLayout.seat_label}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Detailed Information */}
//                         <div className="space-y-4">
//                             {/* Creator Information */}
//                             <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <h5 className="text-base font-bold text-gray-900">Creator Information</h5>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                     <div>
//                                         <span className="text-gray-600 font-medium block mb-1 text-sm">Created By:</span>
//                                         <span className="text-gray-900 font-semibold text-sm">{seatLayout.create_user}</span>
//                                     </div>
//                                     <div>
//                                         <span className="text-gray-600 font-medium block mb-1 text-sm">Created At:</span>
//                                         <span className="text-gray-900 font-semibold text-sm">{formatDate(seatLayout.created_at)}</span>
//                                     </div>
//                                     {seatLayout.update_user && (
//                                         <>
//                                             <div>
//                                                 <span className="text-gray-600 font-medium block mb-1 text-sm">Last Updated By:</span>
//                                                 <span className="text-gray-900 font-semibold text-sm">{seatLayout.update_user}</span>
//                                             </div>
//                                             <div>
//                                                 <span className="text-gray-600 font-medium block mb-1 text-sm">Updated At:</span>
//                                                 <span className="text-gray-900 font-semibold text-sm">{formatDate(seatLayout.updated_at)}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Seat ID and Status */}
//                             <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <h5 className="text-base font-bold text-gray-900">System Information</h5>
//                                 </div>
//                                 <div className="flex flex-wrap items-center gap-2">
//                                     <div className='flex flex-wrap gap-2'>
//                                         <span className="text-gray-600 font-medium block mb-1 text-sm">Seat ID:</span>
//                                         <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-xs">#{seatLayout.seat_id}</span>
//                                     </div>
//                                     <div className='flex flex-wrap ps-7 gap-2'>
//                                         <span className="text-gray-600 font-medium block mb-1 text-sm ">Status:</span>
//                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold
//                                             ${seatLayout.status === 'Active'
//                                                 ? 'bg-emerald-100 text-emerald-800'
//                                                 : 'bg-red-100 text-red-800'
//                                             }`}>
//                                             {seatLayout.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-3 border-t border-blue-200/50">
//                     <div className="flex justify-end">
//                         <button
//                             onClick={onClose}
//                             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Modal Component for Add/Edit Seat Layout
// const SeatLayoutFormModal = ({ seatLayout, onClose, onSubmit, isBulkAdd = false, showNotification }) => {
//     const [formData, setFormData] = useState({
//         screen_id: seatLayout?.screen_id || '',
//         seat_label: seatLayout?.seat_label || '',
//         seat_labels: '', // For manual bulk add
//         start_row_char: '', // For auto bulk add
//         end_row_char: '',   // For auto bulk add
//         start_seat_num: '', // For auto bulk add
//         end_seat_num: '',   // For auto bulk add
//         bulk_add_type: 'manual', // 'manual' or 'auto'
//     });

//     const [loading, setLoading] = useState(false);
//     const [screenTotalSeats, setScreenTotalSeats] = useState(0);

//     useEffect(() => {
//         const fetchScreenDetails = async () => {
//             if (formData.screen_id) {
//                 try {
//                     const token = sessionStorage.getItem('adminToken');
//                     const response = await fetch('http://localhost:5000/api/screen/get', {
//                         method: 'POST',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({ id: formData.screen_id })
//                     });
//                     if (!response.ok) {
//                         throw new Error('Failed to fetch screen details for total seats validation');
//                     }
//                     const data = await response.json();
//                     setScreenTotalSeats(data.total_seats);
//                 } catch (error) {
//                     console.error('Error fetching screen total seats:', error);
//                     showNotification(`Error fetching screen details: ${error.message}`, 'error');
//                     setScreenTotalSeats(0); // Reset if fetch fails
//                 }
//             } else {
//                 setScreenTotalSeats(0);
//             }
//         };

//         if (isBulkAdd && formData.screen_id) {
//             fetchScreenDetails();
//         }
//     }, [formData.screen_id, isBulkAdd, showNotification]);


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const generateAutoSeatLabels = () => {
//         const { start_row_char, end_row_char, start_seat_num, end_seat_num } = formData;
//         const labels = [];

//         const startCharCode = start_row_char.toUpperCase().charCodeAt(0);
//         const endCharCode = end_row_char.toUpperCase().charCodeAt(0);
//         const startNum = parseInt(start_seat_num, 10);
//         const endNum = parseInt(end_seat_num, 10);

//         if (isNaN(startNum) || isNaN(endNum) || startCharCode > endCharCode || startNum > endNum) {
//             showNotification('Invalid input for automatic seat generation.', 'error');
//             return [];
//         }

//         for (let i = startCharCode; i <= endCharCode; i++) {
//             const rowChar = String.fromCharCode(i);
//             for (let j = startNum; j <= endNum; j++) {
//                 labels.push(`${rowChar}${j}`);
//             }
//         }
//         return labels;
//     };

//     const validateFormData = (isBulkAddForm) => {
//         const errors = [];
//         if (!formData.screen_id) {
//             errors.push('Screen ID is required');
//         }

//         if (isBulkAddForm) {
//             if (formData.bulk_add_type === 'manual') {
//                 if (!formData.seat_labels) {
//                     errors.push('Seat labels are required for manual bulk add');
//                 }
//             } else if (formData.bulk_add_type === 'auto') {
//                 if (!formData.start_row_char || !formData.end_row_char || !formData.start_seat_num || !formData.end_seat_num) {
//                     errors.push('All fields for automatic seat generation are required');
//                 } else if (formData.start_row_char.length !== 1 || formData.end_row_char.length !== 1) {
//                     errors.push('Row characters must be a single letter');
//                 } else if (formData.start_row_char.toUpperCase().charCodeAt(0) > formData.end_row_char.toUpperCase().charCodeAt(0)) {
//                     errors.push('Start row character cannot be after end row character');
//                 } else if (parseInt(formData.start_seat_num, 10) > parseInt(formData.end_seat_num, 10)) {
//                     errors.push('Start seat number cannot be greater than end seat number');
//                 }
//             }
//         } else { // Single add/edit
//             if (!formData.seat_label) {
//                 errors.push('Seat label is required');
//             }
//         }
//         return errors;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = validateFormData(isBulkAdd);
//         if (validationErrors.length > 0) {
//             validationErrors.forEach(error => showNotification(error, 'error'));
//             return;
//         }

//         setLoading(true);
//         let submitData = {};
//         let finalSeatLabels = [];

//         if (isBulkAdd) {
//             if (formData.bulk_add_type === 'manual') {
//                 finalSeatLabels = formData.seat_labels.split(',').map(label => label.trim()).filter(label => label !== '');
//             } else { // auto
//                 finalSeatLabels = generateAutoSeatLabels();
//             }

//             if (screenTotalSeats > 0 && finalSeatLabels.length > screenTotalSeats) {
//                 showNotification(`The number of seats (${finalSeatLabels.length}) exceeds the screen's total capacity (${screenTotalSeats}).`, 'error');
//                 setLoading(false);
//                 return;
//             }

//             submitData = {
//                 screen_id: formData.screen_id,
//                 seat_labels: finalSeatLabels,
//             };
//         } else {
//             submitData = {
//                 screen_id: formData.screen_id,
//                 seat_label: formData.seat_label,
//             };
//             if (seatLayout) {
//                 submitData.id = seatLayout.seat_id;
//             }
//         }
//         await onSubmit(submitData, isBulkAdd);
//         setLoading(false);
//     };

//     return (
//         <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl border border-blue-100 animate-in fade-in duration-300">
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
//                     <div className="flex justify-between items-center relative z-10">
//                         <div className="flex items-center space-x-3">
//                             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
//                                 <Layout className="w-6 h-6 text-white" />
//                             </div>
//                             <h3 className="text-2xl font-bold text-white">
//                                 {isBulkAdd ? 'Bulk Add Seats' : (seatLayout ? 'Edit Seat Layout' : 'Add New Seat Layout')}
//                             </h3>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="text-blue-100 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 backdrop-blur-sm"
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Form Content */}
//                 <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
//                     <div className="p-8">
//                         <form onSubmit={handleSubmit}>
//                             <div className="grid grid-cols-1 gap-6">
//                                 {/* Screen ID */}
//                                 <div>
//                                     <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                         <Monitor className="w-4 h-4 text-blue-600" />
//                                         <span>Screen ID</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="screen_id"
//                                         value={formData.screen_id}
//                                         onChange={handleChange}
//                                         className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                         placeholder="Enter screen ID"
//                                         required
//                                         disabled={seatLayout && !isBulkAdd} // Disable screen_id if editing a single seat
//                                     />
//                                 </div>

//                                 {isBulkAdd && (
//                                     <div className="col-span-full">
//                                         <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                             <Plus className="w-4 h-4 text-blue-600" />
//                                             <span>Bulk Add Type</span>
//                                         </label>
//                                         <div className="flex space-x-4">
//                                             <label className="inline-flex items-center">
//                                                 <input
//                                                     type="radio"
//                                                     name="bulk_add_type"
//                                                     value="manual"
//                                                     checked={formData.bulk_add_type === 'manual'}
//                                                     onChange={handleChange}
//                                                     className="form-radio text-blue-600"
//                                                 />
//                                                 <span className="ml-2 text-gray-700">Manual Entry (comma-separated)</span>
//                                             </label>
//                                             <label className="inline-flex items-center">
//                                                 <input
//                                                     type="radio"
//                                                     name="bulk_add_type"
//                                                     value="auto"
//                                                     checked={formData.bulk_add_type === 'auto'}
//                                                     onChange={handleChange}
//                                                     className="form-radio text-blue-600"
//                                                 />
//                                                 <span className="ml-2 text-gray-700">Automatic Generation (e.g., A1-B5)</span>
//                                             </label>
//                                         </div>
//                                         {screenTotalSeats > 0 && (
//                                             <p className="text-sm text-gray-500 mt-2">
//                                                 * This screen has a total capacity of {screenTotalSeats} seats.
//                                             </p>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* Seat Label / Seat Labels */}
//                                 {isBulkAdd ? (
//                                     formData.bulk_add_type === 'manual' ? (
//                                         <div>
//                                             <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                                 <Tag className="w-4 h-4 text-blue-600" />
//                                                 <span>Seat Labels (comma-separated)</span>
//                                             </label>
//                                             <textarea
//                                                 name="seat_labels"
//                                                 value={formData.seat_labels}
//                                                 onChange={handleChange}
//                                                 className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30 min-h-[100px]"
//                                                 placeholder="e.g., A1, A2, B1, B2"
//                                                 required={formData.bulk_add_type === 'manual'}
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                                     <span>Start Row (Char)</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="start_row_char"
//                                                     value={formData.start_row_char}
//                                                     onChange={handleChange}
//                                                     maxLength="1"
//                                                     className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                                     placeholder="e.g., A"
//                                                     required={formData.bulk_add_type === 'auto'}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                                     <span>End Row (Char)</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="end_row_char"
//                                                     value={formData.end_row_char}
//                                                     onChange={handleChange}
//                                                     maxLength="1"
//                                                     className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                                     placeholder="e.g., C"
//                                                     required={formData.bulk_add_type === 'auto'}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                                     <span>Start Seat (Number)</span>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     name="start_seat_num"
//                                                     value={formData.start_seat_num}
//                                                     onChange={handleChange}
//                                                     className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                                     placeholder="e.g., 1"
//                                                     required={formData.bulk_add_type === 'auto'}
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                                     <span>End Seat (Number)</span>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     name="end_seat_num"
//                                                     value={formData.end_seat_num}
//                                                     onChange={handleChange}
//                                                     className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                                     placeholder="e.g., 10"
//                                                     required={formData.bulk_add_type === 'auto'}
//                                                 />
//                                             </div>
//                                         </div>
//                                     )
//                                 ) : (
//                                     <div>
//                                         <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
//                                             <Tag className="w-4 h-4 text-blue-600" />
//                                             <span>Seat Label</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="seat_label"
//                                             value={formData.seat_label}
//                                             onChange={handleChange}
//                                             className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-blue-50/30"
//                                             placeholder="Enter seat label (e.g., A1)"
//                                             required
//                                         />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-blue-100">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70"
//                                 >
//                                     {loading ? 'Processing...' : (isBulkAdd ? 'Bulk Add Seats' : (seatLayout ? 'Update Seat' : 'Add Seat'))}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // Main Seat Layout Component
// const SeatLayout = () => {
//     const [seatLayouts, setSeatLayouts] = useState([]);
//     const [selectedSeatLayout, setSelectedSeatLayout] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [screenFilter, setScreenFilter] = useState('All');
//     const [notifications, setNotifications] = useState([]);
//     const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//     const [formMode, setFormMode] = useState('add'); // 'add', 'edit', 'bulk-add'

//     const showNotification = (message, type = 'info') => {
//         const id = Date.now();
//         setNotifications(prevNotifications => [...prevNotifications, { id, message, type }]);
//         setTimeout(() => {
//             setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
//         }, 2000);
//     };

//     const removeNotification = (id) => {
//         setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
//     };

//     const fetchSeatLayouts = async () => {
//         setLoading(true);
//         try {
//             const token = sessionStorage.getItem('adminToken'); // Assuming adminToken is used for authentication
//             const response = await fetch('http://localhost:5000/api/seats/get-all', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch seat layouts');
//             }

//             const data = await response.json();
//             setSeatLayouts(data);
//         } catch (error) {
//             console.error('Error fetching seat layouts:', error);
//             showNotification(`Error fetching seat layouts: ${error.message}`, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleSeatLayoutStatus = async (seatId) => {
//         try {
//             const token = sessionStorage.getItem('adminToken');
//             const response = await fetch('http://localhost:5000/api/seats/toggle-status', {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ id: seatId })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to toggle seat layout status');
//             }

//             const result = await response.json();
//             showNotification(result.message);

//             setSeatLayouts(seatLayouts.map(seatLayout =>
//                 seatLayout.seat_id === seatId
//                     ? { ...seatLayout, status: seatLayout.status === 'Active' ? 'Inactive' : 'Active' }
//                     : seatLayout
//             ));

//             if (selectedSeatLayout && selectedSeatLayout.seat_id === seatId) {
//                 setSelectedSeatLayout({
//                     ...selectedSeatLayout,
//                     status: selectedSeatLayout.status === 'Active' ? 'Inactive' : 'Active'
//                 });
//             }
//         } catch (error) {
//             console.error('Error toggling seat layout status:', error);
//             showNotification(`Error toggling seat layout status: ${error.message}`, 'error');
//         }
//     };

//     const getSeatLayoutDetails = async (seatId) => {
//         try {
//             const token = sessionStorage.getItem('adminToken');
//             const response = await fetch('http://localhost:5000/api/seats/get-by-id', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ id: seatId })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch seat layout details');
//             }

//             const seatLayoutData = await response.json();
//             setSelectedSeatLayout(seatLayoutData);
//             setIsDetailsModalOpen(true);
//         } catch (error) {
//             console.error('Error fetching seat layout details:', error);
//             showNotification(`Error fetching seat layout details: ${error.message}`, 'error');
//         }
//     };

//     const handleAddOrUpdateOrBulkAddSeatLayout = async (formData, isBulkAdd) => {
//         try {
//             const token = sessionStorage.getItem('adminToken');
//             let url = '';
//             let method = '';

//             if (isBulkAdd) {
//                 url = 'http://localhost:5000/api/seats/bulk';
//                 method = 'POST';
//             } else if (formMode === 'add') {
//                 url = 'http://localhost:5000/api/seats/add';
//                 method = 'POST';
//             } else { // formMode === 'edit'
//                 url = 'http://localhost:5000/api/seats/update';
//                 method = 'PUT';
//             }

//             const response = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(formData)
//             });

//            if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     const msg = errorData.message || `${response.status} ${response.statusText}`;
    
//     // Customize for duplicate seat case
//     if (msg.includes("Seat label already exists")) {
//         throw new Error("Seat already exists with the same label for this screen.");
//     }

//     throw new Error(`Failed to ${formMode} seat layout: ${msg}`);
// }


//             const result = await response.json();
//             showNotification(result.message);
//             fetchSeatLayouts();
//             setIsFormModalOpen(false);
//         } catch (error) {
//             console.error(`Error ${formMode}ing seat layout:`, error);
//             showNotification(`Error ${formMode}ing seat layout: ${error.message}`, 'error');
//         }
//     };


//     const handleDeleteSeatLayout = async (seatId) => {
//         try {
//             const token = sessionStorage.getItem('adminToken');
//          const response = await fetch('http://localhost:5000/api/seats/delete', {
//     method: 'DELETE',
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ id: seatId })
// });


//             if (!response.ok) {
//                 throw new Error('Failed to delete seat layout');
//             }

//             const result = await response.json();
//             showNotification(result.message);
//             fetchSeatLayouts();
//         } catch (error) {
//             console.error('Error deleting seat layout:', error);
//             showNotification(`Error deleting seat layout: ${error.message}`, 'error');
//         }
//     };

//     useEffect(() => {
//         fetchSeatLayouts();
//     }, []);

//     const filteredSeatLayouts = seatLayouts.filter(seatLayout => {
//         const matchesSearch = seatLayout.seat_label.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = statusFilter === 'All' || seatLayout.status === statusFilter;
//         const matchesScreen = screenFilter === 'All' || seatLayout.screen_id == screenFilter;
//         return matchesSearch && matchesStatus && matchesScreen;
//     });

//     const uniqueScreenIds = [...new Set(seatLayouts.map(seatLayout => seatLayout.screen_id))];

//     const StatCard = ({ title, value, icon: Icon, color }) => (
//         <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
//                 </div>
//                 <div className="p-3 rounded-full" style={{ backgroundColor: color + '20', color: color }}>
//                     <Icon className="w-8 h-8" />
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="flex-1 flex flex-col overflow-hidden">
//             <div className="bg-white shadow-sm border-b border-blue-100">
//                 <div className="px-6 py-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800">Seat Layout Management</h2>
//                             <p className="text-gray-600 mt-1">Manage and monitor seat layouts</p>
//                         </div>
//                         <div className="flex space-x-4">
//                             <div className="relative">
//                                 <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search seat labels..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="pl-10 pr-4 py-2 w-64 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                 />
//                             </div>
//                             <select
//                                 value={statusFilter}
//                                 onChange={(e) => setStatusFilter(e.target.value)}
//                                 className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
//                             >
//                                 <option value="All">All Status</option>
//                                 <option value="Active">Active</option>
//                                 <option value="Inactive">Inactive</option>
//                             </select>
//                             <select
//                                 value={screenFilter}
//                                 onChange={(e) => setScreenFilter(e.target.value)}
//                                 className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
//                             >
//                                 <option value="All">All Screens</option>
//                                 {uniqueScreenIds.map((screenId) => (
//                                     <option key={screenId} value={screenId}>
//                                         Screen ID: {screenId}
//                                     </option>
//                                 ))}
//                             </select>

//                             <button
//                                 onClick={() => {
//                                     setFormMode('add');
//                                     setSelectedSeatLayout(null);
//                                     setIsFormModalOpen(true);
//                                 }}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
//                             >
//                                 <Plus className="w-5 h-5" />
//                                 <span>Add Seat</span>
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setFormMode('bulk-add');
//                                     setSelectedSeatLayout(null); // No specific seat selected for bulk add
//                                     setIsFormModalOpen(true);
//                                 }}
//                                 className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2"
//                             >
//                                 <Plus className="w-5 h-5" />
//                                 <span>Bulk Add Seats</span>
//                             </button>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <StatCard title="Total Seats" value={seatLayouts.length} icon={Layout} color="#3B82F6" />
//                         <StatCard title="Active Seats" value={seatLayouts.filter(seat => seat.status === 'Active').length} icon={Layout} color="#10B981" />
//                         <StatCard title="Inactive Seats" value={seatLayouts.filter(seat => seat.status === 'Inactive').length} icon={Layout} color="#EF4444" />
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-1 p-6 overflow-auto">
//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <div className="relative">
//                             <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
//                             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//                                     <tr>
//                                         <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Seat ID</th>
//                                         <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Screen ID</th>
//                                         <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Seat Label</th>
//                                         <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
//                                         <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-blue-100">
//                                     {filteredSeatLayouts.map((seatLayout, index) => (
//                                         <tr key={seatLayout.seat_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex flex-col">
//                                                     <span className="text-sm font-medium text-gray-900">{seatLayout.seat_id}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                                 <div className="flex flex-col">
//                                                     <span className="text-gray-900 font-medium">{seatLayout.screen_id}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{seatLayout.seat_label}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${seatLayout.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
//                                                     {seatLayout.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 <div className="flex space-x-3">
//                                                     <button onClick={() => getSeatLayoutDetails(seatLayout.seat_id)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200" title="View Details">
//                                                         <Eye className="w-4 h-4" />
//                                                     </button>
//                                                     <button onClick={() => {
//                                                         setFormMode('edit');
//                                                         setSelectedSeatLayout(seatLayout);
//                                                         setIsFormModalOpen(true);
//                                                     }} className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200" title="Edit Seat">
//                                                         <Edit className="w-4 h-4" />
//                                                     </button>
//                                                     <button onClick={() => handleDeleteSeatLayout(seatLayout.seat_id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200" title="Delete Seat">
//                                                         <Trash2 className="w-4 h-4" />
//                                                     </button>
//                                                     <button onClick={() => toggleSeatLayoutStatus(seatLayout.seat_id)} className={`p-2 rounded-lg transition-all duration-200 ${seatLayout.status === 'Active' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'}`} title={`${seatLayout.status === 'Active' ? 'Deactivate' : 'Activate'} Seat`}>
//                                                         {seatLayout.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             {isDetailsModalOpen && selectedSeatLayout && (
//                 <SeatLayoutDetailsModal seatLayout={selectedSeatLayout} onClose={() => setIsDetailsModalOpen(false)} />
//             )}
//             {isFormModalOpen && (
//                 <SeatLayoutFormModal
//                     seatLayout={formMode === 'edit' ? selectedSeatLayout : null}
//                     onClose={() => setIsFormModalOpen(false)}
//                     onSubmit={handleAddOrUpdateOrBulkAddSeatLayout}
//                     isBulkAdd={formMode === 'bulk-add'}
//                     showNotification={showNotification} // Pass showNotification
//                 />
//             )}
//             <div className="fixed top-0 right-0 z-50 p-4">
//                 {notifications.map(notification => (
//                     <Notification
//                         key={notification.id}
//                         message={notification.message}
//                         type={notification.type}
//                         onClose={() => removeNotification(notification.id)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default SeatLayout;