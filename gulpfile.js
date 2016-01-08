var gulp            = require('gulp'),
    less            = require('gulp-less'),
    server          = require('tiny-lr')(),
    minifyCSS       = require('gulp-minify-css'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    jshint          = require('gulp-jshint'),
    jscs            = require('gulp-jscs'),
    stylish         = require('gulp-jscs-stylish'),
    uglify          = require('gulp-uglify'),
    ngAnnotate      = require('gulp-ng-annotate'),
    nodemon         = require('gulp-nodemon'),
    notify          = require('gulp-notify'),
    refresh         = require('gulp-livereload'),
    wiredep         = require('wiredep').stream,
    inject          = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    lrPort          = 3000;

var paths = {
  styles: ['public/assets/css/*.less'],
  scripts: [
    'server.js',
    'public/app/*.js',
    'public/app/**/*.js',
    'app/models/*.js'
  ],
  html: [
    'public/app/views/*.html',
    'public/app/*.html'
  ],
  assets: ['public/assets/css'],
  angular: ['public/app/*.js', 'public/app/**/*.js'],
  dist: ['public/dist'],
  assetslogin: [
  'public/assets/js/placeholder.js',
  'public/assets/js/login.js',
  'public/assets/css/login.css',
  'public/assets/css/form-elements.css'
  ],
  assetshome: [
  'public/assets/js/placeholder.js',
  'public/assets/js/core.js',
  'public/assets/css/core.css'
  ]
};

gulp.task('css', function() {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest(paths.assets))
    .pipe(refresh(server));
});

gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(server));
});

gulp.task('html', function()  {
  gulp.src(paths.html)
    .pipe(refresh(server));
});

gulp.task('angular', function() {
  return gulp.src(paths.angular)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist))
    .pipe(refresh(server));
});

gulp.task('injectlogin', function()  {
  var sources = gulp.src(paths.assetslogin, {read: false});
  return  gulp.src(['login.html'],  {cwd: './public/app'})
    .pipe(inject(sources,{relative: true}))
    .pipe(gulp.dest('public/app'));
});

gulp.task('injecthome', function()  {
  var sources = gulp.src(paths.assetshome, {read: false});
  return  gulp.src(['home.html'],  {cwd: './public/app'})
    .pipe(inject(sources,{relative: true}))
    .pipe(gulp.dest('public/app'));
});


gulp.task('wiredep',  function  ()  {
  gulp.src(['./public/app/home.html', './public/app/login.html'])
    .pipe(wiredep({
      directory:  './public/assets/libs'
    }))
    .pipe(gulp.dest('./public/app'));
});

gulp.task('watch', function() {
  refresh.listen();
  // watch the less file and run the css task
  gulp.watch('public/assets/css/*.less', ['css']);
  refresh.listen();
  gulp.watch(['public/app/views/*.html', 'public/app/views/**/*.html'],['html']);
  gulp.watch(['bower.json'],  ['wiredep']);
  refresh.listen();
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'app/models/*.js'], ['js']);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html less',
    env: { 'NODE_ENV': 'development' }
  })
    .on('restart', function () {
      console.log('Restarted!')
    });
});

// Main gulp task
gulp.task('default', ['nodemon', 'watch']);

// https://gist.github.com/Hendrixer/9939346   gulpfile
