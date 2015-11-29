Pages = new Mongo.Collection('pages');

Meteor.methods({
  addPage: function(page) {
    check(page.name, String);
    check(page.url, String);
    // Make doubly sure the string is url sage.
    page.url = encodeURI(page.url.replace(/\W+/g, '-').toLowerCase());
    Pages.insert(page);
  },
  deletePage: function(page) {
    Pages.remove(page);
  },
  editPage: function(page) {
    Pages.update(page.id, {$set: {
      name: page.name,
      url: page.url,
      imageUrl: page.imageUrl,
      _imageAttributes: page._imageAttributes
    }});
  }
});