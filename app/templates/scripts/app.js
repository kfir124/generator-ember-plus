var <%= _.classify(appname) %> = window.<%= _.classify(appname) %> = Ember.Application.create();

// Ember-simple-auth [this example is just for playing around with simple-auth while locally testing your app
// login with kfi124 password 1234 in order to authenticate

// Can extend later in order to make protected routes
<%= _.classify(appname) %>.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
<%= _.classify(appname) %>.ProtectedRoute.reopen({
    fail_route: function(transition) {
        transition.abort();
        this.transitionTo('index');
    },

    needed_level: 0,

    beforeModel: function(transition) {
        if (!this.get('session.isAuthenticated')) {
            this.fail_route(transition);
            Bootstrap.GNM.push('Login is needed', 'Please login', 'danger');
        } else {
            // user is logged in, maybe we should check his lvl
            if (this.get('needed_level')) {
                var needed_level = this.get('needed_level');
                if (this.get('session.user_level') < needed_level) {
                    this.fail_route(transition);
                    Bootstrap.GNM.push('Access denied', 'You are not allowed in here', 'danger');
                }
            }
        }
    }
});

var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
    tokenEndpoint: '/api/token',

    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },

    authenticate: function(credentials) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (credentials.username === 'kfir124' && credentials.password === '1234') {
                Ember.run(function () {
                    Bootstrap.GNM.push('Success', 'Logged in', 'success');
                    resolve(
                        {
                            token: 'this-is-an-example',
                            username: credentials.username
                        });
                });
            } else {
                Ember.run(function () {
                    Bootstrap.GNM.push('Error', 'Wrong username/password', 'danger');
                    reject('Wrong username/password');
                });
            }
        });
    }
});

var CustomAuthorizer = Ember.SimpleAuth.Authorizers.Base.extend({
    authorize: function(jqXHR, requestOptions) {
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
            jqXHR.setRequestHeader('Token', this.get('session.token'));
        }
    }
});

Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        container.register('authenticator:custom', CustomAuthenticator);
        container.register('authorizer:custom', CustomAuthorizer);
        Ember.SimpleAuth.setup(container, application, {
            authorizerFactory: 'authorizer:custom'
        });
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////


/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
