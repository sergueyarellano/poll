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

			var val = document.getElementById(data.results.toString()).children[data.index].innerHTML;
			val = parseInt(val) + parseInt(data.value);
			document.getElementById(data.results.toString()).children[data.index].innerHTML = val;
			break;
		default:
			break;
	}
}

angular.module('adminApp',['adminRoutes'])
	.controller('mainController', function() {
		var vm = this;
		vm.results = {r0:false,r1:false,r2:false,r3:false,r4:false,}
		vm.startPoll = function($event,_r) {
			for (r in vm.results) {
				vm.results[r] = false;
			}
			vm.results[_r] = true;
			console.log(vm.results);

			ws.send(JSON.stringify({type:'nextQuestion',value:$event.target.htmlFor}));
		};
		vm.standBy = function() {
			ws.send(JSON.stringify({type:'standBy'}));
		}
	});

