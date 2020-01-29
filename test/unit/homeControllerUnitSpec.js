describe('home controller testing', function () {
    let $controller;
    let $scope = {};
    let $rootScope = {};

    beforeEach(module('resonanceClientApp'));
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $controller('homeCtrl', {$scope:$scope, $rootScope:$rootScope});

    }));

    it('testing variable definitions', function () {
        expect($rootScope.appName).toBeDefined();
        expect($rootScope.appName).toBe('Resonance Ecommerce');
        expect($scope.furnitures).toBeDefined();
        expect($scope.furnitures.length).toBe(0);
        expect($rootScope.path).toBe('');
    });
});