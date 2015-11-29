Template.projectsList.helpers({
  projects: function() {
    return Projects.find({
      _clientId: this._id
    });
  },
  client: function() {
    return this.name;
  }
});

Template.projectsList.rendered = function () {
  $('form').parsley({
    trigger: 'change',
    successClass: 'has-success',
    errorClass: 'has-error',
    classHandler: function(ParsleyField) {
      return ParsleyField.$element.parent();
    },
    errorsWrapper: '<span class=\"help-block\"></span>',
    errorTemplate: '<span></span>'
  }).on('field:error', function() {
    this.$element.addClass('form-control-error');
  });
};

Template.projectsList.events({
  'click .add-new-project': function(e) {
    e.preventDefault();
    $('#editmodal').modal('show');
    $('.form-control').val('');
    $('.form-group').removeClass('has-success');
  },
  'click .edit': function(e) {
    e.preventDefault();
    project = $(e.target).closest('.project');
    projectId = project.attr('data-id');
    if (typeof projectId !== "undefined") {
      var project = Projects.findOne(projectId);
      $('#projectName').val(project.name);
      $('#projectUrl').val(project.url);
    }
    $('.form-group').removeClass('has-success');
    ModalHelper.openModalFor(projectId);
  }
});

Template.editModalProjectTemplate.events({
  'submit form': function(event) {

    event.preventDefault();

    var projectId = Session.get('selectedItemId');

    var project = {
      name: $('#projectName').val(),
      url: $('#projectUrl').val().replace(/\W+/g, '-').toLowerCase(),
      _clientId: this._id
    };

    // Fall back to using the project name for the url.
    if (project.url == '') {
      project.url = project.name.replace(/\W+/g, '-').toLowerCase();
    }

    if (project.name != '') {
      if (!projectId) {
        Meteor.call('addProject', project, function (error, result) {
          if (error) {
            alert(error);
          }
        });
      }
      else {
        _.extend(project, {id: projectId});
        Meteor.call('editProject', project, function(error, result) {
          if (error) {
            alert(error);
          }
        });
      }

      $('#editmodal').modal('hide');
    }
  }
});