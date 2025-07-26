





import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import moment from 'moment';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import bookingService from '../services/bookingService';
import Navbar from '../components/Navbar';

const TICKET_HORIZONTAL_PADDING = 16;
const DOTTED_LINE_MARGIN = 24; // Space above and below the dotted line
const CIRCLE_DIAMETER = 24; // For desktop
const CIRCLE_DIAMETER_MOBILE = 20;

const TicketDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const movieDetailsRef = useRef(null);
  const [firstLineTop, setFirstLineTop] = useState(140);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingDetails = await bookingService.getBookingById(bookingId);
        const seatLabels = Array.isArray(bookingDetails.booked_seats_details)
          ? bookingDetails.booked_seats_details.map(s => s.seat_label)
          : [];
        setBooking({
          ...bookingDetails,
          seat_labels: seatLabels
        });
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    if (movieDetailsRef.current && booking) {
      // Calculate the vertical position for the first dotted line and its circles
      const rect = movieDetailsRef.current.getBoundingClientRect();
      const parentRect = movieDetailsRef.current.offsetParent.getBoundingClientRect();
      const offsetTop = movieDetailsRef.current.offsetTop;
      const movieDetailsHeight = movieDetailsRef.current.offsetHeight;
      const computedStyle = window.getComputedStyle(movieDetailsRef.current);
      const marginBottom = parseFloat(computedStyle.marginBottom);

      // The line should be below the movie details + margin + DOTTED_LINE_MARGIN
      const calculatedTop = offsetTop + movieDetailsHeight + marginBottom + DOTTED_LINE_MARGIN;
      setFirstLineTop(calculatedTop);
    }
  }, [booking, loading]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
         backgroundColor: '#1c2a4d',
        fontFamily: 'Inter, sans-serif',
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1c2a4d',
        fontFamily: 'Inter, sans-serif',
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Booking not found.</Typography>
      </Box>
    );
  }

  const formattedDate = moment(booking.show_date).format('ddd, D MMM YYYY');
  const formattedTime = booking.show_time && moment(booking.show_time, 'HH:mm:ss').isValid()
    ? moment(booking.show_time, 'HH:mm:ss').format('HH:mm') + ' WIB'
    : 'Invalid Time';

  const qrCodeValue = JSON.stringify({ bookingId: booking.booking_id, transactionCode: booking.booking_id.toString().slice(-6) });

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#1c2a4d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        fontFamily: 'Inter, sans-serif',
        '@media (max-width: 600px)': {
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 380,
          borderRadius: '16px',
          overflow: 'visible',
          backgroundColor: '#ffffff',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          marginBottom: '20px',
          '@media (max-width: 600px)': {
            margin: '0 16px 20px 16px',
            maxWidth: 'none',
          }
        }}>
          {/* Top Section - Your Ticket */}
 {/* Top Section - Your Ticket */}
          <CardContent sx={{
            textAlign: 'center',
            backgroundColor: '#0B193F', // Modified: Changed to match navbar background
            color: 'white',
            padding: '20px 16px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            position: 'relative',
            zIndex: 1,
          }}>
            <Typography variant="h5" component="div" sx={{
              fontWeight: 600,
              fontSize: '1.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Your Ticket
            </Typography>
          </CardContent>

          {/* Main Content Area */}
          <CardContent sx={{
            backgroundColor: '#ffffff',
            padding: '20px',
            color: '#333333',
            position: 'relative',
            zIndex: 0,
            minHeight: 420, // Helps with dynamic content, adjust as needed
          }}>
            {/* Movie Info and Order ID */}
            <Box ref={movieDetailsRef} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <img
                src={`${bookingService.BASE_BACKEND_URL}/MovieImages/${booking.poster_image}`}
                alt={booking.movie_title}
                style={{
                  width: '60px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '12px',
                }}
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'}
              />
              <Box>
                <Typography variant="caption" sx={{
                  color: '#3b82f6',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  display: 'block',
                  mb: 0.5,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Order ID : {booking.booking_id}
                </Typography>
                <Typography variant="h6" component="div" sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  mb: 0.5,
                  color: '#1f2937',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {booking.movie_title}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {booking.cinema_name} • {booking.screen_name}
                </Typography>
              </Box>
            </Box>

            {/* FIRST DOTTED LINE & CIRCLES */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${firstLineTop}px`,
                height: 0,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {/* Circles */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -CIRCLE_DIAMETER / 2,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: CIRCLE_DIAMETER,
                  height: CIRCLE_DIAMETER,
                 backgroundColor: '#1c2a4d',
                  borderRadius: '50%',
                  '@media (max-width: 600px)': {
                    left: -CIRCLE_DIAMETER_MOBILE / 2,
                    width: CIRCLE_DIAMETER_MOBILE,
                    height: CIRCLE_DIAMETER_MOBILE,
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: -CIRCLE_DIAMETER / 2,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: CIRCLE_DIAMETER,
                  height: CIRCLE_DIAMETER,
                  backgroundColor: '#1c2a4d',
                  borderRadius: '50%',
                  '@media (max-width: 600px)': {
                    right: -CIRCLE_DIAMETER_MOBILE / 2,
                    width: CIRCLE_DIAMETER_MOBILE,
                    height: CIRCLE_DIAMETER_MOBILE,
                  }
                }}
              />
              {/* Dotted Line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: TICKET_HORIZONTAL_PADDING,
                  right: TICKET_HORIZONTAL_PADDING,
                  top: '50%',
                  borderTop: '1px dashed #e0e0e0',
                  zIndex: 11,
                  '@media (max-width: 600px)': {
                    left: 10,
                    right: 10,
                  }
                }}
              />
            </Box>

            {/* SCHEDULE/SEAT SECTION - Always below the first dotted line */}
            <Box
              sx={{
                mt: `${firstLineTop - (movieDetailsRef.current ? (movieDetailsRef.current.offsetTop + movieDetailsRef.current.offsetHeight) : 0) + DOTTED_LINE_MARGIN}px`,
                mb: `${DOTTED_LINE_MARGIN}px`,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Schedule
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {formattedDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Time
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {formattedTime}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Seat
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {booking.seat_labels.map((label, index) => (
                      <Typography
  key={index}
  variant="caption"
  sx={{
    backgroundColor: '#0B193F', // Match Navbar color
    color: 'white',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, sans-serif'
  }}
>
  {label}
</Typography>

                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Total Seat
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {booking.seat_labels.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* SECOND DOTTED LINE & CIRCLES (bottom, unchanged) */}
            <Box sx={{
              position: 'absolute',
              left: -CIRCLE_DIAMETER / 2,
              bottom: '122px',
              width: CIRCLE_DIAMETER,
              height: CIRCLE_DIAMETER,
              backgroundColor: '#1c2a4d',
              borderRadius: '50%',
              zIndex: 2,
              transform: 'translateY(50%)',
              '@media (max-width: 600px)': {
                left: -CIRCLE_DIAMETER_MOBILE / 2,
                width: CIRCLE_DIAMETER_MOBILE,
                height: CIRCLE_DIAMETER_MOBILE,
                bottom: '110px',
              }
            }}></Box>
            <Box sx={{
              position: 'absolute',
              right: -CIRCLE_DIAMETER / 2,
              bottom: '122px',
              width: CIRCLE_DIAMETER,
              height: CIRCLE_DIAMETER,
              backgroundColor: '#1c2a4d', 
              borderRadius: '50%',
              zIndex: 2,
              transform: 'translateY(50%)',
              '@media (max-width: 600px)': {
                right: -CIRCLE_DIAMETER_MOBILE / 2,
                width: CIRCLE_DIAMETER_MOBILE,
                height: CIRCLE_DIAMETER_MOBILE,
                bottom: '110px',
              }
            }}></Box>
            <Box sx={{
              position: 'absolute',
              left: TICKET_HORIZONTAL_PADDING,
              right: TICKET_HORIZONTAL_PADDING,
              bottom: '122px',
              borderTop: '1px dashed #e0e0e0',
              '@media (max-width: 600px)': {
                left: 10,
                right: 10,
                bottom: '110px',
              }
            }} />

            {/* Transaction Code and QR Code */}
            <Grid container spacing={2} alignItems="flex-start" sx={{ mt: 2, pt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontSize: '0.75rem',
                  display: 'block',
                  mb: 0.5,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Transaction Code
                </Typography>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  letterSpacing: '2px',
                  color: '#1f2937',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {booking.booking_id.toString().slice(-6)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start'
                }}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5,
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    QR Code
                  </Typography>
                  <Box sx={{
                    backgroundColor: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #e5e7eb',
                  }}>
                    <QRCode value={qrCodeValue} size={50} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{
          width: '100%',
          maxWidth: 380,
          px: 2,
          '@media (max-width: 600px)': {
            px: 4,
          }
        }}>
          <Button
  fullWidth
  variant="contained"
  sx={{
    backgroundColor: '#0B193F', // Match Navbar color
    '&:hover': {
      backgroundColor: '#07112a', // Even darker or just repeat #0B193F for no change
    },
    borderRadius: '8px',
    padding: '12px 0',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0px 4px 12px rgba(11, 25, 63, 0.15)', // Adjust shadow to match new color
  }}
  onClick={() => navigate('/')}
>
  Back To Home
</Button>

        </Box>
      </Box>
    </>
  );
};

export default TicketDetailPage;
