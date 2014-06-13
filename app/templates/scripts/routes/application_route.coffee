<%= _.classify(appname) %>.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin)
<%= _.classify(appname) %>.ApplicationRoute.reopen actions:
  authenticateSession: ->
    
    # Call the login method that shows the loginModal
    @send "login"
    return

  loginModalSubmit: (username, password) ->
    
    # Username and password are bindings in the loginModal template
    @get("session").authenticate "authenticator:custom",
      username: @controller.get("username")
      password: @controller.get("password")

    return

  login: ->
    Bootstrap.ModalManager.show "loginModal"
    return

  signup: ->
    Bootstrap.NM.push "Signup!", "info"
    return
