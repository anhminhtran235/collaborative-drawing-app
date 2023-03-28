goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');

goog.provide('drawings.state');
goog.provide('drawings.dom');

function init() {
  grabDomElements();
  initState();
  initCanvas();
  bindListeners();
}

function grabDomElements() {
  drawings.dom.canvas = document.querySelector('canvas');
  drawings.dom.clearCanvas = document.querySelector('.clear-canvas');
  drawings.dom.ctx = drawings.dom.canvas.getContext('2d');
  drawings.dom.undoButton = document.querySelector('.undo');
  drawings.dom.redoButton = document.querySelector('.redo');
}

function initState() {
  drawings.state.isDrawing = false;
  drawings.state.selectedTool = 'brush';
  drawings.state.brushWidth = 5;
  drawings.state.selectedColor = '#000';
  drawings.state.snapshot = null;
  drawings.state.mouse = { x: 0, y: 0 };
  drawings.state.previous = { x: 0, y: 0 };
  drawings.state.drawingHistory = new DrawingHistory();
}

function initCanvas() {
  matchCanvasToViewableSize();
  paintCanvasWhite();
}

function matchCanvasToViewableSize() {
  drawings.dom.canvas.width = drawings.dom.canvas.offsetWidth;
  drawings.dom.canvas.height = drawings.dom.canvas.offsetHeight;
}

function paintCanvasWhite() {
  drawings.dom.ctx.fillStyle = '#fff';
  drawings.dom.ctx.fillRect(
    0,
    0,
    drawings.dom.canvas.width,
    drawings.dom.canvas.height
  );
  drawings.dom.ctx.fillStyle = drawings.state.selectedColor;
}

function startDrawing(e) {
  drawings.state.isDrawing = true;
  drawings.state.previous = {
    x: drawings.state.mouse.x,
    y: drawings.state.mouse.y,
  };
  drawings.state.mouse = getMousePosition(drawings.dom.canvas, e);
  drawings.state.drawingHistory.clearCurrentDrawing();
  drawings.state.drawingHistory.addPoint(e.offSetX, e.offSetY);
}

function drawing(e) {
  if (!drawings.state.isDrawing) {
    return;
  }

  drawings.state.previous = {
    x: drawings.state.mouse.x,
    y: drawings.state.mouse.y,
  };
  drawings.state.mouse = getMousePosition(drawings.dom.canvas, e);
  drawings.state.drawingHistory.addPoint(
    drawings.state.mouse.x,
    drawings.state.mouse.y
  );

  drawings.dom.ctx.beginPath();
  drawings.dom.ctx.moveTo(drawings.state.previous.x, drawings.state.previous.y);
  drawings.dom.ctx.lineTo(drawings.state.mouse.x, drawings.state.mouse.y);
  drawings.dom.ctx.strokeStyle = drawings.state.selectedColor;
  drawings.dom.ctx.lineWidth = drawings.state.brushWidth;
  drawings.dom.ctx.fillStyle = drawings.state.selectedColor;
  drawings.dom.ctx.stroke();
}

function doneDrawing(e) {
  drawings.state.isDrawing = false;
  drawings.state.drawingHistory.saveAndClearCurrentDrawing();
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

function undo() {
  drawings.state.drawingHistory.undo();
  clearCanvas();
  redrawFromHistory();
}

function redo() {
  drawings.state.drawingHistory.redo();
  clearCanvas();
  redrawFromHistory();
}

function clearCanvas() {
  drawings.dom.ctx.clearRect(
    0,
    0,
    drawings.dom.canvas.width,
    drawings.dom.canvas.height
  );
}

function redrawFromHistory() {
  drawings.state.drawingHistory.getHistoryClone().forEach((points) => {
    drawings.dom.ctx.beginPath();
    drawings.dom.ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      drawings.dom.ctx.lineTo(point.x, point.y);
    });
    drawings.dom.ctx.strokeStyle = drawings.state.selectedColor;
    drawings.dom.ctx.lineWidth = drawings.state.brushWidth;
    drawings.dom.ctx.fillStyle = drawings.state.selectedColor;
    drawings.dom.ctx.stroke();
  });
}

function getMousePosition(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left),
    y: Math.round(e.clientY - rect.top),
  };
}
