import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getMeetingRooms } from '../services/api';
import { MeetingRoom } from '../types';
import Header from '../components/Header';

export default function Home() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getMeetingRooms();
        setRooms(data);
      } catch (error) {
        console.error('Ошибка загрузки комнат:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Переговорные комнаты
        </Typography>
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{room.name}</Typography>
                  <Typography color="textSecondary" paragraph>
                    {room.description || 'Без описания'}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/rooms/${room.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Забронировать
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}