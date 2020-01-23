const {watch, src, dest} = require('gulp');
const browserify = require('gulp-browserify');
const livereload = require('gulp-livereload');

function javascript(){
    return src('./app/app.js')
        .pipe(browserify())
        .pipe(dest('app/build/js'))
        .pipe(livereload());
}

exports.default = function(){
    watch('app/**/*.js', javascript);
}



