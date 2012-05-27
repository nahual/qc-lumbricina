// Guardando solo 3 highscores
snake._max_scores = 3;

// Eliminando el ultimo nivel
snake._levels.pop()

// Invirtiendo niveles 2 y 3
var level_2 = snake._levels[1];
snake._levels[1] = snake._levels[2];
snake._levels[2] = level_2;

// Haciendo que la roja no te alargue
snake._meal_options.o.reactions = [ function() {snake._increase_points(100);}, function() { snake._generate_meal();}];

// Haciendo que la verde invierta arriba/abajo en vez de izquierda/derecha
snake._meal_options.r.reactions = [ function() {
    var pivot = snake._keys.UP;
    snake._keys.UP = snake._keys.DOWN;
    snake._keys.DOWN = pivot;
}];

// Haciendo que la negra no haga nada
snake._meal_options.t.reactions = [];

// No mostrando el puntaje en pantalla
snake._increase_points = function(quantity) {
        snake._score += quantity;
}

// Manteniendo la velocidad entre cambios de nivel
snake._old_generate_empty_map = snake._generate_empty_map;
snake._generate_empty_map = function() {
    var speed = snake._speed || 1;
    snake._old_generate_empty_map();
    snake._speed = speed;
    $("#snake-speed").text(this._speed);
}

// Haciendo que las pastillas duren 40 turnos
function Bonus(box) { this.box = box; this.life = 40;}

// Vaciando el highscore cada vez que se recarga el juego
snake.checkLocalstorage = function() {
    try {
        var ls = 'localStorage' in window && window['localStorage'] !== null;
        localStorage["scores"] = "[]";
        return ls;
    } catch (e) {
        return false;
    }
};
