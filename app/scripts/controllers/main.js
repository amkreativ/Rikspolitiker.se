'use strict';
//var json = require('./data.json');

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

    $scope.partinamn = {
        V: 'Vänsterpartiet',
        S: 'Socialdemokraterna',
        MP: 'Miljöpartiet',
        SD: 'Sverigedemokraterna',
        C: 'Centerpartiet',
        L: 'Liberalerna',
        M: 'Moderaterna',
        KD: 'Kristdemokratena'
    };

    $scope.antalLedamoter = {
        V: 21,
        S: 113,
        MP: 25,
        SD: 48,
        C: 22,
        L: 19,
        M: 84,
        KD: 16
    };

    $scope.getShare = function(parti){
        return $scope.antalLedamoter[parti] / 349 * 100;
    };

    $scope.vardeord = [
        'att',
        'fruktansvärt',
        'hemskt',
        'oerhört',
        'enormt',
        'absolut',
        'kvinnor',
        'hållbar',
        'rasism',
        'feministisk',
        'män',
        'kön',
        'utbildning',

    ];

    $scope.ordlista = [
        'skolan',
        'vården',
        'arbete',
        'sysselsättning',
        'invandring',
        'integration',
        'äldreomsorg',
        'omsorg',
        'ekonomi',
        'transport',
        'miljö',
        'pension',
        'sociala',
        'bostad',
        'försvaret',
        'säkerhet',
        'nato',
        'ordning',
        'polisen',
        'barn',
        'skatter',
        'infrastruktur',
        'energi',
        'utrikes',
        'företagande',
        'eu',
        'handel'
    ];

    $scope.dataView = {
        isActive: false,
        activate: function(){
            $scope.dataView.isActive = true;
        },
        deactivate: function(){
            $scope.dataView.isActive = false;
            $scope.dataView.activeParti = '';
        },
        activeParti: '',
        selectParti: function(parti){
            $scope.dataView.activeParti = parti;
            //$scope.dataView.activeParti = 'parti';
        },
        hasActiveParti: function(){
            if ($scope.dataView.activeParti != '') {
                return true;
            }else{
                return false;
            }
        },
        isActiveParti: function(parti){
            if ($scope.dataView.activeParti == parti) {
                console.log(parti);
                return true;
            }else{
                return false;
            }
        }
    };



    $scope.memes = 'aaa';

    $scope.sorteraPolitiker = function(){
        for (var property in $scope.dataset) {
            if ($scope.dataset.hasOwnProperty(property)) {
                console.log('Parti: ' + $scope.dataset[property].parti);
                if ($scope.dataset[property].parti != '-') {
                    $scope.partier[$scope.dataset[property].parti].ledamoter.push($scope.dataset[property].id);
                }
                

            }
        }
        console.log($scope.partier);
    };

    $http.get('./data/politikerlista.json').success(function(data) {
        $scope.dataset = data;
        $scope.sorteraPolitiker();
    });
    /*
    $http.get('http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=').success(function(data) {
    	$scope.dataset = data;
    	console.log('Data fetched');
        $scope.politikerLista = [];
        for (var i = $scope.dataset.personlista.person.length - 1; i >= 0; i--) {
            var p = $scope.dataset.personlista.person[i];
            console.log(p.sorteringsnamn);
            //politiker[i].sorteringsnamn = p.sorteringsnamn;
            var politiker = {};
            politiker.sorteringsnamn = p.sorteringsnamn;
            politiker.intressent_id = p.intressent_id;
            if (p.personuppgift !== null) {
                for (var j = p.personuppgift.uppgift.length - 1; j >= 0; j--) {
                    if (p.personuppgift.uppgift[j].kod === 'sv' && p.personuppgift.uppgift[j].typ === 'titlar')
                    {
                        politiker.yrke = p.personuppgift.uppgift[j].uppgift;
                        console.log(p.sorteringsnamn + ': ' + p.personuppgift.uppgift[j].uppgift);
                    }
                }
            }
            //politikerLista.push(politiker);
            $scope.politikerLista[politiker.intressent_id] = politiker;
            
        }

        //$scope.apply();
        $scope.ord = null;
        $http.get('./data/ledamoter_ord250.json').success(function(data) {
            $scope.ord = data;
            console.log($scope.ord);

        });

        
    });
    */
    $http.get('./data/partier.json').success(function(data) {
        $scope.partidata = data;
        //console.log($scope.ord);

    });

    $scope.partier = {
        V:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        S:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        MP:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        SD:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        C:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        L:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        M:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        KD:{selected:false, ledamoter:[], flestAnforanden:'', langstOrd:'', kortastOrd:'', flestOrd:'', minstOrd:''},
        selectAll: function(){
            $scope.partier.V.selected = true;
            $scope.partier.S.selected = true;
            $scope.partier.MP.selected = true;
            $scope.partier.SD.selected = true;
            $scope.partier.C.selected = true;
            $scope.partier.L.selected = true;
            $scope.partier.M.selected = true;
            $scope.partier.KD.selected = true;
            //console.log('WEW LAD');
        },
        selectNone: function(){
            $scope.partier.V.selected = false;
            $scope.partier.S.selected = false;
            $scope.partier.MP.selected = false;
            $scope.partier.SD.selected = false;
            $scope.partier.C.selected = false;
            $scope.partier.L.selected = false;
            $scope.partier.M.selected = false;
            $scope.partier.KD.selected = false;
        }
    };

    $scope.isNameLong = function(fnamn,enamn){
        var nameLength = fnamn.length + enamn.length;
        console.log('AAA' + nameLength);

        return nameLength >= 20;
    };

    $scope.sorting = {
        isAlphabetical: true,
        isNumeric: false,
        isDesc: false,
        isAsc: true,
        toggle: function(){
            if ($scope.sorting.isDesc) {
                $scope.sorting.isDesc = false;
                $scope.sorting.isAsc = true;
            } else {
                $scope.sorting.isDesc = true;
                $scope.sorting.isAsc = false;
            }
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
  }])
.directive('animateOnChange', function($timeout) {
  return function(scope, element, attr) {
    scope.$watch(attr.animateOnChange, function(nv,ov) {
      if (nv!=ov) {
        element.addClass('changed');

        $timeout(function() {
          element.removeClass('changed');
        }, 200); // Could be enhanced to take duration as a parameter
      }
    });
  };
});
