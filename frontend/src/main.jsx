// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// const theme = createTheme();

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Removed Material-UI imports: CssBaseline, ThemeProvider, createTheme

// Ensure your main CSS file (which now includes Tailwind directives) is imported
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Removed Material-UI ThemeProvider and CssBaseline */}
    <App />
  </React.StrictMode>
);
