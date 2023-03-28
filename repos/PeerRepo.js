const Peer = require('../models/Peer');

const createNewPeer = async (roomId) => {
  try {
    const peer = new Peer({ room: roomId });
    return peer.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { createNewPeer };
