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
	getTotalVotes: function() {
		var total = this.oneStar + this.twoStar + this.threeStar + this.fourStar + this.fiveStar;
		return (total < 10) ? '0' + total: total;
	},
	getVotePercentage: function(star) {

		return Math.round((this[star] / parseInt(this.getTotalVotes(), 10))*100) || 0;
	},
	getTotalVotesPercentage: function() {
		return Math.round((parseInt(this.getTotalVotes(), 10) / parseInt(usersConnected, 10))*100) || 0;
	}
};

var usersConnected = 0;
var started = false;

angular.module('adminApp',['adminRoutes','LiveFeedbackService'])
	.controller('mainController', function($scope, $location, LiveFeedback) {
		var vm = this;

		ws.onopen = function() {
			ws.send(JSON.stringify({admin:'admin'}));
		};

		vm.results = {r0:true,r1:false,r2:false,r3:false,r4:false,r5:false,r6:false,r7:false,r8:false};
		vm.started = started;
		vm.literals = {
			r0:'Valora la demo del programa "Venta Digital"',
			r1:'Valora la demo del programa "DBI"',
			r2:'Valora la demo del programa "Alta y Contratación"',
			r3:'Valora la demo del programa "MOOM"',
			r4:'Valora la demo del programa "Feedback"',
			r5:'Valora la demo del programa "SDM"',
			r6:'Valora la demo del programa "Digital Payments"',
			r7:'Valora la demo del programa "CARE"',
			r8:'Valora la demo del "Mobile Channel"'
		};
		vm.questionHeader = vm.literals.r0;
		vm.pollResults = pollResults;
		vm.questionActive = 'r0';
		vm.questionResults = questionResults;
		vm.disabled = "disabled";

		ws.onmessage = function (event) {

			var data = JSON.parse(event.data);
			switch (data.type) {
				case 'connected':
					if (!!document.getElementById('pings')) {
						usersConnected = data.value;
						document.getElementById('pings').innerHTML = (data.value < 10) ? '0' + data.value : data.value;
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

						ws.send(JSON.stringify({type:'nextQuestion', href: '/welcome/' + r, qId:r}));
						vm.started = true;
					}
				}
			}
		};
		vm.stopPoll = function($event) {

			if (vm.started) {

				ws.send(JSON.stringify({type:'standBy', href:''}));
				vm.started = false;

				var data = {
					'poll_id' : 'demopi3',
					'q_id' : vm.questionActive,
					'oneStar' : questionResults.oneStar,
					'twoStar' : questionResults.twoStar,
					'threeStar' : questionResults.threeStar,
					'fourStar' : questionResults.fourStar,
					'fiveStar' : questionResults.fiveStar
				};
				LiveFeedback.saveQuestionResults(JSON.stringify(data));

				data = {
					'poll_id' : 'demopi3',
					'total_votes' : vm.getTotalVotes,
   					'total_connected' : usersConnected,
   					'percentage_share' : vm.getTotalVotesPercentage
				};

				LiveFeedback.saveTotalVotes(JSON.stringify(data));

			}
		};

		vm.refreshConnections = function () {
			ws.send(JSON.stringify({type:'reconnect'}));
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

                $scope.myvotes = (value < 10 || value < 0) ? '0' + value : value;
            });
	      		attributes.$observe('myvalue', function(value){

                $scope.myvalue = value;
            });
            $scope.$watch(attributes.myvotes, function(value) {

            })
	      },
	      controller: function($scope, $element) {},
	      template:
	       	'<li>' +
	       		'<div class="{{myclass}}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{myvalue}}" role="progressbar">' +
				'<span class="left-mask">' +
				'<span class="circle"></span>' +
				'</span>' +
				'<span class="right-mask">' +
				'<span class="circle"></span>' +
				'</span>' +
				'<div class="circle icon star"></div>' +
				'</div>' +
				'<span class="{{myclass}}-value">{{myvotes}}</span>' +
			'</li>',
	      replace: true
	    };
	})

angular.module('LiveFeedbackService', [])

	.factory('LiveFeedback', function($http) {

		var _LFFactory = {};

		_LFFactory.saveQuestionResults = function(data) {
			console.log('el puto ',data);
			return $http.put('/api/votaciones', data);
		};

		_LFFactory.getPollResults = function() {
			return $http.get('/api/votaciones');
		};

		_LFFactory.getQuestionResults = function(id) {
			return $http.get('/api/votaciones/' + id);
		};

		_LFFactory.saveTotalVotes = function(data) {
			return $http.put('/api/totales', data);
		};

		return _LFFactory;

	});
