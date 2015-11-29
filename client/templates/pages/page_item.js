Template.pageItem.helpers({
  url: function() {
    var project = Projects.findOne({_id: this._projectId});
    var client = Clients.findOne({_id: project._clientId});
    return '/' + client.url + '/' + project.url + '/' + this.url;
  },
  hasPreview: function() {
    return typeof this._imageAttributes != 'undefined' && !_.isEmpty(this._imageAttributes);
  },
  previewUrl: function() {
    if (typeof this._imageAttributes != 'undefined' && !_.isEmpty(this._imageAttributes)) {
      var attr = this._imageAttributes;
      return attr.baseUrl + '/' + attr.subDirectory + '/thumbnail_big/' + attr.name + '?' + randomToken();
    }
    else {
      return '/images/no_image.png';
    }
  }
});

Template.pageItem.events({
  'click .delete': function(e) {
    e.preventDefault();
    Meteor.call('deletePage', this, function(error, result) {
      if (error) {
        alert(error);
      }
    });
  }
});