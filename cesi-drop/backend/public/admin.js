const wall = new Freewall('#freewall')

wall.reset({
  selector: '.brick',
  animate: true,
  cellW: 600,
  cellH: 'auto',
  onResize: function () {
    wall.fitWidth()
  },
})

window.addEventListener('load', (event) => {
  wall.fitWidth()
})

document.addEventListener('DOMContentLoaded', function () {
  const bricks = document.querySelectorAll('.brick')

  bricks.forEach(function (brick) {
    const inputElement = brick.querySelector('input[type="checkbox"]')

    brick.addEventListener('click', function () {
      inputElement.click()
    })

    inputElement.addEventListener('click', function (event) {
      event.stopPropagation()
    })
  })
})

function showGradient(input) {
  const gradientDiv = input.parentNode.querySelector('.rectangle-gradient-bg')
  if (input.checked) {
    gradientDiv.classList.add('opacity-full')
  } else {
    gradientDiv.classList.remove('opacity-full')
  }
}
