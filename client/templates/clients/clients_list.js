Template.clientsList.helpers({
  clients: function() {
    return Clients.find()
  }
});