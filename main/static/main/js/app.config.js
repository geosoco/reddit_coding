'use string';
(function(){
	
	function MainConfig(
		$resourceProvider,
		$httpProvider,
		$locationProvider,
		$stateProvider,
		$urlRouterProvider,
		toastrConfig,
		usSpinnerConfigProvider) {

			// do not strip trailing slashes
			$resourceProvider.defaults.stripTrailingSlashes = false;

			// initialize csrf
			$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
			$httpProvider.defaults.xsrfCookieName = 'csrftoken';

			// locprovider setup
			$locationProvider.html5Mode(false).hashPrefix('!');



			$urlRouterProvider.otherwise("/");


			// inititalize toastr settings
			angular.extend(toastrConfig, {
				timeOut: 5000,
				tapToDismiss: true,
				maxOpened: 6,
				closeButton: true
			});

			// spinner
			usSpinnerConfigProvider.setDefaults({width: 3, radius: 8, length: 6});


			// temporary state provider stuff
			$stateProvider
				.state("home", {
					url: "/",
					controller: "HomeCtrl as home",
					templateUrl: "/static/main/tmpl/home.html"
				});

	}

	MainConfig.$inject = [
		'$resourceProvider',
		'$httpProvider',
		'$locationProvider',
		'$stateProvider',
		'$urlRouterProvider',
		'toastrConfig',
		'usSpinnerConfigProvider'];


	angular
		.module('main.app')
		.config(MainConfig)
		.run(['$rootScope', '$state', 'SysUser', function($rootScope, $state, SysUser){

			$rootScope.user = SysUser.get({"current_user": "true"});



			$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
			  console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
			});

			$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
			  console.log('$stateChangeError - fired when an error occurs during transition.');
			  console.log(arguments);
			});

			$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
			  console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
			});

			$rootScope.$on('$viewContentLoaded',function(event){
			  console.log('$viewContentLoaded - fired after dom rendered',event);
			});

			$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
			  console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
			  console.log(unfoundState, fromState, fromParams);
			});			

			//$state.go("home");

		}]);


})();