'use strict';
(function(){

function CodingHomeCtrl($scope, $location) {
	console.log("codinghomectrl !");
}
CodingHomeCtrl.$inject = ['$scope', '$location'];


angular.module('coding.home')
	.controller('CodingHomeCtrl', CodingHomeCtrl);

})();