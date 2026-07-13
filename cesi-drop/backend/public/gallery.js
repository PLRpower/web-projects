const width = 300
const bricks = document.querySelectorAll('.brick')

const calculatedWidths = Array.from({ length: bricks.length }, () => {
  return ((1 + 3 * Math.random()) << 0) * width
})

bricks.forEach(function (brick, index) {
  brick.style.width = calculatedWidths[index] + 'px'
})

const wall = new Freewall('#freewall')

wall.reset({
  selector: '.brick',
  animate: true,
  cellW: width,
  cellH: 'auto',
  onResize: function () {
    wall.fitWidth()
  },
})

window.addEventListener('load', (event) => {
  wall.fitWidth()
})
