describe('shop controller testing', function () {
    let $controller;
    let $scope = {};
    let $rootScope = {};

    beforeEach(module('resonanceClientApp'));
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $controller('shopCtrl', {$scope:$scope, $rootScope:$rootScope});
    }));

    it('testing variable definitions', function () {
        expect($rootScope.appName).toBeDefined();
        expect($rootScope.appName).toBe('Shop');
        expect($rootScope.path).toBeDefined();
        expect($rootScope.path).toBe('');

        expect($scope.furnitures).toBeDefined();
        expect($scope.categories).toBeDefined();
        expect($scope.pageSize).toBe('08');
        expect($scope.sortBy).toBe('Default');
    });
});