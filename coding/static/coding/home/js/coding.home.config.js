'use string';
(function(){
	
	function CodingHomeConfig($stateProvider) {
		// temporary state provider stuff
		$stateProvider
			.state("coding.home", {
				url: "",
				controller: "CodingHomeCtrl as home",
				templateUrl: "/static/coding/home/tmpl/coding.home.html",
				onEnter: function() {
					console.log("entering codinghome")
				}
			});

	}

	CodingHomeConfig.$inject = [
		'$stateProvider'
	];


	angular
		.module('coding.home', [
			'ngAnimate',
			'ngResource',
			'ui.router',
			'toastr',
			'angularSpinner',
			'main.services',
			'main.submission',
			'main.comment',
			'coding.coding'
		])
		.config(CodingHomeConfig);

})();