<%= _.classify(appname) %>.ApplicationAdapter = DS.FixtureAdapter;
// This fix is needed so your Fixture data will obey to the serializer rules
// Please see https://github.com/emberjs/data/issues/1333
<%= _.classify(appname) %>.ApplicationSerializer = DS.JSONSerializer.extend({
    // In EmberData source, extractArray is the identical twin of extractSingle
    // Override it here so it does something useful and doesn't throw a wrench in things later
    extractArray: function(store, type, payload) {
        var that = this;
        return payload.map(function(item) {
            return that.normalize(type, item);
        });
    }
});
<%= _.classify(appname) %>.ApplicationAdapter = DS.FixtureAdapter.extend({
    // This "unsets" serializer so that the store will lookup the proper serializer
    serializer: function() {
        return;
    }.property()
});
