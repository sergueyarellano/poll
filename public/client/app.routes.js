angular.module('welcomeRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/welcome/init', {
            templateUrl: 'client/views/pages/standBy.html',
            controller: 'welcomeController',
            controllerAs: 'welcome'
        })
        .when('/welcome/r0', {
            templateUrl: 'client/views/pages/question-0.html',
            controller: 'q0Controller',
            controllerAs: 'q0'
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
        })
        .when('/welcome/commentText', {
            templateUrl: 'client/views/pages/commentText.html',
            controller: 'commentTextController',
            controllerAs: 'commentText'
        })

    $locationProvider.html5Mode(true);
});