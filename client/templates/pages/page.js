Template.page.rendered = function() {
  if ($('img')) {
    var width = $('img').attr('width');
    $('.container').css({
      'width': width + 'px',
      'padding': 0
    });
  }
};

Template.page.helpers({
  src: function() {
    console.log(this);
    return this.imageUrl;
  },
  width: function() {
    return this._imageAttributes.dimensions.width;
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
        $('.container').css({'max-width': fileInfo.dimensions.width});
      }
    }
  }
});