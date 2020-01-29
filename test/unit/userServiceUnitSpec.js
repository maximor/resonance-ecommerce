describe('$user service test', function () {
    let $user;
    let user = {}

    beforeEach(function () {
        user = {
            id: "rec5w3B5GEhD4ZYt3",
            fields: {
                username: "xryan0512",
                email: "bryandev12@gmail.com",
                "Last Name": "Alvarez",
                "First Name": "Bryan",
                Password: "827ccb0eea8a706c4c34a16891f84e7b",
                key: "bryandev12@gmail.com"
            },
            createdTime: "2019-12-30T17:18:56.000Z"
        }
    });

    beforeEach(module('resonanceClientApp'));
    beforeEach(inject(function (_$user_) {
        $user = _$user_;
        if($user.isLogIn()){
            $user.logout();
        }
    }));

    it('testing if the user is placed in session', function () {
        $user.addUserToLocalStorage(user);
        expect($user.isLogIn()).toBe(true);
        expect($user.getCurrentUser().id).toBe(user.id);
        expect($user.getCurrentUser().username).toBe(user.fields.username);
        expect($user.getCurrentUser().email).toBe(user.fields.email);
        expect($user.getCurrentUser()['First Name']).toBe(user.fields['First Name']);
        expect($user.getCurrentUser()['Last Name']).toBe(user.fields['Last Name']);
    });

    it('testing if the user clean the session', function () {
        expect($user.isLogIn()).toBe(false);
    });

    it('testing userExists function', function () {
        //I'm using a default user I created in airTable for the test
        $user.userExists('test@test.com').then(function (status) {
           expect(status).toBe(true);
        });
    });

    it('testing if the user doesnt exists userExists function', function () {
        $user.userExists('test1@test.com').then(function (status) {
            expect(status).toBe(false);
        });
    });

    it('testing login function', function () {
        $user.login('test@test.com', '123456').then(function (status) {
            expect(status).toBe(true);
        });
    });

    it('testing login if the user doesnt exists', function () {
        $user.login('test1@test.com', '123456').then(function (status) {
            expect(status).toBe(false);
        });
    });

    it('testing login if password is incorrect', function () {
        $user.login('test@test.com', '123456s').then(function (status) {
            expect(status).toBe(false);
        });
    });
});
