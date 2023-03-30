const Peer = require('../models/Peer');

const createNewPeer = async (roomId, peerId) => {
  try {
    const peer = new Peer({ room: roomId, peerId });
    return peer.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByPeerId = async (peerId) => {
  try {
    return Peer.findOne({ peerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteByPeerId = async (peerId) => {
  try {
    return Peer.findOneAndDelete({ peerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { createNewPeer, findByPeerId, deleteByPeerId };
