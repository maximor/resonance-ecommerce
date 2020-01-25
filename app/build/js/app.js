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
    $http.defaults.headers.post['Content-Type'] = 'application/json';
});

//Main controller for the application
app.controller("mainController", function($scope, $rootScope, $http, externals, Notification, $location, $window) {
    if( $window.localStorage.getItem('user') != null){
        $rootScope.user = JSON.parse($window.localStorage.getItem('user'));
    }

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
        if($window.localStorage.getItem('cart') != null){
            $window.localStorage.removeItem('user');
            $rootScope.user = {};
            $scope.$emit('mainController', $rootScope.user);
            $window.location.href = '#!/home';
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

},{"./pages":4,"./services":9}],2:[function(require,module,exports){
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

    let loginRegisterCtrl = function ($rootScope, $scope, $http, externals, $location, Notification, $window) {
        let user = $window.localStorage.getItem('user');
        if(user != null){
            $window.location.href = '#!/home';
        }

        $rootScope.appName = "Login Register";
        $rootScope.path = $location.path();


        $scope.user = {};
        $scope.login = {};
        let collection = {records: []};

        $scope.register = function () {

            $scope.user.Password = CryptoJS.SHA512($scope.user.Password).toString();
            collection.records = [{fields: $scope.user}];
            $http.post(externals.urls.resonanceApi+'Users', collection)
                .then(function (response) {
                    $scope.clean();
                    Notification.success({message: '<i class="fa fa-bell-o"></i> You has been registered successfully! '});
                }, function (err) {
                    console.log(err);
                });
        }

        $scope.logins = function () {
            $http.get(externals.urls.resonanceApi+"Users?filterByFormula=({email}='"+$scope.login.email+"')").then(function (successResponse) {
                if(successResponse.data.records.length == 1){
                    let inputPassword = CryptoJS.SHA512($scope.login.password).toString();

                    if(successResponse.data.records[0].fields.Password === inputPassword){
                        let user = {};
                        user['id'] = successResponse.data.records[0].id;
                        user['username'] = successResponse.data.records[0].fields.username;
                        user['email'] = successResponse.data.records[0].fields.email;
                        user['First Name'] = successResponse.data.records[0].fields['First Name'];
                        user['Last Name'] = successResponse.data.records[0].fields['Last Name'];
                        $window.localStorage.setItem('user', JSON.stringify(user));

                        $rootScope.user = user;
                        $scope.$emit('mainController', $rootScope.user);
                        $window.location.href = '#!/home';
                    }else{
                        Notification.error({message: '<i class="fa fa-bell-o"></i> User or password incorrect! '});
                    }

                }
            }, function (errResponse) {
                console.log(errResponse);
            });
        }

        $scope.clean = function () {
            $scope.user = {};
            $scope.login = {};
        }
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
},{}],8:[function(require,module,exports){
module.exports = function (app) {
    //send emails using spark post service api
    app.service('$sparkPost', function ($http, externals) {
        this.send = function (to, subject, html, text) {
            let content = {
                campaign_id: "Resonance Email System",
                recipients: [
                    {
                        address: to
                    }
                ],
                content: {
                    from: {
                        email: externals.mainSparkPostEmail,
                        name: externals.mainSparkPostName
                    },

                    subject: subject,
                    html: html,
                    text: text
                }
            }
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': externals.sparkPostKEY
                }
            }

            $http.post(externals.urls.sparkPostApi+'?num_rcpt_errors=3', content, options).then(function (successResponse) {
                return successResponse;
            }, function (errResponse) {
                return errResponse;
            });
        }
    });
}
},{}],9:[function(require,module,exports){
module.exports = function (app) {
    require('./PostSpark/postSpark') (app);
}
},{"./PostSpark/postSpark":8}]},{},[1])