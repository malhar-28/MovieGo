// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { loginSchema } from '../../utils/validationSchema';
import '../../index.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await login(values.email, values.password); // Use context's login
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/'); // Navigate to home page on successful login
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
      <div className="col-12 col-md-8 col-lg-5 col-xl-4">
        <div className="form-container">
          <h2 className="text-center mb-4">Login to MovieGo</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
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

                <div className="mb-4">
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

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 mb-3"
                  disabled={isSubmitting || loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;