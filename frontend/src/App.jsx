
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AuthCombinedPage from './pages/Auth/AuthCombinedPage';
// import HomePage from './pages/HomePage';
// import AccountPage from './pages/AccountPage';
// import ChangePasswordPage from './pages/ChangePasswordPage';
// import MovieDetailPage from './pages/MovieDetailPage';
// import SeatSelectionPage from './pages/SeatSelectionPage';
// import UserBookingHistoryPage from './pages/UserBookingHistoryPage';
// import TicketDetailPage from './pages/TicketDetailPage';
// import NewsDetailPage from './pages/NewsDetailPage';
// import NewsPage from './pages/NewsPage';
// import AllMoviesPage from './pages/AllMoviesPage';
// import AllCinemasPage from './pages/AllCinemasPage';
// import CinemaDetailPage from './pages/CinemaDetailPage';
// import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
// import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
// import { AuthProvider, useAuth } from './context/AuthContext';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// const PrivateRoute = ({ children }) => {
//   const { currentUser, loading } = useAuth();
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   return currentUser ? children : <Navigate to="/login" replace />;
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <AuthProvider>
//           <ToastContainer />
//           <Routes>
//             <Route path="/login" element={<AuthCombinedPage />} />
//             <Route path="/register" element={<AuthCombinedPage />} />
//             <Route path="/" element={<HomePage />} />
//             <Route path="/news" element={<NewsPage />} />
//             <Route path="/movies" element={<AllMoviesPage />} />
//             <Route path="/cinemas" element={<AllCinemasPage />} />
//             <Route path="/cinemas/:cinemaId" element={<CinemaDetailPage />} />
//             <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
//             <Route path="/account/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
//             <Route path="/movies/:movieId" element={<MovieDetailPage />} />
//             <Route path="/book/:showtimeId" element={<PrivateRoute><SeatSelectionPage /></PrivateRoute>} />
//             <Route path="/booking-history" element={<PrivateRoute><UserBookingHistoryPage /></PrivateRoute>} />
//             <Route path="/ticket/:bookingId" element={<TicketDetailPage />} />
//             <Route path="/news/:newsId" element={<NewsDetailPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route path="/reset-password" element={<ResetPasswordPage />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </AuthProvider>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;


// src/App.jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import AuthCombinedPage from './pages/Auth/AuthCombinedPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import UserBookingHistoryPage from './pages/UserBookingHistoryPage';
import TicketDetailPage from './pages/TicketDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewsPage from './pages/NewsPage';
import AllMoviesPage from './pages/AllMoviesPage';
import AllCinemasPage from './pages/AllCinemasPage';
import CinemaDetailPage from './pages/CinemaDetailPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    // Main container for the whole app, applying global styles with Tailwind
    <div className="bg-gray-100 min-h-screen text-gray-800 font-sans">
      <Router>
        {/* AuthProvider must be inside Router to use useNavigate */}
        <AuthProvider>
          <ToastContainer /> {/* ToastContainer can stay here or be moved higher if preferred */}
          <Routes>
            <Route path="/login" element={<AuthCombinedPage />} />
            <Route path="/register" element={<AuthCombinedPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/movies" element={<AllMoviesPage />} />
            <Route path="/cinemas" element={<AllCinemasPage />} />
            <Route path="/cinemas/:cinemaId" element={<CinemaDetailPage />} />
            <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/account/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
            <Route path="/movies/:movieId" element={<MovieDetailPage />} />
            <Route path="/book/:showtimeId" element={<PrivateRoute><SeatSelectionPage /></PrivateRoute>} />
            <Route path="/booking-history" element={<PrivateRoute><UserBookingHistoryPage /></PrivateRoute>} />
            <Route path="/ticket/:bookingId" element={<TicketDetailPage />} />
            <Route path="/news/:newsId" element={<NewsDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
