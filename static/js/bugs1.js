// Eliminando el nivel 6
snake._levels.pop()

// Invirtiendo niveles 2 y 3
var level_2 = snake._levels[1];
snake._levels[1] = snake._levels[2];
snake._levels[2] = level_2;
