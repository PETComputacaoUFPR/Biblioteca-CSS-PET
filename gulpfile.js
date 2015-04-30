var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var prefix = require('gulp-autoprefixer');
var linter = require('gulp-csslint');

var paths = {
  sass: ['./scss/**/*.scss']
};

//SASS -> CSS
gulp.task('sass', function(done) {
    gulp.src('./scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefix({browser: ['last 3 versions', 'Firefox > 20', '> 5%']}))
    .pipe(sourcemaps.write('.'))
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

//Faz o lint do CSS
gulp.task('lint', function(done){
    gulp.src('./css/style.css')
    .pipe(linter())
    .pipe(linter.reporter(customReporter))
    .on('end', done);
});

//"Minifica" o CSS
gulp.task('minify-css', function(done){
    gulp.src('./css/style.css')
        .pipe(gulp.dest('./css'))
        .pipe(rename({extname: '.min.css'}))
        .pipe(minifyCss())
        .pipe(gulp.dest('./css/'))
        .on('end', done);
});

//Observa mudanças nos arquivos scss
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

//Reporter para o linter
var customReporter = function(file) {
    gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));

    file.csslint.results.forEach(function(result) {
        gutil.log(result.error.message+' on line '+result.error.line);
    });
    
    if(file.csslint.errorCount > 0){
        gutil.log(gutil.colors.red("Aborted!"));
        process.exit(1);
    }
};

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['sass', 'minify-css']);
gulp.task('test', ['sass', 'lint']);