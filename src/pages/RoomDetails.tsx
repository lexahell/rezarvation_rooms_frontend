import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createReservation, getReservationsByRoomId } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../components/Header';

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Загружаем бронирования при монтировании компонента
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!id) return;
        const data = await getReservationsByRoomId(parseInt(id));
        setReservations(data);
      } catch (err) {
        console.error('Ошибка загрузки бронирований:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchReservations();
  }, [id]);

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !id) return;

    setLoading(true);
    setError(null);

    try {
      const fromDateFormatted = format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T');
      const toDateFormatted = format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T');

      await createReservation({
        meetingroom_id: parseInt(id),
        from_reserve: fromDateFormatted,
        to_reserve: toDateFormatted,
      });

      navigate('/my-reservations');
    } catch (err: any) {
      // Если ошибка от сервера — покажем её
      const errorMessage =
        err.response?.data.detail ||
        'Не удалось забронировать переговорную комнату.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Бронирование комнаты #{id}
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" noValidate autoComplete="off">
              <DateTimePicker
                label="Дата начала"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />

              <DateTimePicker
                label="Дата окончания"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Выбрано время:
                </Typography>
                <Typography variant="subtitle1">
                  {fromDate && format(fromDate, 'dd.MM.yyyy HH:mm')}
                  {' — '}
                  {toDate && format(toDate, 'dd.MM.yyyy HH:mm')}
                </Typography>
              </Box>

              {/* Список занятых слотов */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Занятые временные слоты:
                </Typography>

                {fetchLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Загрузка...
                  </Typography>
                ) : reservations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Нет активных бронирований.
                  </Typography>
                ) : (
                  <List dense>
                    {reservations.map((res) => (
                      <ListItem key={res.id} divider>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body2">
                            {format(new Date(res.from_reserve), 'dd.MM.yyyy HH:mm')} —{' '}
                            {format(new Date(res.to_reserve), 'dd.MM.yyyy HH:mm')}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                {loading ? 'Загрузка...' : 'Забронировать'}
              </Button>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Container>
    </>
  );
}