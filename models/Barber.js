const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/img/default-avatar.jpg'
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Создаем одного барбера по умолчанию (демо)
barberSchema.statics.initDemo = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    return this.create({
      name: 'Ресул,погоняла ЮРА МАШИНКА',
      avatar: '/img/barber.jpg',
      description: 'Профессиональный барбер с 5-летним опытом. Специализируюсь на мужских стрижках и бородах. Создаю стильные образы для современных мужчин.'
    });
  }
};

module.exports = mongoose.model('Barber', barberSchema);