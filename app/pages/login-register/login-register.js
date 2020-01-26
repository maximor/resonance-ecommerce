module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('login-register',{
            url: '/login-register',
            templateUrl: 'app/pages/login-register/login-register.html',
            controller: loginRegisterCtrl
        });
    });

    let loginRegisterCtrl = function ($rootScope, $scope, $http, externals, $location, Notification, $window, $user) {
        if($user.isLogIn()){$window.location.href = '#!/home';}

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
            $user.login($scope.login.email, $scope.login.password).then(function (user) {
                if(user){
                    console.log(user);
                    $user.addUserToLocalStorage(user);
                    $rootScope.user = $user.getCurrentUser();
                    $scope.$emit('mainController', $rootScope.user);
                    $window.location.href = '#!/home';
                }else{
                    Notification.error({message: '<i class="fa fa-bell-o"></i> User or password incorrect! '});
                }
            }, function (err) {
                Notification.error({message: '<i class="fa fa-bell-o"></i> User or password incorrect! '});
            });
        }

        $scope.clean = function () {
            $scope.user = {};
        }
    }
}