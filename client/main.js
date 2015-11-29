Meteor.subscribe('clients');
Meteor.subscribe('projects');
Meteor.subscribe('pages');
Meteor.subscribe('images');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template._loginButtonsLoggedOutDropdownOverride.replaces("_loginButtonsLoggedOutDropdown");
Template._loginButtonsLoggedInDropdownOverride.replaces("_loginButtonsLoggedInDropdown");

Tracker.autorun(function() {
  if (Meteor.userId()) {
    $('body').addClass('logged-in').removeClass('logged-out');
  }
  else {
    $('body').addClass('logged-out').removeClass('logged-in');
  }
});

Meteor.startup(function() {
  if (Meteor.userId()) {
    $('body').addClass('logged-in');
  }
  else {
    $('body').addClass('logged-out');
  }
});