'use string';
(function(){

function CodingCodeListCtrl(
	$stateParams,
	$scope,
	CodeScheme,
	Code
	) {

	var vm = this;

	vm.codeSchemes = CodeScheme.query();
	vm.codes = [];


	vm.codeSchemes.$promise.then(function(data){
		data.results.forEach(function(d){
			Array.prototype.push.apply(vm.codes, data.code_set);	
		});
		
	})

}
CodingCodeListCtrl.$inject = ['$stateParams', '$scope', CodeScheme, Code];




angular.module('coding.coding')
	.controller('CodingCodeListCtrl', CodingCodeListCtrl)


})();