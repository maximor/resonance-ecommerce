describe('login register controller testing', function () {
    let $controller;
    let $scope = {};
    let $rootScope = {};
    let $user;

    beforeEach(module('resonanceClientApp'));
    beforeEach(inject(function (_$controller_, _$user_) {
        $controller = _$controller_;
        $user = _$user_;
        $controller('loginRegisterCtrl', {$scope:$scope, $rootScope:$rootScope});
    }));

    it('testing variable definitions', function () {
        expect($rootScope.appName).toBeDefined();
        expect($rootScope.appName).toBe('Login Register');
        expect($rootScope.path).toBe('');
        expect($scope.user).toBeDefined();
        expect($scope.login).toBeDefined();
    });
});