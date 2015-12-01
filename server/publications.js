Meteor.publish(
  'clients', function() {
    return Clients.find();
  }
);

Meteor.publish(
  'projects', function() {
    return Projects.find();
  }
);

Meteor.publish(
  'pages', function() {
    return Pages.find();
  }
);
