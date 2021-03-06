'use strict'
let gulp = require('gulp');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let watchify = require('watchify');

/* browserify */ 
gulp.task('browserify', function() {
  let bundler = browserify({
    entries: ['./client/components/app.jsx'], // Only need initial file
    transform: [babelify], // Convert JSX to javascript
    debug: true, cache: {}, packageCache: {}, fullPaths: false
  });

  let watcher = watchify(bundler);

  return watcher
  .on('update', function() { // On update When any files updates
    let updateStart = Date.now();
        watcher.bundle()
        .on("error", function (err) { console.log("Error: " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./client/public/js'));
        console.log('Updated ', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create initial bundle when starting the task 
  .on("error", function (err) { console.log("Error: " + err.message); })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./client/public/js'));

});

/* default */
gulp.task('default', ['serve'], function() {});

/* serve */
gulp.task('serve', ['browserify'], function() {});