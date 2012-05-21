snake._max_scores = 3;

// Haciendo que la negra no haga nada
snake._meal_options.t.reactions = [];

snake._increase_points = function(quantity) {
        snake._score += quantity;
}
