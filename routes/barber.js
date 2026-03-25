const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Публичная страница барбера
router.get('/barber/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).send('Барбер не найден');
    }
    
    const services = await Service.find();
    
    res.render('index', { barber, services });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

// Главная перенаправляет на первого барбера
router.get('/', async (req, res) => {
  try {
    const barber = await Barber.findOne();
    if (barber) {
      res.redirect(`/barber/${barber._id}`);
    } else {
      res.send('Барбер не найден');
    }
  } catch (error) {
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;