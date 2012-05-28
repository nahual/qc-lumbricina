function Box(x,y,code){ this.x=x; this.y=y; this.code=code; }
function Score(name,score){ this.name=name; this.score=score; }
function Bonus(box) { this.box = box; this.life = 50;}

function Snake(){

    /*********************/
    /**	   Attributes	**/
    /*********************/
    var snake = this;
    this._canvas = $("#canvas")[0]; //The canvas element
    this._ctx = null; //The canvas context
    this._box_size = 8; //The size of a box on the board
    this._box_padding = 1; //The size of the padding around a box
    this._localstorage = null; //To know if the user's browser supports localstorage
    this._border_color = "gray"; //The color of the external borders
    this._snake_color = "rgb(194, 42, 53)"; //The color of the snake
    this._max_scores = 5; // How many scores are shown?
    this._meal_options = {
                    'o' : { 'preference' : 0, 'name' : 'standard', 'color' : "red", 'reactions' : [ function() {snake._increase_points(100);}, function() { snake._grow(); }, function() { snake._generate_meal();}] },
                    'p' : { 'preference' : 3, 'name' : 'super bonus', 'color' : "blue", 'reactions' : [ function() {snake._increase_points(500);}, function() {snake._accelerate();}] },
                    'q' : { 'preference' : 3, 'name' : 'slower', 'color' : "gold", 'reactions' : [ function() {snake._slow_down();}] },
                    'r' : { 'preference' : 3, 'name' : 'crazy', 'color' : "green", 'reactions' : [ function() {snake._invert_right_left();}] },
                    't' : { 'preference' : 3, 'name' : 'gameover', 'color' : "black", 'reactions' : [ function() {snake._collision = true;}] },
                    'u' : { 'preference' : 2, 'name' : 'hunger', 'color' : "white", 'reactions' : [ function() {snake._hungerfy()},function() {snake._accelerate(); snake._accelerate(); snake._accelerate();}] },
                    'v' : { 'preference' : 2, 'name' : 'shrinker', 'color' : "violet", 'reactions' : [ function() {snake._accelerate(); snake._accelerate(); snake._accelerate();}, function() {snake._shrink();}] },
                 };
    this._levels = [
                     [], // 1
                     [
                      [24,1],[25,1],[24,2],[25,2],[24,3],[25,3],[24,4],[25,4],[24,5],[25,5],
                      [24,24],[25,24],[24,25],[25,25],[24,26],[25,26],[24,27],[25,27],[24,28],[25,28],
                      [1,14],[1,15],[2,14],[2,15],[3,14],[3,15],[4,14],[4,15],[5,14],[5,15],
                      [44,14],[44,15],[45,14],[45,15],[46,14],[46,15],[47,14],[47,15],[48,14],[48,15]
                     ], //2
                     [
                      [24,1],[25,1],[24,2],[25,2],[24,3],[25,3],[24,4],[25,4],[24,5],[25,5],[24,6],[25,6],[24,7],[25,7],
                      [11,22],[12,22],[11,23],[12,23],[11,24],[12,24],[11,25],[12,25],[11,26],[12,26],[11,27],[12,27],[11,28],[12,28],
                      [35,22],[36,22],[35,23],[36,23],[35,24],[36,24],[35,25],[36,25],[35,26],[36,26],[35,27],[36,27],[35,28],[36,28]
                     ], //3
                     [
                      [37,1],[38,1],[37,2],[38,2],[37,3],[38,3],[37,4],[38,4],[37,5],[38,5],[37,6],[38,6],[37,7],[38,7],
                      [11,22],[12,22],[11,23],[12,23],[11,24],[12,24],[11,25],[12,25],[11,26],[12,26],[11,27],[12,27],[11,28],[12,28],
                      [1,10],[1,11],[2,10],[2,11],[3,10],[3,11],[4,10],[4,11],[5,10],[5,11],[6,10],[6,11],[7,10],[7,11],[8,10],[8,11],[9,10],[9,11],[10,10],[10,11],[11,10],[11,11],[12,10],[12,11],[13,10],[13,11],[14,10],[14,11],
                       [35,15],[35,16],[36,15],[36,16],[37,15],[37,16],[38,15],[38,16],[39,15],[39,16],[40,15],[40,16],[41,15],[41,16],[42,15],[42,16],[43,15],[43,16],[44,15],[44,16],[45,15],[45,16],[46,15],[46,16],[47,15],[47,16],[48,15],[48,16]
                     ], // 4
                     [
                      [24,20],[25,20],[24,21],[25,21],[24,22],[25,22],[24,23],[25,23],[24,24],[25,24],[24,25],[25,25],[24,26],[25,26],[24,27],[25,27],[24,28],[25,28],
                      [8,18],[8,19],[9,18],[9,19],[10,18],[10,19],[11,18],[11,19],[12,18],[12,19],[13,18],[13,19],[14,18],[14,19],[15,18],[15,19],[16,18],[16,19],[17,18],[17,19],[18,18],[18,19],[19,18],[19,19],[20,18],[20,19],[21,18],[21,19],[22,18],[22,19],[23,18],[23,19],[24,18],[24,19],[25,18],[25,19],[26,18],[26,19],[27,18],[27,19],[28,18],[28,19],[29,18],[29,19],[30,18],[30,19],[31,18],[31,19],[32,18],[32,19],[33,18],[33,19],[34,18],[34,19],[35,18],[35,19],[36,18],[36,19],[37,18],[37,19],[38,18],[38,19],[39,18],[39,19],
                      [8,9],[9,9],[8,10],[9,10],[8,11],[9,11],[8,12],[9,12],[8,13],[9,13],[8,14],[9,14],[8,15],[9,15],[8,16],[9,16],[8,17],[9,17],
                      [38,9],[39,9],[38,10],[39,10],[38,11],[39,11],[38,12],[39,12],[38,13],[39,13],[38,14],[39,14],[38,15],[39,15],[38,16],[39,16],[38,17],[39,17],
                     ], // 5
                  ];
    /*********************/
    /**		Methods	    **/
    /*********************/
    /**
     * Initialization of the snake
     */
    this.init = function() {
        this._keys = { ENTER : 13, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40};
        this._meal_distributions = this._generate_meal_distributions();
        this._bonus = null;
        this._box = this._box_size+this._box_padding*2; //The total size of a box (size+padding)
        this._play = false; //To know if the game is running
        this._menu = false; //To know if a menu is displayed and which one
        this._collision = false; //To know if there is a collision
        this._score = 0; //The current score of the player
        this._direction = 'left'; //The current direction where the snake is going to
        this._direction_changed = false; //To know if the user has already changed the snake's direction in a game loop
        this._has_to_grow = false; // To know if the tail has to remain in place
        this._hungry = false; // Can the snake eat obstacles?
        this._current_level = 1;
        this._number_of_levels = 0;
        $(this._levels).each(function(){snake._number_of_levels += 1;});
        $("#score").text(this._score);
        $("#level").text(this._current_level);
        if(this._canvas.getContext){
            this._ctx = this._canvas.getContext("2d");
            //Checks the canvas dimensions
            var dimensions_error = false;
            if(this._canvas.width%this._box != 0)
                alert("The canvas width ("+this._canvas.width+") have to be a multiple of the box size ("+this._box+")");
            if(this._canvas.height%this._box != 0)
                alert("The canvas height ("+this._canvas.height+") have to be a multiple of the box size ("+this._box+")");

            if(!dimensions_error){
                this._generate_empty_map(true);
                this._generate_level_obstacles();
                //Generates the meal
                this._generate_meal();
                //Render the board for the first time
                this.render();
                //Bind the keydown event
                document.onkeydown = function(e){ snake.keydown(e.keyCode); };
                //Displays the start menu
                this.start_menu();
                //Displays the saved top scores
                this.top_scores();
            }
        }
        else{
            //If the browser does not support html5 canvas
            //Add fallback or error here
            alert("You browser doesn't support HTML5 canvas");
        }
    };

    this._change_level = function() {
        this._play = false;
        this._current_level += 1;
        this._generate_empty_map(true);
        this._generate_level_obstacles();
        this._generate_meal();
        $("#level").text(this._current_level);
        this._play = true;
    }

    this._generate_empty_map = function(reset_speed) {
        this._direction = 'left';
        if (reset_speed || !this._speed) {
            this._speed = 1; //The initial speed of the snake
        }
        this._board = []; //Stocks all the box from the board
        this._snake = []; //Represents the snake's body
        //Generates the new empty board
        for(var i=0; i<=this._canvas.width; i+=this._box){
            for(var j=0; j<=this._canvas.height; j+=this._box){
                this._board.push(new Box(i,j,'_'));
            }
        }
        //Generates the borders
        for(var i=0; i<=this._canvas.width; i+=this._box){
            this.setBox(i, 0, '#');
            this.setBox(i, this._canvas.height-this._box, '#');
        }
        for(var j=0; j<=this._canvas.height; j+=this._box){
            this.setBox(0, j, '#');
            this.setBox(this._canvas.width-this._box, j, '#');
        }
        //Generates the snake
        var x = Math.ceil(this._canvas.width/2)-this._box;
        var y = Math.ceil(this._canvas.height/2);
        for(var i=0; i<3; i++){
            this._snake.push(new Box(x,y,'s'));
            this.setBox(x, y, 's');
            x += this._box;
        }
        $("#snake-speed").text(this._speed);
        $("#snake-length").text(this._snake.length);
    }
    
    this._generate_level_obstacles = function() {
        $(this._levels[(this._current_level-1)%this._number_of_levels]).each(function() {
            snake.setBox(this[0]*snake._box, this[1]*snake._box, '&');
        });
    }

    /**
     * Main loop of the game
     */
    this.loop = function(){
        this.move();
        if(this._collision){
            this._play = false;
            this.stop_menu(); //Displays the gameover menu
        }
        else{
            this.render();
        }
        if(this._play){
            this._direction_changed = false;
            this._decide_bonuses();
            setTimeout(function(){ snake.loop(); }, 200-this._speed);
        }
    };

    /**
     * Render method, transforms each box in the board in their graphical equivalent
     */
    this.render = function(){
        var box;
        for(var i=0; i<this._board.length; i++){
            box = this._board[i];
            switch(this._board[i].code){
                case '_': //Empty box
                    this.clearBox(box.x, box.y);
                    break;
                case '#': //Border box
                    if(!this._play){ //Doesn't redraw the borders once the game is launched
                        this._ctx.fillStyle = this._border_color;
                        this.drawBox(box.x, box.y);
                    }
                    break;
                case 's': //Snake box
                    this._ctx.fillStyle = this._snake_color;
                    this.drawBox(box.x, box.y);
                    break;
                case '&': //Obstacle box
                    this._ctx.fillStyle = this._border_color;
                    this.drawBox(box.x, box.y);
                    break;
                default: // It should be a meal
                    this._ctx.fillStyle = this._meal_options[this._board[i].code].color;
                    this.drawBox(box.x, box.y);
                    break;
            }
        }
    };

    this.key_bindings = function() {
        return this._keys;
    }

    /**
     * Method called when a keydown event is triggered
     */
    this.keydown = function(key){
        var keys = this.key_bindings();
        if(key != keys.ENTER && key != 68 && key != 72 && this._direction_changed)
            return false;
        switch(key){
            case keys.ENTER:
                if(this._menu == 'start'){
                    //Clears the menu
                    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                    this._menu = false;
                    //Displays the board
                    this.render();
                    //Launches the game
                    this._play = true;
                    this.loop();
                } else if (this._menu == 'stop') {
                    this.save_score(); //Saves the score
                    this.top_scores(); //Displays the new score
                    this.init();
                }
                break;
            case keys.LEFT:
                if(this._direction != 'right')
                    this._direction = 'left';
                break;
            case keys.UP:
                if(this._direction != 'down')
                    this._direction = 'up';
                break;
            case keys.RIGHT:
                if(this._direction != 'left')
                    this._direction = 'right';
                break;
            case keys.DOWN:
                if(this._direction != 'up')
                    this._direction = 'down';
                break;
            case 68:
                $("#debug-info").toggle();
                break;
            case 72:
                $("#game-info").toggle();
                break;
            default:
                break;
        }
        this._direction_changed = true;
    };

    /**
     * Moves the snake to the next box according to the direction
     */
    this.move = function(){
        //Add the new snake's head
        var x = this._snake[0].x;
        var y = this._snake[0].y;
        if(this._direction == 'left')
            x -= this._box;
        else if(this._direction == 'up')
            y -= this._box;
        else if(this._direction == 'right')
            x += this._box;
        else if(this._direction == 'down')
            y += this._box;
        this._snake.unshift(new Box(x,y,'s'));
        var hasEaten = this.checkCollisions();
        this.setBox(x,y,'s');
        //Delete the last snake's part
        if(!this._has_to_grow){
            var box = this._snake.pop();
            this.setBox(box.x, box.y, '_');
        } else {
            this._has_to_grow = false;
        }
        if (hasEaten && this._has_to_change_level()) {
            this._change_level();
        }
    };

    this._has_to_change_level = function() {
        return this._score >= 500*this._current_level;
    }

    this._decide_bonuses = function() {
        if (this._bonus) {
            if (this._bonus.life > 0) {
                this._bonus.life -= 1;
            } else {
                this._remove_bonus();
            }
        } else {
            this._generate_bonus();
        }
        $("#bonus-life").text(this._bonus ? this._bonus.life : 0);
    }

    this._remove_bonus = function() {
        this.setBox(this._bonus.box.x, this._bonus.box.y, '_');
        this._bonus = null;
    }

    /**
     * Checks if there is a collision
     * Return true if the snake has eaten the meal
     */
    this.checkCollisions = function(){
        var head = this._snake[0];
        var box = this.getBox(head.x, head.y);
        if (box.code == '#') { //Collision with a border
            this._collision = true;
            return false;
        } else if (box.code == 's') { // Collision with snake
            this._collision = true;
            return false;
        } else if (box.code == '&' && !this._hungry) { // Collision with obstacle
            this._collision = true;
            return false;
        } else if(this._meal_options[box.code]){ //The snake has eaten a meal
            var options = this._meal_options[box.code];
            $(options.reactions).each(function(){
                this();
            });
            return true;
        }
        return false;
    };

    /**
     * Generates a new meal randomly on the board
     */
    this._place_meal = function(meal) {
        var x = ((Math.random() * (this._canvas.width-this._box)) / 100) * 100;
        var y = ((Math.random() * (this._canvas.height-this._box)) / 100) * 100;
        //Transforms x and y in box size multiple
        x = (Math.round(x/this._box))*this._box;
        y = (Math.round(y/this._box))*this._box;
        //Set the meal if there is no collisions
        var box = this.getBox(x, y);
        if(box.code == '_') {
            this.setBox(x, y, meal);
            return new Box(x, y, meal);
        }
        else {
            return this._place_meal(meal);
        }
    };

    this._generate_meal = function() {
        this._place_meal('o');
    }

    this._generate_bonus = function() {
        var option = Math.floor(Math.random()*this._meal_distributions.length);
        var meal = this._meal_distributions[option];
        this._bonus = new Bonus(this._place_meal(meal));    
    }

    /**
    * Reactions to eating meals
    **/
    this._accelerate = function(){
        if(this._speed >= 199)
            return
        if(this._speed < 100)
            this._speed += 20;
        else if(this._speed < 130) 
            this._speed += 10;
        else if(this._speed < 150)
            this._speed += 5;
        else if(this._speed < 200)
            this._speed += 1;
        $("#snake-speed").text(this._speed);
    };

    this._slow_down = function(){
        if(this._speed <= 1)
            return
        if(this._speed < 100)
            this._speed -= 5;
        else if(this._speed < 130) 
            this._speed -= 10;
        else if(this._speed < 200)
            this._speed -= 20;
        $("#snake-speed").text(this._speed);
    };
    
    this._increase_points = function(quantity){
        this._score += quantity;
        $("#score").text(this._score);
        $("#snake-score").text(this._score);
    }

    this._grow = function() {
        this._has_to_grow = true;
        $("#snake-length").text(this._snake.length);
    }

    this._invert_right_left = function() {
        var pivot = this._keys.LEFT;
        this._keys.LEFT = this._keys.RIGHT;
        this._keys.RIGHT = pivot;
    }

    this._hungerfy = function() {
        this._hungry = !this._hungry;
    }

    this._shrink = function() {
        var len = this._snake.length;
        if (len > 4) {
            var box = this._snake.pop();
            this.setBox(box.x, box.y, '_');
            $("#snake-length").text(this._snake.length-1);
        }
    }

    /**
     * Saves the current score in local storage if it' a top score
     */
    this.save_score = function(){
        if(this._localstorage != false){
            var scores = localStorage["scores"];
            if(scores == null)
                scores = new Array(); //Creates a new empty array if there's no saved score
            else
                scores = JSON.parse(scores);

            //The game saves only five scores, if there's less than five saved score while it saves the new one
            if(scores.length < this._max_scores){
                var username = prompt("Nombre : "); //Asks for the user's name
                if(username == null || username == "") //Checks if there is a username
                    username = "Alguien";
                scores.push(new Score(username, this._score));
                localStorage["scores"] = JSON.stringify(scores);
            }
            //Else it looks if the new score is better than an old one
            else{
                scores.sort(function(a,b){ return (a.score - b.score); }); //Sorts the array by score (smallest first)
                if(this._score > scores[0]["score"]){ //If the smallest saved score is smaller than the new score
                    var username = prompt("Nombre : "); //Asks for the user's name
                    if(username == null || username == "") //Checks if there is a username
                        username = "Alguien";
                    scores[0] = new Score(username, this._score); //Replaces it
                    localStorage["scores"] = JSON.stringify(scores);                    
                }
            }
        }
    };

    /**
     * To know if the user's browser supports localstorage
     */
    this.checkLocalstorage = function(){
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };

    /**
     * Displays the top scores
     */
    this.top_scores = function(){
        if(this._localstorage == null){
            //Checks for localstorage support
            this._localstorage = this.checkLocalstorage();
        }
        if(this._localstorage != false){
            if(localStorage["scores"] != null){
                //Displays the scores
                var scores = localStorage["scores"];
                scores = JSON.parse(scores);
                scores.sort(function(a,b){ return (b.score - a.score); });
                var top_scores = $("#top_scores");
                top_scores.empty();
                for(var i=0; i<scores.length; i++){
                    var content = "<li><span class='name'>"+scores[i]['name']+"</span>";
                    content += "<span class='score'>"+scores[i]["score"]+"</span></li>";
                    $(content).appendTo(top_scores);
                }
            }
        }
    };

    /**
     * Displays the start menu
     */
    this.start_menu = function(){
        this._ctx.fillStyle = "rgba(0,0,0,0.8)";
        this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
        this._ctx.fillStyle = "rgba(255,255,255,0.7)";
        this._ctx.font = "30px Helvetica";
        this._ctx.textAlign = "center";
        this._ctx.fillText("Lumbricina", this._canvas.width/2, 100);
        this._ctx.font = "20px Helvetica";
        this._ctx.textAlign = "left";
        this._ctx.fillText("- A la lombriz se la mueve con las flechas", (this._canvas.width/2)-150, 150, 300);
        this._ctx.fillText("- Hay que tocar enter para empezar!", (this._canvas.width/2)-150, 175, 300);
        this._menu = 'start';
    };

    /**
     * Displays the stop menu
     */
    this.stop_menu = function(){
        this._ctx.fillStyle = "rgba(0,0,0,0.8)";
        this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
        this._ctx.fillStyle = "rgba(255,255,255,0.7)";
        this._ctx.font = "30px Helvetica";
        this._ctx.textAlign = "center";
        this._ctx.fillText("Game Over", this._canvas.width/2, 100);
        this._ctx.font = "20px Helvetica";
        this._ctx.fillText("Hiciste "+this._score+" puntos!", this._canvas.width/2, 150);
        this._ctx.fillText("(tocar enter para continuar)", this._canvas.width/2, 180);
        this._menu = 'stop';
    };

    /**
     * Helper : A method to find a box in the board array
     */
    this.getBox = function(x,y){
        for(var i=0; i<this._board.length; i++)
            if(this._board[i].x == x && this._board[i].y == y) return this._board[i];
    };
    
    /**
     * Helper : A method to set a box in the board array
     */
    this.setBox = function(x,y,code){
        for(var i=0; i<this._board.length; i++){
            if(this._board[i].x == x && this._board[i].y == y){
                this._board[i].code = code;
                return true;
            }

        }
    }

    /**
     * Helper : A graphic method to draw a new box on the canvas
     */
    this.drawBox = function(x,y){
        this._ctx.fillRect(x+this._box_padding, y+this._box_padding, this._box_size, this._box_size);
    };

    /**
     * Helper : A graphical method to clear a box on the canvas
     */
    this.clearBox = function(x,y){
        this._ctx.clearRect(x+this._box_padding, y+this._box_padding, this._box_size, this._box_size);
    }

    this._generate_meal_distributions = function() {
        var distributions = [];
        $.each(this._meal_options, function(representation, config) { 
            var quantity = this.preference;
            for (var i = 0; i< quantity; ++i) {
                distributions.push(representation);
            }
        });
        return distributions;
    }
    
}
