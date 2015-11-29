Template.projectsList.helpers({
  projects: function() {
    return Projects.find({
      _clientId: this._id
    }, {sort: {weight: 1}});
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
  Sortable.create(projectsList, {
    animation: 150,
    onUpdate: function(ui) {
      // Get the dragged html element and the one before
      // and after it.
      el = $(ui.item).get(0);
      before = $(ui.item).prev().get(0);
      after = $(ui.item).next().get(0);

      // Blaze.getData takes as a parameter an html element
      // and will return the data context that was bound when
      // that html element was rendered.
      if (!before) {
        // If it was dragged into the first position grab the
        // next element's data context and subtract one from the weight.
        newWeight = Blaze.getData(after).weight - 1;
      } else if (!after) {
        // If it was dragged into the last position grab the
        // previous element's data context and add one to the weight.
        newWeight = Blaze.getData(before).weight + 1;
      }
      else
      // Else take the average of the two weights of the previous
      // and next elements.
        newWeight = (Blaze.getData(after).weight +
          Blaze.getData(before).weight)/2;

      newWeight = newWeight ? newWeight : 0;
      // Update the dragged Item's weight.
      Meteor.call('updateProjectWeight', Blaze.getData(el)._id, newWeight, function(error, result) {
        if (error) {
          alert(error);
        }
      });
    }
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