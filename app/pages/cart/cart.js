module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('cart',{
            url: '/cart',
            templateUrl: 'app/pages/cart/cart.html',
            controller: 'cartCtrl'
        });
    });

    app.controller('cartCtrl', function ($rootScope, $scope, $http, externals, $location, $user, Notification, $window) {
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

        $scope.createOrder = function() {
            if($user.isLogIn()){
                $http.get(externals.urls.resonanceApi+`Clients?filterByFormula=({Users}='${$rootScope.user.id}')`).then(function (successResponse) {
                    if(successResponse.data.records.length > 0){
                        //order json
                        let order = {
                            records: [
                                {
                                    fields: {
                                        Client: [
                                            `${successResponse.data.records[0].id}`
                                        ],
                                    }
                                }
                            ]
                        };
                        //create the order
                        $http.post(externals.urls.resonanceApi+'Client%20Orders', order).then(function (ordersResponse) {
                            //line items
                            let orderLineItem = {records: []};
                            for(let i = 0; i < $rootScope.cart.length; i++){
                                orderLineItem.records.push({
                                    fields:{
                                        Quantity:$rootScope.cart[i].quantity,
                                        "Furniture Item":[`${$rootScope.cart[i].id}`],
                                        "Belongs to Order":[`${ordersResponse.data.records[0].id}`]
                                    }
                                });
                            }

                            $http.post(externals.urls.resonanceApi+'Order%20Line%20Items', orderLineItem).then(function (responseline) {
                                Notification.success({message: `<i class="fa fa-bell-o"></i> Your order with ID #${ordersResponse.data.records[0].id} has been created! `});
                                $window.localStorage.setItem('cart', '[]');
                                $rootScope.cart = [];
                            }, function (err) {
                                console.log(err);
                            });
                        }, function (errOrderResponse) {
                            console.log(errOrderResponse);
                        });
                    }
                }, function (errResponse) {
                    console.log(errResponse);
                });
            }else{
                Notification.error({message: '<i class="fa fa-bell-o"></i> Error, you have to login the system to make your order! '});
            }


        }

        // load data
        $scope.loadFurniture();
    });
}