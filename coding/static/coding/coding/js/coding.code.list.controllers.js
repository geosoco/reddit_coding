'use string';
(function(){

function CodingCodeListCtrl(
	$stateParams,
	$scope,
	$rootScope,
	CodeScheme,
	Code
	) {

	var vm = this;

	vm.codeSchemes = CodeScheme.query();
	vm.codes = [];
	vm.codeinput = "";


	vm.codeSchemes.$promise.then(function(data){
		data.results.forEach(function(d){
			Array.prototype.push.apply(vm.codes, d.code_set);	
		});
		
	});


	vm.filterAny = function(value, index, array) {
		if(value && value.name) {
			return value.name.toLowerCase().indexOf(vm.codeinput) >= 0;	
		}
		return false;
	}

	vm.addCode = function(code) {
		console.log(code);
	}

	vm.toggleCode = function($event, code) {
		$rootScope.$emit("code:toggle", code);
		$event.stopPropagation();
		$event.preventDefault();
	}

}
CodingCodeListCtrl.$inject = ["$stateParams", "$scope", "$rootScope", "CodeScheme", "Code"];




angular.module("coding.coding")
	.controller("CodingCodeListCtrl", CodingCodeListCtrl)


})();