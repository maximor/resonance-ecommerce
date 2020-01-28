module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/pages/home/home.html',
            controller: 'homeCtrl'
        });
    });

    app.controller('homeCtrl', function ($rootScope, $scope, $http, externals, $location) {
        $rootScope.appName = "Resonance Ecommerce";
        $rootScope.path = $location.path();
        $scope.furnitures = [];

        $scope.loadFurniture = function () {
            $http.get(externals.urls.findAllFurniture+'?maxRecords=9').then(function (request) {
                $scope.furnitures = request.data.records;
            });
        }

        // load data
        $scope.loadFurniture();
    });
}