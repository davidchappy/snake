// DOM elements
var $grid = $('#grid');

// Objects
var grid = {
  gridSize: 1600,
  xLength: 40,
  defaultSquare: " ",
  gridCoords: [],
  renderGrid: function() {
    for(let i = 0; i < this.gridSize; i++) {
       $grid.append('<div class="square" ' + 'data-coords="' + 
          this.gridCoords[i] + '">' + this.defaultSquare + '</div>');
    };
  },
  resetGrid: function() {
    for(let i = 0; i < this.gridSize; i++) {
       $grid.find('[data-coords="' + this.gridCoords[i] + '"]')
          .html(this.defaultSquare).removeClass('is-snake');
    };
  },
  setCoordinates: function() {
    let x = 0;
    let y = 0;
    for(let i = 0; i < this.gridSize; i++) {
      if (i === 0 || i % this.xLength === 0) {
        x++;
      }
      if (i <= 39) {
        y = i+1;
      } else {
        y = (i % this.xLength)+1;
      }
      this.gridCoords[i] = [x, y];  
    };
    return this.gridCoords;
  }
};

var snake = {
  head: '<span class="head">O</span>',
  headPosition: "20,20",
  direction: 'r',
  snakeBody: ["20,21", "20,22"],
  move: function() {

  },
  eat: function(square) {
    let newSquare = this.headPosition;
    this.snakeBody.unshift(newSquare);
    this.headPosition = square.toString();
  },
  render: function() {
    // render head
    let headSquare = $grid.find('[data-coords="' + this.headPosition + '"]');
    headSquare.html(this.head);

    // render body
    for(var i = 0; i < this.snakeBody.length; i++) {
      let memberSquare = $grid.find('[data-coords="' + this.snakeBody[i] + '"]');
      memberSquare.addClass('is-snake');
    }
  }
}

var food = {
  defaultSquare: '<span class="food">F</span>',
  appear: function() {
    let randomNumber = Math.floor((Math.random() * 1600));
    let targetCoords = grid.gridCoords[randomNumber];
    let targetSquare = $grid.find('[data-coords="' + targetCoords.toString() + '"]');

    if (targetSquare.hasClass('is-snake') || targetSquare.children().length != 0) {
      this.appear();
    } else {
      targetSquare.html(this.defaultSquare);
    }
  },
  disappear: function() {
    $grid.find('.food').html(grid.defaultSquare);
  }
}

// Run the game
$(document).ready(function() {
  // initiate grid and snake
  grid.setCoordinates();
  grid.renderGrid();
  snake.render();

  // reset, (manual)move, eat and re-render
  grid.resetGrid();
  snake.headPosition = ["20,19"];
  snake.snakeBody = ["20,20", "20,21"];
  snake.eat("20,18");
  snake.eat("20,17");
  snake.render();

  // throw in some food
  food.appear();
  food.disappear();
});

