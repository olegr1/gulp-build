const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const uglifycss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');

//Delete everything from the dist folder
gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

//Concatenate and minify JS, add sourcemaps and copy to /dist/scripts as all.min.js
gulp.task('scripts', () => {
    return gulp.src(['./js/circle/jquery-3.2.1.slim.min.js', './js/circle/*.js', './js/global.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/scripts/'));
});

//Compile SASS to CSS, minify CSS and copy to /dist/styles as all.min.css
gulp.task('styles', () => {
    return gulp.src( './sass/global.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())  
        .pipe(uglifycss())
        .pipe(rename('all.min.css'))        
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(connect.reload());
});

//Optimize images and copy them to dist/content
gulp.task('images', () => {
    return gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
    }
);

//Replace all references to CSS, JS and images in the HTML document 
//to reflect the new file names and containing folders; copy to /dist folder
gulp.task('html', () => {
    return gulp.src('./index.html')
        .pipe(replace('css/global.css', 'styles/all.min.css'))
        .pipe(replace('js/global.js', 'scripts/all.min.js'))
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest('./dist/'));
});

//Watch for changes in any SASS file and run the styles task
gulp.task('watch', function() {
    gulp.watch('./sass/**', ['styles'])        
});

//Serve the /dist folder at http://localhost:3000
gulp.task('connect', function() {
    connect.server({
        root: './dist',
        livereload: true,
        port: 3000
    });
});

//Run optimization tasks as soon as the clean task is done
gulp.task('build', ['clean'], () => {
    gulp.start(['scripts', 'styles', 'images', 'html']);
});

//Upon running 'grunt' in the console, run the build task, serve the site on localhost and reload it upon SASS changes
gulp.task('default', ['build'], () => {
    gulp.start(['connect', 'watch']);
});
