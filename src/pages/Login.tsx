import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  CssBaseline,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/jwt/login`,
        {
          username: email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = response.data.access_token;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        console.log('navigate');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data.detail ||
          'Ошибка при входе. Проверьте логин и пароль.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      navigate('/rooms'); // или '/my-reservations' — куда нужно
    }
  }, [loading, navigate]);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: 2,
        }}
      >
        <Container component='main' maxWidth='xs'>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component='h1' variant='h5' sx={{ mb: 3 }}>
              Вход в систему
            </Typography>

            {error && (
              <Alert severity='error' sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component='form' noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email'
                name='email'
                autoComplete='email'
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Пароль'
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type='button'
                fullWidth
                variant='contained'
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Войти'
                )}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
