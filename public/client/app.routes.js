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
		.when('/welcome/r5', {
			templateUrl: 'client/views/pages/question-5.html',
			controller: 'q5Controller',
			controllerAs: 'q5'
		})
		.when('/welcome/r6', {
			templateUrl: 'client/views/pages/question-6.html',
			controller: 'q6Controller',
			controllerAs: 'q6'
		})
		.when('/welcome/r7', {
			templateUrl: 'client/views/pages/question-7.html',
			controller: 'q7Controller',
			controllerAs: 'q7'
		})
		.when('/welcome/r8', {
			templateUrl: 'client/views/pages/question-8.html',
			controller: 'q8Controller',
			controllerAs: 'q8'
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
		.when('/welcome/voted', {
			templateUrl: 'client/views/pages/voted.html',
			controller: 'votedController',
			controllerAs: 'voted'
		})
		.when('/closedPoll', {
			templateUrl: 'client/views/pages/closedPoll.html',
			controller: 'closedPollController',
			controllerAs: 'closedPoll'
		})
		.when('/welcome/selectComment', {
			templateUrl: 'client/views/pages/selectComment.html',
			controller: 'selectCommentController',
			controllerAs: 'selectComment'
		}).when('/welcome/commentText', {
			templateUrl: 'client/views/pages/commentText.html',
			controller: 'commentTextController',
			controllerAs: 'commentText'
		})

		$locationProvider.html5Mode(true);
});
