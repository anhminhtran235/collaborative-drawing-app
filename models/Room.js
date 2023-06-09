const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  peers: [
    {
      type: String,
    },
  ],
});

module.exports = Room = mongoose.model('room', RoomSchema);
