// nota: controlar si al refrescar la encuesta esta lanzada y recuperar el estado del admin

// Init admin socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

ws.onopen = function() {
    ws.domain = 'titan';
    // identify
    ws.send(JSON.stringify({
        admin: 'admin'
    }));

    // keep socket alive
    var alive = setInterval(function() {

        ws.send(JSON.stringify({
            type: 'alive'
        }))
    }, 110000);
};

var pollResults = {

    r0: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r1: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r2: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r3: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r4: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r5: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r6: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r7: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    },
    r8: {
        rating0: 0,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0
    }
};

var currentQVotes = {
    rating0: 0,
    rating1: 0,
    rating2: 0,
    rating3: 0,
    rating4: 0,
    getTotalVotes: function() {
        var total = this.rating0 + this.rating1 + this.rating2 + this.rating3 + this.rating4;
        return (total < 10) ? '0' + total : total;
    },
    getVotePercentage: function(star) {

        return Math.round((this[star] / parseInt(this.getTotalVotes(), 10)) * 100) || 0;
    },
    getTotalVotesPercentage: function() {
        return Math.round((parseInt(this.getTotalVotes(), 10) / parseInt(usersConnected, 10)) * 100) || 0;
    },
    getAverageVotes: function() {

        return Math.round((this.rating0 * 1 + this.rating1 * 2 + this.rating2 * 3 + this.rating3 * 4 + this.rating4 * 5) / parseInt(this.getTotalVotes(), 10) * 100) / 100 || 0;
    },
    getAverageRepCircle: function() {
        return Math.round(this.getAverageVotes() * 20);
    }
};

Object.defineProperties(currentQVotes, {
    getTotalVotes: {
        enumerable: false,
        writable: false
    },
    getVotePercentage: {
        enumerable: false,
        writable: false
    },
    getTotalVotesPercentage: {
        enumerable: false,
        writable: false
    },
    getAverageVotes: {
        enumerable: false,
        writable: false
    },
    getAverageRepCircle: {
        enumerable: false,
        writable: false
    }
})

var usersConnected = 0;
var started = false;

