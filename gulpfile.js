const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const htmlreplace = require("gulp-html-replace");
const webserver = require('gulp-webserver');
const watch = require('gulp-watch');

gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

gulp.task('scripts', ['clean'], () => {
  return gulp.src(['./js/circle/*.js', './js/global.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('styles', ['clean'], () => {
  return gulp.src( './sass/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())    
    .pipe(rename('all.min.css'))
    .pipe(uglifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('prapareIndexPage', function() {
  gulp.src('./index.html')
    .pipe(htmlreplace({
        'css': 'all.min.css',
        'js': 'all.min.js'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            fallback: 'index.html',
            livereload: true,
            directoryListing: false,
            open: true,
            port: 3000
        })
    );
});


gulp.task('test1', ['scripts', 'styles', 'prapareIndexPage']);

