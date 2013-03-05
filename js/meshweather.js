_.templateSettings = {
  evaluate : /\{\[([\s\S]+?)\]\}/g,
  interpolate :/\{\{(.+?)\}\}/g
};

var Forcast = Backbone.Model.extend({
  defaults: {
    user_zip: 'Not entered',
    wunderground_api_key: '0' //Enter your wunderground.com api key here
  },

  url: function() { 
    var zip = this.get('user_zip');
    var api_key = this.get('wunderground_api_key');
    console.log( 'http://api.wunderground.com/api/' + api_key + '/conditions/q/' + zip + '.json' );
    return 'http://api.wunderground.com/api/' + api_key + '/conditions/q/' + zip + '.json'
  },
    
  parse: function(data, xhr) {
    var observation = data.current_observation;
    return {
      city: observation.display_location.city,
      state: observation.display_location.state,
      temperature: observation.temp_f,
      icon: observation.icon_url,
      icon_alt: observation.icon
    }
  }
});

var ForcastCollection = Backbone.Collection.extend({
  model: Forcast
});

var ForcastView = Backbone.View.extend({
  el: $('#weather-display'),
  template: _.template($('#weather-template').html()),

  initialize: function() {
    _.bindAll(this, 'render');
    this.myLocation = new Forcast({ user_zip: '78240' });
    this.myForcasts = new ForcastCollection([this.myLocation]);
    this.myForcasts.bind('add', this.appendItem);
    var self = this;
    this.myLocation.fetch({ 
      dataType: 'jsonp',
      success: function() { 
        self.render()
      },
      error: function(data,response) {
        console.log('Fetch error');
        console.log(response);
      } 
    });
  },

  render: function() {
    var self = this;
    _(this.myForcasts.models).each( function(item) {
      this.$el.html( self.template(item.toJSON()) );
    }, this);
  }
});



(function($){
  var forcastView = new ForcastView();
})(jQuery);
