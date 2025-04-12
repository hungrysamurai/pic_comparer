var cssnano = require("gulp-cssnano");
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

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

gulp.task("cssbuild", function () {
  return gulp.src("src/comparer.css")
    .pipe(cssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(gulp.dest("build"));
});


gulp.task(
  "default",
  gulp.series(gulp.parallel("cssbuild"), function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/index.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("index.js"))
      .pipe(gulp.dest("build/dist"));
  })
);
