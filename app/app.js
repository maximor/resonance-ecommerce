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
});

//Main controller for the application
app.controller("mainController", function($scope, $rootScope, $http, externals, Notification, $location) {
    $rootScope.appName = "Resonance Ecommerce";
    $rootScope.cart = [];
    $rootScope.path = $location.path();

    console.log($rootScope.path);


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
                $rootScope.cart.push(furniture);
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

    // $http.get("https://api.airtable.com/v0/appzeUDpZOqRjLPaJ/Furniture?maxRecords=3&view=Main%20View").then(function(response) {
    //     console.log(response);
    // });
});

//uris for for the resonance application
app.constant('externals', {
    'airTableKEY': 'keyOR1tUy1gM5pkdK',
    'urls': {
        "findAllFurniture":"https://api.airtable.com/v0/appzeUDpZOqRjLPaJ/Furniture"
    },
});

require('./pages')(app);