Clients = new Mongo.Collection('clients');

Meteor.methods({
  addClient: function(client) {
    check(client.name, String);
    check(client.url, String);
    // Make doubly sure the string is url safe.
    client.url = encodeURI(client.url.replace(/\W+/g, '-').toLowerCase());
    client.weight = 1000;
    Clients.insert(client);
  },
  deleteClient: function(client) {
    Clients.remove(client);
    // Delete all child projects.
    Projects.find({_clientId: client._id}).forEach(function(project) {
      Meteor.call('deleteProject', project, function(error, result) {
        if (error) {
          console.log(error);
        }
      });
    });
  },
  editClient: function(client) {
    Clients.update(client.id, {$set: {
      name: client.name,
      url: client.url
    }});
  }
});
