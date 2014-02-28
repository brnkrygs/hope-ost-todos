"use strict";

// Declare the application, including dependencies on other modules
var application = angular.module( "todos", ["todos.controllers", "ngCookies", 'ngRoute', 'todos.directives', 'todos.filters'] )

    .config( [
        "$routeProvider", function( $routeProvider ) {

            // Set up routes inside the app
            $routeProvider.when( '/lists', { templateUrl: '/Scripts/app2/partials/lists.html', controller: 'ListsCtrl' } );
            $routeProvider.when( '/login', { templateUrl: '/Scripts/app2/partials/login.html', controller: 'LoginCtrl' } );
            $routeProvider.when( '/register', { templateUrl: '/Scripts/app2/partials/register.html', controller: 'RegisterCtrl' } );
            $routeProvider.otherwise( { redirectTo: '/login' } );

        }
    ] )

    //#region Advanced: Interceptor

    // Add an interceptor around HTTP responses that checks for 401 responses and broadcasts event:loginRequired if the resource was locked

    .config( [
        "$httpProvider", function( $httpProvider ) {
            var interceptor = [
                '$rootScope', '$q', function( $rootScope, $q ) {

                    function success( response ) {
                        return response;
                    }

                    function error( response ) {
                        if ( response.status === 401 ) {
                            var deferred = $q.defer();
                            $rootScope.$broadcast( 'event:loginRequired' );
                            return deferred.promise;
                        }
                        return $q.reject( response );
                    }

                    return function( promise ) {
                        return promise.then( success, error );
                    };
                }
            ];
            $httpProvider.responseInterceptors.push( interceptor );
        }
    ] );

    //#endregion

//#region Intermediate: Event listening/Session handling

// Start the app, and register application-wide event listeners
application.run( ['$rootScope', '$location', '$http', '$cookies', function ( $rootScope, $location, $http, $cookies ) {

    //*******************
    // Scope
    //*******************

    // Set session-handling functions on root scope, which we can reach from any child scope
    $rootScope.logout = logout;
    $rootScope.isLoggedIn = isLoggedIn;

    // When event:loginRequired is fired, redirect the app to the login view
    $rootScope.$on( 'event:loginRequired', function ( event ) {
        return $location.path('/login');
    });

    //*******************
    // Public
    //*******************

    function logout() {
        $http.get("/user/logout").success(function () {
            $location.path('/login');
        });
    }

    function isLoggedIn() {
        return $cookies.hasOwnProperty(".ASPXAUTH");
    }
}] );

//#endregion