describe('product controller testing', function () {
    let $controller;
    let $scope = {};
    let $rootScope = {};
    let $stateParams;

    beforeEach(module('resonanceClientApp'));
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $controller('productCtrl', {$scope:$scope, $rootScope:$rootScope, $stateParams:$stateParams});
    }));

    it('testing variable definitions', function () {
        expect($rootScope.appName).toBeDefined();
        expect($rootScope.appName).toBe('Product Detail');
        expect($rootScope.path).toBeDefined();
        expect($rootScope.path).toBe('');

        expect($scope.furniture).toBeDefined();
    });
});