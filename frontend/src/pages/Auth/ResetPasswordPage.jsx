import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const isFormValid = otp.length === 6 && newPassword.length >= 6;

  const handleResetPassword = async () => {
    try {
      await api.post('/user/reset-password-with-otp', { email, otp, newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Reset Password</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>OTP sent to: <strong>{email}</strong></Typography>
      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!isFormValid}
        onClick={handleResetPassword}
      >
        Change Password
      </Button>
    </Container>
  );
};

export default ResetPasswordPage;
