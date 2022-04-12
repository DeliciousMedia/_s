/* jshint esversion: 8 */

require('es6-promise').polyfill();

var gulp = require('gulp'),
  sass             = require('gulp-sass')(require('sass')),
  rtlcss           = require('gulp-rtlcss'),
  autoprefixer     = require('gulp-autoprefixer'),
  plumber          = require('gulp-plumber'),
  gutil            = require('gulp-util'),
  rename           = require('gulp-rename'),
  concat           = require('gulp-concat'),
  jshint           = require('gulp-jshint'),
  uglify           = require('gulp-uglify'),
  imagemin         = require('gulp-imagemin'),
  imageminmozjpeg  = require('imagemin-mozjpeg'),
  cssnano          = require('gulp-cssnano'),
  newer            = require('gulp-newer'),
  cached           = require('gulp-cached'),
  stripcsscomments = require('gulp-strip-css-comments'),
  removeemptylines = require('gulp-remove-empty-lines');


var onError = function(err) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};

// SASS
gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss', { sourcemaps: true })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(removeemptylines())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css',  { sourcemaps: '.' }))
});

// SASS RTL
gulp.task('sass-rtl', function() {
  return gulp.src('./src/sass/**/*.scss', { sourcemaps: true })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(removeemptylines())
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest('./assets/css'))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css', { sourcemaps: '.'  }));

});

// Additional CSS
gulp.task('css', function() {
  return gulp.src('./src/css/**/*.css', { sourcemaps: true })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(removeemptylines())
    .pipe(gulp.dest('./assets/css', { sourcemaps: '.'  }))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css', {sourcemaps: '.'}))
});

// Additional CSS-RTL
gulp.task('css-rtl', function() {
  return gulp.src('./src/css/**/*.css', { sourcemaps: true })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(removeemptylines())
    .pipe(gulp.dest('./assets/css', { sourcemaps: '.'  }))
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/css', {sourcemaps: '.'}))
});

// JavaScript
gulp.task('js', function() {
  return gulp.src(['./src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('_s.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(removeemptylines())
    .pipe(gulp.dest('./assets/js'));
});




// Images
// By default we use mozjpeg at 90% which is very slightly lossy but shouldn't be perceptible.
// Where this is unacceptable, switch out for jpegtran which is lossless but much smaller savings.
gulp.task('images', function() {
  var images = gulp.src('./src/img/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(newer('./assets/img'))
    .pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
      //imagemin.jpegtran({progressive: true}),
      imageminmozjpeg({
        progressive: true,
        quality: 90
      }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('./assets/img'));

  return images;

});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/css/**/*.css', gulp.series('css'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/img/**/*', gulp.series('images'));
});

// Watch with rtl
gulp.task('watch-rtl', function() {
  gulp.watch('src/sass/**/*.scss', gulp.parallel('sass','sass-rtl'));
  gulp.watch('src/css/**/*.css', gulp.series('css'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/img/**/*', gulp.series('images'));
});


gulp.task('build', gulp.parallel(['sass', 'css', 'js', 'images']));
gulp.task('build-rtl', gulp.parallel(['sass','sass-rtl', 'css', 'css-rtl', 'js', 'images']));

gulp.task('start', gulp.series('build','watch'));
gulp.task('start-rtl', gulp.series('build-rtl','watch-rtl'));

gulp.task('default', gulp.series('start'));
