// Put together some filters for acting on Todo items
angular.module("todos.filters", []).

    // Filter to return todo items that are incomplete
    // Uses Angular's built-in filter function
    filter('incomplete', function() {
        return function(todos) {
            return todos.filter(function(todo) {
                return todo.Completed === false;
            });
        };
    }).

    // Filter to return todo items that are complete
    filter('complete', function() {
        return function(todos) {
            return todos.filter(function(todo) {
                return todo.Completed === true;
            });
        };
    });