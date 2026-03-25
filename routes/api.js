const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Barber = require('../models/Barber');
const Service = require('../models/Service');

// Получить свободные слоты на дату
router.get('/slots/:barberId/:date', async (req, res) => {
  try {
    const { barberId, date } = req.params;
    
    // Все возможные слоты (10:00-20:00, шаг 1 час)
    const allSlots = [];
    for (let hour = 10; hour <= 20; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    // Проверяем, не прошло ли время
    const now = new Date();
    const selectedDate = new Date(date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Получаем занятые слоты
    const bookings = await Booking.find({ barberId, date });
    const bookedSlots = bookings.map(b => b.time);
    
    // Фильтруем слоты
    let availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    // Если дата сегодня, удаляем прошедшие часы
    if (selectedDate.getTime() === today.getTime()) {
      const currentHour = now.getHours();
      availableSlots = availableSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0]);
        return slotHour > currentHour;
      });
    }
    
    // Если дата в прошлом, возвращаем пустой массив
    if (selectedDate < today) {
      availableSlots = [];
    }
    
    res.json({ availableSlots, bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать запись
router.post('/bookings', async (req, res) => {
  try {
    const { barberId, serviceId, clientName, phone, date, time } = req.body;
    
    // Проверяем, не занято ли время
    const existingBooking = await Booking.findOne({ barberId, date, time });
    if (existingBooking) {
      return res.status(400).json({ error: 'Это время уже занято' });
    }
    
    // Проверяем, не прошлое ли время
    const now = new Date();
    const bookingDateTime = new Date(`${date}T${time}:00`);
    if (bookingDateTime < now) {
      return res.status(400).json({ error: 'Нельзя записаться в прошлое' });
    }
    
    // Создаем запись
    const booking = new Booking({
      barberId,
      serviceId,
      clientName,
      phone,
      date,
      time
    });
    
    await booking.save();
    res.json({ success: true, message: 'Запись успешно создана' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании записи' });
  }
});

// Получить информацию о барбере
router.get('/barber/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    res.json(barber);
  } catch (error) {
    res.status(500).json({ error: 'Барбер не найден' });
  }
});

// Получить услуги
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки услуг' });
  }
});

// Получить отзывы для барбера
router.get('/reviews/:barberId', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ barberId: req.params.barberId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка загрузки отзывов' });
  }
});

// Создать отзыв
router.post('/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const { barberId, clientName, rating, comment } = req.body;
    
    const review = new Review({
      barberId,
      clientName,
      rating,
      comment
    });
    
    await review.save();
    res.json({ success: true, message: 'Спасибо за отзыв!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при сохранении отзыва' });
  }
});

module.exports = router;