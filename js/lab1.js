class Drawer {
  /**
   * Create Drawer instance
   * @constructor
   */
  constructor (canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('2d')
    this.halfOfX = Math.round(this.canvas.width / 2)
    this.halfOfY = Math.round(this.canvas.height / 2)
    this.context.translate(this.halfOfX, this.halfOfY)
    this.context.rotate(-Math.PI / 2)
  }

  clear () {
    if (typeof this.halfOfX !== 'undefined') {
      this.context.clearRect(-this.halfOfX, -this.halfOfY, this.halfOfX * 2, this.halfOfY * 2)
    }
  }

  setGrid (countOfXSquares, countOfYSquares) {
    this.x = countOfXSquares
    this.y = countOfYSquares
    this.currentWidth = Math.round(this.canvas.width / this.x)
    this.currentHeight = Math.round(this.canvas.height / this.y)
    this.drawGrid()
  }

  drawGrid () {
    this.context.strokeStyle = '#FF0000'
    for (let i = -this.halfOfY + this.currentHeight; i < this.halfOfY; i += this.currentHeight) {
      if (i === 0) {
        this.context.strokeStyle = '#000000'
      }
      this.context.beginPath()
      this.context.moveTo(-this.halfOfX, i)
      this.context.lineTo(this.halfOfX, i)
      this.context.stroke()
      this.context.strokeStyle = '#FF0000'
    }
    for (let i = -this.halfOfX + this.currentWidth; i < this.halfOfX; i += this.currentWidth) {
      if (i === 0) {
        this.context.strokeStyle = '#000000'
      }
      this.context.beginPath()
      this.context.moveTo(i, -this.halfOfY)
      this.context.lineTo(i, this.halfOfY)
      this.context.stroke()
      this.context.strokeStyle = '#FF0000'
    }
  }

  setSquares (filledSquares) {
    this.filledSquares = filledSquares
    this.context.fillStyle = 'yellow'
    for (let itemName in this.filledSquares) {
      let item = this.filledSquares[itemName]
      this.context.fillRect(item.y * this.currentWidth, item.x * this.currentHeight,
        this.currentWidth, this.currentHeight)
    }
  }

  setLine (x1, y1, x2, y2, color) {
    this.context.beginPath()
    this.context.strokeStyle = color
    this.context.moveTo(y1 * this.currentWidth, x1 * this.currentHeight)
    this.context.lineTo(y2 * this.currentWidth, x2 * this.currentHeight)
    this.context.stroke()
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
    for (let item in lines) {
      this.setLine(lines[item].x1, lines[item].y1, lines[item].x2, lines[item].y2, lines[item].color)
    }

  }

  difAnalyzer (currentY, y2, currentX, x2, dy, dx, lines, x1, y1) {
    let diffX
    let diffY
    if (dx > dy) {
      diffX = 1
      diffY = dy / dx
    } else {
      diffX = dx / dy
      diffY = 1
    }
    while (currentY <= y2 && currentX <= x2) {
      this.setSquares([{
        x: Math.round(currentX) - 0.5,
        y: Math.round(currentY) - 0.5
      }])
      if (Math.round(currentX + diffX) <= x2 && Math.round(currentY + diffY) <= y2) {
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
      this.setLine(x1, y1, x2, y2, 'blue')

    }
  }

}