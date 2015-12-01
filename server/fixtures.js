/**
 * @file
 * Includes a basic set of fixtures for populating the db for testing purposes.
 */

if (Clients.find().count() === 0) {
  var clientId = Clients.insert({
    name: 'Oriel College',
    url: 'oriel-college',
    password: 'agile-oriel'
  });
}

if (Projects.find().count() === 0) {
  var projectId = Projects.insert({
    name: 'Main college web site',
    url: 'main',
    _clientId: clientId
  });
}

if (Pages.find().count() === 0) {
  var pageIdHome = Pages.insert({
    name: 'Home page',
    url: 'home',
    _projectId: projectId
  });
  var pageIdGeneric = Pages.insert({
    name: 'Generic page',
    url: 'generic',
    _projectId: projectId
  });
}

if (Meteor.users.find().count() === 0) {
  var userId = Accounts.createUser({
    username: 'root',
    email: 'root@root',
    password: 'root',
    profile: {
      first_name: 'Root',
      last_name: '',
      company: ''
    }
  });
  Houston._admins.insert({
    user_id: userId
  });
  Houston._admins.insert({
    exists: true
  });
}