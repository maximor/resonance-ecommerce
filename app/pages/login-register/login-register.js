module.exports = function (app) {
    app.config(function ($stateProvider) {
        $stateProvider.state('login-register',{
            url: '/login-register',
            templateUrl: 'app/pages/login-register/login-register.html',
            controller: loginRegisterCtrl
        });
    });

    let loginRegisterCtrl = function ($rootScope, $scope, $http, externals, $location, Notification, $window) {
        let user = $window.localStorage.getItem('user');
        if(user != null){
            $window.location.href = '#!/home';
        }

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
            $http.get(externals.urls.resonanceApi+"Users?filterByFormula=({email}='"+$scope.login.email+"')").then(function (successResponse) {
                if(successResponse.data.records.length == 1){
                    let inputPassword = CryptoJS.SHA512($scope.login.password).toString();

                    if(successResponse.data.records[0].fields.Password === inputPassword){
                        let user = {};
                        user['id'] = successResponse.data.records[0].id;
                        user['username'] = successResponse.data.records[0].fields.username;
                        user['email'] = successResponse.data.records[0].fields.email;
                        user['First Name'] = successResponse.data.records[0].fields['First Name'];
                        user['Last Name'] = successResponse.data.records[0].fields['Last Name'];
                        $window.localStorage.setItem('user', JSON.stringify(user));

                        $rootScope.user = user;
                        $scope.$emit('mainController', $rootScope.user);
                        $window.location.href = '#!/home';
                    }else{
                        Notification.error({message: '<i class="fa fa-bell-o"></i> User or password incorrect! '});
                    }

                }
            }, function (errResponse) {
                console.log(errResponse);
            });
        }

        $scope.clean = function () {
            $scope.user = {};
            $scope.login = {};
        }
    }
}