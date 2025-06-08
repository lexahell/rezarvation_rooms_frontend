import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar
      position='static'
      color='primary'
      sx={{
        bgcolor: 'primary.main',
        boxShadow: 3,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {/* Логотип */}
        <Typography
          variant='h6'
          component={Link}
          to='/'
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 700,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          🚀 MeetingRoomBooker
        </Typography>

        {/* Навигационные ссылки для десктопа */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {isAuthenticated && (
            <>
              <Button
                color='inherit'
                component={Link}
                to='/my-reservations'
                sx={{
                  fontWeight: 500,
                  borderRadius: 20,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Мои бронирования
              </Button>
              <Button
                color='inherit'
                component={Link}
                to='/rooms'
                sx={{
                  fontWeight: 500,
                  borderRadius: 20,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Переговорные
              </Button>
            </>
          )}
        </Box>

        {/* Пользовательский интерфейс */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderLeft: 1, ml: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Имя и email пользователя */}

              {/* Аватар и меню */}

              {/* Меню пользователя */}
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
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
                <MenuItem onClick={handleClose}>Профиль</MenuItem>
                <MenuItem onClick={handleClose}>Настройки</MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  textAlign: 'left',
                  mr: 1,
                }}
              >
                <IconButton
                  size='small'
                  onClick={handleMenu}
                  color='inherit'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                >
                  <Box
                  sx={{
                    ml: 1,
                  }}
                >
                  <Typography variant='body1' noWrap fontWeight={500}>
                    {user?.first_name || 'Пользователь'}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='rgba(255, 255, 255, 0.8)'
                    noWrap
                  >
                    {user?.email}
                  </Typography>
                </Box>
                </IconButton>
              </Box>
            </>
          ) : (
            <Button
              color='inherit'
              component={Link}
              to='/login'
              sx={{
                fontWeight: 500,
                borderRadius: 20,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Войти
            </Button>
          )}

          {/* Разделитель между навигацией и аватаром */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', sm: 'inline-block' }, mx: 1 }}>
              <Divider
                orientation='vertical'
                flexItem
                sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}
              />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
