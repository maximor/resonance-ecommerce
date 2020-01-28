module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('product', {
            url: '/product/:id',
            templateUrl: 'app/pages/product/product.html',
            controller: 'productCtrl'
        });
    });

    app.controller('productCtrl', function ($rootScope, $scope, $http, externals, $stateParams, $location) {
        $rootScope.appName = "Product Detail";
        $rootScope.path = $location.path();

        $scope.furniture = {};
        if($stateParams.id){
            $http.get(externals.urls.findAllFurniture+"/"+$stateParams.id).then(function (response) {
                $scope.furniture = response.data;
                $scope.furniture.quantity = 1;
            });
        }
    });
}