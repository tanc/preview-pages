Template.usersAdmin.helpers({
  // Check if the user is an admin.
  isAdminUser: function() {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
  }
});