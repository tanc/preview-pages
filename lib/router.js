Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.onBeforeAction('loading');

Router.route('/', {
  name: 'clientsList'
});

Router.route('/users', {
  name: 'usersAdmin',
  action: function() {
    if (Roles.userIsInRole(Meteor.user(), ['admin'])) {
      this.render('usersAdmin')
    }
  }
});

Router.route('/:_clientUrl/:_projectUrl/:_pageUrl', {
  name: 'page',
  layoutTemplate: 'layout_no_nav',
  waitOn: function() {
    return [
      Meteor.subscribe('clients'),
      Meteor.subscribe('projects'),
      Meteor.subscribe('pages')
    ];
  },
  action: function() {
    var client = Clients.findOne({url: this.params._clientUrl});
    var project = Projects.findOne({url: this.params._projectUrl, _clientId: client._id});
    var page = Pages.findOne({url: this.params._pageUrl, _projectId: project._id});
    if (typeof client === 'undefined' || typeof project === 'undefined' || typeof page === 'undefined' || project._clientId !== client._id || page._projectId !== project._id) {
      this.render('notFound');
    }
    else {
      this.render('page', {
        data: page
      });
    }
  }
});

Router.route('/:_clientUrl/:_projectUrl', {
  name: 'pagesList',
  waitOn: function() {
    return [
      Meteor.subscribe('clients'),
      Meteor.subscribe('projects'),
      Meteor.subscribe('pages')
    ];
  },
  action: function() {
    var client = Clients.findOne({url: this.params._clientUrl});
    var project = Projects.findOne({url: this.params._projectUrl, _clientId: client._id});
    if (typeof client === 'undefined' || typeof project === 'undefined' || project._clientId !== client._id) {
      this.render('notFound');
    }
    else {
      this.render('pagesList', {
        data: project
      });
    }
  }
});

Router.route('/:_clientId', function() {
  var client = Clients.findOne({url: this.params._clientId});
  if (typeof client === 'undefined') {
    this.render('notFound');
  }
  else {
    this.render('projectsList', {
      data: client
    });
  }
}, {
  name: 'projectsList'
});

