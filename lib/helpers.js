Helpers = {};

String.prototype.toUnderscores = function() {
  return this.toString().replace(/\W+/g, '_').toLowerCase();
};

String.prototype.toDashes = function() {
  return this.toString().replace(/\W+/g, '-').toLowerCase();
};

/**
 * Ensures a url string is unique.
 *
 * @param type
 *   A collection object to search.
 * @param searchContext
 *   An object containing the id of the current item not to search for
 *   and the parent item's id.
 */
String.prototype.uniqueUrl = function(type, searchContext) {
  var urlString = this.toString(),
    finalUrl = urlString;

  var findUrl = function(urlString) {
    searchContext.url = urlString;
    return type.findOne(searchContext);
  };

  var updateUrl = function(urlString) {
    var matches = urlString.match(/-(\d+?)$/);

    if (matches && matches[1]) {
      var id = matches[1];
      id ++;
      urlString = urlString.replace(/-\d+?$/, '-' + id);
      return urlString;
    }
    else {
      return urlString + '-1';
    }
  };

  var checkUrl = function(urlString) {
    if (findUrl(urlString)) {
      // This url is not unique so append a number.
      urlString = updateUrl(urlString);
      // Recheck the url
      checkUrl(urlString);
    }
    else {
      // Update the final url string with the current url string.
      finalUrl = urlString;
    }
  };

  checkUrl(urlString);
  return finalUrl;
};