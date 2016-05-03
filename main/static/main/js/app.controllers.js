'use strict';
(function(){


function HeaderCtrl($scope, $location) {
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