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


    });
}