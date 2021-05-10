const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  time: Date,
  username: String,
  fullName: String,
  devices: [String],
  message: String,
  // status: Boolean,
});

module.exports = mongoose.model('message', messageSchema);
