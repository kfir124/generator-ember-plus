<%= _.classify(appname) %>.ApplicationAdapter = DS.FixtureAdapter
# In EmberData source, extractArray is the identical twin of extractSingle
# Override it here so it does something useful and doesn't throw a wrench in things later
<%= _.classify(appname) %>.ApplicationSerializer = DS.JSONSerializer.extend(extractArray: (store, type, payload) ->
  that = this
  payload.map (item) ->
    that.normalize type, item

)
# This "unsets" serializer so that the store will lookup the proper serializer
<%= _.classify(appname) %>.ApplicationAdapter = DS.FixtureAdapter.extend(serializer: (->
  return
).property())
