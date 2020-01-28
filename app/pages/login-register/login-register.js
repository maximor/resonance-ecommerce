module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('login-register',{
            url: '/login-register',
            templateUrl: 'app/pages/login-register/login-register.html',
            controller: 'loginRegisterCtrl'
        });
    });

    app.controller('loginRegisterCtrl', function ($rootScope, $scope, $http, externals, $location, Notification, $window, $user) {
        if($user.isLogIn()){$window.location.href = '#!/home';}

        $rootScope.appName = "Login Register";
        $rootScope.path = $location.path();

        $scope.user = {};
        $scope.login = {};
        let collection = {records: []};

        $scope.register = function () {
            $user.userExists($scope.user.email).then(function (successResponse) {
                if(!successResponse){
                    $scope.user.Password = CryptoJS.SHA512($scope.user.Password).toString();
                        collection.records = [{fields: $scope.user}];
                        $http.post(externals.urls.resonanceApi+'Users', collection)
                            .then(function (response) {
                                // create the client profile
                                let client = {records: [{fields:{Name:`${$scope.user['First Name']} ${$scope.user['Last Name']}`, Users:response.data.records[0].id}}]}
                                $http.post(externals.urls.resonanceApi+'Clients', client).then(function (successResponse) {
                                    Notification.success({message: '<i class="fa fa-bell-o"></i> You has been registered successfully! '});
                                    $scope.clean();
                                }, function (errResponse) {
                                    console.log(errResponse);
                                });
                            }, function (err) {
                                console.log(err);
                            });
                }else{
                    Notification.error({message: `<i class="fa fa-bell-o"></i> Error, the email ${$scope.user.email} already exist, try with a new one!`});
                }
            }, function (errResponse) {
                Notification.error({message: `<i class="fa fa-bell-o"></i> Error, the email ${$scope.user.email} already exist, try with a new one!`});
            });
        }

        $scope.logins = function () {
            $user.login($scope.login.email, $scope.login.password).then(function (user) {
                if(user){
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
    })

}