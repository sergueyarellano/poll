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
			$location.path('/welcome/voted');
			LiveFeedback.saveVote(data);
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
	.controller('resultsController', function ($q, LiveFeedback) {
		var vm = this;

		vm.getTotalVotes = function (question, data) {
			return data.reduce(function (ac, e) {
				if (e.votes[question] !== 0) {
					return ac + 1;
				} else {
					return ac + 0;
				}

			}, 0)
		}
		vm.getAverageRating = function (question, data) {
			return data.reduce(function (ac, e) {
				return ac + e.votes[question];
			}, 0)
		}
		vm.getComments = function(question, data, commentType) {
			return data.reduce(function(ac, e) {
				if (e.comments && e.comments[question] && e.comments[question][commentType]) {
					console.log(e.comments[question][commentType])
					return ac + e.comments[question][commentType] + '...'
				} else {
					return ac;
				}
			}, '...')
		}

		$q.all([LiveFeedback.getRegistry()]).then(function (data) {
			console.log(vm.getTotalVotes('r0', data[0].data));
			vm.participationR0 = vm.getTotalVotes('r0', data[0].data);
			vm.participationR1 = vm.getTotalVotes('r1', data[0].data);
			vm.participationR2 = vm.getTotalVotes('r2', data[0].data);
			vm.participationR3 = vm.getTotalVotes('r3', data[0].data);
			vm.participationR4 = vm.getTotalVotes('r4', data[0].data);
			vm.participationR5 = vm.getTotalVotes('r5', data[0].data);
			vm.participationR6 = vm.getTotalVotes('r6', data[0].data);
			vm.participationR7 = vm.getTotalVotes('r7', data[0].data);
			vm.participationR8 = vm.getTotalVotes('r8', data[0].data);
			vm.averageRatingR0 = Math.round(vm.getAverageRating('r0', data[0].data) / vm.participationR0 *100) /100;
			vm.averageRatingR1 = Math.round(vm.getAverageRating('r1', data[0].data) / vm.participationR1 *100) /100;
			vm.averageRatingR2 = Math.round(vm.getAverageRating('r2', data[0].data) / vm.participationR2 *100) /100;
			vm.averageRatingR3 = Math.round(vm.getAverageRating('r3', data[0].data) / vm.participationR3 *100) /100;
			vm.averageRatingR4 = Math.round(vm.getAverageRating('r4', data[0].data) / vm.participationR4 *100) /100;
			vm.averageRatingR5 = Math.round(vm.getAverageRating('r5', data[0].data) / vm.participationR5 *100) /100;
			vm.averageRatingR6 = Math.round(vm.getAverageRating('r6', data[0].data) / vm.participationR6 *100) /100;
			vm.averageRatingR7 = Math.round(vm.getAverageRating('r7', data[0].data) / vm.participationR7 *100) /100;
			vm.averageRatingR8 = Math.round(vm.getAverageRating('r8', data[0].data) / vm.participationR8 *100) /100;
			vm.keepR0 = vm.getComments('r0', data[0].data, 'keepDoing');
			vm.keepR1 = vm.getComments('r1', data[0].data, 'keepDoing');
			vm.keepR2 = vm.getComments('r2', data[0].data, 'keepDoing');
			vm.keepR3 = vm.getComments('r3', data[0].data, 'keepDoing');
			vm.keepR4 = vm.getComments('r4', data[0].data, 'keepDoing');
			vm.keepR5 = vm.getComments('r5', data[0].data, 'keepDoing');
			vm.keepR6 = vm.getComments('r6', data[0].data, 'keepDoing');
			vm.keepR7 = vm.getComments('r7', data[0].data, 'keepDoing');
			vm.keepR8 = vm.getComments('r8', data[0].data, 'keepDoing');
			vm.stopR0 = vm.getComments('r0', data[0].data, 'stopDoing');
			vm.stopR1 = vm.getComments('r1', data[0].data, 'stopDoing');
			vm.stopR2 = vm.getComments('r2', data[0].data, 'stopDoing');
			vm.stopR3 = vm.getComments('r3', data[0].data, 'stopDoing');
			vm.stopR4 = vm.getComments('r4', data[0].data, 'stopDoing');
			vm.stopR5 = vm.getComments('r5', data[0].data, 'stopDoing');
			vm.stopR6 = vm.getComments('r6', data[0].data, 'stopDoing');
			vm.stopR7 = vm.getComments('r7', data[0].data, 'stopDoing');
			vm.stopR8 = vm.getComments('r8', data[0].data, 'stopDoing');
			vm.suggestR0 = vm.getComments('r0', data[0].data, 'suggestion');
			vm.suggestR1 = vm.getComments('r1', data[0].data, 'suggestion');
			vm.suggestR2 = vm.getComments('r2', data[0].data, 'suggestion');
			vm.suggestR3 = vm.getComments('r3', data[0].data, 'suggestion');
			vm.suggestR4 = vm.getComments('r4', data[0].data, 'suggestion');
			vm.suggestR5 = vm.getComments('r5', data[0].data, 'suggestion');
			vm.suggestR6 = vm.getComments('r6', data[0].data, 'suggestion');
			vm.suggestR7 = vm.getComments('r7', data[0].data, 'suggestion');
			vm.suggestR8 = vm.getComments('r8', data[0].data, 'suggestion');

		});
	})

angular.module('LiveFeedbackService', [])

.factory('LiveFeedback', function ($http, $q, $timeout) {

	var _LFFactory = {};

	_LFFactory.getRegistry = function (ip) {
		return $http.get('/api/registro?ip=all');
	};

	_LFFactory.saveVote = function (data) {
		return $http.put('/api/registro', data);
	};

	_LFFactory.postRegistry = function (data) {
		return $http.post('/api/registro', data);
	};

	return _LFFactory;

});