angular.module('adminApp', ['adminRoutes', 'LiveFeedbackService'])
    .controller('mainController', function($scope, $location, $q, $timeout, LiveFeedback) {
        var vm = this;

        // socket listeners


        ws.onmessage = function(event) {

            var data = JSON.parse(event.data);
            switch (data.type) {
                case 'connected':
                    if (!!document.getElementById('pings')) {
                        usersConnected = data.value;
                        document.getElementById('pings').innerHTML = (data.value < 10) ? '0' + data.value : data.value;
                    }
                    break;
                case 'poll':
                    vm.pollResults[data.results][data.index] += parseInt(data.value, 10);
                    vm.currentQVotes[data.index] += parseInt(data.value, 10);

                    $scope.$apply();
                    break;
                case 'update':
                    if (data.current) {

                        pollResults = data;

                        currentQVotes.rating0 = data[data.current].rating0;
                        currentQVotes.rating1 = data[data.current].rating1;
                        currentQVotes.rating2 = data[data.current].rating2;
                        currentQVotes.rating3 = data[data.current].rating3;
                        currentQVotes.rating4 = data[data.current].rating4;
                    }
                    break;
                default:
                    break;
            }
        };

        // get DB and update current votes
        $q.all([LiveFeedback.getPollResults()]).then(function(data) {
            data = data[0].data
            data.forEach(function(qData) {
                pollResults[qData.q_id].rating0 = qData.oneStar;
                pollResults[qData.q_id].rating1 = qData.twoStar;
                pollResults[qData.q_id].rating2 = qData.threeStar;
                pollResults[qData.q_id].rating3 = qData.fourStar;
                pollResults[qData.q_id].rating4 = qData.fiveStar;
            });

        }).then(function() {
            // init current votes
            for (star in pollResults.r0) {
                currentQVotes[star] = pollResults.r0[star];
            }
        });

        // init variables
        vm.results = {
            r0: true,
            r1: false,
            r2: false,
            r3: false,
            r4: false,
            r5: false,
            r6: false,
            r7: false,
            r8: false
        };
        vm.started = started;
        vm.literals = {
            main: 'Valora la demo del programa',
            r0: '"Venta Digital"',
            r1: '"DBI"',
            r2: '"Alta y Contratación"',
            r3: '"MOOM"',
            r4: '"Feedback"',
            r5: '"SDM"',
            r6: '"Digital Payments"',
            r7: '"CARE"',
            r8: '"Mobile Channel"'
        };
        vm.questionHeader = vm.literals.r0;
        vm.pollResults = pollResults;
        vm.questionActive = 'r0';
        vm.currentQVotes = currentQVotes;

        vm.disabled = "disabled";

        vm.showQuestionResults = function(rId) {
            for (r in vm.results) {
                vm.results[r] = false;
            }
            vm.results[rId] = true;

            vm.questionHeader = vm.literals[rId];
            vm.questionActive = rId;
            for (starIndex in vm.currentQVotes) {

                // the methods in currentQVotes are set to non enumerable
                vm.currentQVotes[starIndex] = vm.pollResults[rId][starIndex];
            }
        };

        vm.startPoll = function($event) {
            if ($location.path() === '/results') {
                return;
            }
            if (!vm.started) {

                for (r in vm.results) {
                    if (vm.results[r] === true) {

                        ws.send(JSON.stringify({
                            type: 'nextQuestion',
                            href: '/welcome/' + r,
                            qId: r,
                            literal: vm.literals[r],
                            main: vm.literals.main
                        }));
                        vm.started = true;
                    }
                }
            }
        };
        vm.stopPoll = function($event) {

            if (vm.started) {

                ws.send(JSON.stringify({
                    type: 'standBy',
                    href: ''
                }));
                vm.started = false;

                var data = {
                    'poll_id': 'demopi4',
                    'q_id': vm.questionActive,
                    'oneStar': currentQVotes.rating0,
                    'twoStar': currentQVotes.rating1,
                    'threeStar': currentQVotes.rating2,
                    'fourStar': currentQVotes.rating3,
                    'fiveStar': currentQVotes.rating4,
                    'total_votes': currentQVotes.getTotalVotes(),
                    'total_connected': usersConnected,
                    'percentage_share': currentQVotes.getTotalVotesPercentage(),
                    'average_votes': currentQVotes.getAverageVotes()
                };
                LiveFeedback.saveQuestionResults(JSON.stringify(data));
            }
        };

        vm.refreshConnections = function() {
            if ($location.path() === '/results') {
                return;
            }
            ws.send(JSON.stringify({
                type: 'reconnect'
            }));
        };
    })
    .directive('pollstar', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            link: function($scope, element, attributes) {
                $scope.myclass = attributes.myclass;
                $scope.myvalue = attributes.myvalue;
                $scope.myvotes = attributes.myvotes;
                attributes.$observe('myvotes', function(value) {

                    $scope.myvotes = (value < 10 || value < 0) ? '0' + value : value;
                });
                attributes.$observe('myvalue', function(value) {

                    $scope.myvalue = value;
                });
                $scope.$watch(attributes.myvotes, function(value) {

                })
            },
            controller: function($scope, $element) {},
            template:   '<li>' +
                            '<svg width="8em" height="8em" class="chart">' +
                                '<circle r="3.9em" cx="4em" cy="4em" stroke="#2d3e50" fill="none" stroke-width=".15em" class="background" />' +
                                '<circle r="3.8em" cx="4em" cy="4em" stroke="rgba(47,130,184,0.5)" fill="none" stroke-width=".375em" ' +
                                'aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{myvalue}}" role="progressbar" />' +
                                '<g transform="rotate(90 64 64) translate(40 40)">' +
                                    '<path fill="rgba(255,255,255,.3)" class="st0" d="M28,18.7c0.3,0.6,0.9,1,1.6,1.1l9,1.3l6.4-2.1c-0.2-0.7-0.9-1.3-1.7-1.4l-12.1-1.8L25.8,5 c-0.3-0.7-1.1-1.1-1.9-1.1l0,0v6.7l0,0L28,18.7z" />' +
                                    '<path fill="rgba(255,255,255,.3)" class="st1" d="M32.1,27.5c-0.5,0.5-0.7,1.2-0.6,1.8l1.5,9l4,5.4c0.6-0.5,1-1.2,0.8-2l-2.1-12l8.7-8.5 c0.6-0.5,0.8-1.4,0.5-2.1l0,0l-6.4,2.1l0,0L32.1,27.5z" />' +
                                    '<path fill="rgba(255,255,255,.3)" class="st2" d="M25,34.1c-0.6-0.3-1.3-0.3-1.9,0L15,38.3l-4,5.4c0.6,0.5,1.5,0.5,2.2,0.2L24,38.3l10.8,5.7 c0.7,0.4,1.5,0.3,2.2-0.2l0,0l-4-5.4l0,0L25,34.1z" />' +
                                    '<path fill="rgba(255,255,255,.3)" class="st3" d="M16.5,29.4c0.1-0.7-0.1-1.3-0.6-1.8l-6.5-6.4L3,19.1c-0.2,0.7,0,1.6,0.5,2.1l8.7,8.5l-2.1,12 c-0.1,0.8,0.2,1.6,0.8,2l0,0l4-5.4l0,0L16.5,29.4z" />' +
                                    '<path fill="rgba(255,255,255,.3)" class="st4" d="M18.4,19.9c0.7-0.1,1.3-0.5,1.6-1.1l4-8.2V3.8c-0.8,0-1.5,0.4-1.9,1.1l-5.4,11L4.7,17.7 c-0.8,0.1-1.4,0.7-1.7,1.4l0,0l6.4,2.1l0,0L18.4,19.9z" />' +
                                '</g>' +
                            '</svg>' +
                        '</li>',

            replace: true
        };
    });

angular.module('LiveFeedbackService', [])

.factory('LiveFeedback', function($http, $q, $timeout) {

    var _LFFactory = {};

    _LFFactory.saveQuestionResults = function(data) {
        return $http.put('/api/votaciones', data);
    };

    _LFFactory.getPollResults = function() {
        return $http.get('/api/votaciones');
    };

    _LFFactory.getQuestionResults = function(id) {
        return $http.get('/api/votaciones/' + id);
    };

    _LFFactory.saveTotalVotes = function(data) {
        return $http.put('/api/totales', data);
    };

    _LFFactory.getCurrentQVotes = function(data) {
        var deferred = $q.defer();

        $timeout(function() {
            deferred.resolve(currentQVotes);
        }, 2000);
        return deferred.promise;
    };

    return _LFFactory;

});