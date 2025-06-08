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
} from '@mui/material';
import axios from 'axios';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/reservations/my_reservations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservations(response.data);
      } catch (err) {
        setError('Не удалось загрузить бронирования');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Мои бронирования
        </Typography>

        {loading ? (
          <Box display='flex' justifyContent='center' mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error'>{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Комната</TableCell>
                  <TableCell>Дата начала</TableCell>
                  <TableCell>Дата окончания</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation: any) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.meetingroom_id}</TableCell>
                    <TableCell>
                      {new Date(reservation.from_reserve).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.to_reserve).toLocaleString()}
                    </TableCell>
                    <TableCell>Активно</TableCell>
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
