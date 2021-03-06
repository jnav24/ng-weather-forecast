var weatherApp = angular.module('weatherApp', ['ngResource', 'ngRoute']);

weatherApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeController'
		})
		.when('/forecast', {
			templateUrl: 'pages/forecast.html',
			controller: 'forecastController'
		})
		.when('/forecast/:days', {
			templateUrl: 'pages/forecast.html',
			controller: 'forecastController'
		})
});

weatherApp.service('cityService', function() {
	this.city = "Miami, FL";
});

weatherApp.directive('searchResults', function() {
	return {
		replace: true,
		restrict: 'E',
		templateUrl: 'templates/results.html',
		scope: {
			convertToStandard: "&",
			convertToDate: "&",
			dateFormat: "@",
			weatherDay: "="
		}
	};
});

weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {
	$scope.city = cityService.city;
	$scope.$watch('city', function() {
		cityService.city = $scope.city;
	});
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', 'cityService', '$routeParams', function($scope, $resource, cityService, $routeParams) {
	$scope.days = ($routeParams.days || 1);
	$scope.city = cityService.city;
	$scope.weatherApi = $resource("http://api.openweathermap.org/data/2.5/forecast", 
		{ callback: "JSON_CALLBACK" },
		{ get: {method: "JSONP"}});
	$scope.weatherResult = $scope.weatherApi.get({ q: $scope.city, appid: weather_api_key, cnt: ($scope.days* 8) });

	$scope.convertToFahrenheit = function(degK) {
		return Math.round( (1.8*(degK-273)+32) );
	};

	$scope.convertToDate = function(dt) {
		return new Date(dt*1000);
	};

	console.log($scope.weatherApi);
	console.log($scope.weatherResult);
	console.log($scope.days);
}]);