import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, User, Film, Phone, Upload, Image, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'admin' // 'admin', 'owner', or 'manager'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Admin email restriction (remove if not needed)
    if (formData.userType === 'admin' && formData.email !== ADMIN_EMAIL) {
      setError('Access denied. Only authorized administrators can login.');
      setLoading(false);
      return;
    }

    try {
      let endpoint;
      switch(formData.userType) {
        case 'admin':
          endpoint = `${BASE_URL}/api/user/login`;
          break;
        case 'owner':
          endpoint = `${BASE_URL}/api/cinema-owner/login`;
          break;
        case 'manager':
          endpoint = `${BASE_URL}/api/cinema-manager/login`;
          break;
        default:
          endpoint = `${BASE_URL}/api/user/login`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        // Store credentials based on user type
        switch(formData.userType) {
          case 'admin':
            sessionStorage.setItem('adminToken', data.token);
            sessionStorage.setItem('adminEmail', data.email);
            break;
          case 'owner':
            sessionStorage.setItem('ownerToken', data.token);
            sessionStorage.setItem('ownerEmail', data.email);
            sessionStorage.setItem('ownerName', data.name);
            sessionStorage.setItem('ownerId', data.owner_id);
            break;
          case 'manager':
            sessionStorage.setItem('managerToken', data.token);
            sessionStorage.setItem('managerEmail', data.email);
            sessionStorage.setItem('cinemaId', data.cinema_id);
            break;
        }
        navigate('/adminpanel');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!registerData.name || !registerData.email || !registerData.contact ||
        !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!selectedImage) {
      setError('Please upload a profile image.');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', registerData.name);
      formDataToSend.append('email', registerData.email);
      formDataToSend.append('contact', registerData.contact);
      formDataToSend.append('password', registerData.password);
      formDataToSend.append('image', selectedImage);

      const response = await fetch(`${BASE_URL}/api/cinema-owner/register`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok) {
        setError('');
        alert('Registration successful! Your account will be activated after verification.');
        setIsRegistering(false);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    switch(formData.userType) {
      case 'admin':
        return <Shield className="w-8 h-8 text-white" />;
      case 'owner':
        return <Film className="w-8 h-8 text-white" />;
      case 'manager':
        return <ClipboardList className="w-8 h-8 text-white" />;
      default:
        return <Shield className="w-8 h-8 text-white" />;
    }
  };

  const getUserTypeTitle = () => {
    switch(formData.userType) {
      case 'admin':
        return 'Admin Portal';
      case 'owner':
        return ' Owner Portal';
      case 'manager':
        return ' Manager Portal';
      default:
        return 'Admin Portal';
    }
  };

  const getUserTypeDescription = () => {
    switch(formData.userType) {
      case 'admin':
        return 'Secure administrator access';
      case 'owner':
        return 'Manage your cinema operations';
      case 'manager':
        return 'Manage your cinema screenings';
      default:
        return 'Secure administrator access';
    }
  };

  const getLoginButtonText = () => {
    switch(formData.userType) {
      case 'admin':
        return 'Sign In to Admin Panel';
      case 'owner':
        return 'Sign In to Owner Portal';
      case 'manager':
        return 'Sign In to Manager Portal';
      default:
        return 'Sign In';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {isRegistering ? (
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200/50 p-8 w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cinema Owner Registration</h1>
            <p className="text-gray-600">Register your cinema owner account</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-48 h-48 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={triggerFileInput}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Upload Profile Image</p>
                        <p className="text-gray-400 text-xs">(Required)</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    {imagePreview ? 'Change Image' : 'Select Image'}
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-blue-500" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="contact"
                          name="contact"
                          value={registerData.contact}
                          onChange={handleRegisterChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="owner@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-blue-500" />
                    Account Security
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          className="block w-full pl-10 pr-12 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showRegisterConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          className="block w-full pl-10 pr-12 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                        >
                          {showRegisterConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200/50 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
              {getUserTypeIcon()}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {getUserTypeTitle()}
            </h1>
            <p className="text-gray-600">
              {getUserTypeDescription()}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'admin'})}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  formData.userType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'owner'})}
                className={`px-4 py-2 text-sm font-medium ${
                  formData.userType === 'owner'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'manager'})}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  formData.userType === 'manager'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Manager
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder={formData.userType === 'admin' ? 'admin@example.com' : `${formData.userType}@example.com`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                getLoginButtonText()
              )}
            </button>

            {formData.userType === 'owner' && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Don't have an account? Register here
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Authorized personnel only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;