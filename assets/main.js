var Game = Game || {}
var Component = Component || {}
var Keyboard = Keyboard || {}

Keyboard.Keymap = {
    37: 'left', // mã 37 là mũi trái
    38: 'up',
    39: 'right',
    40: 'down'
}

Keyboard.ControllerEvents = function() {
    var self = this
    this.pressKey = null
    this.Keymap = Keyboard.Keymap

    document.onkeydown = function(event) {
        console.log(event)
        self.pressKey = event.which
    }

    this.getKey = function() {
        return self.Keymap[self.pressKey]
    }
}

Component.Stage = function(canvas, options) {
    this.keyEvent = new Keyboard.ControllerEvents()
    this.width = canvas.width
    this.height = canvas.height
    this.length = []
    this.food = {}
    this.score = 0
    this.direction = 'right'
    this.options = {
        cw: 10,
        size: 6,
        fps: 1000
    }
    if (typeof options == 'object') {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.options[key] = options[key]
            }
        }
    }
}

Component.Snake = function(canvas, options) {
    this.stage = new Component.Stage(canvas, options)
    this.InitSnake = function() {
            for (var i = 0; i < this.stage.options.size; i++) {
                this.stage.length.push({ x: i, y: 0 })
            }
        }
        // console.log(this.stage.length)
        // console.log(this.stage.options)
    this.InitSnake()
    this.InitFood = function() {
        this.stage.food = {
            x: Math.round(Math.random() * (this.stage.width - this.stage.options.cw) / this.stage.options.cw),
            y: Math.round(Math.random() * (this.stage.height - this.stage.options.cw) / this.stage.options.cw),
        }
    }
    this.InitFood()
    this.restart = function() {
        this.stage.length = []
        this.stage.food = {}
        this.stage.score = 0
        this.stage.direction = 'right'
        this.stage.keyEvent.pressKey = null
        this.InitSnake()
        this.InitFood()
    }
}

Game.Init = function(id, options) {
    // Sets
    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    var snake = new Component.Snake(canvas, options);
    var gameDraw = new Game.Draw(context, snake);

    // Game Interval
    setInterval(function() { gameDraw.drawStage(); }, snake.stage.options.fps); //set time

}

Game.Draw = function(context, snake) {

    // Draw Stage
    this.drawStage = function() {

        // Check Keypress And Set Stage direction
        var keyPress = snake.stage.keyEvent.getKey();
        if (typeof(keyPress) != 'undefined') {
            snake.stage.direction = keyPress;
        }

        // Draw White Stage
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);

        // Snake Position
        var nx = snake.stage.length[0].x;
        var ny = snake.stage.length[0].y;

        // Add position by stage direction
        switch (snake.stage.direction) {
            case 'right':
                nx++;
                break;
            case 'left':
                nx--;
                break;
            case 'up':
                ny--;
                break;
            case 'down':
                ny++;
                break;
        }

        // Check Collision
        if (this.collision(nx, ny) == true) {
            snake.restart();
            return;
        }

        // Logic of Snake food
        if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
            var tail = { x: nx, y: ny };
            snake.stage.score++;
            snake.InitFood();
        } else {
            var tail = snake.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        snake.stage.length.unshift(tail);

        // Draw Snake
        for (var i = 0; i < snake.stage.length.length; i++) { // check chiều dài sau của
            var cell = snake.stage.length[i];
            this.drawCell(cell.x, cell.y);
        }

        // Draw Food
        this.drawCell(snake.stage.food.x, snake.stage.food.y);

        // Draw Score
        context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
    };

    // Draw Cell
    this.drawCell = function(x, y) {
        context.fillStyle = 'rgb(170, 170, 170)';
        context.beginPath();
        context.arc((x * snake.stage.options.cw + 6), (y * snake.stage.options.cw + 6), 4, 0, 2 * Math.PI, false);
        context.fill();
    };

    // Check Collision with walls
    this.collision = function(nx, ny) {
        if (nx == -1 || nx == (snake.stage.width / snake.stage.options.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.options.cw)) {
            return true;
        }
        return false;
    }
};


window.onload = onload()

function onload() {
	var input, input2
    console.log('onload')
    console.log(Game)
	while(true){
		try{
			input = prompt("Please enter the level (high level -> slow): ")
			input2 = prompt("Please enter the size's snake: ")
			if(input <=0  || input2 <= 0){
				alert("Please input level or size > 0")
				continue
			}
			break
		}catch(err){
			message.innerHTML = "Input is " + err
		}	
	}
    new Game.Init('stage', { fps: input, size: input2 })
}