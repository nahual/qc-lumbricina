// Invirtiendo arriba y abajo
snake.key_bindings = function() { return { ENTER : 13, LEFT : 37, UP : 40, RIGHT : 39, DOWN : 38}; };

// Eliminando las frutas azules
snake._meal_options['p']['preference'] = 0;
