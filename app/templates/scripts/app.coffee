<%= _.classify(appname) %> = window.<%= _.classify(appname) %> = Ember.Application.create()
<%= _.classify(appname) %>.reopen s3_url: (key) ->
  "https://<%= appname %>.s3.amazonaws.com/" + key

# Can extend later in order to make protected routes
<%= _.classify(appname) %>.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin)
<%= _.classify(appname) %>.ProtectedRoute.reopen
  fail_route: (transition) ->
    transition.abort()
    @transitionTo "index"
    return

  needed_level: 0
  beforeModel: (transition) ->
    unless @get("session.isAuthenticated")
      @fail_route transition
      Bootstrap.GNM.push "Login is needed", "Please login", "danger"
    else
      
      # user is logged in, maybe we should check his lvl
      if @get("needed_level")
        needed_level = @get("needed_level")
        if @get("session.user_level") < needed_level
          @fail_route transition
          Bootstrap.GNM.push "Access denied", "You are not allowed in here", "danger"
    return


CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend(
  tokenEndpoint: "/token"
  restore: (data) ->
    new Ember.RSVP.Promise((resolve, reject) ->
      unless Ember.isEmpty(data.token)
        resolve data
      else
        reject()
      return
    )

  authenticate: (credentials) ->
    tokenEndpoint = @get("tokenEndpoint")
    new Ember.RSVP.Promise((resolve, reject) ->
      Ember.$.post(tokenEndpoint,
        username: credentials.username
        password: credentials.password
      , ->
      ).done((data) ->
        Ember.run ->
          Bootstrap.GNM.push "Success", "Logged in", "success"
          resolve
            token: data.token
            username: credentials.username
            user_level: data.user_level

          return

        return
      ).fail (err) ->
        Ember.run ->
          Bootstrap.GNM.push "Error", err.responseText, "danger"
          reject err.responseText
          return

        return

      return
    )
)

CustomAuthorizer = Ember.SimpleAuth.Authorizers.Base.extend(authorize: (jqXHR, requestOptions) ->
  jqXHR.setRequestHeader "token", @get("session.token")  if @get("session.isAuthenticated") and not Ember.isEmpty(@get("session.token"))
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
require "scripts/controllers/**/*"
require "scripts/store"
require "scripts/models/*"
require "scripts/routes/**/*"
require "scripts/components/*"
require "scripts/views/*"
require "scripts/router"
require "scripts/helpers"