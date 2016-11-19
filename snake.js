// Helpers 
function getCoordinates(gridSize, xLength) {
  coords = [];
  x = 0;
  y = 0;
  for(var i = 0; i < gridSize; i++) {
    if (i === 0 || i % xLength === 0) {
      x++;
    }
    if (i <= 39) {
      y = i+1;
    } else {
      y = (i % xLength)+1;
    }
    coords[i] = [x, y];  
  };
  return coords;
};

// DOM elements
var $grid = $('#grid');

// Objects
var grid = {
  gridSize: 1600,
  xLength: 40,
  defaultSquare: " ",
  gridCoords: [],
  renderGrid: function() {
    for(var i = 0; i < this.gridSize; i++) {
       $grid.append('<div class="square" ' + 'data-coords="' + 
          grid.gridCoords[i] + '">' + this.defaultSquare + '</div>');
    };
  },
  resetGrid: function() {
    for(var i = 0; i < this.gridSize; i++) {
       $grid.find('[data-coords="' + this.gridCoords[i] + '"]')
          .html(this.defaultSquare).removeClass('is-snake');
    };
  }
};

var snake = {
  head: '<span class="head">O</span>',
  headPosition: "20,20",
  direction: 'r',
  snakeBody: [this.headPosition, "20,21", "20,22"],
  move: function() {

  },
  eat: function() {

  },
  render: function() {
    // render head
    var headSquare = $grid.find('[data-coords="' + this.headPosition + '"]');
    headSquare.html(this.head);

    // render body
    var $body = this.snakeBody;
    for(var i = 1; i < this.snakeBody.length; i++) {
      var memberSquare = $grid.find('[data-coords="' + this.snakeBody[i] + '"]');
      memberSquare.addClass('is-snake');
    }
  }
}

$(document).ready(function() {
  // init grid
  grid.gridCoords = getCoordinates(grid.gridSize, grid.xLength);
  grid.renderGrid();

  // render snake
  snake.render();

  // reset, move and re-render
  grid.resetGrid();
  snake.headPosition = ["20,19"];
  snake.snakeBody = [snake.headPosition, "20,20", "20,21"];
  snake.render();
});

