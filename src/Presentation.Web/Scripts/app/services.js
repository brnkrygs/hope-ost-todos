// Define a module for interacting with the world outside of Angular - a set of services, implemented as factories
angular.module("todos.services", ['ngResource']).

    // Create a factory that handles Todo Lists
    // Assumes a RESTful web service backing the entity
    factory("TodoListFactory", ['$resource', function($resource) {
        return $resource('/api/todolists/:id', { id: '@Id' });
    }]).

    // Create a factory that handles Todos on Todo Lists
    // Assumes a RESTful web service backing the entity
    factory("ListTodoFactory", ['$resource', function($resource) {
        return $resource('/api/todolists/:listId/todos');
    }]).

    // Create a factory that handles Todos directly
    // Assumes a RESTful web service backing the entity
    factory("TodoFactory", ['$resource', function($resource) {
        return $resource('/api/todos/:id', {id:'@Id'}, {
            update: {method:'PUT'}
        });
    }]);