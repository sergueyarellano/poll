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

var storage = document.cookie.replace(/(?:(?:^|.*;\s*)LiveFeedbackClientId\s*\=\s*([^;]*).*$)|^.*$/, "$1");



angular.module('welcomeApp', ['welcomeRoutes', 'LiveFeedbackService'])

.controller('mainController', function ($scope, $location, $q, LiveFeedback) {
		var vm = this;

		vm.startClass = '';
		ws.onopen = function () {
			// if client does not have storage id, send a handshake
			if (!storage) {
				ws.send(JSON.stringify({
					type: 'handshake'
				})); // Send the message 'Ping' to the server
			} else {
				$q.all([LiveFeedback.getRegistry(storage)]).then(function (data) {
					clientInfo = data[0];
				});
			}
		};
		ws.onmessage = function (event) {

			var data = JSON.parse(event.data);

			switch (data.type) {
			case 'nextQuestion':
				nextQuestion = data;
				var currentVote = clientInfo && clientInfo.data[0].votes[nextQuestion.qId];
				if (currentVote !== 0) {
					var sv = savedVote[savedVote.currentTarget];
					// delete last vote and send it to the socket
					sv.href = data.href;
					sv.index = 'rating' + (currentVote - 1);
					sv.results = savedVote.currentTarget;
					sv.send = true;
					sv.type = 'poll';
					sv.value = -1;
					ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));

					$location.path('/welcome/r0');
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
			case 'handshake':
				document.cookie = 'LiveFeedbackClientId=' + data.clientId;
				$q.all([LiveFeedback.postRegistry({
					ip: data.clientId
				}), LiveFeedback.getRegistry(data.clientId)]).then(function (data) {
					clientInfo = data[1];
				})
				break;
			default:
				break;
			}
		};
		vm.applyThings = function () {

			$scope.$apply();
		}
		vm.savePoll = function ($event) {

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
		vm.sendPoll = function () {

			if (!clientInfo.data[0]) {
				document.cookie = 'LiveFeedbackClientId=';
				window.location.href = '/welcome/init';
			}
			//TODO: votes of undefined
			// if client has voted before, redirect to standby
			var currentVote = clientInfo.data[0].votes[savedVote.currentTarget]
			if (currentVote === 0) {

				if (savedVote[savedVote.currentTarget].send) {
					ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
					var data = {
						ip: clientInfo.data[0].ip
					}
					data[nextQuestion.qId] = parseInt(savedVote[nextQuestion.qId].index.slice(-1)) + 1;
					// save vote

					$location.path('/welcome/selectComment');
					LiveFeedback.saveVote(data);
				}
			} else {
				$location.path('/welcome/standBy');
			}

		}

		vm.addStartClass = function () {
			vm.startClass = 'start';
		}

		vm.goToVoted = function () {
			vm.startClass = '';
			$location.path('/welcome/voted');
		}
		vm.goToSelectComment = function () {
			$location.path('/welcome/selectComment');
		}
	})
	.controller('welcomeController', function () {
		var vm = this;

	})
	.controller('q0Controller', function () {
		var vm = this;
		vm.q = nextQuestion;

		vm.displayButton = function () {
			vm.class = 'active';

		}
	})
	.controller('standByController', function () {
		var vm = this;

	})
	.controller('selectCommentController', function ($location, LiveFeedback) {
		var vm = this;

		vm.q = nextQuestion;
		vm.goToCommentText = function (type, literalSelect) {

			// assign
			nextQuestion['literalSelect'] = literalSelect;
			nextQuestion['commentType'] = type;

			// redirect
			vm.startClass = '';
			$location.path('/welcome/commentText');
		}
	})
	.controller('commentTextController', function ($location, LiveFeedback) {
		var vm = this;
		vm.q = nextQuestion;
		vm.comment = '';

		vm.submitComment = function () {
			var data = {
				ip: clientInfo.data[0].ip,
				r: nextQuestion.qId,
				type: nextQuestion.commentType,
				comment: vm.comment
			}

			// submit comment
			LiveFeedback.saveVote(data);
			$location.path('/welcome/voted');
		}

	})
	.controller('votedController', function ($location, LiveFeedback) {
		var vm = this;

		vm.changeVote = function () {
			savedVote[savedVote.currentTarget].value = -1;

			ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
			// TODO: actualizar base de datos, a cero
			var dataChange = {
				ip: clientInfo.data[0].ip
			}

			dataChange[nextQuestion.qId] = 0;
			// submit comment
			LiveFeedback.saveVote(dataChange);

			vm.startClass = '';

			$location.path(savedVote[savedVote.currentTarget].href);
			// vm.applyThings();
		}
	})

angular.module('LiveFeedbackService', [])

.factory('LiveFeedback', function ($http, $q, $timeout) {

	var _LFFactory = {};

	_LFFactory.getRegistry = function (ip) {
		return $http.get('/api/registro?ip=' + ip);
	};

	_LFFactory.saveVote = function (data) {
		return $http.put('/api/registro', data);
	};

	_LFFactory.postRegistry = function (data) {
		return $http.post('/api/registro', data);
	};

	return _LFFactory;

});