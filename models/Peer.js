const mongoose = require('mongoose');

const PeerSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'room',
  },
  peerId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = Peer = mongoose.model('peer', PeerSchema);
