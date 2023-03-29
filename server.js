const express = require('express');

const RoomRepo = require('./repos/RoomRepo');
const PeerRepo = require('./repos/PeerRepo');
const { connectDB } = require('./db/db');

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/createRoom', async (req, res) => {
  try {
    const room = await RoomRepo.createNewRoom();
    const peer = await PeerRepo.createNewPeer(room._id);
    await RoomRepo.addPeerToRoom(room.name, peer._id);

    res.send({ roomName: room.name, peerId: peer._id });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.post('/joinRoom', async (req, res) => {
  try {
    const { roomName } = req.body;
    const room = await RoomRepo.findRoomByName(roomName);
    if (!room) {
      throw new Error('Room does not exist');
    }

    const peer = await PeerRepo.createNewPeer(room._id);
    const peersInRoom = room.peers;
    await RoomRepo.addPeerToRoom(room.name, peer._id);

    res.send({ peerId: peer._id, otherPeers: peersInRoom });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.delete('/leaveRoom', async (req, res) => {
  try {
    const { peerId } = req.query;
    const peer = await PeerRepo.findPeerById(peerId);
    if (!peer) {
      throw new Error(`Peer with id '${peerId}' does not exist`);
    }

    const room = await RoomRepo.findRoomById(peer.room.toString());
    room.peers = room.peers.filter((peer) => peer._id.toString() !== peerId);

    if (room.peers.length === 0) {
      await RoomRepo.deleteRoom(room._id);
    } else {
      await room.save();
    }

    await PeerRepo.deleteById(peerId);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
