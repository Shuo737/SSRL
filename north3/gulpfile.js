var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var imagemin = require('gulp-imagemin');
// var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var connectPHP = require('gulp-connect-php');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var lazypipe = require('lazypipe');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var env = process.env.NODE_ENV || 'development';
var outputDir;
var sassStyle;
if(env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

var docSources = [
  'builds/development/docs/manual.md.html',
  'builds/development/docs/manual.css'
];

var htmlSources = [
  'builds/development/*.html',
  'builds/development/*.htm',
  'builds/development/*.php',
];
var phpSources = [
  'builds/development/lib/**'
];
var jsonSources = [outputDir + 'js/*.json'];
var jsSources = [
  // 'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'builds/components/js/utils.js',
  'builds/components/js/default.js',

  // libraries
  'builds/components/js/L.heatmap.js',
  'builds/components/js/_jquery.cookie.js',
  'builds/components/js/_w2ui-1.5.rc1.min.js',

  // classes, order here is important
  'builds/components/js/initUi.js',
  'builds/components/js/classDataBroker.js',
  'builds/components/js/classMenu.js',
  'builds/components/js/classMenuBroker.js',
  'builds/components/js/classInitBroker.js',

  'builds/components/js/classChartConfig.js',
  'builds/components/js/classCard.js',
  'builds/components/js/classCardBroker.js',
  'builds/components/js/classSpiderBroker.js',
  'builds/components/js/classLegend.js',
  'builds/components/js/classSvgLayer.js',
  'builds/components/js/classFields.js',
  'builds/components/js/classLayer.js',
  'builds/components/js/classLayerManager.js',
  'builds/components/js/classLayerAnimation.js',
  'builds/components/js/classRamp.js',
  'builds/components/js/classRampBroker.js',
  'builds/components/js/classClassifier.js',
  'builds/components/js/classTheme.js',
  'builds/components/js/classBarDotLayer.js',
  'builds/components/js/classPieDotLayer.js',
  'builds/components/js/classBarLayer.js',
  'builds/components/js/classPieLayer.js',
  'builds/components/js/classRealPieLayer.js',
  'builds/components/js/classBarHeatLayer.js',
  'builds/components/js/classPieHeatLayer.js',
  'builds/components/js/classChoropLayer.js',
  'builds/components/js/classRedrawBroker.js',
  'builds/components/js/classNode.js',
  'builds/components/js/classGeoBroker.js',
  'builds/components/js/classFileBroker.js',
  'builds/components/js/classFilter.js',
  'builds/components/js/classFilterManager.js',

  'builds/components/js/classTooltip.js',
  'builds/components/js/initLeftPanel.js',

  // 'builds/components/js/initUiMainMenu.js',
  'builds/components/js/initMap.js',

  /* put individual js here instead of using wildcard
    to process them in the pre-defined order */
];
var sassSources = [
  'builds/components/sass/main.scss',
  'builds/components/sass/*.css',
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
  'node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css',
  'node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
  'node_modules/bootstrap-select/dist/css/bootstrap-select.min.css',
  'node_modules/bootstrap-toggle/css/bootstrap2-toggle.min.css',
  'node_modules/leaflet/dist/leaflet.css'
];

var imgSources = [
  'builds/development/img/**',
  'node_modules/bootstrap-colorpicker/dist/img/**/*'
];

gulp.task('php-lib', function() {
  gulp.src(phpSources)
  .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'lib')))
  // .pipe(connect.reload())
  .pipe(livereload());
});

var docs_fix = lazypipe()
  .pipe(replace)
  .pipe(replace, '<title>manual</title>', '<title>Online Documentation</title><link rel="stylesheet" href="manual.css"></link>')
  .pipe(rename, 'manual.html');

gulp.task('docs', function(){
  if(env === 'production'){
    gulp.src(docSources)
      .pipe(gulpif('manual*.html', docs_fix()))
      .pipe(gulpif('*.html', minifyHTML({ //  Php won't get minified. So it's safe
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        collapseWhitespace: true
      })))
      .pipe(gulp.dest(outputDir + 'docs'))
      .pipe(livereload());
  }else{
    gulp.src(docSources)
      .pipe(gulpif('manual*.html', docs_fix()))
      .pipe(gulp.dest(outputDir + 'docs'))
      .pipe(livereload());
  }
});

gulp.task('html', function() {
  if(env === 'production'){
    gulp.src(htmlSources)
    .pipe(minifyHTML({ //  Php won't get minified. So it's safe
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(outputDir))
    .pipe(livereload());
  }else{
    gulp.src(htmlSources)
    .pipe(gulpif('manual*.html', rename('manual.html')))
    .pipe(gulp.dest(outputDir))
    .pipe(livereload());
  }
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(gulpif('[^_]*.js', jshint())) // do not parse external js libraries (whose filename starts with '_')
    .pipe(jshint.reporter('default'))
  // .pipe(jshint.reporter('fail'))
    .pipe(concat('script.js'))
    .pipe(browserify().on('error', function(e){
      // print the error (can replace with gulp-util)
      console.log(e.message);
      // end this stream
      this.emit('end');
    }))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js/'))
    .pipe(livereload());
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
    .pipe(livereload());
});

gulp.task('img', function() {
  gulp.src(imgSources)
      .pipe(gulp.dest(outputDir + 'img'));
});

var font_fix = lazypipe()
  .pipe(replace)
  .pipe(replace, '../font', '../fonts');

gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(gulpif('*fontello.css', font_fix()))
      // .pipe(gulpif('builds/components/sass/main.scss', compass({
      //   sass: 'builds/components/sass',
      //   image: outputDir + 'img',
      //   style: sassStyle
      // })))
    .pipe(sass({
      outputStyle: sassStyle,
      precison: 3,
      errLogToConsole: true
      // ,includePaths: [bootstrapSass + 'assets/stylesheets']
    }))
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(livereload());
});

gulp.task('fonts', function() {
  gulp.src([
    'builds/components/fonts/*'
    // 'node_modules/bootstrap/fonts/*'
  ])
  .pipe(gulp.dest(outputDir + 'fonts'));
});

gulp.task('php', function() {
  connectPHP.server({
    hostname: '0.0.0.0', // 'localhost' fails to launch PHP server.

    /* remember to enable PDO support for PSQL (edit php.ini and uncomment the extension) */

    /*=====================================*/
    /* off-campus dev setup (Mac Book Pro) */
    /*-------------------------------------*/
    bin: '/usr/local/bin/php',
    ini: '/usr/local/etc/php/5.6/php.ini',
    /*=====================================*/

    /*=========================================*/
    /* dev setup for Lenovo server in Arts 282 */
    /*-----------------------------------------*/
    // bin: 'E:/Matthew/Software/wamp64/bin/php/php7.0.0/php.exe',
    // ini: 'E:/Matthew/Software/wamp64/bin/php/php7.0.0/php.ini',
    /*=========================================*/

    port: 8081,
    base: outputDir,
    livereload: true
  });
});

// gulp.task('connect', function() {
//   connect.server({
//     root: outputDir,
//     port: 8080
//   })
// });

gulp.task('default', [ 'php-lib', 'docs', 'html', 'js', 'json', 'img', 'sass', 'fonts', 'php', 'watch' ]);
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('builds/development/*.html', [ 'html' ]);
  gulp.watch(jsSources, [ 'js' ]);
  gulp.watch('builds/development/js/*.json', [ 'json' ]);
  gulp.watch('builds/components/sass/*.scss', [ 'sass' ]);
});
