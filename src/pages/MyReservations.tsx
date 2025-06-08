import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import axios from 'axios';
import Header from '../components/Header';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MyReservations = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reservations/my_reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
    } catch (err) {
      setError('Не удалось загрузить бронирования');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Мои бронирования
          </Typography>
          <IconButton color="primary" onClick={fetchReservations}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reservations.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" mt={4}>
            У вас нет активных бронирований.
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Комната</TableCell>
                  <TableCell>Начало</TableCell>
                  <TableCell>Окончание</TableCell>
                  <TableCell align="right">Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id} hover>
                    <TableCell component="th" scope="row">
                      №{reservation.meetingroom_id}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.from_reserve).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.to_reserve).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Chip label="Активно" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default MyReservations;