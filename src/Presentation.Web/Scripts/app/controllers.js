// Controllers are the components that "back" views (and optionally directives)
// Declare a dependency on the services
angular.module("todos.controllers", ["todos.services"]).

    // Controller backing the login view
    controller("LoginCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {

        $scope.login = function() {
            $http.post("/user/login", { Email: $scope.Email, Password: $scope.Password }).success(function () {
                $location.path('/lists');
            });
        };
    }]).


    // Controller backing the signup form
    controller("RegisterCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {

        $scope.register = function() {
            $http.post('/user/register', { Email: $scope.Email, Name: $scope.Name, Password: $scope.Password }).success(function() {
                $location.path('/lists');
            });
        };
    }]).


    // Controller backing the list of lists
    controller("ListsCtrl", ["$scope", "TodoListFactory", function($scope, TodoListFactory) {

        var self = this;

        $scope.$on('list:deleted', function() {
            self.setLists();
        });

        this.setLists = function() {
            TodoListFactory.query(function (lists) {
                var items = [], buffer = [];
                lists.forEach(function(l, i) {
                    buffer.push(l);
                    if ((i + 1) % 2 == 0 && i != 0 || i == lists.length - 1) {
                        items.push({ row: buffer });
                        buffer = [];
                    }
                });
                $scope.lists = items;
            });
        };

        this.setLists();
        
        $scope.addList = function() {
            var todo = new TodoListFactory({ Name: $scope.Name });
            todo.$save(function () {
                $scope.$broadcast('list:added');
                self.setLists();
            });
        };
    }]).


    // Controller backing a single list
    controller("ListCtrl", ["$scope", "ListTodoFactory", "TodoFactory", function ($scope, ListTodoFactory, TodoFactory) {

        $scope.$on('todo:deleted', function() {
            ListTodoFactory.query({listId:$scope.list.Id}, function(todos) {
                $scope.list.Todos = todos;
            });
        });

        $scope.addTodo = function (title, dueDate) {
            var todo = new ListTodoFactory({ Title: title, DueDate: dueDate + "T00:00:00" });
            todo.$save({ listId: $scope.list.Id }, function () {
                $scope.list.Todos.push(todo);
                $scope.Title = "";
            });
        };

        $scope.completed = function () {
            var count = 0;
            angular.forEach($scope.list.Todos, function(todo) {
                count += todo.Completed ? 1 : 0;
            });
            return count;
        };
    }]).


    // Controller backing a todo
    controller("TodoCtrl", ["$scope", "TodoFactory", function ($scope, TodoFactory) {

        $scope.deleteTodo = function ( todo ) {
            todo.deleting = true;

            // Use bracket notation to call delete for the sake of IE ()
            TodoFactory['delete']( { id: todo.Id }, {}, function () {
                $scope.$emit( 'todo:deleted' );
            }, function () {
                todo.deleting = false;
            } );
        };

        $scope.markDone = function (todo) {
            if (todo.deleting) return;
            todo.Completed = true;
            if (!todo.hasOwnProperty('$update'))
                todo = new TodoFactory(todo);
            todo.$update();
        };

        $scope.markNotDone = function (todo) {
            if (todo.deleting) return;
            todo.Completed = false;
            if (!todo.hasOwnProperty('$update'))
                todo = new TodoFactory(todo);
            todo.$update();
        };

    }]);