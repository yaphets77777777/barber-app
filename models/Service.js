const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // длительность в минутах
  }
});

// Демо-услуги
serviceSchema.statics.initDemo = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    return this.insertMany([
      { name: 'Мужская стрижка', price: 1500, duration: 60 },
      { name: 'Стрижка бороды', price: 800, duration: 30 },
      { name: 'Стрижка + борода', price: 2000, duration: 90 },
      { name: 'Королевское бритье', price: 1200, duration: 45 },
      { name: 'Камуфляж седины', price: 1000, duration: 30 }
    ]);
  }
};

module.exports = mongoose.model('Service', serviceSchema);