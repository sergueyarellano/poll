// Init admin socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

// listen to messages
ws.onmessage = function (event) {

	var data = JSON.parse(event.data);

	switch (data.type) {
		case 'connected':
			if (!!document.getElementById('pings')) {

				document.getElementById('pings').innerHTML = data.value;
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
		vm.results = {r0:true,r1:false,r2:false,r3:false,r4:false};
		vm.started = false;
		vm.literals = {r0:'Question 1 stats',r1:'Question 2 stats',r2:'Question 3 stats',r3:'Question 4 stats',r4:'Question 5 stats'};
		vm.actualHeader = vm.literals.r0;
		vm.pollState = 'Pulsa Start para comenzar con la votacion';

		vm.showPoll = function(_r) {

			for (r in vm.results) {
				vm.results[r] = false;
			}

			vm.results[_r] = true;
			vm.actualHeader = vm.literals[_r];
		};
		vm.startPoll = function($event) {

			if (!vm.started) {

				for (r in vm.results) {
					if (vm.results[r] === true) {

						ws.send(JSON.stringify({type:'nextQuestion',value:r}));
						vm.pollState = 'La votacion ha comenzado :)';
						vm.started = true;
					}
				}
			}
		};
		vm.stopPoll = function($event) {

			if (vm.started) {

				ws.send(JSON.stringify({type:'standBy'}));
				vm.pollState = 'No hay ninguna votacion en curso :(';
				vm.started = false;
			}
		};
	});

