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

const findPeerById = async (peerId) => {
  try {
    return Peer.findById(peerId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteById = async (peerId) => {
  try {
    return Peer.findByIdAndDelete(peerId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { createNewPeer, findPeerById, deleteById };
