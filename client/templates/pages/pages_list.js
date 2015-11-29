Template.pagesList.helpers({
  pages: function() {
    return Pages.find({
      _projectId: this._id
    }, {sort: {weight: 1}});
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
  Sortable.create(pagesList, {
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
      Meteor.call('updatePageWeight', Blaze.getData(el)._id, newWeight, function(error, result) {
        if (error) {
          alert(error);
        }
      });
    }
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
      // Check whether there is an uploaded image associated and if
      // so display a field so it can be deleted.
      if (typeof page.imageUrl !== 'undefined' && page.imageUrl) {
        var attr = page._imageAttributes,
          thumbUrl = attr.baseUrl + '/' + attr.subDirectory + '/thumbnail_big/' + attr.name + '?' + randomToken();
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
        // Load the current page data.
        var previousPage = Pages.findOne(pageId);
        page._imageAttributes = previousPage._imageAttributes;
        page.imageUrl = previousPage.imageUrl;
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