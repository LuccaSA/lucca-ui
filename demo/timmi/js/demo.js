'use strict';

var app = angular.module('demo', ['ui.select']);

app.controller('DemoCtrl', function($scope, $http) {
  $scope.disabled = undefined;

  $scope.enable = function() {
    $scope.disabled = false;
  };

  $scope.disable = function() {
    $scope.disabled = true;
  };

  $scope.clear = function() {
    $scope.country.selected = undefined;
  };

  $scope.statute = {};
  $scope.statutes = [
      {id: 1, name: 'Statute #01'},
      {id: 2, name: 'Statute #02'},
      {id: 3, name: 'Statute #03'}
  ];
});
