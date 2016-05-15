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
        var politikerLista = [];
        for (var i = $scope.dataset.personlista.person.length - 1; i >= 0; i--) {
            var p = $scope.dataset.personlista.person[i];
            console.log(p.sorteringsnamn);
            //politiker[i].sorteringsnamn = p.sorteringsnamn;
            var politiker = {}
            politiker.sorteringsnamn = p.sorteringsnamn;
            politikerLista.push(politiker);
        }
        console.log(politikerLista);
    });


    $scope.partier = {
        V:{selected:false},
        S:{selected:false},
        MP:{selected:false},
        SD:{selected:false},
        C:{selected:false},
        L:{selected:false},
        M:{selected:false},
        KD:{selected:false},
        selectAll: function(){
            $scope.partier['V'].selected = true;
            $scope.partier['S'].selected = true;
            $scope.partier['V'].selected = true;
            $scope.partier['MP'].selected = true;
            $scope.partier['SD'].selected = true;
            $scope.partier['C'].selected = true;
            $scope.partier['L'].selected = true;
            $scope.partier['M'].selected = true;
            $scope.partier['KD'].selected = true;
            console.log('WEW LAD');
        },
        selectNone: function(){
            $scope.partier['V'].selected = false;
            $scope.partier['S'].selected = false;
            $scope.partier['V'].selected = false;
            $scope.partier['MP'].selected = false;
            $scope.partier['SD'].selected = false;
            $scope.partier['C'].selected = false;
            $scope.partier['L'].selected = false;
            $scope.partier['M'].selected = false;
            $scope.partier['KD'].selected = false;
        }
    };

    $scope.selectedID = ':D';

    $scope.select = function(id){
    	console.log('id');
    	if ($scope.selectedID === id) {
    		$scope.selectedID = '';
    	}else{
    		$scope.selectedID = id;
    	}
    };

    $scope.selectParti = function(parti){
        if ($scope.partier[parti].selected === false) {
            $scope.partier[parti].selected = true;
            console.log($scope.partier[parti].selected);
        }else{
            $scope.partier[parti].selected = false;
            console.log($scope.partier[parti].selected);
        }
    };

    $scope.isPartiSelected = function(parti){
        //console.log(parti);
        //console.log($scope.partier[parti].selected);
        //console.log($scope.partier[parti].selected);
        return $scope.partier[parti].selected;
    };

    $scope.isSelected = function(id){
    	if (id === $scope.selectedID) {
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
