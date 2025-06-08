import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Button color='inherit' component={Link} to='/'>
            Сервис бронирования
          </Button>
          <Button color='inherit' onClick={() => navigate('/my-reservations')}>
            Мои бронирования
          </Button>
        </Typography>

        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color='inherit'
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              Выйти
            </Button>
          </Box>
        )}

        {!isAuthenticated && (
          <Button color='inherit' component={Link} to='/login'>
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
