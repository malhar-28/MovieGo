import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await api.post('/user/send-otp', { email });
      toast.success('OTP sent successfully!');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Forgot Password</Typography>
      <TextField
        fullWidth
        label="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSendOtp}
        disabled={!email}
      >
        Send OTP
      </Button>
    </Container>
  );
};

export default ForgotPasswordPage;
