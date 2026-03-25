const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Загружаем переменные окружения
dotenv.config();

// Импортируем модели
const Barber = require('./models/Barber');
const Service = require('./models/Service');

// Импортируем роуты
const barberRoutes = require('./routes/barber');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

const app = express();

// Настройка шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к MongoDB (исправленная версия)
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB подключена');
  
  // Инициализируем демо-данные
  await Barber.initDemo();
  await Service.initDemo();
  
  console.log('✅ Демо-данные загружены');
})
.catch(err => {
  console.error('❌ Ошибка подключения к MongoDB:', err);
  process.exit(1);
});

// Маршруты
app.use('/', barberRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Обработка 404
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📅 Админ-панель: http://localhost:${PORT}/admin`);
});