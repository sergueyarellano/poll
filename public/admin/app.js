// Init admin socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
var totalVotes = {results0:0,results1:0,results2:0,results3:0,results4:0};
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
			totalVotes[data.results] += 1;
			console.log(totalVotes); 
			var val = document.getElementById(data.results.toString()).children[data.index].innerHTML;
			val = parseInt(val) + parseInt(data.value);
			document.getElementById(data.results.toString()).children[data.index].innerHTML = val;
			break;
		default:
			break;
	}
}

var pollResults = {
	r0: {oneStar: 1, twoStar:0, threeStar:0, fourStar:0, fiveStar: 0},
	r1: {oneStar: 0, twoStar:0, threeStar:0, fourStar:0, fiveStar: 0},
	r2: {oneStar: 0, twoStar:0, threeStar:0, fourStar:0, fiveStar: 0},
	r3: {oneStar: 0, twoStar:0, threeStar:0, fourStar:0, fiveStar: 0},
	r4: {oneStar: 0, twoStar:0, threeStar:0, fourStar:0, fiveStar: 0},
	value: function(r) {
		return this.r.oneStar
	}
}

angular.module('adminApp',['adminRoutes'])
	.controller('mainController', function() {
		var vm = this;
		vm.pollResults = pollResults;
		vm.results = {r0:true,r1:false,r2:false,r3:false,r4:false};
		vm.started = false;
		vm.pollState = 'Pulsa Start para comenzar con la votacion';
		vm.showPoll = function(_r) {

			for (r in vm.results) {
				vm.results[r] = false;
			}

			vm.results[_r] = true;
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
	})
	.directive('pollstar', function() {
	  	return {
	      restrict: 'E',
	      transclude: true,
	      scope: {},
	      link: function($scope, element, attributes){
	      		$scope.myclass = attributes.myclass;
	      		$scope.myvalue = attributes.myvalue;

	      },
	      controller: function($scope, $element) {},
	      template:
	       	'<div class="{{myclass}}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{myvalue}}" role="progressbar">' +
					'<span class="left-mask">' +
					'<span class="circle"></span>' +
					'</span>' +
					'<span class="right-mask">' +
					'<span class="circle"></span>' +
					'</span>' +
					'<div class="circle icon star"></div>' +
					'</div>',
	      replace: true
	    };
	});

