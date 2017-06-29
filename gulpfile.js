const fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
// var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var jsonminify = require('gulp-jsonminify');
var imagemin = require('gulp-imagemin');
// var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var connectPHP = require('gulp-connect-php');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var lazypipe = require('lazypipe');

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

// var mvt_bg = 'http://gis1test.usask.ca:8080/data/osm2vectortiles.json';
var mvt_bg = 'https://gis1test.usask.ca/basemap/data/osm2vectortiles.json';

var htmlSources = ['builds/development/*.html', 'builds/development/*.php'];
var jsonSources = [outputDir + 'js/*.json'];
var jsSources = [

  'builds/components/js/_jquery.cookie.js',

  'builds/components/js/default.js',
  'builds/components/js/utils.js',
  'builds/components/js/structure.js',
  'builds/components/js/classMetaBroker.js',
  'builds/components/js/classLayerBroker.js',
  'builds/components/js/classFileBroker.js',
  'builds/components/js/classHeatmap.js',
  'builds/components/js/classSoilLayer.js',
  'builds/components/js/classVectorLayer.js',
  'builds/components/js/classRasterLayer.js',
  'builds/components/js/classInfoPanel.js',
  'builds/components/js/classLocations.js',

  'builds/components/js/data.js',
  'builds/components/js/initUi.js',
  'builds/components/js/initMap.js'

  /* put individual js here instead of using wildcard
    to process them in the pre-defined order */
];
var sassSources = [
  'builds/components/sass/main.scss',
  'builds/components/sass/*.css',
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
  'node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
  'node_modules/bootstrap-select/dist/css/bootstrap-select.min.css',
  'node_modules/mapbox-gl/dist/mapbox-gl.css',
  'node_modules/mapbox-gl-draw/dist/mapbox-gl-draw.css',
  'node_modules/bootstrap-toggle/css/bootstrap2-toggle.min.css'
];

var imgSources = [
  'builds/development/img/*.jpg',
  'builds/development/img/*.jpeg',
  'builds/development/img/*.png'
  // 'node_modules/bootstrap-colorpicker/dist/img/**/*'
];

var phpSources = [
  'builds/development/lib/**'
];

gulp.task('jstree-fix', function(){

  fs.stat(outputDir + 'img/jstree', function(err, stat) {
    if(err == null){
        console.log('img/jstree folder exists. Skipping...');
    }else{
      if(err.code === 'ENOENT'){
        var imgSrc = [
          'node_modules/jstree/dist/themes/default/*.png',
          'node_modules/jstree/dist/themes/default/*.gif'
        ];
        var cssSrc = ['node_modules/jstree/dist/themes/default/style.min.css'];
        gulp.src(imgSrc)
            .pipe(gulp.dest(outputDir + 'img/jstree/'));

        var jstree_fix = lazypipe()
          .pipe(replace)
          .pipe(replace, 'url(throbber.gif)', 'url(../img/jstree/throbber.gif)')
          .pipe(replace, 'url(32px.png)', 'url(../img/jstree/32px.png)')
          .pipe(replace, 'url(40px.png)', 'url(../img/jstree/40px.png)')
          .pipe(replace, 'url(40px.png)', 'url(../img/jstree/40px.png)');

        gulp.src(cssSrc)
            .pipe(jstree_fix())
            .pipe(concat('jstree.css'))
            // .pipe(rename('jstree.css'))
            .pipe(gulp.dest('builds/components/sass/'))
      }
    }
  });
});

gulp.task('php-lib', function() {
  gulp.src(phpSources)
  .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'lib')))
  // .pipe(connect.reload())
  .pipe(livereload());
});

gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  // .pipe(connect.reload())
  .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(jshint())
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
  gulp.src('builds/development/json/structure.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/json/')))
    .pipe(livereload());
});

gulp.task('img', function() {
  gulp.src(imgSources)
      .pipe(gulpif(env === 'production', gulp.dest('builds/production/img/')))
});

var font_fix = lazypipe()
  .pipe(replace)
  .pipe(replace, '../font', '../fonts')

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
    .pipe(concat('main.css'))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(livereload());
});

// fix mvt location and paths
var mvt_fix = lazypipe()
  .pipe(replace)
  .pipe(replace, 'mbtiles://{osm2vectortiles}', mvt_bg)
  .pipe(replace, 'sprites/', 'gl-styles/sprites/')
  .pipe(replace, 'glyphs/', 'gl-styles/glyphs/');

gulp.task('gl-styles', function() {
  fs.stat(outputDir + 'gl-styles/styles', function(err, stat) {
    if(err == null){
        console.log('Style folder exists. Skipping...');
    }else{
      if(err.code === 'ENOENT'){
        gulp.src([
          'node_modules/tileserver-gl-styles/**'
        ])
        .pipe(gulpif('*.json', mvt_fix()))
        .pipe(gulp.dest(outputDir + 'gl-styles'));
      }
    }
  });
});

gulp.task('fonts', function() {
  gulp.src([
    'builds/components/fonts/*',
    'node_modules/bootstrap/fonts/*'
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

    port: 8083,
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

gulp.task('default', [ 'html', 'php-lib', 'js', 'json', 'img', 'jstree-fix', 'sass', 'fonts', 'gl-styles', 'php', 'watch' ]);
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('builds/development/*.html', [ 'html' ]);
  gulp.watch(jsSources, [ 'js' ]);
  gulp.watch('builds/development/js/*.json', [ 'json' ]);
  gulp.watch('builds/components/sass/*.scss', [ 'sass' ]);
});
