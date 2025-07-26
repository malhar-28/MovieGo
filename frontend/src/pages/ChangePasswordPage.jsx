import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa'; // Using react-icons for spinner and back arrow
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct
import authService from '../services/authService'; // Ensure this path is correct
import Navbar from '../components/Navbar'; // Ensure this path is correct

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // For overall form submission loading

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'New Password must be at least 6 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm New Password is required'),
  });

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true); // Start overall loading
    setSubmitting(true); // Formik's submitting state
    try {
      await authService.changePassword(values.oldPassword, values.newPassword);

      toast.success('Password changed successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      resetForm();
      navigate('/account');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred.';
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false); // End overall loading
      setSubmitting(false); // End Formik's submitting state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col text-gray-800 relative overflow-hidden">
      {/* Background decoration consistent with other pages */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 mb-8 border border-white/20 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 transform transition-all duration-300 hover:scale-[1.005] hover:shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate('/account')}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-lg font-semibold"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Change Password
            </h1>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Old Password
                  </label>
                  <Field
                    name="oldPassword"
                    type="password"
                    placeholder="Enter your old password"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm
                      ${errors.oldPassword && touched.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    New Password
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm
                      ${errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <Field
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white shadow-sm
                      ${errors.confirmNewPassword && touched.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="group w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Change Password'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  disabled={loading}
                  className="group w-full bg-gray-200 text-gray-800 text-lg font-bold px-8 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
