questions = {
	q1:{title:'Question one, vote!', answerA:'vote Good',answerB:'vote Bad'},
	q2:{title:'Question two', answerA:'Better',answerB:'Worse'},
	q3:{title:'Question three', answerA:'Batman',answerB:'Robin'}
}

angular.module('welcomeApp',['welcomeRoutes'])
	.controller('mainController', function() {
		var vm = this;
	})

	.controller('q1Controller', function() {
		var vm = this;

		vm.q1 = questions.q1;
	});
