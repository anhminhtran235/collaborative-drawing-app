const Room = require('../models/Room');
const { createShortId } = require('../util');

const createNewRoom = async () => {
  try {
    const room = new Room({ name: await getNewRoomName() });
    return room.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addPeerToRoom = async (roomName, peerId) => {
  try {
    const room = await findRoomByName(roomName);
    if (!room) {
      throw new Error('Room does not exist');
    }
    room.peers.push(peerId);
    return room.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findRoomByName = async (roomName) => {
  try {
    return Room.findOne({ name: roomName });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getNewRoomName = async () => {
  let roomName = createShortId();
  while (await Room.exists({ name: roomName })) {
    roomName = createShortId();
  }
  return roomName;
};

module.exports = { createNewRoom, addPeerToRoom, findRoomByName };
