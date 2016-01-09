questions = {
	q0:{title:'Question one, vote!', answerA:'vote Good',answerB:'vote Bad'},
	q1:{title:'Question two, vote!', answerA:'vote Good',answerB:'vote Bad'},
	q2:{title:'Question three', answerA:'Better',answerB:'Worse'},
	q3:{title:'Question four, vote!', answerA:'vote Good',answerB:'vote Bad'},
	q4:{title:'Question five', answerA:'Batman',answerB:'Robin'}
}

// Init client socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

// listen to messages
ws.onmessage = function (event) {

		var data = JSON.parse(event.data);

		switch (data.type) {
			case 'nextQuestion':
				window.location.href = '/welcome/' + data.value;
				break;
			case 'standBy':
				window.location.href = '/welcome/standBy';
				break;
			case 'connected':
				if (!!document.querySelector('#pings p')) {

					document.querySelector('#pings p').innerHTML = data.value;
				}
				break;
			default:
				break;
		}
}

angular.module('welcomeApp',['welcomeRoutes'])
	.controller('mainController', function() {
		var vm = this;

		vm.sendPoll = function ($event, results, index) {
			ws.send(JSON.stringify({type:'poll',results:results, index:index, value:$event.target.value}));
		}
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
	.controller('standByController', function() {
		var vm = this;
	});