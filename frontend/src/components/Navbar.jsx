// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box, TextField, InputAdornment, Avatar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Search, Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import moviegoLogo from '../assets/moviego.png';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const getUserInitial = () => {
    if (currentUser && currentUser.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    return '';
  };

  const navLinks = (
    <>
      <Button color="inherit" component={Link} to="/" style={{ color: 'white', marginLeft: '10px' }}>Home</Button>
      <Button color="inherit" component={Link} to="/news" style={{ color: 'white', marginLeft: '10px' }}>News</Button>
      <Button color="inherit" component={Link} to="/movies" style={{ color: 'white', marginLeft: '10px' }}>Movies</Button>
      <Button color="inherit" component={Link} to="/cinemas" style={{ color: 'white', marginLeft: '10px' }}>Cinemas</Button>
      {currentUser && (
        <Button color="inherit" component={Link} to="/booking-history" style={{ color: 'white', marginLeft: '10px' }}>Booking History</Button>
      )}
    </>
  );

  const mobileNavLinks = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/news">
          <ListItemText primary="News" />
        </ListItem>
        <ListItem button component={Link} to="/movies">
          <ListItemText primary="Movies" />
        </ListItem>
        <ListItem button component={Link} to="/cinemas">
          <ListItemText primary="Cinemas" />
        </ListItem>
        {currentUser && (
          <ListItem button component={Link} to="/booking-history">
            <ListItemText primary="Booking History" />
          </ListItem>
        )}
        {currentUser ? (
          <>
            <ListItem button onClick={() => { navigate('/account'); }}>
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/account/change-password'); }}>
              <ListItemText primary="Change Password" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={() => { navigate('/login'); }}>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" style={{ backgroundColor: '#0B193F' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <img src={moviegoLogo} alt="MovieGo Logo" style={{ height: '40px' }} />
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
          {navLinks}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search style={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: { backgroundColor: 'white', borderRadius: '20px', paddingLeft: '5px' },
              classes: {
                notchedOutline: {
                  borderColor: 'transparent !important',
                },
              },
            }}
            sx={{
              mr: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
              display: { xs: 'none', sm: 'block' }
            }}
          />
          {currentUser ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  src={currentUser.image ? `http://localhost:5000/UserImage/${currentUser.image}` : null}
                  sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '1rem' }}
                >
                  {!currentUser.image && getUserInitial()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/account'); handleClose(); }}>Account</MenuItem>
                <MenuItem onClick={() => { navigate('/account/change-password'); handleClose(); }}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <IconButton
              size="large"
              aria-label="guest user"
              color="inherit"
              onClick={() => navigate('/login')}
            >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '1rem' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          )}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {mobileNavLinks}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
