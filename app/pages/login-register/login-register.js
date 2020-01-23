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