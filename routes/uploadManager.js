// config the uploader
var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    publicDir: __dirname + '/../public/uploaded',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl:  '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)$/i,
    imageTypes:  /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        width:  80,
        height: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    nodeStatic: {
        cache:  3600 // seconds to cache served files
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

var Mongoose = require('mongoose');
var db = Mongoose.connect('mongodb://localhost/fupload');
var Images = require('../models/image.js');
var async = require('async');

module.exports = function (router) {
    router.get('/upload', function(req, res) {
      uploader.get(req, res, function (obj) {
        res.send(JSON.stringify(obj)); 
      });
    });

    router.post('/upload', function(req, res) {
      uploader.post(req, res, function (obj) {
        var newobject = {
            files: []
        }
        async.forEach(obj.files, function(file, callback) {
            newimage = new Images(file)
            newimage.save();
            file._id = newimage._id;
            newobject.files.push(file); 
            callback();
        }, function(err) {
            if (err) return next(err);
            res.send(JSON.stringify(newobject)); 
        });

      });
      
    });

    router.delete('/uploaded/files/:name', function(req, res) {
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });
    return router;
}