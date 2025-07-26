// src/pages/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import User from '../components/User';
import Movie from '../components/Movie';
import Cinema from '../components/Cinema';
import CinemaReview from '../components/CinemaReview';
import News from '../components/News';
import Screen from '../components/Screen';
// import SeatLayout from '../components/SeatLayout';
import Showtime from '../components/Showtime';
import Booking from '../components/Booking';
import { 
    Users, Film, MapPin, Star, Newspaper, 
    Monitor, Layout, Calendar, BookOpen, 
    UserCircle, LogOut, Menu, X, ClipboardList, UserCog, KeyRound // Added icons
} from 'lucide-react';
import CinemaOwner from '../components/CinemaOwner';
import CinemaManager from '../components/CinemaManager';
import { useNavigate } from 'react-router-dom';

// Notification Component (assuming it's defined elsewhere or here)
const Notification = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4"><span className="text-xl">×</span></button>
      </div>
    </div>
);

const BASE_URL = import.meta.env.VITE_BASE_URL;


// ++ START: New Change Password Modal ++
const ChangePasswordModal = ({ onClose, showNotification }) => {
    const [formData, setFormData] = useState({
        recent_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            showNotification('New password and confirm password do not match.', 'error');
            return;
        }
        if (formData.new_password.length < 6) {
            showNotification('New password must be at least 6 characters long.', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = sessionStorage.getItem('managerToken');
            const response = await fetch(`${BASE_URL}/api/cinema-manager/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recent_password: formData.recent_password,
                    new_password: formData.new_password
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to change password');
            }

            showNotification('Password changed successfully!', 'success');
            onClose();
        } catch (error) {
            console.error('Error changing password:', error);
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                    <h3 className="text-xl font-bold">Change Password</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Recent Password</label>
                        <input
                            type="password"
                            name="recent_password"
                            value={formData.recent_password}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// -- END: New Change Password Modal --


const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem('adminToken') ? 'users' : 
               sessionStorage.getItem('ownerToken') ? 'cinemas' : 
               sessionStorage.getItem('managerToken') ? 'screens' : 
               'showtimes';
    });

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false); // State for modal
    const [notifications, setNotifications] = useState([]); // State for notifications
    const navigate = useNavigate();

    const isAdmin = !!sessionStorage.getItem('adminToken');
    const isOwner = !!sessionStorage.getItem('ownerToken');
    const isManager = !!sessionStorage.getItem('managerToken');
    const cinemaId = sessionStorage.getItem('cinemaId');

    useEffect(() => {
        if (!isAdmin && !isOwner && !isManager) {
            navigate('/');
        }
    }, [isAdmin, isOwner, isManager, navigate]);

    // Function to show notifications
    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const allTabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'cinemaOwner', label: 'Cinema Owners', icon: UserCircle },
        { id: 'cinemaManager', label: 'Cinema Managers', icon: UserCog },
        { id: 'movies', label: 'Movies', icon: Film },
        { id: 'cinemas', label: 'Cinemas', icon: MapPin },
        { id: 'screens', label: 'Screens', icon: Monitor },
        { id: 'showtimes', label: 'Showtimes', icon: Calendar },
        { id: 'bookings', label: 'Bookings', icon: BookOpen },
        { id: 'cinemaReviews', label: 'Cinema Reviews', icon: Star },
        { id: 'news', label: 'News', icon: Newspaper }
    ];

    const ownerTabs = [
        { id: 'cinemas', label: 'My Cinemas', icon: MapPin },
        { id: 'cinemaManager', label: 'Cinema Managers', icon: UserCog },
        { id: 'screens', label: 'Screens', icon: Monitor },
        { id: 'showtimes', label: 'Showtimes', icon: Calendar },
        { id: 'bookings', label: 'Bookings', icon: BookOpen },
        { id: 'cinemaReviews', label: 'Reviews', icon: Star }
    ];

    const managerTabs = [
        { id: 'screens', label: 'Screens', icon: Monitor },
        { id: 'showtimes', label: 'Showtimes', icon: Calendar },
        { id: 'bookings', label: 'Bookings', icon: BookOpen },
        { id: 'cinemaReviews', label: 'Reviews', icon: Star }
    ];

    const tabs = isAdmin ? allTabs : (isOwner ? ownerTabs : managerTabs);

    const handleLogout = () => {
        sessionStorage.clear(); // Clears all session storage
        navigate('/');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const renderContent = () => {
        const commonProps = { cinemaId: isManager ? cinemaId : null };
        switch (activeTab) {
            case 'users': return <User {...commonProps} />;
            case 'cinemaOwner': return <CinemaOwner {...commonProps} />;
            case 'cinemaManager': return <CinemaManager {...commonProps} />;
            case 'movies': return <Movie {...commonProps} />;
            case 'cinemas': return <Cinema {...commonProps} />;
            case 'screens': return <Screen {...commonProps} />;
            // case 'seatlayouts': return <SeatLayout {...commonProps} />;
            case 'showtimes': return <Showtime {...commonProps} />;
            case 'bookings': return <Booking {...commonProps} />;
            case 'cinemaReviews': return <CinemaReview {...commonProps} />;
            case 'news': return <News {...commonProps} />;
            default: return <div className="p-8">Select a tab to view content</div>;
        }
    };

    const getUserType = () => {
        if (isAdmin) return 'Administrator';
        if (isOwner) return 'Cinema Owner';
        if (isManager) return 'Cinema Manager';
        return 'User';
    };

    const getUserEmail = () => {
        return sessionStorage.getItem('adminEmail') || 
               sessionStorage.getItem('ownerEmail') || 
               sessionStorage.getItem('managerEmail') || 
               '';
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex h-screen">
                {/* Left Sidebar */}
                <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl border-r border-blue-100 flex flex-col transition-all duration-300 ease-in-out`}>
                    <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex items-center justify-between">
                            {!sidebarCollapsed && (
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                                    <p className="text-blue-100 text-sm mt-1">{getUserType()} Dashboard</p>
                                </div>
                            )}
                            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-blue-500 transition-colors duration-200 ml-auto">
                                {sidebarCollapsed ? <Menu className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
                            </button>
                        </div>
                    </div>
                    
                    <nav className="mt-6 flex-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center ${sidebarCollapsed ? 'px-3 justify-center' : 'px-6'} py-4 text-left hover:bg-blue-50 transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                    title={sidebarCollapsed ? tab.label : ''}
                                >
                                    <Icon className={`w-5 h-5 ${!sidebarCollapsed && 'mr-3'}`} />
                                    {!sidebarCollapsed && <span className="font-medium">{tab.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                    
                    {/* User info and Action Buttons */}
                    <div className="p-4 border-t border-blue-100 space-y-2">
                        {!sidebarCollapsed && (
                            <div className="mb-2">
                                <p className="text-sm font-medium text-gray-700 truncate">{getUserEmail()}</p>
                                <p className="text-xs text-gray-500">{getUserType()}</p>
                                {isManager && <p className="text-xs text-gray-500">Cinema ID: {cinemaId}</p>}
                            </div>
                        )}
                        
                        {/* ++ START: Added Button for Manager ++ */}
                        {isManager && (
                            <button
                                onClick={() => setChangePasswordModalOpen(true)}
                                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-center px-4'} py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200`}
                                title={sidebarCollapsed ? 'Change Password' : ''}
                            >
                                <KeyRound className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${sidebarCollapsed ? '' : 'mr-2'}`} />
                                {!sidebarCollapsed && <span className="font-medium">Password</span>}
                            </button>
                        )}
                        {/* -- END: Added Button for Manager -- */}

                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-center px-4'} py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200`}
                            title={sidebarCollapsed ? 'Logout' : ''}
                        >
                            <LogOut className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${sidebarCollapsed ? '' : 'mr-2'}`} />
                            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
                
                {/* Right Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {renderContent()} 
                    </div>
                </div>
            </div>

            {/* Render Modals and Notifications */}
            {isChangePasswordModalOpen && (
                <ChangePasswordModal 
                    onClose={() => setChangePasswordModalOpen(false)} 
                    showNotification={showNotification} 
                />
            )}
            <div className="fixed top-0 right-0 z-50 p-4">
                {notifications.map(n => <Notification key={n.id} {...n} />)}
            </div>
        </div>
    );
};

export default AdminPanel;