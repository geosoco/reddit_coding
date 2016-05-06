'use string';
(function(){
	function codeInstance($compile) {
		return {
			restrict: 'E', 
			scope: { },
			transclude: true,
			templateUrl: '/static/coding/coding/tmpl/coding.codeinstance.html',
			controller: "CommentCodeInstanceCtrl as ctrl",
		}
	}
	codeInstance.$inject = ['$compile'];


	function codeInstanceList($compile) {
		return {
			restrict: 'E', 
			scope: { },
			transclude: true,
			templateUrl: '/static/coding/coding/tmpl/coding.codeinstance.list.html',
		}
	}
	codeInstanceList.$inject = ['$compile'];


	angular.module("coding.coding")
		.directive("codeinstancelist", codeInstanceList)
		.directive("codeinstance", codeInstance)

})();