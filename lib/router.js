Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('clients');
  }
});

Router.onBeforeAction('loading');

Router.route('/', {
  name: 'clientsList'
});

Router.route('/:_clientUrl/:_projectUrl/:_pageUrl', {
  data: function() {
    return Pages.findOne({url: this.params._pageUrl});
  },
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
    var project = Projects.findOne({url: this.params._projectUrl});
    var page = Pages.findOne({url: this.params._pageUrl});
    if (typeof client === 'undefined' || typeof project === 'undefined' || typeof page === 'undefined' || project._clientId !== client._id || page._projectId !== project._id) {
      this.render('notFound');
    }
    else {
      this.render();
    }
  }
});

Router.route('/:_clientUrl/:_projectUrl', function() {
  var client = Clients.findOne({url: this.params._clientUrl});
  var project = Projects.findOne({url: this.params._projectUrl});

  if (typeof client === 'undefined' || typeof project === 'undefined' || project._clientId !== client._id) {
    this.render('notFound');
  }
  else {
    this.render('pagesList', {
      data: project
    });
  }
}, {
  name: 'pagesList'
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