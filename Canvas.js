class Canvas {
  constructor(canvasDom) {
    this._canvas = canvasDom;
    this._ctx = this._canvas.getContext('2d');

    this._isDrawing = false;
    this._selectedTool = 'brush';
    this._brushWidth = 5;
    this._selectedColor = '#000';
    this._mouse = { x: 0, y: 0 };
    this._previous = { x: 0, y: 0 };
  }

  matchCanvasToViewableSize() {
    this._canvas.width = this._canvas.offsetWidth;
    this._canvas.height = this._canvas.offsetHeight;
  }

  startDrawing(e) {
    this._isDrawing = true;
    this._previous = {
      x: this._mouse.x,
      y: this._mouse.y,
    };
    this._mouse = this._getMousePosition(e);
  }

  drawing(e) {
    this._previous = {
      x: this._mouse.x,
      y: this._mouse.y,
    };
    this._mouse = this._getMousePosition(e);
    this._ctx.beginPath();
    this._ctx.moveTo(this._previous.x, this._previous.y);
    this._ctx.lineTo(this._mouse.x, this._mouse.y);
    this._ctx.strokeStyle = this._selectedColor;
    this._ctx.lineWidth = this._brushWidth;
    this._ctx.fillStyle = this._selectedColor;
    this._ctx.stroke();
  }

  isDrawing() {
    return this._isDrawing;
  }

  setIsDrawing(isDrawing) {
    this._isDrawing = isDrawing;
  }

  setSelectedTool(selectedTool) {
    this._selectedTool = selectedTool;
  }

  setBrushWidth(brushWidth) {
    this._brushWidth = brushWidth;
  }

  setSelectedColor(selectedColor) {
    this._selectedColor = selectedColor;
  }

  setMouse(mouse) {
    this._mouse = mouse;
  }

  getMouse() {
    return this._mouse;
  }

  setPrevious(previous) {
    this._previous = previous;
  }

  clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  redrawFromHistory(drawingHistory) {
    drawingHistory.getHistoryClone().forEach((points) => {
      this._ctx.beginPath();
      this._ctx.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        this._ctx.lineTo(point.x, point.y);
      });
      this._ctx.strokeStyle = this._selectedColor;
      this._ctx.lineWidth = this._brushWidth;
      this._ctx.fillStyle = this._selectedColor;
      this._ctx.stroke();
    });
  }

  _getMousePosition(e) {
    const rect = this._canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }
}
