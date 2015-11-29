Projects = new Mongo.Collection('projects');

Meteor.methods({
  addProject: function(project) {
    check(project.name, String);
    check(project.url, String);
    // Make doubly sure the string is url sage.
    project.url = encodeURI(project.url.replace(/\W+/g, '-').toLowerCase());
    project.weight = 1000;
    Projects.insert(project);
  },
  deleteProject: function(project) {
    Projects.remove(project);
    // Delete all child pages.
    Pages.find({_projectId: project._id}).forEach(function(page) {
      Pages.remove(page);
    });
  },
  editProject: function(project) {
    Projects.update(project.id, {$set: {
      name: project.name,
      url: project.url
    }});
  },
  updateProjectWeight: function(id, weight) {
    Projects.update(id, {$set: {weight: weight}});
  }
});