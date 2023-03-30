goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');

goog.provide('drawings.state');
goog.provide('drawings.dom');

function init() {
  grabDomElementsAndInitState();
  bindListeners();
  connectToPeerServer();
}

function connectToPeerServer() {
  const peer = new Peer({
    host: 'code-spot-peer-server.herokuapp.com/',
    port: '/..',
    secure: true,
    pingInterval: 3000,
    debug: 2,
  });

  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    joinRoom(id);
  });

  peer.on('error', (error) => {
    console.log(error);
  });

  peer.on('connection', (conn) => {
    console.log('connected to peer');
    conn.on('open', () => {
      console.log('connection open');
    });
    conn.on('data', (message) => {
      console.log('Received peer message: ' + message);
    });
    conn.on('close', () => {
      console.log('connection closed');
    });
    conn.on('error', (error) => {
      console.log(error);
    });
  });
}

function joinRoom(peerId) {
  const currentUrl = window.location.href;
  if (currentUrl.includes('room=')) {
    const roomName = currentUrl.split('=').pop();
    joinExistingRoom(roomName, peerId);
  } else {
    joinNewRoom(peerId);
  }
}

function joinExistingRoom(roomName, peerId) {
  fetch('http://localhost:5000/api/joinRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomName,
      peerId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const otherPeers = data.otherPeers || [];
      otherPeers.forEach((peer) => {});
    })
    .catch((error) => console.error(error));
}

function joinNewRoom(peerId) {
  fetch('http://localhost:5000/api/createRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      peerId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const url = `http://localhost:5000?room=${data.roomName}`;
      window.history.pushState(null, null, url);
    })
    .catch((error) => console.error(error));
}

function grabDomElementsAndInitState() {
  drawings.dom.canvas = document.querySelector('canvas');
  drawings.dom.undoButton = document.querySelector('.undo');
  drawings.dom.redoButton = document.querySelector('.redo');

  drawings.state.canvas = new Canvas(drawings.dom.canvas);
  drawings.state.drawingHistory = new DrawingHistory();

  drawings.state.canvas.matchCanvasToViewableSize();
}

function startDrawing(e) {
  drawings.state.canvas.startDrawing(e);
  drawings.state.drawingHistory.clearCurrentDrawing();
  drawings.state.drawingHistory.addPoint(e.offSetX, e.offSetY);
}

function drawing(e) {
  if (!drawings.state.canvas.isDrawing()) {
    return;
  }

  drawings.state.canvas.drawing(e);

  drawings.state.drawingHistory.addPoint(
    drawings.state.canvas.getMouse().x,
    drawings.state.canvas.getMouse().y
  );
}

function doneDrawing(e) {
  drawings.state.canvas.setIsDrawing(false);
  drawings.state.drawingHistory.saveAndClearCurrentDrawing();
}

function undo() {
  drawings.state.drawingHistory.undo();
  drawings.state.canvas.clearCanvas();
  drawings.state.canvas.redrawFromHistory(drawings.state.drawingHistory);
}

function redo() {
  drawings.state.drawingHistory.redo();
  drawings.state.canvas.clearCanvas();
  drawings.state.canvas.redrawFromHistory(drawings.state.drawingHistory);
}

function bindListeners() {
  const keyHandler = new goog.events.KeyHandler(document);

  goog.events.listen(
    drawings.dom.canvas,
    goog.events.EventType.MOUSEDOWN,
    startDrawing
  );
  goog.events.listen(
    drawings.dom.canvas,
    goog.events.EventType.MOUSEMOVE,
    drawing
  );
  goog.events.listen(
    drawings.dom.canvas,
    goog.events.EventType.MOUSEUP,
    doneDrawing
  );
  goog.events.listen(
    drawings.dom.undoButton,
    goog.events.EventType.CLICK,
    undo
  );
  goog.events.listen(
    drawings.dom.redoButton,
    goog.events.EventType.CLICK,
    redo
  );
  keyHandler.listen(goog.events.KeyHandler.EventType.KEY, function (e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode == goog.events.KeyCodes.Z) {
      undo();
    }
  });
  keyHandler.listen(goog.events.KeyHandler.EventType.KEY, function (e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode == goog.events.KeyCodes.Y) {
      redo();
    }
  });
}
