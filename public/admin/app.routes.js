angular.module('adminRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/admin/init', {
			templateUrl: 'admin/views/pages/index.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/results', {
			templateUrl: 'admin/views/pages/index.html',
			controller: 'mainController',
			controllerAs: 'main'
		});

		$locationProvider.html5Mode(true);
});