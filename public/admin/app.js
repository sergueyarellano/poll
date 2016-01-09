questions = {
	q1:{title:'Question one results', answerA:'barra graph Good',answerB:'barra graph Bad'},
	q2:{title:'Question two', answerA:'Better',answerB:'Worse'},
	q3:{title:'Question three', answerA:'Batman',answerB:'Robin'}
}

// Init admin socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

// listen to messages
ws.onmessage = function (event) {

	var data = JSON.parse(event.data);

	switch (data.type) {
		case 'connected':
			if (!!document.querySelector('#pings p')) {

				document.querySelector('#pings p').innerHTML = data.value;
			}
			break;
		case 'poll':
			switch (data.id) {
				case 'one':
					var val = document.getElementById('val1').innerHTML;
					val = parseInt(val) + parseInt(data.value);
					document.getElementById('val1').innerHTML = val;
					break;
				case 'two':
					var val = document.getElementById('val2').innerHTML;
					val = parseInt(val) + parseInt(data.value);
					document.getElementById('val2').innerHTML = val;
					break;
				case 'three':
					var val = document.getElementById('val3').innerHTML;
					val = parseInt(val) + parseInt(data.value);
					document.getElementById('val3').innerHTML = val;
					break;
				case 'four':
					var val = document.getElementById('val4').innerHTML;
					val = parseInt(val) + parseInt(data.value);
					document.getElementById('val4').innerHTML = val;
					break;
				case 'five':
					var val = document.getElementById('val5').innerHTML;
					val = parseInt(val) + parseInt(data.value);
					document.getElementById('val5').innerHTML = val;
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
}

angular.module('adminApp',['adminRoutes'])
	.controller('mainController', function() {
		var vm = this;

		vm.doClick = function() {

			//send instruction to the server
			ws.send(JSON.stringify({type:'nextQuestion',value:'goToQuestion1'}));
		};
	})
	.controller('q1Controller', function() {
		var vm = this;

		vm.q1 = questions.q1;
	});
