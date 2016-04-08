var questions = {
	q0:{title:'Valora la demo del programa "Venta Digital"'},
	q1:{title:'Valora la demo del programa "DBI"'},
	q2:{title:'Valora la demo del programa "Alta y Contratación"'},
	q3:{title:'Valora la demo del programa "MOOM"'},
	q4:{title:'Valora la demo del programa "Feedback"'},
	q5:{title:'Valora la demo del programa "SDM"'},
	q6:{title:'Valora la demo del programa "Digital Payments"'},
	q7:{title:'Valora la demo del programa "CARE"'},
	q8:{title:'Valora la demo del "Mobile Channel"'}
}
var savedVote = {r0:{href:'',value:0, send:false},r1:{href:'',value:0, send:false},r2:{href:'',value:0, send:false},r3:{href:'',value:0, send:false},r4:{href:'',value:0, send:false},r5:{href:'',value:0, send:false},r6:{href:'',value:0, send:false},r7:{href:'',value:0, send:false},r8:{href:'',value:0, send:false},type:'',currentTarget:'r0'};

// Init client socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

// listen to messages
angular.module('welcomeApp',['welcomeRoutes'])

	.controller('mainController', function($scope,$location) {
		var vm = this;

		ws.onmessage = function (event) {

			var data = JSON.parse(event.data);

			switch (data.type) {
				case 'nextQuestion':
					if (savedVote[data.qId].href === data.href && savedVote[data.qId].value === 1) {
						$location.path('/welcome/voted');
					} else {
						savedVote.currentTarget = data.qId;
						savedVote[data.qId].send = false;
						$location.path(data.href);
					}
						vm.applyThings();
					break;
				case 'standBy':
					$location.path('/welcome/standBy');
					vm.applyThings();
					break;

				case 'reconnect':
					console.log("entro");
					savedVote.currentTarget = '/welcome/init';
					window.location.href = savedVote.currentTarget;
					break;
				case 'connected':
					if (!!document.querySelector('#pings p')) {

						document.querySelector('#pings p').innerHTML = data.value;
					}
					break;
				default:
					break;
			}
		};
		vm.applyThings = function() {

			$scope.$apply();
		}
		vm.savePoll = function (results, starId) {

			savedVote[results] = {type:'poll',results:results, index:starId, value:1, href:$location.path(), send:true};
			savedVote.currentTarget = results;
			savedVote.select = true;
		}

		// $scope.$apply();
		vm.sendPoll = function () {

			if (savedVote[savedVote.currentTarget].send && savedVote.select) {

				ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
				$location.path('/welcome/selectComment');
			}

		}
		vm.changeVote = function() {
			savedVote[savedVote.currentTarget].value = -1;
			ws.send(JSON.stringify(savedVote[savedVote.currentTarget]));
			$location.path(savedVote[savedVote.currentTarget].href);
			savedVote.select = false;
		}

		vm.commentText = function () {
				$location.path('/welcome/commentText');
		}


	})
	.controller('welcomeController', function() {
		var vm = this;

		vm.q0 = questions.q0;
	})
	.controller('q0Controller', function() {
		var vm = this;

		vm.q0 = questions.q0;
	})
	.controller('q1Controller', function() {
		var vm = this;

		vm.q1 = questions.q1;
	})
	.controller('q2Controller', function() {
		var vm = this;

		vm.q2 = questions.q2;
	})
	.controller('q3Controller', function() {
		var vm = this;

		vm.q3 = questions.q3;
	})
	.controller('q4Controller', function() {
		var vm = this;

		vm.q4 = questions.q4;
	})
	.controller('q5Controller', function() {
		var vm = this;

		vm.q5 = questions.q5;
	})
	.controller('q6Controller', function() {
		var vm = this;

		vm.q6 = questions.q6;
	})
	.controller('q7Controller', function() {
		var vm = this;

		vm.q7 = questions.q7;
	})
	.controller('q8Controller', function() {
		var vm = this;

		vm.q8 = questions.q8;
	})
	.controller('standByController', function() {
		var vm = this;

	})
	.controller('thanksController', function() {
		var vm = this;
	})
	.controller('selectCommentController', function() {
		var vm = this;
	})
	.controller('commentTextController', function() {
		var vm = this;
	})
