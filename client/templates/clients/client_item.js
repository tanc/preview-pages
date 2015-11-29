Template.clientItem.helpers({

});

Template.clientItem.events({
  'click .delete': function(e) {
    e.preventDefault();
    Meteor.call('deleteClient', this, function(error, result) {
      if (error) {
        alert(error);
      }
    });
  }
});