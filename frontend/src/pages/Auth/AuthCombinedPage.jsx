import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { loginSchema, registerSchema } from '../../utils/validationSchema';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Container, TextField, Typography, Avatar, CssBaseline, Paper } from '@mui/material';
import { CameraAlt, ArrowBack } from '@mui/icons-material'; // Import ArrowBack icon
import moviegoLogo from '../../assets/moviego.png';

const AuthCombinedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authContextLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(location.pathname === '/login');
  const [previewImage, setPreviewImage] = useState('https://via.placeholder.com/150');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoginMode(location.pathname === '/login');
    if (location.pathname === '/register') {
      setPreviewImage('https://via.placeholder.com/150');
    }
  }, [location.pathname]);

  const loginInitialValues = {
    email: '',
    password: '',
  };

  const registerInitialValues = {
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
      setPreviewImage('https://via.placeholder.com/150');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      if (isLoginMode) {
        await authContextLogin(values.email, values.password);
        toast.success('Login successful!');
        navigate('/');
      } else {
        await authService.register(values);
        toast.success('Registration successful! Please login.');
        resetForm();
        setPreviewImage('https://via.placeholder.com/150');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred.';
      toast.error(message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f0f2f5', // Light grey background for the entire page
        p: 2, // Padding around the container
      }}
    >
      <CssBaseline />
      <Paper
        elevation={0} // Remove default shadow
        sx={{
          mt: 0, // Remove top margin
          p: 0, // Remove default padding
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px', // Max width for the card
          borderRadius: '12px', // Rounded corners for the entire card
          overflow: 'hidden', // Ensure content respects rounded corners
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Subtle shadow for the card
        }}
      >
        {/* Top Dark Blue Section */}
        {/* Top Dark Blue Section */}
        <Box
          sx={{
            bgcolor: '#0B193F', // Dark blue background
            width: '100%',
            p: 3, // Padding inside this section
            borderRadius: '12px 12px 0 0', // Rounded top corners
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Changed from 'flex-start' to 'center'
            justifyContent: 'center', // Added to center vertically if needed, but primarily for horizontal centering with column direction
            color: '#ffffff', // White text color
            position: 'relative',
          }}
        >
          {/* Back Arrow */}
          <Button
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              color: '#ffffff',
              minWidth: 'unset',
              p: 0,
              '& .MuiButton-startIcon': {
                margin: 0,
              },
            }}
          >
            <ArrowBack />
          </Button>
          {isLoginMode ? (
  <>
    <Box
      component="img"
      src={moviegoLogo} // Adjust path as needed
      alt="Logo"
      sx={{
        height: 50,
        mx: 'auto',
        display: 'block',
        mt: 4,
      }}
    />
    <Typography
      variant="h6"
      sx={{
        // textAlign: 'center', // This is no longer strictly necessary if parent is centering
        mt: 2,
        fontWeight: 'bold',
      }}
    >
      Login
    </Typography>
  </>
) : (
  <Typography
    component="h1"
    variant="h5"
    sx={{
      mt: 4,
      fontWeight: 'bold',
      alignSelf: 'center',
      fontSize: '1.5rem',
    }}
  >
    Create New Account
  </Typography>
)}

        </Box>

        {/* White Form Section */}
        <Box sx={{ p: 4, width: '100%', bgcolor: '#ffffff', borderRadius: '0 0 12px 12px' }}>
          <Formik
            initialValues={isLoginMode ? loginInitialValues : registerInitialValues}
            validationSchema={isLoginMode ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                {!isLoginMode && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}> {/* Increased margin-bottom */}
                    <Avatar src={previewImage} sx={{ width: 100, height: 100, mb: 2 }} />
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CameraAlt />}
                      sx={{
                        bgcolor: '#4073FF', // Blue button color
                        '&:hover': {
                          bgcolor: '#0B193F', // Darker blue on hover
                        },
                        textTransform: 'none', // Prevent uppercase
                        borderRadius: '8px', // Rounded button
                        px: 3, // Horizontal padding
                        py: 1, // Vertical padding
                      }}
                    >
                      Upload Image
                      <input type="file" hidden ref={fileInputRef} onChange={(event) => handleImageChange(event, setFieldValue)} />
                    </Button>
                  </Box>
                )}
                {!isLoginMode && (
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        label="Your Name" // Label from image
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        sx={{ mb: 2 }} // Margin bottom for spacing
                      />
                    )}
                  </Field>
                )}
                <Field name="email">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Email address" // Label from image
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      sx={{ mb: 2 }}
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      sx={{ mb: isLoginMode ? 1 : 2 }} // Less margin for login password
                    />
                  )}
                </Field>
{isLoginMode && (
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{
                      width: '100%',
                      mb: 2,
                      color: '#4073FF',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'none', // Removed underline on hover**
                      },
                    }}
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </Typography>
                )}
                {!isLoginMode && (
                  <Field name="confirmPassword">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Field>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: '#0B193F',
                    '&:hover': {
                      bgcolor: '#325BBF', // Slightly darker blue on hover**
                    },
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Loading...' : isLoginMode ? 'Login' : 'Create Movigo Account'}
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="body2" align="center" sx={{ color: '#333' }}>
            {isLoginMode ? (
              <>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#4073FF', textDecoration: 'none', fontWeight: 'bold' }}>
                  Create One
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#4073FF', textDecoration: 'none', fontWeight: 'bold' }}>
                  Login
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthCombinedPage;