# Takes a pojo and makes it an Ember object
PojoToEmber = (pojo) ->
  obj = Ember.Object.create()
  for name of pojo
    obj.set name, pojo[name]  if pojo.hasOwnProperty(name)
  obj

# Takes an array and makes it an Ember array
# cast_function will be called on each entry if given
ArrayToEmber = (json, cast_function) ->
  if typeof cast_function is "undefined"
    cast_function = (same) ->
      same
  if Array.isArray(json)
    ember_array = Ember.A()
    json.forEach (entry) ->
      ember_array.pushObject cast_function(entry)
      return

    ember_array
  else
    console.log "WARNING: ArrayToEmber called on non-array object"
    json
Yayornay.EmbeddedTransform = DS.Transform.extend(
  deserialize: (json) ->
    
    # Array of embedded objects
    if Array.isArray(json)
      
      # Makes Ember-Array while casting all the pojos into Ember objects
      ArrayToEmber json, PojoToEmber
    
    # Just a Pojo
    else if typeof json is "object"
      PojoToEmber json
    
    # Empty or something we can't handle
    else
      json

  serialize: (object) ->
    JSON.stringify object
)

# Uncasted array
Yayornay.ArrayTransform = DS.Transform.extend(
  deserialize: (json) ->
    ArrayToEmber json

  serialize: (object) ->
    JSON.stringify object
)

# Array which is elements are strings
Yayornay.ArrayStringTransform = DS.Transform.extend(
  deserialize: (json) ->
    ArrayToEmber json, String

  serialize: (object) ->
    JSON.stringify object
)

# Array which is elements are numbers
Yayornay.ArrayNumberTransform = DS.Transform.extend(
  deserialize: (json) ->
    ArrayToEmber json, Number

  serialize: (object) ->
    JSON.stringify object
)