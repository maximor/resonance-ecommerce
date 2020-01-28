module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('myOrders', {
            url:'/my-orders',
            templateUrl: 'app/pages/my-orders/my-orders.html',
            controller: 'myOrdersCtrl'
        });
    });


    app.controller('myOrdersCtrl', function ($rootScope, $scope, $http, externals, $location, $user, $window) {
        if(!$user.isLogIn()){
            $window.location.href = '#!/home';
        }else{
            $rootScope.user = $user.getCurrentUser();
        }

        $rootScope.appName = "Cart";
        $rootScope.path = $location.path();
        $scope.orders = [];
        $scope.totalOrders = 0.0;

        $scope.loadMyOrders = function () {
            $http.get(externals.urls.resonanceApi+`Clients?filterByFormula=({Users}='${$rootScope.user.id}')`).then(function (clientResponse) {
                if(clientResponse.data.records.length > 0){
                    $http.get(externals.urls.resonanceApi+`Client%20Orders?filterByFormula=({clientId}="${clientResponse.data.records[0].id}")`).then(function (orders) {
                        $scope.orders = orders.data.records;
                        for(let i = 0; i < orders.data.records.length; i++){
                            $scope.totalOrders += orders.data.records[i].fields['Order Total Cost'];
                        }
                    });
                }
            }, function (errClientResponse) {
                console.log(errClientResponse);
            });
        }
        //load data
        $scope.loadMyOrders();
    });
}