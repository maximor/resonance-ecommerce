module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('shop',{
            url: '/shop',
            templateUrl: 'app/pages/shop/shop.html',
            controller: 'shopCtrl'
        }).state('shopCategores', {
            url: '/shop/:type/:name',
            templateUrl: 'app/pages/shop/shop.html',
            controller: 'shopCtrl'
        });
    });

    app.controller('shopCtrl', function ($rootScope, $scope, $http, externals, $stateParams, $location) {
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
                    });
                }
            }else{
                $http.get(externals.urls.findAllFurniture+"?"+query).then(function (request) {
                    $scope.furnitures = request.data.records;
                });
            }
        }

        // load data
        $scope.loadFurniture();
        $scope.dinamicSearch();
    });
}