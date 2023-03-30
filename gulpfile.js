var gulp = require("gulp");
var babel = require("gulp-babel");
var cssnano = require("gulp-cssnano");

gulp.task("js", function () {
 return gulp.src("src/comparer.js")
  .pipe(babel({
   presets: ["@babel/preset-env"]
  }))
  .pipe(gulp.dest("dist"));
});

gulp.task("css", function () {
 return gulp.src("src/comparer.css")
  .pipe(cssnano({
   zindex: false,
   discardComments: {
    removeAll: true
   }
  }))
  .pipe(gulp.dest("dist"));
});

