import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Search, Plus, X, Image as ImageIcon, BookOpen, FileText, Info, Tag, User, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;


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

// Modal Component for News Details
const NewsDetailsModal = ({ news, onClose }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'inactive':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'draft':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const InfoField = ({ icon: Icon, label, value, className = "" }) => (
        <div className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-100 hover:shadow-sm">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200">
                        {label}
                    </p>
                    <p className={`text-gray-900 font-semibold leading-relaxed ${className}`}>
                        {value || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderContentBlock = (block) => {
        switch (block.type) {
            case "Title":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800">{block.content || "No title provided"}</h4>
                    </div>
                );
            case "Description":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        {block.content ? (
                            <div dangerouslySetInnerHTML={{ __html: block.content }} />
                        ) : (
                            <p className="text-gray-500">No description provided</p>
                        )}
                    </div>
                );
            case "Left and Right Content":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-gray-800">{block.leftText || "No left content provided"}</div>
                            <div className="text-gray-800">{block.rightText || "No right content provided"}</div>
                        </div>
                    </div>
                );
            case "Single Image":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        {block.image ? (
                            <img
                                src={`${BASE_URL}/NewsImage/${block.image}`}
                                alt="Content"
                                className="w-full h-auto rounded-lg"
                            />
                        ) : (
                            <div className="text-gray-500">No image provided</div>
                        )}
                    </div>
                );
            case "Double Image":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                {block.leftImage ? (
                                    <img
                                        src={`${BASE_URL}/NewsImage/${block.leftImage}`}
                                        alt="Left Content"
                                        className="w-full h-auto rounded-lg"
                                    />
                                ) : (
                                    <div className="text-gray-500">No left image provided</div>
                                )}
                            </div>
                            <div>
                                {block.rightImage ? (
                                    <img
                                        src={`${BASE_URL}/NewsImage/${block.rightImage}`}
                                        alt="Right Content"
                                        className="w-full h-auto rounded-lg"
                                    />
                                ) : (
                                    <div className="text-gray-500">No right image provided</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "Point":
                const points = block.points || block.content || [];
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        {points.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {points.map((point, index) => (
                                    <li key={index} className="text-gray-800">{point}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No points provided</p>
                        )}
                    </div>
                );
            case "Quote":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                            {block.content || "No quote provided"}
                        </blockquote>
                    </div>
                );
            case "Embed Link":
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        {block.content ? (
                            <a href={block.content} className="text-blue-600 hover:underline">{block.content}</a>
                        ) : (
                            <p className="text-gray-500">No link provided</p>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <p className="text-gray-500">Unknown block type</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-60 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white ">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="relative flex justify-between items-start  ">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">News Details</h3>
                                <p className="text-blue-100 text-sm font-medium">Article Information</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
                {/* Content */}
                <div className="overflow-y-auto flex-grow bg-gradient-to-br from-gray-50 to-white ">
                    <div className="p-6 space-y-6">
                        {/* Image Section */}
                        {news.image && (
                            <div className="relative group">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-inner">
                                    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
                                        {!imageError ? (
                                            <img
                                                className={`w-full h-full object-scale-down transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                                src={`${BASE_URL}/NewsImage/${news.image}`}
                                                alt={news.title}
                                                onLoad={() => setImageLoaded(true)}
                                                onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <div className="text-center">
                                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500 font-medium">Image not available</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Information Grid */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                                    Article Information
                                </h4>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <InfoField
                                    icon={FileText}
                                    label="Title"
                                    value={news.title}
                                    className="text-lg leading-relaxed"
                                />
                                <InfoField
                                    icon={Edit}
                                    label="Description"
                                    value={news.description}
                                    className="leading-relaxed text-gray-700"
                                />
                            </div>
                        </div>
                        {/* User & Status Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* User Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
                                    <h4 className="font-bold text-gray-800 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-green-600" />
                                        User Information
                                    </h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <InfoField
                                        icon={User}
                                        label="Created By"
                                        value={news.create_user}
                                    />
                                    <InfoField
                                        icon={Edit}
                                        label="Updated By"
                                        value={news.update_user}
                                    />
                                </div>
                            </div>
                            {/* Timeline Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100">
                                    <h4 className="font-bold text-gray-800 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-purple-600" />
                                        Timeline
                                    </h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <InfoField
                                        icon={Calendar}
                                        label="Created At"
                                        value={formatDate(news.created_at)}
                                    />
                                    <InfoField
                                        icon={Calendar}
                                        label="Updated At"
                                        value={formatDate(news.updated_at)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Status Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Eye className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-700">Publication Status</span>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(news.status)} flex items-center space-x-2`}>
                                    <div className={`w-2 h-2 rounded-full ${news.status === 'Active' ? 'bg-emerald-500' : news.status === 'Inactive' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <span>{news.status}</span>
                                </div>
                            </div>
                        </div>
                        {/* Content Blocks Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h4 className="font-bold text-gray-800 mb-4">Content Blocks</h4>
                            <div className="space-y-4">
                                {news.context && Array.isArray(news.context) && news.context.map((block, index) => (
                                    <div key={index} className="mb-4">
                                        {renderContentBlock(block)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                        >
                            <span>Close</span>
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Modal Component for Add/Edit News
const NewsFormModal = ({ news, onClose, onSubmit, showNotification }) => {
    const normalizedContext = (news?.context && Array.isArray(news.context) ? news.context : []).map(block => {
        const base = { ...block };

        // Point blocks: restore "points" from content
        if (block.type === "Point" && Array.isArray(block.content)) {
            base.points = block.content;
        }

        // Left and Right Content blocks: ensure leftText/rightText are present
        if (block.type === "Left and Right Content") {
            base.leftText = block.leftText || '';
            base.rightText = block.rightText || '';
        }

        return base;
    });

    const [formData, setFormData] = useState({
        title: news?.title || '',
        description: news?.description || '',
        image: null,
        context: normalizedContext
    });

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

        if (!formData.title) errors.push('Title is required');
        if (!formData.description) errors.push('Description is required');
        if (!news && !formData.image) errors.push('Image is required');

        formData.context.forEach((block, index) => {
            if (block.type === "Double Image") {
                const hasLeft = !!block.leftImage || typeof block.leftImage === 'string';
                const hasRight = !!block.rightImage || typeof block.rightImage === 'string';
                if ((hasLeft && !hasRight) || (!hasLeft && hasRight)) {
                    errors.push(`Both left and right images must be added in Double Image block ${index + 1}`);
                }
            }

            if (block.type === "Left and Right Content") {
                const hasLeft = block.leftText?.trim();
                const hasRight = block.rightText?.trim();
                if ((hasLeft && !hasRight) || (!hasLeft && hasRight)) {
                    errors.push(`Both left and right content must be provided in block ${index + 1}`);
                }
            }
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
        const submitData = new FormData();

        // Title, Description, Thumbnail
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        if (formData.image) {
            submitData.append('image', formData.image);
        }
        if (news) {
            submitData.append('id', news.news_id);
        }

        // Add files for context blocks and build JSON content
        const contextData = [];

        formData.context.forEach((block, i) => {
            const blockData = { type: block.type };

            // For Left and Right Text
            if (block.type === "Left and Right Content") {
                blockData.leftText = block.leftText || '';
                blockData.rightText = block.rightText || '';
            }

            // For Points
            if (block.type === "Point") {
                blockData.content = (block.points || []).filter(p => p.trim() !== '');
            }

            // For text-based content
            if (["Title", "Description", "Quote", "Embed Link"].includes(block.type)) {
                blockData.content = block.content || '';
            }

            // SINGLE IMAGE BLOCK
            if (block.type === "Single Image") {
                const fieldName = `contextFile_${i}`;
                if (block.fileField) {
                    submitData.append(fieldName, block.fileField);
                    blockData.imageField = fieldName;
                } else if (block.image) {
                    // Preserve existing image filename
                    blockData.image = block.image;
                }
            }

            // DOUBLE IMAGE BLOCK
            if (block.type === "Double Image") {
                const leftField = `leftImage_${i}`;
                const rightField = `rightImage_${i}`;

                // LEFT
                if (block.leftImage instanceof File) {
                    submitData.append(leftField, block.leftImage);
                    blockData.leftImageField = leftField;
                } else if (block.leftImage) {
                    blockData.leftImage = block.leftImage;
                }

                // RIGHT
                if (block.rightImage instanceof File) {
                    submitData.append(rightField, block.rightImage);
                    blockData.rightImageField = rightField;
                } else if (block.rightImage) {
                    blockData.rightImage = block.rightImage;
                }
            }

            contextData.push(blockData);
        });

        // Final JSON string
        submitData.append('context', JSON.stringify(contextData));

        await onSubmit(submitData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-60 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="relative flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{news ? 'Edit News Article' : 'Create New News Article'}</h3>
                                <p className="text-blue-100 text-sm font-medium">Fill in the details below</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-grow bg-gradient-to-br from-gray-50 to-white">
                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit}>
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                                    <h4 className="font-bold text-gray-800 flex items-center">
                                        <Info className="w-5 h-5 mr-2 text-blue-600" />
                                        Basic Information
                                    </h4>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="flex items-center space-x-2">
                                                <span>Title</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                                            placeholder="Enter news title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="flex items-center space-x-2">
                                                <span>Description</span>
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                                            placeholder="Enter news description"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <span className="flex items-center space-x-2">
                                                <ImageIcon className="w-4 h-4 text-blue-600" />
                                                <span>Featured Image</span>
                                                {!news && <span className="text-red-500">*</span>}
                                            </span>
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            {formData.image ? (
                                                <div className="relative">
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Preview"
                                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image: null })}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : news?.image ? (
                                                <div className="relative">
                                                    <img
                                                        src={`${BASE_URL}/NewsImage/${news.image}`}
                                                        alt="Current"
                                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex-1">
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer transition-all">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <ImageIcon className="w-8 h-8 mb-3 text-blue-400" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                        accept="image/*"
                                                        required={!news}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Blocks Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100">
                                    <h4 className="font-bold text-gray-800 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-purple-600" />
                                        Content Blocks
                                    </h4>
                                </div>
                                <div className="p-6 space-y-4">
                                    {formData.context.length === 0 && (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <FileText className="mx-auto w-8 h-8 text-gray-400" />
                                            <h4 className="mt-2 text-sm font-medium text-gray-700">No content blocks added</h4>
                                            <p className="mt-1 text-xs text-gray-500">Add your first content block to get started</p>
                                        </div>
                                    )}

                                    {formData.context.map((block, index) => (
                                        <div key={index} className="group relative p-6 rounded-xl border border-gray-200 hover:border-blue-300 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                                            {/* Block Header */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                        Block {index + 1}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {block.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={block.type}
                                                        onChange={(e) => {
                                                            const updated = [...formData.context];
                                                            updated[index] = {
                                                                type: e.target.value,
                                                                content: '',
                                                                leftText: '',
                                                                rightText: '',
                                                                fileField: null,
                                                                leftImage: null,
                                                                rightImage: null,
                                                                points: []
                                                            };
                                                            setFormData({ ...formData, context: updated });
                                                        }}
                                                        className="text-xs px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    >
                                                        {[
                                                            "Title", "Description", "Left and Right Content",
                                                            "Single Image", "Double Image", "Point", "Embed Link", "Quote"
                                                        ].map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...formData.context];
                                                            updated.splice(index, 1);
                                                            setFormData({ ...formData, context: updated });
                                                        }}
                                                        className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-all"
                                                        title="Remove block"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Block Content */}
                                            <div className="space-y-4">
                                                {/* TEXT BLOCKS */}
                                                {["Title", "Description", "Quote", "Point", "Embed Link"].includes(block.type) && (
                                                    block.type === "Description" ? (
                                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                            <Editor
                                                                apiKey={apikey}
                                                                value={block.content}
                                                                init={{
                                                                    height: 250,
                                                                    menubar: true,
                                                                    plugins: [
                                                                        "advlist", "autolink", "lists", "link", "charmap", "print", "preview", "anchor",
                                                                        "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media",
                                                                        "table", "paste", "help", "wordcount", "emoticons", "hr", "nonbreaking"
                                                                    ],
                                                                    toolbar:
                                                                        "undo redo | formatselect | bold italic underline | " +
                                                                        "alignleft aligncenter alignright alignjustify | " +
                                                                        "bullist numlist outdent indent | removeformat | help",
                                                                    content_style:
                                                                        "body { font-family:Arial,Helvetica,sans-serif; font-size:14px }",
                                                                }}
                                                                onEditorChange={(content) => {
                                                                    const updated = [...formData.context];
                                                                    updated[index].content = content;
                                                                    setFormData({ ...formData, context: updated });
                                                                }}
                                                            />
                                                        </div>
                                                    ) : block.type === "Point" ? (
                                                        <div className="space-y-3">
                                                            <div className="space-y-2">
                                                                {(block.points || []).map((point, i) => (
                                                                    <div key={i} className="flex items-center gap-2">
                                                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                                            {i + 1}
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={point}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.context];
                                                                                updated[index].points[i] = e.target.value;
                                                                                setFormData({ ...formData, context: updated });
                                                                            }}
                                                                            placeholder={`Enter point ${i + 1}`}
                                                                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
                                                                            onClick={() => {
                                                                                const updated = [...formData.context];
                                                                                updated[index].points.splice(i, 1);
                                                                                setFormData({ ...formData, context: updated });
                                                                            }}
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-all duration-200"
                                                                onClick={() => {
                                                                    const updated = [...formData.context];
                                                                    if (!updated[index].points) updated[index].points = [];
                                                                    updated[index].points.push('');
                                                                    setFormData({ ...formData, context: updated });
                                                                }}
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                <span>Add Point</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                            placeholder={`Enter ${block.type.toLowerCase()}...`}
                                                            value={block.content}
                                                            onChange={(e) => {
                                                                const updated = [...formData.context];
                                                                updated[index].content = e.target.value;
                                                                setFormData({ ...formData, context: updated });
                                                            }}
                                                            rows={block.type === "Title" ? 2 : 4}
                                                        />
                                                    )
                                                )}

                                                {/* LEFT AND RIGHT TEXT */}
                                                {block.type === "Left and Right Content" && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Left Content</label>
                                                            <textarea
                                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                placeholder="Enter left content..."
                                                                value={block.leftText}
                                                                onChange={(e) => {
                                                                    const updated = [...formData.context];
                                                                    updated[index].leftText = e.target.value;
                                                                    setFormData({ ...formData, context: updated });
                                                                }}
                                                                rows={4}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Right Content</label>
                                                            <textarea
                                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                placeholder="Enter right content..."
                                                                value={block.rightText}
                                                                onChange={(e) => {
                                                                    const updated = [...formData.context];
                                                                    updated[index].rightText = e.target.value;
                                                                    setFormData({ ...formData, context: updated });
                                                                }}
                                                                rows={4}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* SINGLE IMAGE */}
                                                {block.type === "Single Image" && (
                                                    <div className="space-y-3">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Upload Image</label>
                                                        <div className="flex flex-col md:flex-row gap-4">
                                                            {(block.image || block.fileField) && (
                                                                <div className="relative w-full md:w-1/3">
                                                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                                        <img
                                                                            src={block.fileField ?
                                                                                URL.createObjectURL(block.fileField) :
                                                                                `${BASE_URL}/NewsImage/${block.image}`}
                                                                            alt="Preview"
                                                                            className="w-full h-48 object-cover"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                                                                        onClick={() => {
                                                                            const updated = [...formData.context];
                                                                            if (block.fileField) {
                                                                                updated[index].fileField = null;
                                                                            } else {
                                                                                updated[index].image = null;
                                                                            }
                                                                            setFormData({ ...formData, context: updated });
                                                                        }}
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className={`flex-1 ${(block.image || block.fileField) ? 'md:w-2/3' : 'w-full'}`}>
                                                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                                                        <p className="mb-2 text-sm text-gray-500">
                                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.context];
                                                                            updated[index].fileField = e.target.files[0];
                                                                            setFormData({ ...formData, context: updated });
                                                                        }}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* DOUBLE IMAGE */}
                                                {block.type === "Double Image" && (
                                                    <div className="space-y-3">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Upload Images</label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Left Image */}
                                                            <div className="space-y-2">
                                                                <div className="font-medium text-sm text-gray-700 flex items-center">
                                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                                    Left Image
                                                                </div>
                                                                {(block.leftImage || (block.leftImage instanceof File)) && (
                                                                    <div className="relative">
                                                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={block.leftImage instanceof File ?
                                                                                    URL.createObjectURL(block.leftImage) :
                                                                                    `${BASE_URL}/NewsImage/${block.leftImage}`}
                                                                                alt="Left Preview"
                                                                                className="w-full h-48 object-cover"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                                                                            onClick={() => {
                                                                                const updated = [...formData.context];
                                                                                updated[index].leftImage = null;
                                                                                setFormData({ ...formData, context: updated });
                                                                            }}
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                                                                        <p className="text-xs text-gray-500">Upload left image</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.context];
                                                                            updated[index].leftImage = e.target.files[0];
                                                                            setFormData({ ...formData, context: updated });
                                                                        }}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                    />
                                                                </label>
                                                            </div>

                                                            {/* Right Image */}
                                                            <div className="space-y-2">
                                                                <div className="font-medium text-sm text-gray-700 flex items-center">
                                                                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                                                                    Right Image
                                                                </div>
                                                                {(block.rightImage || (block.rightImage instanceof File)) && (
                                                                    <div className="relative">
                                                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={block.rightImage instanceof File ?
                                                                                    URL.createObjectURL(block.rightImage) :
                                                                                    `${BASE_URL}/NewsImage/${block.rightImage}`}
                                                                                alt="Right Preview"
                                                                                className="w-full h-48 object-cover"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                                                                            onClick={() => {
                                                                                const updated = [...formData.context];
                                                                                updated[index].rightImage = null;
                                                                                setFormData({ ...formData, context: updated });
                                                                            }}
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                                                                        <p className="text-xs text-gray-500">Upload right image</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.context];
                                                                            updated[index].rightImage = e.target.files[0];
                                                                            setFormData({ ...formData, context: updated });
                                                                        }}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Block Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                context: [...formData.context, { type: "Title", content: "" }]
                                            })
                                        }
                                        className="w-full py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add Content Block</span>
                                    </button>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Processing...</span>
                                        </>
                                    ) : news ? (
                                        <>
                                            <Edit className="w-4 h-4" />
                                            <span>Update News</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Create News</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main News Component
const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const truncateText = (text, length) => {
        if (!text) return '';
        return text.length > length ? `${text.substring(0, length)}...` : text;
    };

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

    const fetchNews = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/news/get-all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }

            const data = await response.json();
            const sortedData = data.sort((a, b) => b.news_id - a.news_id);
            setNewsList(sortedData);
        } catch (error) {
            console.error('Error fetching news:', error);
            showNotification(`Error fetching news: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleNewsStatus = async (newsId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/news/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: newsId })
            });

            if (!response.ok) {
                throw new Error('Failed to toggle news status');
            }

            const result = await response.json();
            showNotification(result.message);

            setNewsList(newsList.map(news =>
                news.news_id === newsId
                    ? { ...news, status: news.status === 'Active' ? 'Inactive' : 'Active' }
                    : news
            ));

            if (selectedNews && selectedNews.news_id === newsId) {
                setSelectedNews({
                    ...selectedNews,
                    status: selectedNews.status === 'Active' ? 'Inactive' : 'Active'
                });
            }
        } catch (error) {
            console.error('Error toggling news status:', error);
            showNotification(`Error toggling news status: ${error.message}`, 'error');
        }
    };

    const getNewsDetails = async (newsId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/news/get`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: newsId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch news details');
            }

            const newsData = await response.json();
            setSelectedNews(newsData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching news details:', error);
            showNotification(`Error fetching news details: ${error.message}`, 'error');
        }
    };

    const handleAddOrUpdateNews = async (formData) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const url = formMode === 'add' ? `${BASE_URL}/api/news/add` : `${BASE_URL}/api/news/update`;
            const method = formMode === 'add' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to ${formMode} news`);
            }

            const result = await response.json();
            showNotification(result.message);
            fetchNews();
            setIsFormModalOpen(false);
        } catch (error) {
            console.error(`Error ${formMode}ing news:`, error);
            showNotification(`Error ${formMode}ing news: ${error.message}`, 'error');
        }
    };

    const handleDeleteNews = async (newsId) => {
        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/news/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: newsId })
            });

            if (!response.ok) {
                throw new Error('Failed to delete news');
            }

            const result = await response.json();
            showNotification(result.message);
            fetchNews();
        } catch (error) {
            console.error('Error deleting news:', error);
            showNotification(`Error deleting news: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    const filteredNews = newsList.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            news.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || news.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

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
                            <h2 className="text-2xl font-bold text-gray-800">News Management</h2>
                            <p className="text-gray-600 mt-1">Manage and monitor news</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Search news..."
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
                                className="px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={15}>15 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                            <button
                                onClick={() => {
                                    setFormMode('add');
                                    setSelectedNews(null);
                                    setIsFormModalOpen(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add News</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total News" value={newsList.length} icon={BookOpen} color="#3B82F6" />
                        <StatCard title="Active News" value={newsList.filter(news => news.status === 'Active').length} icon={BookOpen} color="#10B981" />
                        <StatCard title="Inactive News" value={newsList.filter(news => news.status === 'Inactive').length} icon={BookOpen} color="#EF4444" />
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {currentNews.map((news, index) => (
                                        <tr key={news.news_id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {news.image ? (
                                                    <img className="h-16 w-12 rounded-lg object-cover" src={`${BASE_URL}/NewsImage/${news.image}`} alt={news.title} />
                                                ) : (
                                                    <div className="h-16 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg font-bold text-white">{news.title.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div>
                                                    <div className="font-medium text-gray-800">{truncateText(news.title, 40)}</div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {truncateText(news.description, 60)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${news.status === 'Active' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' : 'bg-red-100 text-red-800 ring-1 ring-red-200'}`}>
                                                    {news.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button onClick={() => getNewsDetails(news.news_id)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => {
                                                        setFormMode('edit');
                                                        setSelectedNews(news);
                                                        setIsFormModalOpen(true);
                                                    }} className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-100 transition-all duration-200" title="Edit News">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteNews(news.news_id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-200" title="Delete News">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => toggleNewsStatus(news.news_id)} className={`p-2 rounded-lg transition-all duration-200 ${news.status === 'Active' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'}`} title={`${news.status === 'Active' ? 'Deactivate' : 'Activate'} News`}>
                                                        {news.status === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredNews.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12">
                                                <p className="text-gray-500 text-lg">No news found</p>
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
            {isModalOpen && selectedNews && (
                <NewsDetailsModal news={selectedNews} onClose={() => setIsModalOpen(false)} />
            )}
            {isFormModalOpen && (
                <NewsFormModal
                    news={selectedNews}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleAddOrUpdateNews}
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

export default News;