
(function () {
  "use strict";

  var autoprefixer = require("gulp-autoprefixer");
  var cleanCSS = require("gulp-clean-css");
  var concat = require("gulp-concat");
  var del = require("del");
  var ghPages = require("gulp-gh-pages");
  var gulp = require("gulp");
  var jshint = require("gulp-jshint");
  var imagemin = require("gulp-imagemin");
  var livereload = require("gulp-livereload");
  var rename = require("gulp-rename");
  var runSequence = require("run-sequence");
  var sass = require("gulp-sass");
  var sourcemaps = require("gulp-sourcemaps");
  var uglify = require("gulp-uglify");

  var sassOptions = {
    errLogToConsole: true,
    outputStyle: "expanded"
  };

  gulp.task("clean", function () {
    return del(["dist"]);
  });

  gulp.task("sass", function () {
    gulp.src("scss/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions).on("error", sass.logError))
      .pipe(cleanCSS())
      .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
      .pipe(sourcemaps.write())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("dist/css"))
      .pipe(livereload());
  });

  gulp.task("js", function () {
    gulp.src("js/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("dist/js"))
      .pipe(livereload());
  });

  gulp.task("html", function() {
    gulp.src("*.html")
      .pipe(gulp.dest("dist"))
      .pipe(livereload());
  });

  gulp.task("fonts", function() {
    gulp.src("fonts/*.*")
      .pipe(gulp.dest("dist/fonts"))
      .pipe(livereload());
  });

  gulp.task("images", function() {
    gulp.src("images/*.*")
      .pipe(imagemin({
        optimizationLevel: 7,
        progressive: true
      }))
      .pipe(gulp.dest("dist/images"))
      .pipe(livereload());
  });

  gulp.task("watch", function() {
    livereload.listen();
    gulp.watch("scss/*.scss", ["sass"]);
    gulp.watch("js/*.js", ["js"]);
    gulp.watch("*.html", ["html"]);
    gulp.watch("images/*.*", ["images"]);
  });

  gulp.task("build", function (cb) {
    runSequence("clean", ["sass", "js", "html", "fonts", "images", "watch"], cb);
  });

  gulp.task("deploy", function() {
    return gulp.src("./dist/**/*")
      .pipe(ghPages());
  });

  gulp.task("default", function(cb) {
    runSequence("build", cb);
  });
})();