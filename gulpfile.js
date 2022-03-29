require('es6-promise').polyfill();

var gulp = require('gulp'),
   sass = require('gulp-sass')(require('sass')),
    sourcemaps     = require('gulp-sourcemaps');
    //rtlcss         = require('gulp-rtlcss'),
    autoprefixer     = require('gulp-autoprefixer'),
    plumber          = require('gulp-plumber'),
    gutil            = require('gulp-util'),
    rename           = require('gulp-rename'),
//    concat           = require('gulp-concat'),
    jshint           = require('gulp-jshint'),
    uglify           = require('gulp-uglify'),
    imagemin         = require('gulp-imagemin'),
    imageminmozjpeg  = require('imagemin-mozjpeg'),
    cssnano          = require('gulp-cssnano'),
    newer            = require('gulp-newer');
    cached           = require('gulp-cached');
    stripcsscomments = require('gulp-strip-css-comments');


var onError = function(err) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};

// Sass
gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'));
  //  .pipe(rtlcss())                     // Convert to RTL
  //  .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
  //  .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
});

// CSS
gulp.task('css', function() {
  return gulp.src('./src/css/**/*.css')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(stripcsscomments())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cssnano({
      autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'iOS >= 8'], add: true }
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'));
  //  .pipe(rtlcss())                     // Convert to RTL
  //  .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
  //  .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
});
// JavaScript
gulp.task('js', function() {
  return gulp.src(['./src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('./assets/js'))
    //.pipe(concat('app.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
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

gulp.task('default', gulp.parallel('sass', 'css', 'js', 'images', 'watch'));
gulp.task('build', gulp.parallel(['sass', 'css', 'js', 'images']));
