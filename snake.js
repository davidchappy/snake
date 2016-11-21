// DOM elements
const $grid = $('#grid');

// Global variables
const snakeSpeed = 250;
const foodSpeed = 5000;
const foodDisappearSpeed = 30000;
var snakeTimer = null;
var foodTimer = null;
var foodRemovalTimer = null;


// Objects
var game = {
  gameOver: function() {
    alert('<h1>Game Over!</h1>');
    window.location.reload(true);
  }
}

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
      grid.findSquare(this.gridCoords[i]).html(this.defaultSquare).removeClass('is-snake');
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
  },
  findAdjacent: function(currentPosition, direction) {
    let array = currentPosition.split(',').map(Number);
    switch(direction) {
      case 'l':
        if(array[1] != 1) {
          array[1] -= 1;
          return array.toString();  
        } else {
          return false;
        }
        break;
      case 'r':
        if(array[1] != 40) {
          array[1] += 1;
          return array.toString();  
        } else {
          return false;
        } 
        break;
      case 'u':
        if(array[0] != 1) {
          array[0] -= 1;
          return array.toString();  
        } else {
          return false;
        }
        break;
      case 'd':
        if(array[0] != 40) {
          array[0] += 1;
          return array.toString();  
        } else {
          return false;
        }
        break;
    }
  },
  randomSquare: function() {
    let randomNumber = Math.floor((Math.random() * this.gridSize));
    let targetCoords = this.gridCoords[randomNumber];
    return this.findSquare(targetCoords.toString());
  },
  findSquare: function(targetSquare) {
    return $grid.find('[data-coords="' + targetSquare + '"]');
  }
};

var snake = {
  head: '<span class="head">O</span>',
  headPosition: "20,20",
  direction: 'r',
  snakeBody: [],
  move: function(direction) {
    console.log("moved " + direction);
    let $snakeHead = this.findSnakeHead();
    $snakeHead.html(blankSquare);
    let destination = grid.findAdjacent(this.headPosition, direction);
    if(destination) {
      if (food.isFood(destination)) {
        this.eat(destination);
      }
      this.headPosition = destination;
      this.checkOverlap();
      this.render();
    } else {
      game.gameOver();
    }
  },
  listen: function() {
    let $snakeHead = this.findSnakeHead();
    $('body').on('keydown', $snakeHead, function(event) {
      event.preventDefault();
      switch(event.which) {
        case 37:
          snake.direction = ('l'); break;
        case 38:
          snake.direction = ('u'); break;
        case 39:
          snake.direction = ('r'); break;
        case 40:
          snake.direction = ('d'); break;
        default: break; 
      }
    });
    $('body').on('click', '#pause', function(event) {
      event.preventDefault();
      if($(this).hasClass('paused')) {
        $(this).html('pause');
        timer.startSnake();
        $(this).toggleClass('paused');
      } else {
        $(this).html('unpause');
        clearInterval(snakeTimer);
        clearInterval(foodTimer);
        clearInterval(foodRemovalTimer);
        $(this).toggleClass('paused');
      }
    });
  },
  eat: function(square) {
    let newSquare = this.headPosition;
    this.snakeBody.unshift(newSquare);
    this.headPosition = square.toString();
  },
  render: function() {
    // render head
    let headSquare = this.findSnakeHead();
    headSquare.html(this.head);

    // render body
    for(var i = 0; i < this.snakeBody.length; i++) {
      let memberSquare = grid.findSquare(this.snakeBody[i]);
      memberSquare.addClass('is-snake');
    }
  },
  findSnakeHead: function() {
    return grid.findSquare(this.headPosition);
  },
  checkOverlap: function() {
    if($.inArray(this.headPosition, this.snakeBody) != -1) {
      game.gameOver();
      return true;
    } else {
      return false;
    }
  }
}

var food = {
  defaultSquare: '<span class="food">F</span>',
  foodList: [],
  appear: function() {
    let targetSquare = grid.randomSquare();
    if (targetSquare.hasClass('is-snake') || targetSquare.children().length != 0) {
      this.appear();
    } else {
      this.foodList.push(targetSquare);
      targetSquare.html(this.defaultSquare);
    }
  },
  disappear: function() {
    let foodIndex = 0;
    if(this.foodList.length > 1) {
      foodIndex = Math.floor(Math.random(this.foodList.length));
    } else if(this.foodList.length === 0) {
      return;
    }
    this.foodList[foodIndex].html(grid.defaultSquare);
    this.foodList.splice(foodIndex, 1);
  },
  isFood: function(targetSquare) {
    console.log(targetSquare);
    let $targetDiv = $(grid.findSquare(targetSquare));
    if($targetDiv.find('span.food').length) {
      return true;
    } else {
      return false;
    }
  }
}

var timer = {
  startSnake: function() {
    snakeTimer = setInterval(function() {
      snake.move(snake.direction);
    }, snakeSpeed);
  },
  startFood: function() {
    foodTimer = setInterval(function() {
      food.appear();
    }, foodSpeed);
    foodRemovalTimer = setInterval(function() {
      food.disappear();
    }, foodDisappearSpeed);
  }
}

const blankSquare = grid.defaultSquare;

// Run the game
$(document).ready(function() {
  // initiate grid and snake
  grid.setCoordinates();
  grid.renderGrid();
  snake.render();
  snake.listen();

  // start timers
  timer.startFood();
  timer.startSnake();
});

