const express = require('express');
const cors = require('cors');
const path = require('path');

const RoomRepo = require('./repos/RoomRepo');
const PeerRepo = require('./repos/PeerRepo');
const { connectDB } = require('./db/db');

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
  res.send({ express: 'Hello World' });
});

app.post('/api/createRoom', async (req, res) => {
  try {
    const { peerId } = req.body;
    const room = await RoomRepo.createNewRoom();
    const peer = await PeerRepo.createNewPeer(room._id, peerId);
    await RoomRepo.addPeerToRoom(room.name, peer.peerId);

    res.send({ roomName: room.name });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.post('/api/joinRoom', async (req, res) => {
  try {
    const { roomName, peerId } = req.body;
    const room = await RoomRepo.findRoomByName(roomName);
    if (!room) {
      throw new Error('Room does not exist');
    }

    const peer = await PeerRepo.createNewPeer(room._id, peerId);
    const peersInRoom = room.peers;
    await RoomRepo.addPeerToRoom(room.name, peer.peerId);

    res.send({ otherPeers: peersInRoom });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.delete('/api/leaveRoom', async (req, res) => {
  try {
    const { peerId } = req.query;
    const peer = await PeerRepo.findByPeerId(peerId);
    if (!peer) {
      throw new Error(`Peer with id '${peerId}' does not exist`);
    }

    const room = await RoomRepo.findRoomById(peer.room.toString());
    room.peers = room.peers.filter((peer) => peer !== peerId);

    if (room.peers.length === 0) {
      await RoomRepo.deleteRoom(room._id);
    } else {
      await room.save();
    }

    await PeerRepo.deleteByPeerId(peerId);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
