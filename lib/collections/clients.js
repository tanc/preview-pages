Clients = new Mongo.Collection('clients');

Meteor.methods({
  addClient: function(client) {
    check(client.name, String);
    check(client.url, String);
    // Make doubly sure the string is url sage.
    client.url = encodeURI(client.url.replace(/\W+/g, '-').toLowerCase());
    client.weight = 1000;
    Clients.insert(client);
  },
  deleteClient: function(client) {
    Clients.remove(client);
  },
  editClient: function(client) {
    Clients.update(client.id, {$set: {
      name: client.name,
      url: client.url
    }});
  }
});
