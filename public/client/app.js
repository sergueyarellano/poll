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

var storage = document.cookie.replace(/(?:(?:^|.*;\s*)LiveFeedbackClientId\s*\=\s*([^;]*).*$)|^.*$/, "$1");



angular.module('welcomeApp', ['welcomeRoutes', 'LiveFeedbackService'])

.controller('mainController', function ($scope, $location, $q, LiveFeedback) {
		var vm = this;
		ws.onopen = function () {
			// if client does not have storage id, send a handshake
			if (!storage) {
				ws.send(JSON.stringify({
					type: 'handshake'
				})); // Send the message 'Ping' to the server
			} else {
				$q.all([LiveFeedback.getRegistry(storage)]).then(function (data) {
					console.log('getRegistry', data);
					clientInfo = data[0];
				});
			}
		};
		ws.onmessage = function (event) {

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
				console.log('address', data, nextQuestion);
				// $q.all([LiveFeedback.getRegistry(data.ip)]).then(function (data) {

				// 	clientInfo = data[0];
				// });
				break;
			case 'handshake':
				document.cookie = 'LiveFeedbackClientId=' + data.clientId;
				$q.all([LiveFeedback.postRegistry({ip:data.clientId}),LiveFeedback.getRegistry(data.clientId)]).then(function(data) {
					console.log('finally_my registry', data);
					clientInfo = data[0];
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
			// if client has voted before, redirect to standby
			console.log('clientInfo', clientInfo);
			if (clientInfo.data[0].votes[savedVote.currentTarget] === 0) {

				if (savedVote[savedVote.currentTarget].send) {
					ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
					var data = {
						ip: clientInfo.data[0].ip
					}
					data[nextQuestion.qId] = parseInt(savedVote[nextQuestion.qId].index.slice(-1)) + 1;
					console.log('data send poll', data);
					// save vote
					LiveFeedback.saveVote(data);

					$location.path('/welcome/selectComment');
				}
			} else {
				$location.path('/welcome/standBy');
			}

		}

		vm.goToVoted = function () {
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

		vm.q = nextQuestion.literal;
	})
	.controller('standByController', function () {
		var vm = this;

	})
	.controller('selectCommentController', function ($location, LiveFeedback) {
		var vm = this;

		vm.q = nextQuestion.literal;
		vm.goToCommentText = function (type, literalSelect) {

			// assign
			nextQuestion['literalSelect'] = literalSelect;
			nextQuestion['commentType'] = type;

			// redirect
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
			console.log('data changeVote', dataChange);
			// submit comment
			LiveFeedback.saveVote(dataChange);

			$location.path(savedVote[savedVote.currentTarget].href);
			// vm.applyThings();
		}
	})

angular.module('LiveFeedbackService', [])

.factory('LiveFeedback', function ($http, $q, $timeout) {

	var _LFFactory = {};

	_LFFactory.getRegistry = function (ip) {
		console.log('getRegistry', ip);
		return $http.get('/api/registro?ip=' + ip);
	};

	_LFFactory.saveVote = function (data) {
		console.log('factory', data)
		return $http.put('/api/registro', data);
	};

	_LFFactory.postRegistry = function (data) {
		return $http.post('/api/registro', data);
	};

	return _LFFactory;

});