(function(){
"use strict";

angular.module("coding.assignment")
	.controller("AssignmentHomeCtrl", AssignmentHomeCtrl)
	.controller("AssignmentCreateCtrl", AssignmentCreateCtrl);


AssignmentHomeCtrl.$inject = ["$scope", "$location", "Assignment"];
function AssignmentHomeCtrl($scope, $location, Assignment) {
	var vm = this;


}



AssignmentCreateCtrl.$inject = ["$scope", "$location", "$q", "Assignment", "CodeScheme", "SysUser"]
function AssignmentCreateCtrl($scope, $location, $q, Assignment, CodeScheme, SysUser) {
	var vm = this;

	vm.assignment = new Assignment();
	vm.codeSchemes = CodeScheme.query();
	vm.users = SysUser.query();
	vm.coders = [];
	vm.errors = {};

	$q.all([vm.codeSchemes.$promise, vm.users.$promise])
		.then(loadingFinished)
		.catch(loadingError);

	vm.submit = submit;
	vm.fieldHasError = fieldHasError;


	////////////////////////////

	function loadingFinished(data) {
		if(vm.codeSchemes.length > 0) {
			vm.assignment.codeSchemes = [vm.codeSchemes[0].id];	
		}
		
		if(vm.coders.length > 0) {
			vm.coders = [vm.coders[0].id];
		}

	}

	function loadingError(err) {
		console.error("failed to load data:" + err)
	}

	function fieldHasError(fieldName) {
		return vm.errors ? fieldName in vm.errors : false;
	}

	function submit($event) {
		// reset our error and success statuses
		vm.success = null;
		vm.errors = null;

		//
		var tmp_list = vm.assignment.assigned_comments;
		var list = vm.assignment.assigned_comments.replace(/\n/gi, ",")
		vm.assignment.assigned_comments = list.split(",");

		vm.assignment.assigned_submissions = [];

		vm.assignment.$save()
			.then(function (data){
				console.log("successful save");
				vm.success = data;
			})
			.catch(function(err, data){
				console.error("failed to save: " + err);
				console.dir(err);
				vm.errors = err.data;
			})
			.finally(function(data){
				vm.assignment.assigned_comments = tmp_list;
			})

	}

}


})();

