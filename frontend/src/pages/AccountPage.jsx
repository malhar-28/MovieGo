import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaSignOutAlt, FaKey, FaArrowLeft, FaCamera, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import defaultUserImage from '../assets/default-user.png';
import Navbar from '../components/Navbar';

// const BASE_BACKEND_URL = 'http://localhost:5000'; 
const BASE_BACKEND_URL = import.meta.env.VITE_BASE_URL; 

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [displayImageUrl, setDisplayImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to set display image URL, with cache busting
  useEffect(() => {
    console.log("AccountPage: useEffect triggered for image display."); // ADD THIS
    if (selectedFile) {
      // If a file is selected, show its local URL for preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setDisplayImageUrl(objectUrl);
      console.log("AccountPage: Displaying local image preview:", objectUrl); // ADD THIS
      // Clean up the object URL when the component unmounts or file changes
      return () => {
        URL.revokeObjectURL(objectUrl);
        console.log("AccountPage: Revoked object URL."); // ADD THIS
      };
    } else if (currentUser?.image) {
      // Add timestamp to force cache refresh when loading from backend
      const imageUrl = `${BASE_BACKEND_URL}/UserImage/${currentUser.image}?t=${Date.now()}`;
      setDisplayImageUrl(imageUrl);
      console.log("AccountPage: Displaying backend image:", imageUrl); // ADD THIS
    } else {
      setDisplayImageUrl(defaultUserImage);
      console.log("AccountPage: Displaying default image."); // ADD THIS
    }
  }, [currentUser?.image, selectedFile]); // Depend on currentUser.image and selectedFile

  const handleFileChange = (event) => {
    console.log("AccountPage: handleFileChange triggered."); // ADD THIS
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log("AccountPage: File selected:", file.name, file.type); // ADD THIS
    } else {
      setSelectedFile(null);
      console.log("AccountPage: No file selected or file input cleared."); // ADD THIS
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
    console.log("AccountPage: Image upload button clicked, triggering file input."); // ADD THIS
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("AccountPage: handleUpdateProfile triggered."); // ADD THIS

    // Check if there's anything to update
    const isNameChanged = newName !== currentUser?.name;
    const isImageChanged = selectedFile !== null;

    if (!isNameChanged && !isImageChanged) {
      toast.info("No changes to update.");
      console.log("AccountPage: No changes to update (name or image)."); // ADD THIS
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    if (isNameChanged) {
      formData.append('name', newName);
      console.log("AccountPage: Appending new name to FormData:", newName); // ADD THIS
    } else {
      // If name is not changed, still send current name to ensure it's not nullified if backend expects it
      formData.append('name', currentUser.name);
      console.log("AccountPage: Appending current name to FormData:", currentUser.name); // ADD THIS
    }

    if (isImageChanged) {
      formData.append('image', selectedFile);
      console.log("AccountPage: Appending selected image to FormData:", selectedFile.name); // ADD THIS
    }

    // IMPORTANT: Log FormData content before sending (for debugging)
    for (let pair of formData.entries()) {
      console.log("AccountPage: FormData entry - ", pair[0], ": ", pair[1]); // ADD THIS
    }

    try {
      const updatedUser = await authService.updateUser(formData);
      updateCurrentUser(updatedUser); // Update context and local storage
      toast.success('Profile updated successfully!');
      setSelectedFile(null); // Clear selected file after successful upload
      setIsEditingName(false); // Exit editing mode
      console.log("AccountPage: Profile update successful. Updated user data:", updatedUser); // ADD THIS
    } catch (error) {
      console.error('AccountPage: Error updating profile:', error); // ADD THIS
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("AccountPage: Submission process finished."); // ADD THIS
    }
  };


  const handleLogout = () => {
    logout();
  };

  // ... (rest of your JSX remains the same)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col items-center py-10 px-4">
      <Navbar /> {/* Ensure your Navbar is present here */}

      <div className="relative w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 mt-10 border border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition duration-300 z-10 p-2 rounded-full hover:bg-gray-700"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-2xl" />
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-blue-400">
          My Account
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-center transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl border border-gray-100">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl group">
            <img
              src={displayImageUrl}
              alt="User Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultUserImage;
                console.error("AccountPage: Error loading image, setting to default."); // ADD THIS
              }}
            />
            {/* Overlay for image upload */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={handleImageUploadClick}
            >
              <FaCamera className="text-white text-3xl" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-4">
            {isEditingName ? (
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
                />
                <button
                  onClick={handleUpdateProfile} // Use the combined update function
                  disabled={isSubmitting}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mr-2">
                  {currentUser?.name || 'User Name'}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                  aria-label="Edit name"
                >
                  <FaEdit className="text-xl" />
                </button>
              </div>
            )}
            {currentUser?.email && (
              <div className="mt-2 text-gray-600 text-base">
                <p className="font-semibold">Email:</p>
                <p className="font-normal text-gray-600 text-base">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl border border-gray-100">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/account/change-password')}
              className="group w-full bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
            >
              <FaKey className="mr-3" /> Change Password
            </button>
            <button
              onClick={handleLogout}
              className="group w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>

            {/* Save Profile Button - Only visible if there are changes */}
            {(selectedFile || isEditingName) && !isEditingName && ( // Show only if image selected OR name changed and not in name edit mode
              <button
                onClick={handleUpdateProfile}
                disabled={isSubmitting}
                className="group w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center"
              >
                {isSubmitting ? <FaSpinner className="animate-spin mr-3" /> : <FaEdit className="mr-3" />}
                {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;