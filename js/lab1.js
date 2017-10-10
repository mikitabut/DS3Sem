class Drawer {
  /**
   * Create Drawer instance
   * @constructor
   */
  constructor (canvasId1, canvasId2) {
    this.canvasDiff = document.getElementById(canvasId1)
    this.contextDiff = this.canvasDiff.getContext('2d')
    this.halfOfX = Math.round(this.canvasDiff.width / 2)
    this.halfOfY = Math.round(this.canvasDiff.height / 2)
    this.contextDiff.translate(this.halfOfX, this.halfOfY)
    this.contextDiff.rotate(-Math.PI / 2)

    this.canvasBrez = document.getElementById(canvasId2)
    this.contextBrez = this.canvasBrez.getContext('2d')
    this.contextBrez.translate(this.halfOfX, this.halfOfY)
    this.contextBrez.rotate(-Math.PI / 2)
  }

  clear () {
    if (typeof this.halfOfX !== 'undefined') {
      this.contextDiff.clearRect(-this.halfOfX, -this.halfOfY, this.halfOfX * 2, this.halfOfY * 2)
      this.contextBrez.clearRect(-this.halfOfX, -this.halfOfY, this.halfOfX * 2, this.halfOfY * 2)
    }
  }

  setGrid (countOfXSquares, countOfYSquares) {
    this.x = countOfXSquares
    this.y = countOfYSquares
    this.currentWidth = Math.round(this.canvasDiff.width / this.x)
    this.currentHeight = Math.round(this.canvasDiff.height / this.y)
    this.drawGrid(this.contextDiff)
    this.drawGrid(this.contextBrez)
  }

  drawGrid (context) {
    context.strokeStyle = '#FF0000'
    for (let i = -this.halfOfY + this.currentHeight; i < this.halfOfY; i += this.currentHeight) {
      if (i === 0) {
        context.strokeStyle = '#000000'
      }
      context.beginPath()
      context.moveTo(-this.halfOfX, i)
      context.lineTo(this.halfOfX, i)
      context.stroke()
      context.strokeStyle = '#FF0000'
    }
    for (let i = -this.halfOfX + this.currentWidth; i < this.halfOfX; i += this.currentWidth) {
      if (i === 0) {
        context.strokeStyle = '#000000'
      }
      context.beginPath()
      context.moveTo(i, -this.halfOfY)
      context.lineTo(i, this.halfOfY)
      context.stroke()
      context.strokeStyle = '#FF0000'
    }
  }

  setSquares (filledSquares, context) {
    this.filledSquares = filledSquares
    context.fillStyle = 'yellow'
    for (let itemName in this.filledSquares) {
      let item = this.filledSquares[itemName]
      context.fillRect(item.y * this.currentWidth, item.x * this.currentHeight,
        this.currentWidth, this.currentHeight)
    }
  }

  setLine (x1, y1, x2, y2, color, context) {
    context.beginPath()
    context.strokeStyle = color
    context.moveTo(y1 * this.currentWidth, x1 * this.currentHeight)
    context.lineTo(y2 * this.currentWidth, x2 * this.currentHeight)
    context.stroke()
  }

  draw (x1, y1, x2, y2, countOfX, countOfY) {
    this.clear()
    let dy = Math.abs(y2 - y1)
    let dx = Math.abs(x2 - x1)
    let currentx = x1
    let currenty = y1
    this.setGrid(countOfX, countOfY)
    let lines = []
    this.difAnalyzer(currenty, y2, currentx, x2, dy, dx, lines, x1, y1)
    this.brezenhem(currenty, y2, currentx, x2, dy, dx, lines, x1, y1)
    for (let item in lines) {
      this.setLine(lines[item].x1, lines[item].y1, lines[item].x2, lines[item].y2, lines[item].color)
    }

  }

  difAnalyzer (currentY, y2, currentX, x2, dy, dx, lines, x1, y1) {
    let diffX
    let diffY
    if (dx > dy) {
      diffX = Math.sign(x2 - x1)
      diffY = Math.sign(y2 - y1) * dy / dx
    } else {
      diffX = Math.sign(x2 - x1) * dx / dy
      diffY = Math.sign(y2 - y1)
    }
    let signX = Math.sign(x2 - currentX)
    let signY = Math.sign(y2 - currentY)
    let nextSignX = Math.sign(x2 - currentX - diffX)
    let nextSignY = Math.sign(y2 - currentY - diffY)
    while (currentY * signY <= y2 * signY && currentX * signX <= x2 * signX
    && (Math.sign(y2 - currentY) === signY || Math.sign(y2 - currentY) === 0)
    && (Math.sign(x2 - currentX) === signX || Math.sign(x2 - currentX) === 0)) {
      this.setSquares([{
        x: Math.round(currentX) - 0.5,
        y: Math.round(currentY) - 0.5
      }], this.contextDiff)

      if (Math.round(currentX + diffX) * nextSignX <= x2 * nextSignX
        && Math.round(currentY + diffY) * nextSignY <= y2 * nextSignY
        && (Math.sign(y2 - currentY - diffY) === nextSignY || Math.sign(y2 - currentY - diffY) === 0)
        && (Math.sign(x2 - currentX - diffX) === nextSignX || Math.sign(x2 - currentX - diffX) === 0)) {
        lines.push({
          x1: Math.round(currentX),
          y1: Math.round(currentY),
          x2: Math.round(currentX + diffX),
          y2: Math.round(currentY + diffY),
          color: 'green'
        })
      }
      currentY += diffY
      currentX += diffX
      this.setLine(x1, y1, x2, y2, 'blue', this.contextDiff)

    }

  }

  brezenhem (currentY, y2, currentX, x2, dy, dx, lines, x1, y1) {
    let diffX
    let diffY
    let t0 = -1 / 2
    let k = dy / dx
    while (currentY <= y2 && currentX <= x2) {
      this.setSquares([{
        x: Math.round(currentX) - 0.5,
        y: Math.round(currentY) - 0.5
      }], this.contextBrez)
      t0 += k
      if (t0 >= 0) {
        diffX = 1
        diffY = 1
        t0 -= 1
      } else {
        diffX = 1
        diffY = 0
      }
      currentY += diffY
      currentX += diffX

    }
    this.setLine(x1, y1, x2, y2, 'blue', this.contextBrez)

  }

}