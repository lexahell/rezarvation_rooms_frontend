import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createReservation } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !id) return;

    try {
      // Конвертируем даты в timezone-aware формат
      const fromDateFormatted = format(fromDate, 'yyyy-MM-dd HH:mm').replace(" ", "T");
      const toDateFormatted = format(toDate, 'yyyy-MM-dd HH:mm').replace(" ", "T");

      await createReservation({
        meetingroom_id: parseInt(id),
        from_reserve: fromDateFormatted,
        to_reserve: toDateFormatted,
      });

      navigate('/my-reservations');
    } catch (error) {
      console.error('Ошибка бронирования:', error);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' gutterBottom>
        Бронирование комнаты #{id}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component='form' noValidate autoComplete='off'>
          <DateTimePicker
            label='Дата начала'
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
            label='Дата окончания'
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
              },
            }}
          />

          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 3 }}
          >
            Забронировать
          </Button>
        </Box>
      </LocalizationProvider>
    </Container>
  );
}