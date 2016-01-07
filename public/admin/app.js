questions = {
	q1:{title:'Question one results', answerA:'barra graph Good',answerB:'barra graph Bad'},
	q2:{title:'Question two', answerA:'Better',answerB:'Worse'},
	q3:{title:'Question three', answerA:'Batman',answerB:'Robin'}
}

	var host = location.origin.replace(/^http/, 'ws');
	var ws = new WebSocket(host);

	ws.onmessage = function (event) {

		if (!!document.querySelector('#pings p')) {

			document.querySelector('#pings p').innerHTML = event.data;
		}
	}

angular.module('adminApp',['adminRoutes'])
	.controller('mainController', function() {
		var vm = this;

		vm.doClick = function() {
			console.log('clickado');

			ws.send('goToQuestion1');
		};
	})
	.controller('q1Controller', function() {
		var vm = this;

		vm.q1 = questions.q1;
	});
