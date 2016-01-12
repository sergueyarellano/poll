angular.module('adminRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/admin/init', {
			templateUrl: 'admin/views/pages/index.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/admin/q1', {
			templateUrl: 'admin/views/pages/q1.html',
			controller: 'q1Controller',
			controllerAs: 'q1'
		})
		.when('/results', {
			templateUrl: 'admin/views/pages/results.html'
		});

		$locationProvider.html5Mode(true);
});