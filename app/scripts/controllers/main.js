'use strict';

/**
 * @ngdoc function
 * @name rksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rksApp
 */
angular.module('rksApp')
  .controller('MainCtrl', ['$scope', '$http',  function ($scope,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=').success(function(data) {
    	$scope.dataset = data;
    	console.log('Data fetched');
    });

    $scope.selectedID = ':D';

    $scope.select = function(id){
    	console.log("id");
    	$scope.selectedID = id;
    };

    $scope.isSelected = function(id){
    	if (id == $scope.selectedID) {
    		console.log(id);
    		return true;
    	}else{
    		return false;
    	}
    };
    /*
    $scope.partifarg = function(parti){
    	console.log(parti);
    	switch(parti) {
    		case 'M':
    			return 'm';
    		case 'C':
    			return 'c';
    		case 'L':
    			return 'm';
    		case 'KD':
    			return 'm';
    		case 'MP':
    			return 'm';
    		case 'S':
    			return 'm';
    		case 'V':
    			return 'm';
    		case 'SD':
    			return 'm';    	}
};
*/
  }]);
