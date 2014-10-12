App.ApplicationController = Ember.Controller.extend(
  loginModalButtons: [
    Ember.Object.create(
      title: "Submit"
      clicked: "loginModalSubmit"
    )
    Ember.Object.create(
      title: "Cancel"
      clicked: "cancel"
      dismiss: "modal"
    )
  ]
  actions:
    
    #Submit the modal
    loginModalSubmit: ->
      Bootstrap.ModalManager.hide "loginModal"
      
      # THIS IS IMPORTANT! it will cause the action to bubble to our route so we can really authenticate the user
      true

    cancel: ->
)