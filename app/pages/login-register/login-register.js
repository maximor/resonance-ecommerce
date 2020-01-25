module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('login-register',{
            url: '/login-register',
            templateUrl: 'app/pages/login-register/login-register.html',
            controller: loginRegisterCtrl
        });
    });

    let loginRegisterCtrl = function ($rootScope, $scope, $http, externals, $location, Notification) {
        $rootScope.appName = "Login Register";
        $rootScope.path = $location.path();


        $scope.user = {};
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

        $scope.login = function () {

        }

        $scope.clean = function () {
            $scope.user = {};
        }
    }
}