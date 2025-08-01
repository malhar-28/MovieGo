import React, { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
const VerifyTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, success, error

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const userId = params.get('userId');
  const code = params.get('transaction_code');

  if (!orderId || !userId || !code) {
    setStatus('error');
    return;
  }

  const baseUrl = import.meta.env.VITE_BASE_URL;

  fetch(`${baseUrl}/api/booking/verify-ticket?orderId=${orderId}&userId=${userId}&transaction_code=${code}`)
    .then(res => res.json())
    .then(data => {
      if (data.verified) {
        setTicketData(data.ticket);
        setStatus('success');
      } else {
        setStatus('error');
      }
    })
    .catch(() => {
      setStatus('error');
    });
}, []);


  // Loading State - Compact spinner
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Verifying Ticket</h3>
          <p className="text-gray-500 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  // Error State - Compact error design
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-blue-600 mb-3">Verification Failed</h3>
          <p className="text-gray-600 mb-4">This ticket is invalid or has already been used.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success State - Compact ticket design
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-4 px-4">
      <div className="max-w-md mx-auto">
        {/* Success Header - Compact */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Ticket Verified!</h1>
          <p className="text-sm text-gray-600">Your ticket is valid and ready to use</p>
        </div>

        {/* Ticket Card - Compact Layout */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Ticket Header with Gradient - blueuced padding */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">CINEMA TICKET</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-1">{ticketData.movie_title}</h2>
              <p className="text-blue-100 text-sm truncate">{ticketData.cinema_name}</p>
            </div>
          </div>

          {/* Movie Poster - Much Smaller */}
          <div className="relative">
           
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          </div>

          {/* Ticket Details - Compact */}
          <div className="p-4 space-y-3">
            {/* Date and Time - Compact */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Show Date</p>
                  <p className="text-sm font-bold text-gray-800">{ticketData.show_date}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Show Time</p>
                  <p className="text-sm font-bold text-gray-800">{ticketData.show_time}</p>
                </div>
              </div>
            </div>

            {/* Other Details - Compact */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Screen</span>
                </div>
                <span className="font-semibold text-gray-800 text-sm">{ticketData.screen_name}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Cinema</span>
                </div>
                <span className="font-semibold text-gray-800 text-sm text-right max-w-48 truncate">{ticketData.cinema_name}</span>
              </div>
            </div>

            {/* Transaction Code - Compact */}
            <div className="bg-gray-50 rounded-lg p-3 mt-4">
              <p className="text-xs text-gray-500 mb-2 text-center">Transaction Code</p>
              <div className="bg-white rounded-lg p-2 border border-dashed border-gray-200">
                <p className="text-center font-mono text-sm font-bold text-gray-800 tracking-wider">
                  {ticketData.transaction_code}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Border */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
        </div>

        {/* Footer Message - Compact */}
        <div className="text-center mt-4 text-gray-500">
          <p className="text-xs">Present this verified ticket at the cinema entrance</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;