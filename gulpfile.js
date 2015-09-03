var gulp = require("gulp"),
    concat = require("gulp-concat"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    coffee = require("gulp-coffee"),
    newer = require("gulp-newer"),
    nodemon = require("gulp-nodemon"),
    gutil = require("gulp-util"),
    sourcemaps = require("gulp-sourcemaps"),
    lr = require("gulp-livereload"),
    gulpif = require("gulp-if");

var SRC = 'src';
var DEST = 'tmp';
var dev = false;

gulp.task('dev', function() {
  dev = true;
  nodemon({
    script: 'server.js',
    nodeArgs: ['--harmony'],
    ext: 'js',
    ignore: ["tmp"]
  })
  .on('start', ['source', 'watch']);
});

gulp.task('source', ['templates','styles','images','scripts']);

gulp.task('watch', function() {
  gulp.watch(SRC+'/jade/*.jade', ['templates']);
  gulp.watch(SRC+'/sass/**/*.scss', ['styles']);
  gulp.watch(SRC+'/scripts/*.coffee', ['scripts']);
});

gulp.task('templates', function() {
  gulp.src('src/jade/*.jade')
    // .pipe(newer(DEST))
    .pipe(jade({
      doctype: 'html',
      pretty: true,
      // debug: true,
      // compileDebug: true
    }))
    .pipe(gulp.dest(DEST))
    .pipe(gulpif(dev,lr()));
});

gulp.task('styles', function() {
  gulp.src('src/sass/main.scss')
    .pipe(newer(DEST+'/styles'))
    .pipe(sass({
      includePaths: require('node-neat').includePaths,
      loadPath: 'src/sass',
      errLogToConsole: true
    }))
    .pipe(gulp.dest(DEST+'/styles'))
    .pipe(gulpif(dev,lr()));
});

gulp.task('images', function() {
  gulp.src('src/images/*.*')
    .pipe(newer(DEST+'/images'))
    .pipe(gulp.dest(DEST+'/images'));
});

gulp.task('scripts', function() {
  gulp.src('src/scripts/*.coffee')
    .pipe(newer(DEST+'/js'))
    .pipe(concat('scripts.coffee'))
    .pipe(sourcemaps.init())
    .pipe(coffee({bare:true})).on('error', gutil.log)
    .pipe(gulp.dest(DEST+'/js'))
    .pipe(gulpif(dev,lr()));
});
