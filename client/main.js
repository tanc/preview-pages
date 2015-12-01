Meteor.subscribe('clients');
Meteor.subscribe('projects');
Meteor.subscribe('pages');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL_CONFIRM"
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