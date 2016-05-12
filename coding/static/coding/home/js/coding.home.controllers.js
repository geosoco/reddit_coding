(function(){
'use strict';

angular.module('coding.home')
	.controller('CodingHomeCtrl', CodingHomeCtrl);


CodingHomeCtrl.$inject = ['$scope', '$location', 'Assignment'];
function CodingHomeCtrl($scope, $location, Assignment) {
	var vm = this;

	vm.assignments = Assignment.query();

}




})();