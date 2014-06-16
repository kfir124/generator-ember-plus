<%= _.classify(appname) %> = window.<%= _.classify(appname) %> = Ember.Application.create()

# Ember-simple-auth [this example is just for playing around with simple-auth while locally testing your app
# login with kfi124 password 1234 in order to authenticate

# Can extend later in order to make protected routes
<%= _.classify(appname) %>.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin)
CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend(
  tokenEndpoint: "/api/token"
  restore: (data) ->
    new Ember.RSVP.Promise((resolve, reject) ->
      unless Ember.isEmpty(data.token)
        resolve data
      else
        reject()
      return
    )

  authenticate: (credentials) ->
    new Ember.RSVP.Promise((resolve, reject) ->
      if credentials.username is "kfir124" and credentials.password is "1234"
        Ember.run ->
          Bootstrap.GNM.push "Success", "Logged in", "success"
          resolve
            token: "this-is-an-example"
            username: credentials.username

          return

      else
        Ember.run ->
          Bootstrap.GNM.push "Error", "Wrong username/password", "danger"
          reject "Wrong username/password"
          return

      return
    )
)
CustomAuthorizer = Ember.SimpleAuth.Authorizers.Base.extend(authorize: (jqXHR, requestOptions) ->
  jqXHR.setRequestHeader "Token", @get("session.token")  if @get("session.isAuthenticated") and not Ember.isEmpty(@get("session.token"))
  return
)
Ember.Application.initializer
  name: "authentication"
  initialize: (container, application) ->
    container.register "authenticator:custom", CustomAuthenticator
    container.register "authorizer:custom", CustomAuthorizer
    Ember.SimpleAuth.setup container, application,
      authorizerFactory: "authorizer:custom"

    return


#///////////////////////////////////////////////////////////////////////////////////////////////

# Order and include as you please.
require 'scripts/controllers/*'
require 'scripts/store'
require 'scripts/models/*'
require 'scripts/routes/*'
require 'scripts/components/*'
require 'scripts/views/*'
require 'scripts/router'
