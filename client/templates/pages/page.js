Template.page.rendered = function() {
  // Modify the width of the container to fit the dimensions
  // of the image.
  if ($('img')) {
    var width = $('img').attr('width');
    $('.container').css({
      'width': width + 'px',
      'max-width': width + 'px',
      'padding': 0
    });
  }
};

Template.page.helpers({
  src: function() {
    return this.imageUrl;
  },
  width: function() {
    // If a width has been specified use it, otherwise fall back to
    // the image width.
    return this.width ? this.width : this._imageAttributes.dimensions.width;
  },
  uploadCallbacks: function() {
    var templateContext = this;
    return {
      formData: function() {
        var project = Projects.findOne({
            _id: templateContext._projectId
          }),
          client = Clients.findOne({
            _id: project._clientId
          }),
          path = client.url.toUnderscores() + '/' + project.url.toUnderscores();
        return {
          path: path,
          _pageId: templateContext._id
        }
      },
      finished: function(index, fileInfo, templateContext) {
        var width = templateContext.width ? templateContext.width : fileInfo.dimensions.width;
        $('.container').css({
          'width': width,
          'max-width': width
        });
      }
    }
  }
});