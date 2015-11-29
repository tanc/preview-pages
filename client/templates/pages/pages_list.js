Template.pagesList.helpers({
  pages: function() {
    return Pages.find({
      _projectId: this._id
    });
  },
  client: function() {
    var client = Clients.findOne({
      _id: this._clientId
    });
    return client.name;
  },
  project: function() {
    return this.name;
  },
  breadcrumb_client: function() {
    var client = Clients.findOne({
      _id: this._clientId
    });
    return client.url;
  },
  breadcrumb_project: function() {
    return this.url;
  }
});

Template.pagesList.rendered = function () {
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

Template.pagesList.events({
  'click .add-new-page': function(e) {
    e.preventDefault();
    $('#editmodal').modal('show');
    $('.form-control').val('');
    $('.form-group').removeClass('has-success');
  },
  'click .edit': function(e) {
    e.preventDefault();
    page = $(e.target).closest('.page__item');
    pageId = page.attr('data-id');

    if (typeof pageId !== "undefined") {
      var page = Pages.findOne(pageId);
      $('#pageName').val(page.name);
      $('#pageUrl').val(page.url);
      var attr = page._imageAttributes,
        thumbUrl = attr.baseUrl + '/' + attr.subDirectory + '/thumbnail_big/' + attr.name + '?' + randomToken();
      // Check whether there is an uploaded image associated and if
      // so display a field so it can be deleted.
      if (typeof page.imageUrl !== 'undefined' && page.imageUrl) {
        $('#pageImageUrl').attr({'src': thumbUrl}).closest('.form-group').removeClass('hidden');
      }
      else {
        $('#pageImageUrl').closest('.form-group').addClass('hidden');
      }
    }
    $('.form-group').removeClass('has-success');
    ModalHelper.openModalFor(pageId);
  }
});

Template.editModalPageTemplate.events({
  'submit form': function(event) {

    event.preventDefault();

    var pageId = Session.get('selectedItemId');

    var page = {
      name: $('#pageName').val(),
      url: $('#pageUrl').val().replace(/\W+/g, '-').toLowerCase(),
      _projectId: this._id
    };

    // Fall back to using the page name for the url.
    if (page.url == '') {
      page.url = page.name.replace(/\W+/g, '-').toLowerCase();
    }

    if (page.name != '') {
      if (!pageId) {
        Meteor.call('addPage', page, function (error, result) {
          if (error) {
            alert(error);
          }
        });
      }
      else {
        _.extend(page, {id: pageId});
        Meteor.call('editPage', page, function(error, result) {
          if (error) {
            alert(error);
          }
        });
      }

      $('#editmodal').modal('hide');
    }
  },
  'click .delete-image': function(event) {
    event.preventDefault();
    $('#pageImageUrl').closest('.form-group').addClass('hidden');
    var pageId = Session.get('selectedItemId');

    var page = Pages.findOne(pageId);

    page.imageUrl = '';
    page._imageAttributes = {};
    _.extend(page, {id: pageId});

    Meteor.call('editPage', page, function (error, result) {
      if (error) {
        alert(error);
      }
    });

  }
});