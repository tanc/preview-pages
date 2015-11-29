Meteor.subscribe('clients');
Meteor.subscribe('projects');
Meteor.subscribe('pages');
Meteor.subscribe('images');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template._loginButtonsLoggedOutDropdownOverride.replaces("_loginButtonsLoggedOutDropdown");
Template._loginButtonsLoggedInDropdownOverride.replaces("_loginButtonsLoggedInDropdown");