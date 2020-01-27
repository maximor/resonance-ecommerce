module.exports = function (app) {
    app.service('$user', function ($window, $http, externals) {

        this.isLogIn = function () {
            return $window.localStorage.getItem('user') != null;
        }

        this.getCurrentUser = function () {
            if(this.isLogIn()){
                return JSON.parse($window.localStorage.getItem('user'));
            } else {
                return null;
            }
        }

        this.addUserToLocalStorage = function (user) {
            if(typeof user === 'object'){
                if(!user.hasOwnProperty('id')){
                    throw 'object missing id property';
                }else if(!user.fields.hasOwnProperty('username')){
                    throw 'object missing username property';
                }else if(!user.fields.hasOwnProperty('email')){
                    throw 'object missing email property';
                }else if(!user.fields.hasOwnProperty('First Name')){
                    throw 'object missing Fist Name property';
                }else if(!user.fields.hasOwnProperty('Last Name')){
                    throw 'object missing Last Name property';
                }else {
                    let userAux = {};
                    userAux['id'] = user.id;
                    userAux['username'] = user.fields.username;
                    userAux['email'] = user.fields.email;
                    userAux['First Name'] = user.fields['First Name'];
                    userAux['Last Name'] = user.fields['Last Name'];
                    $window.localStorage.setItem('user', JSON.stringify(userAux));
                }
            }
        }

        this.login = function (email, password) {
            return new Promise(function (resolve, reject) {
                $http.get(externals.urls.resonanceApi+"Users?filterByFormula=({email}='"+email+"')").then(function (successResponse) {
                    if(successResponse.data.records.length == 1){
                        let passwordd = CryptoJS.SHA512(password).toString();
                        if(successResponse.data.records[0].fields.Password === passwordd){
                            resolve(successResponse.data.records[0]);
                        }else {
                            reject(false);
                        }
                    }else{
                        reject(false);
                    }
                }, function (errResponse) {
                    console.log(errResponse);
                    reject(false);
                });
            });

        }

        this.userExists = async function (email) {
            return new Promise(function (resolve, reject) {
                $http.get(externals.urls.resonanceApi+`Users/?filterByFormula=({email}='${email}')`).then(function (successResponse) {
                    resolve((successResponse.data.records.length > 0 && successResponse.data.records[0].fields.email == email));
                }, function (errResponse) {
                    reject(false);
                });
            });
        }

        this.logout = function () {
            if(this.isLogIn()){
                $window.localStorage.removeItem('user');
                $window.location.href = '#!/home';
            }
        }
    });
}