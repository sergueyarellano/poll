var questions = {
    q0: {
        title: 'Valora la demo del programa "Venta Digital"'
    },
    q1: {
        title: 'Valora la demo del programa "DBI"'
    },
    q2: {
        title: 'Valora la demo del programa "Alta y Contratación"'
    },
    q3: {
        title: 'Valora la demo del programa "MOOM"'
    },
    q4: {
        title: 'Valora la demo del programa "Feedback"'
    },
    q5: {
        title: 'Valora la demo del programa "SDM"'
    },
    q6: {
        title: 'Valora la demo del programa "Digital Payments"'
    },
    q7: {
        title: 'Valora la demo del programa "CARE"'
    },
    q8: {
        title: 'Valora la demo del "Mobile Channel"'
    },
    currentQuestion: ''
}
var savedVote = {
    r0: {
        href: '',
        value: 0,
        send: false
    },
    r1: {
        href: '',
        value: 0,
        send: false
    },
    r2: {
        href: '',
        value: 0,
        send: false
    },
    r3: {
        href: '',
        value: 0,
        send: false
    },
    r4: {
        href: '',
        value: 0,
        send: false
    },
    r5: {
        href: '',
        value: 0,
        send: false
    },
    r6: {
        href: '',
        value: 0,
        send: false
    },
    r7: {
        href: '',
        value: 0,
        send: false
    },
    r8: {
        href: '',
        value: 0,
        send: false
    },
    type: '',
    currentTarget: 'r0'
};

// Init client socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
var clientInfo;
var nextQuestion;

angular.module('welcomeApp', ['welcomeRoutes', 'LiveFeedbackService'])

.controller('mainController', function($scope, $location, $q, LiveFeedback) {
    var vm = this;

    ws.onmessage = function(event) {

        var data = JSON.parse(event.data);

        switch (data.type) {
            case 'nextQuestion':
                nextQuestion = data;
                if (savedVote[data.qId].href === data.href && savedVote[data.qId].value === 1) {
                    $location.path('/welcome/voted');
                } else {
                    savedVote.currentTarget = data.qId;
                    savedVote[data.qId].send = false;
                    $location.path('/welcome/r0');
                }
                vm.applyThings();
                break;
            case 'standBy':
                $location.path('/welcome/standBy');
                vm.applyThings();
                break;

            case 'reconnect':
                window.location.href = '/welcome/init';
                break;
            case 'connected':
                if (!!document.querySelector('#pings p')) {

                    document.querySelector('#pings p').innerHTML = data.value;
                }
                break;
            case 'address':
                $q.all([LiveFeedback.getRegistry(data.ip)]).then(function(data) {
                    clientInfo = data[0];
                });
                break;
            default:
                break;
        }
    };
    vm.applyThings = function() {

        $scope.$apply();
    }
    vm.savePoll = function($event) {

        savedVote[nextQuestion.qId] = {
            type: 'poll',
            results: nextQuestion.qId,
            index: $event.target.htmlFor,
            value: 1,
            href: $location.path(),
            send: true
        };
        savedVote.currentTarget = nextQuestion.qId;
    }

    // $scope.$apply();
    vm.sendPoll = function() {

        // if client has voted before, redirect to standby
        if (clientInfo.data.votes[savedVote.currentTarget] === 0) {

            if (savedVote[savedVote.currentTarget].send) {
                ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
                var data = {
                    ip: clientInfo.data.ip
                }
                data[nextQuestion.qId] = 1;

                // save vote
                LiveFeedback.saveVote(data);

                $location.path('/welcome/selectComment');
            }
        } else {
            $location.path('/welcome/standBy');
        }

    }
    vm.changeVote = function() {
        savedVote[savedVote.currentTarget].value = -1;
        ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
        $location.path(savedVote[savedVote.currentTarget].href);
        // vm.applyThings();
    }
    vm.goToVoted = function() {
        $location.path('/welcome/voted');
    }
})
    .controller('welcomeController', function() {
        var vm = this;

        vm.q0 = nextQuestion.literal;
    })
    .controller('q0Controller', function() {
        var vm = this;

        vm.q = nextQuestion.literal;
    })
    .controller('standByController', function() {
        var vm = this;

    })
    .controller('selectCommentController', function($location, LiveFeedback) {
        var vm = this;

        vm.q = nextQuestion.literal;
        vm.goToCommentText = function(type, literalSelect) {

            // initialize
            nextQuestion['stopDoing'] = false;
            nextQuestion['keepDoing'] = false;
            nextQuestion['suggestion'] = false;

            // assign
            nextQuestion['literalSelect'] = literalSelect;
            nextQuestion[type] = true;

            // redirect
            $location.path('/welcome/commentText');
        }
    })
    .controller('commentTextController', function($location, LiveFeedback) {
        var vm = this;
        vm.q = nextQuestion;
    })
    .controller('votedController', function() {
        var vm = this;

    })

angular.module('LiveFeedbackService', [])

.factory('LiveFeedback', function($http, $q, $timeout) {

    var _LFFactory = {};

    _LFFactory.getRegistry = function(ip) {
        return $http.get('/api/registro?ip=' + ip);
    };

    _LFFactory.saveVote = function(data) {
        return $http.put('/api/registro', data);
    };

    return _LFFactory;

});