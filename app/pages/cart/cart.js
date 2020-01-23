module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('cart',{
            url: '/cart',
            templateUrl: 'app/pages/cart/cart.html',
            controller: cartCtrl
        });
    });

    let cartCtrl = function ($rootScope, $scope, $http, externals, $location) {
        $rootScope.appName = "Cart";
        $rootScope.path = $location.path();
        $scope.categories = [];
        $scope.furnitures = [];

        $scope.loadFurniture = function () {
            $http.get(externals.urls.findAllFurniture+"?sort%5B0%5D%5Bfield%5D=Type").then(function (request) {
                $scope.furnitures = request.data.records;
                if($scope.furnitures.length > 0){
                    let type = $scope.furnitures[0].fields.Type;
                    $scope.categories.push(type);

                    for(let i = 1; i < $scope.furnitures.length; i++){
                        if(type != $scope.furnitures[i].fields.Type){
                            $scope.categories.push($scope.furnitures[i].fields.Type);
                            type = $scope.furnitures[i].fields.Type;
                        }
                    }

                }
            });
        }

        // load data
        $scope.loadFurniture();
    }
}