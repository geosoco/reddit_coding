'use strict';
(function(){


function HeaderCtrl($scope, $location) {
	var vm = this;

	this.user = $scope.$parent.$root.user;
	console.log("HeaderCtrl!");
}

HeaderCtrl.$inject = ['$scope', '$location'];


function CodingRootCtrl($scope) {
	var vm = this;

	
}
CodingRootCtrl.$inject = ['$scope'];


angular.module('coding.app')
	.controller('HeaderCtrl', HeaderCtrl)
	.controller('CodingRootCtrl', CodingRootCtrl);

})();