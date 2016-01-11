// Init admin socket interface
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

var pollResults = {
	
	r0:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r1:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r2:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r3:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r4:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r5:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r6:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r7:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0},
	r8:{oneStar:0, twoStar:0, threeStar:0, fourStar:0, fiveStar:0}
};

var questionResults = {
	oneStar: 0, 
	twoStar:0, 
	threeStar:0, 
	fourStar:0, 
	fiveStar: 0,
	getTotal: function() {
	 return this.oneStar + this.twoStar + this.threeStar + this.fourStar + this.fiveStar;
	},
	getStarPercentage: function(star) {

		return Math.round((this[star] / this.getTotal())*100) || 0;
	}
};

angular.module('adminApp',['adminRoutes'])
	.controller('mainController', function($scope) {
		var vm = this;

		vm.results = {r0:true,r1:false,r2:false,r3:false,r4:false};
		vm.started = false;
		vm.literals = {r0:'Question 1 stats',r1:'Question 2 stats',r2:'Question 3 stats',r3:'Question 4 stats',r4:'Question 5 stats'};
		vm.questionHeader = vm.literals.r0;
		vm.pollState = 'Pulsa Start para comenzar con la votacion';
		vm.pollResults = pollResults;
		vm.questionActive = 'r0';
		vm.questionResults = questionResults;

		ws.onmessage = function (event) {

			var data = JSON.parse(event.data);

			switch (data.type) {
				case 'connected':
					if (!!document.getElementById('pings')) {
						document.getElementById('pings').innerHTML = data.value;
					}
					break;
				case 'poll':
					vm.pollResults[data.results][data.index] += parseInt(data.value,10);
					vm.questionResults[data.index] += parseInt(data.value,10);
					$scope.$apply();
					break;
				default:
					break;
			}
		}

		vm.showQuestionResults = function(rId) {
			for (r in vm.results) {
				vm.results[r] = false;
			}
			vm.results[rId] = true;

			vm.questionHeader = vm.literals[rId];
			vm.questionActive = rId;
			for (starIndex in vm.questionResults) {
				if (!starIndex.startsWith('get')) {
					vm.questionResults[starIndex] = vm.pollResults[rId][starIndex];
				}
			}
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
	      		$scope.myvotes = attributes.myvotes;
	      		attributes.$observe('myvotes', function(value){

                $scope.myvotes = value;
            });
	      		attributes.$observe('myvalue', function(value){

                $scope.myvalue = value;
            });
            $scope.$watch(attributes.myvotes, function(value) {

            })
	      },
	      controller: function($scope, $element) {},
	      template:
	       	'<li><div class="{{myclass}}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{myvalue}}" role="progressbar">' +
					'<span class="left-mask">' +
					'<span class="circle"></span>' +
					'</span>' +
					'<span class="right-mask">' +
					'<span class="circle"></span>' +
					'</span>' +
					'<div class="circle icon star"></div>' +
					'</div>' +
					'<span class="{{myclass}}-value">{{myvotes}}</span></li>',
	      replace: true
	    };
	});

