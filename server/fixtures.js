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

if (Images.find().count() === 0) {
  Images.insert({
    _pageId: pageIdHome
  });
}

if (Meteor.users.find().count() === 0) {
  var userId = Accounts.createUser({
    username: 'tanc',
    email: 'tanc@agile.coop',
    password: 'tanc',
    profile: {
      first_name: 'Tancredi',
      last_name: "D'Onofrio",
      company: 'Agile Collective'
    }
  });
  Houston._admins.insert({                                                                                   // 74
    user_id: userId                                                                                         // 77
  });                                                                                                        //
  Houston._admins.insert({                                                                                   // 74
    exists: true                                                                                             // 78
  });                                                                                                        //
}