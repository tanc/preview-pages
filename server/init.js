Meteor.startup(function() {

  // Define the uploads directory.
  var uploadsDir = process.env.UPLOADS_DIR;
  if (typeof(uploadsDir) === 'undefined') {
    uploadsDir = Meteor.absolutePath + '/.uploads/';
  }

  UploadServer.init({
    tmpDir: uploadsDir + '/tmp',
    uploadDir: uploadsDir,
    checkCreateDirectories: true,
    overwrite: true,
    imageVersions: {
      thumbnail_big: {width: 400, height: 300}
    },
    crop: true,
    getDirectory: function(fileInfo, formData) {
      return formData.path;
    },
    finished: function(fileInfo, formData) {
      fileInfo._pageId = formData._pageId;
      var page = Pages.findOne({
        _id: fileInfo._pageId
      });

      getImageSize = function(url, callback) {
        gm(url).size(function(err, value) {
          if (err) {
            throw new Error(err.message);
          }
          else {
            callback && callback(null, value);
          }
        });
      };

      var getImageSizeSynchronously = Meteor.wrapAsync(getImageSize);

      fileInfo.dimensions = getImageSizeSynchronously(fileInfo.url);

      Pages.update(page._id, {$set: {
        imageUrl: fileInfo.url,
        _imageAttributes: fileInfo
      }});

      // Crop the thumbnail version.
      var thumbnailPath = Meteor.absolutePath + '/.uploads/' + fileInfo.subDirectory + '/thumbnail_big/' + fileInfo.name,
        fullPath = Meteor.absolutePath + '/.uploads/' + fileInfo.subDirectory + '/' + fileInfo.name;

      Meteor.setTimeout(function() {
        Imagemagick.crop({
          srcPath: fullPath,
          dstPath: thumbnailPath,
          width: 400,
          height: 300,
          quality: 1,
          gravity: "North"
        });
      }, 1000);


    }
  });
});