// src/pages/Auth/RegisterPage.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { registerSchema } from '../../utils/validationSchema';
import '../../index.css';

// FIX: Import your local default user image
// Change to:
import defaultUserImage from '../../assets/default-user.png';// Make sure this path is correct!

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Initialize with the imported local image
  const [previewImage, setPreviewImage] = useState(defaultUserImage);
  const fileInputRef = useRef(null);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFieldValue('image', null);
      setPreviewImage(defaultUserImage); // Reset to local default image
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      await authService.register(values);
      toast.success('Registration successful! Please login.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      resetForm();
      setPreviewImage(defaultUserImage); // Reset to local default image
      navigate('/login');
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="form-container">
          <h2 className="text-center mb-4">Create New Account</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="d-flex flex-column align-items-center mb-3">
                  <img
                    // Use previewImage directly, which is initialized with or set to defaultUserImage
                    src={previewImage}
                    alt="User Profile"
                    className="rounded-circle mb-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current.click()}
                  />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                    style={{ display: 'none' }}
                  />
                  <small className="text-muted">Click image to upload profile picture (Optional)</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 mb-3"
                  disabled={isSubmitting || loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Register'
                  )}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;