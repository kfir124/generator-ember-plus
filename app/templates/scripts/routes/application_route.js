App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
App.ApplicationRoute.reopen({
    actions: {
        authenticateSession: function() {
            // Call the login method that shows the loginModal
            this.send('login');
        },

        loginModalSubmit: function(username, password) {
            // Username and password are bindings in the loginModal template
            this.get('session').authenticate('authenticator:custom',
                {
                    'username': this.controller.get('username'),
                    'password': this.controller.get('password')
                });
        },

        login: function() {
            Bootstrap.ModalManager.show('loginModal');
        },

        signup: function() {
            Bootstrap.NM.push('Signup!', 'info');
        }
    }
});

