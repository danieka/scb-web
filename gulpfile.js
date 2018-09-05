'use strict';

var gulp = require('gulp'), concat = require('gulp-concat');
var cloudfront = require('gulp-cloudfront-invalidate');
var runSequence = require('run-sequence')
var fs = require('fs')
var os = require('os')

var file = fs.readFileSync(os.homedir() + '/.aws/credentials.danielk')
var lines = file.toString().split("\n")
var AWS = {
    "accessKeyId": lines[1].split("=")[1].trim(),
    "secretAccessKey": lines[2].split("=")[1].trim(),
}

var s3 = require('gulp-s3-upload')(AWS);

var uploadOpts = { Bucket: "", ACL: "public-read" }
gulp.task('upload', () => gulp.src('./public/**').pipe(s3(uploadOpts)))


var settings = {
    distribution: "", // Cloudfront distribution ID
    paths: ['/*'],          // Paths to invalidate
    accessKeyId: AWS.accessKeyId,             // AWS Access Key ID
    secretAccessKey: AWS.secretAccessKey,         // AWS Secret Access Key
    wait: true                      // Whether to wait until invalidation is completed (default: false)
}
gulp.task("cloudfront", () => {
    return gulp.src('*')
        .pipe(cloudfront(settings));
})

gulp.task('deploy', function(done) {
    uploadOpts.Bucket = "scb.danielk.se"
    settings.distribution = "EXQOHJR9ZL9XC"
    runSequence("upload", "cloudfront", done)
});
