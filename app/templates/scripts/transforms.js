// Takes a pojo and makes it an Ember object
function PojoToEmber(pojo) {
    var obj = Ember.Object.create();
    for (var name in pojo) {
        if (pojo.hasOwnProperty(name)) {
            obj.set(name, pojo[name]);
        }
    }
    return obj;
}
// Takes an array and makes it an Ember array
// cast_function will be called on each entry if given
function ArrayToEmber(json, cast_function) {
    if (typeof cast_function === 'undefined') {
        cast_function = function(same) {
            return same;
        };
    }
    if (Array.isArray(json)) {
        var ember_array = Ember.A();
        json.forEach(function(entry) {
            ember_array.pushObject(cast_function(entry));
        });
        return ember_array;
    } else {
        console.log('WARNING: ArrayToEmber called on non-array object');
        return json;
    }
}

Yayornay.EmbeddedTransform = DS.Transform.extend({
    deserialize: function(json) {
        // Array of embedded objects
        if (Array.isArray(json)) {
            // Makes Ember-Array while casting all the pojos into Ember objects
            return ArrayToEmber(json, PojoToEmber);
            // Just a Pojo
        } else if (typeof json === 'object'){
            return PojoToEmber(json);
            // Empty or something we can't handle
        } else {
            return json;
        }
    },
    serialize: function(object) {
        return JSON.stringify(object);
    }
});
// Uncasted array
Yayornay.ArrayTransform = DS.Transform.extend({
    deserialize: function(json) {
        return ArrayToEmber(json);
    },
    serialize: function(object) {
        return JSON.stringify(object);
    }
});
// Array which is elements are strings
Yayornay.ArrayStringTransform = DS.Transform.extend({
    deserialize: function(json) {
        return ArrayToEmber(json, String);
    },
    serialize: function(object) {
        return JSON.stringify(object);
    }
});
// Array which is elements are numbers
Yayornay.ArrayNumberTransform = DS.Transform.extend({
    deserialize: function(json) {
        return ArrayToEmber(json, Number);
    },
    serialize: function(object) {
        return JSON.stringify(object);
    }
});
