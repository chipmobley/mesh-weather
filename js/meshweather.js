_.templateSettings = {
  evaluate : /\{\[([\s\S]+?)\]\}/g,
  interpolate :/\{\{(.+?)\}\}/g
};

var Forcast = Backbone.Model.extend({
  defaults: {
    city: 'Not entered',
    temperature: '0'
  },

  url: function() { 
    return 'test_data/test.json' 
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
    this.myLocation = new Forcast();
    this.myForcasts = new ForcastCollection([this.myLocation]);
    this.myForcasts.bind('add', this.appendItem);
    var self = this;
    this.myLocation.fetch({ 
      success: function() { 
        self.render()
      },
      error: function() {
        console.log('Fetch error');
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
