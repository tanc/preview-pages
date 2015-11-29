Helpers = {};

//Helpers.toUnderscore = function(str) {
//  return str.replace(/\W+/g, '_').toLowerCase();
//};
//
//Helpers.toDash = function(str) {
//  return str.replace(/\W+/g, '-').toLowerCase();
//};

String.prototype.toUnderscores = function() {
  return this.toString().replace(/\W+/g, '_').toLowerCase();
};

String.prototype.toDashes = function() {
  return this.toString().replace(/\W+/g, '-').toLowerCase();
};