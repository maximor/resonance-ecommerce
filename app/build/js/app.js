(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./pages":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/pages/home/home.html',
            controller: homeCtrl
        });
    });

    let homeCtrl = function ($rootScope, $scope, $http, externals, $location) {
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
    };
}
},{}],4:[function(require,module,exports){
module.exports = function (app) {
    require('./home/home') (app);
    require('./product/product') (app);
    require('./login-register/login-register') (app);
    require('./cart/cart') (app);
    require('./shop/shop') (app);
}
},{"./cart/cart":2,"./home/home":3,"./login-register/login-register":5,"./product/product":6,"./shop/shop":7}],5:[function(require,module,exports){
module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('login-register',{
            url: '/login-register',
            templateUrl: 'app/pages/login-register/login-register.html',
            controller: loginRegisterCtrl
        });
    });

    let loginRegisterCtrl = function ($rootScope, $scope, $http, externals, $location) {
        $rootScope.appName = "Login Register";
        $rootScope.path = $location.path();
    }
}
},{}],6:[function(require,module,exports){
module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('product', {
            url: '/product/:id',
            templateUrl: 'app/pages/product/product.html',
            controller: productCtrl
        });
    });

    let productCtrl = function ($rootScope, $scope, $http, externals, $stateParams, $location) {
        $rootScope.appName = "Product Detail";
        $rootScope.path = $location.path();

        $scope.furniture = {};
        if($stateParams.id){
            $http.get(externals.urls.findAllFurniture+"/"+$stateParams.id).then(function (response) {
                $scope.furniture = response.data;
                $scope.furniture.quantity = 1;

            });
        }else{

        }
    }
}
},{}],7:[function(require,module,exports){
module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('shop',{
            url: '/shop',
            templateUrl: 'app/pages/shop/shop.html',
            controller: collectionCtrl
        }).state('shopCategores', {
            url: '/shop/:type/:name',
            templateUrl: 'app/pages/shop/shop.html',
            controller: collectionCtrl
        });
    });

    let collectionCtrl = function ($rootScope, $scope, $http, externals, $stateParams, $location) {
        $rootScope.appName = "Shop";
        $rootScope.path = $location.path();

        $scope.categories = [];
        $scope.furnitures = [];
        $scope.pageSize = '08';
        $scope.sortBy = 'Default';

        $scope.loadFurniture = function () {
            $http.get(externals.urls.findAllFurniture+"?sort[0][field]=Type").then(function (request) {
                // $scope.furnitures = request.data.records;
                if(request.data.records.length > 0){
                    let type = {};
                    type.name = request.data.records[0].fields.Type;
                    type.amount = 1;
                    for(let i = 1; i < request.data.records.length; i++){
                        if(type.name != request.data.records[i].fields.Type){
                            $scope.categories.push(type);
                            type = {};
                            type.name = request.data.records[i].fields.Type;
                            type.amount = 1;
                        }else{
                            type.amount++;
                        }
                    }
                }
                console.log($scope.categories);
            });
        }


        $scope.dinamicSearch = function () {
            let query = '';
            //build the sortBy query filter with a custom url
            if($scope.sortBy != 'Default'){
                if($scope.sortBy == 'ASCN'){
                    query = 'sort[0][field]=Name&sort[0][direction]=asc';
                }else if($scope.sortBy == 'DESCN'){
                    query = 'sort[0][field]=Name&sort[0][direction]=desc';
                }else if($scope.sortBy == 'ASCP'){
                    query = 'sort[0][field]=Unit+Cost&sort[0][direction]=asc';
                }else if($scope.sortBy == 'DESCP'){
                    query = 'sort[0][field]=Unit+Cost&sort[0][direction]=desc';
                }else if($scope.sortBy == 'ASCT'){
                    query = 'sort[0][field]=Type&sort[0][direction]=asc';
                }else if($scope.sortBy == 'DESCT'){
                    query = 'sort[0][field]=Type&sort[0][direction]=desc';
                }
            }

            if($stateParams.type && $stateParams.name){
                if($stateParams.type == 'category'){
                    $http.get(externals.urls.findAllFurniture+"?filterByFormula=({Type}='"+$stateParams.name+"')"+((query.length > 0) ? '&' : '')+query).then(function (request) {
                        $scope.furnitures = request.data.records;
                        console.log($scope.furnitures);
                    });

                }else{
                    if($stateParams.type == 'name'){
                    }
                }
            }else{
                console.log(externals.urls.findAllFurniture+query);
                $http.get(externals.urls.findAllFurniture+"?"+query).then(function (request) {
                    $scope.furnitures = request.data.records;
                });
            }
        }

        // load data
        $scope.loadFurniture();
        $scope.dinamicSearch();
    }
}
},{}]},{},[1])