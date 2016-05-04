'use strict';
(function(){


function HeaderCtrl($scope, $location) {
	var vm = this;

	this.user = $scope.$parent.$root.user;
	console.log("HeaderCtrl!");
}

HeaderCtrl.$inject = ['$scope', '$location'];


function HomeCtrl($scope, $location) {
	console.log("homectrl !");
}
HomeCtrl.$inject = ['$scope', '$location'];


angular.module('main.app')
	.controller('HeaderCtrl', HeaderCtrl)
	.controller('HomeCtrl', HomeCtrl);

})();