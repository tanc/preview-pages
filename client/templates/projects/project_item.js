Template.projectItem.helpers({
  url: function() {
    var client = Clients.findOne({_id: this._clientId});
    return client.url + '/' + this.url;
  }
});

Template.projectItem.events({
  'click .delete': function(e) {
    e.preventDefault();
    Meteor.call('deleteProject', this, function(error, result) {
      if (error) {
        alert(error);
      }
    });
  }
});