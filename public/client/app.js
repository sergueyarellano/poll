questions = {
	q1:{title:'Question one, vote!', answerA:'vote Good',answerB:'vote Bad'},
	q2:{title:'Question two', answerA:'Better',answerB:'Worse'},
	q3:{title:'Question three', answerA:'Batman',answerB:'Robin'}
}

// Init client socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

// listen to messages
ws.onmessage = function (event) {

		var data = JSON.parse(event.data);

		switch (data.type) {
			case 'nextQuestion':
				window.location.href = '/welcome/q1';
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

		vm.sendPoll = function ($event) {
			ws.send(JSON.stringify({type:'poll',id:$event.target.id, value:$event.target.value}));
		}
	})

	.controller('q1Controller', function() {
		var vm = this;

		vm.q1 = questions.q1;
	});
