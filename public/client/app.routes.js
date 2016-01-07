angular.module('welcomeRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/welcome/init', {
			templateUrl: 'client/views/pages/index.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/welcome/q1', {
			templateUrl: 'client/views/pages/q1.html',
			controller: 'q1Controller',
			controllerAs: 'q1'
		});

		$locationProvider.html5Mode(true);
});