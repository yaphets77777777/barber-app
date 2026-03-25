const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Админ-панель
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId')
      .sort({ date: -1, time: 1 });
    
    const services = await Service.find();
    
    res.render('admin', { bookings, services });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

// Удаление записи
router.post('/delete/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении');
  }
});

// Удаление отзыва
router.post('/review/delete/:id', async (req, res) => {
  try {
    const Review = require('../models/Review');
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/admin/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении');
  }
});

module.exports = router;