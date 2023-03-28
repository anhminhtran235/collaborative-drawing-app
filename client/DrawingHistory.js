class DrawingHistory {
  constructor() {
    this._undo = [];
    this._redo = [];
    this._points = [];
  }

  addPoint(x, y) {
    this._points.push({ x, y });
    this._redo = [];
  }

  saveAndClearCurrentDrawing() {
    this._undo.push(this._points);
    this.clearCurrentDrawing();
  }

  undo() {
    const points = this._undo.pop();
    if (points) {
      this._redo.push(points);
    }
  }

  redo() {
    const points = this._redo.pop();
    if (points) {
      this._undo.push(points);
    }
  }

  getHistoryClone() {
    return deepClone(this._undo);
  }

  clearCurrentDrawing() {
    this._points = [];
  }
}
