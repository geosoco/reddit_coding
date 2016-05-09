'use string';
(function(){
	function codeInstance($compile) {
		return {
			restrict: 'E', 
			scope: { "instance": "=", "removeCode": "&" },
			transclude: true,
			templateUrl: '/static/coding/coding/tmpl/coding.codeinstance.html',
			controller: "CommentCodeInstanceCtrl as ccic",
			bindToController: true
		}
	}
	codeInstance.$inject = ['$compile'];


	function codeInstanceList($compile) {
		return {
			restrict: 'E', 
			scope: { "codeInstances": '=', "comment": '=' },
			transclude: true,
			controller: "CommentCodeInstanceListCtrl as ccilc",
			templateUrl: '/static/coding/coding/tmpl/coding.codeinstance.list.html',
			bindToController: true,
			link: function(scope, el, attrs, control) {
				var test = 4;
			}
		}
	}
	codeInstanceList.$inject = ['$compile'];


	angular.module("coding.coding")
		.directive("codeinstancelist", codeInstanceList)
		.directive("codeinstance", codeInstance)

})();