angular.module('welcomeRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/welcome/init', {
			templateUrl: 'client/views/pages/index.html',
			controller: 'welcomeController',
			controllerAs: 'welcome'
		})
		.when('/welcome/r0', {
			templateUrl: 'client/views/pages/question-0.html',
			controller: 'q0Controller',
			controllerAs: 'q0'
		})
		.when('/welcome/r1', {
			templateUrl: 'client/views/pages/question-1.html',
			controller: 'q1Controller',
			controllerAs: 'q1'
		})
		.when('/welcome/r2', {
			templateUrl: 'client/views/pages/question-2.html',
			controller: 'q2Controller',
			controllerAs: 'q2'
		})
		.when('/welcome/r3', {
			templateUrl: 'client/views/pages/question-3.html',
			controller: 'q3Controller',
			controllerAs: 'q3'
		})
		.when('/welcome/r4', {
			templateUrl: 'client/views/pages/question-4.html',
			controller: 'q4Controller',
			controllerAs: 'q4'
		})
		.when('/welcome/standBy', {
			templateUrl: 'client/views/pages/standBy.html',
			controller: 'standByController',
			controllerAs: 'standBy'
		})
		.when('/welcome/thanks', {
			templateUrl: 'client/views/pages/thanks.html',
			controller: 'thanksController',
			controllerAs: 'thanks'
		})

		$locationProvider.html5Mode(true);
});