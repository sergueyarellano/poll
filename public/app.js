angular.module('welcomeApp',[])
	.controller('mainController', function() {
		var vm = this;

		vm.questions = {
			q1:{title:'Question one', answerA:'Good',answerB:'Bad'},
			q2:{title:'Question two', answerA:'Better',answerB:'Worse'},
			q3:{title:'Question three', answerA:'Batman',answerB:'Robin'}
		}

	})