let app = angular.module("resonanceClientApp",
    [
        'ui.router',
        'ui-notification'
    ]);

//http access and main routes configuration
app.config(function($httpProvider, $urlRouterProvider, $stateProvider, NotificationProvider) {
    $httpProvider.defaults.withCredentials = false;
    $urlRouterProvider.otherwise('home');

    //notification library
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
    });
});

//place the key in every request header automatically
app.run(function ($http, $rootScope, $http, externals) {
    $http.defaults.headers.common['Authorization'] = 'Bearer '+ externals.airTableKEY;
    $http.defaults.headers.post['Content-Type'] = 'application/json';
});

//Main controller for the application
app.controller("mainController", function($scope, $rootScope, $http, externals, Notification, $location, $window, $user) {
    if($user.isLogIn()){ $rootScope.user = $user.getCurrentUser();}

    $rootScope.appName = "Resonance Ecommerce";
    $rootScope.cart = [];
    $rootScope.path = $location.path();

    if($window.localStorage.getItem('cart') != null){
        $rootScope.cart = JSON.parse($window.localStorage.getItem('cart'));
    }

    $rootScope.addToCart = function (furniture, quantity = 1) {
        if(typeof furniture === 'object'){
            furniture.quantity = quantity;
            let status = false;
            for(let i = 0; i < $rootScope.cart.length; i++){
                if($rootScope.cart[i].id == furniture.id){
                    status = true;
                }
            }

            if(!status){
                if($window.localStorage.getItem('cart') != null){
                    $rootScope.cart = JSON.parse($window.localStorage.getItem('cart'));
                    $rootScope.cart.push(furniture);
                    $window.localStorage.setItem('cart', JSON.stringify($rootScope.cart));
                }else{
                    $rootScope.cart.push(furniture);
                    $window.localStorage.setItem('cart', JSON.stringify($rootScope.cart));
                }
                Notification.success({ message: '<i class="fa fa-bell-o"></i> '+furniture.fields.Name+' has been added to your cart' });
            }
        }else{
           throw 'Error, only object are allowed in the cart';
        }
    }

    $rootScope.removeFromCart = function (objectId) {
        if($rootScope.cart.length > 0){
            let i = 0;
            while ($rootScope.cart.length > i ){
                if($rootScope.cart[i].id == objectId){
                    $rootScope.cart.splice(i, 1);
                    $window.localStorage.setItem('cart', JSON.stringify($rootScope.cart));
                    if($rootScope.cart.length == 0){
                        $window.localStorage.setItem('cart', '[]');
                    }
                    Notification.warning({message: '<i class="fa fa-bell-o"></i> '+objectId+' has been removed of your cart'})
                    break;
                }
                i++;
            }
        }
    }

    $rootScope.numberOfItems = function () {
        return $rootScope.cart.length;
    }

    $rootScope.cartTotal = function () {
        let total = 0;
        for (let i = 0; i < $rootScope.cart.length; i++){
            total += (parseFloat($rootScope.cart[i].fields['Unit Cost']) * $rootScope.cart[i].quantity);
        }
        return total;
    }

    $rootScope.logout = function () {
        if($user.isLogIn()){
            $rootScope.user = {};
            $scope.$emit('mainController', $rootScope.user);
            $user.logout();
        }
    }

});

//uris for for the resonance application
app.constant('externals', {
    'airTableKEY': 'keyOR1tUy1gM5pkdK',
    'urls': {
        'resonanceApi': 'https://api.airtable.com/v0/appzeUDpZOqRjLPaJ/',
        "findAllFurniture":"https://api.airtable.com/v0/appzeUDpZOqRjLPaJ/Furniture"
    },
});

require('./pages')(app);
require('./services')(app);
