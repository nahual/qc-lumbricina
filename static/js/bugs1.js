// Eliminando el nivel 6
snake._levels.pop()

// Invirtiendo niveles 2 y 3
var level_2 = snake._levels[1];
snake._levels[1] = snake._levels[2];
snake._levels[2] = level_2;

// Haciendo que la roja no te alargue
snake._meal_options.o.reactions = [ function() {snake._increase_points(100);}, function() { snake._generate_meal();}];
