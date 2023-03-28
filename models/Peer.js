const mongoose = require('mongoose');

const PeerSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'room',
  },
});

module.exports = Peer = mongoose.model('peer', PeerSchema);
