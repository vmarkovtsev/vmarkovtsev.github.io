var gulp = require("gulp");
plugins = require("gulp-load-plugins")();
var babelify = require("babelify");
var browserify = require("browserify");
var through2 = require("through2");
var shrthnd = require("shrthnd");
var del = require("del");
var pngquant = require("imagemin-pngquant");
var lazypipe = require("lazypipe");
var dist = "dist/";
var languages = ["ko", "ru"];

plugins.shorthand = function () {
  return through2.obj(function (file, enc, next) {
    var contents = file.contents.toString();
    var res = shrthnd(contents).string;
    console.log(file.path + ": shrthnd saved " + (contents.length - res.length) + " bytes");
    file.contents = new Buffer(res);
    next(null, file);
  });
};

var assets_pipeline = lazypipe().pipe(plugins.sourcemaps.init,
  {loadMaps: true, debug: true});


gulp.task("bower", function () {
  return plugins.bower("src/libs");
});

gulp.task("watch-bower", function () {
  gulp.watch(["bower.json"], ["bower"]);
});

gulp.task("sass", ["bower"], function () {
  return gulp.src("src/sass/*.scss")
    .pipe(plugins.newer({dest: "build/css", ext: ".css"}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      precision: 8,
      includePaths: ["src/libs/bootstrap-sass/assets/stylesheets"]
    }))
    .on("error", plugins.util.log)
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("build/css"));
});

gulp.task("watch-sass", function () {
  gulp.watch(["src/sass/*.scss"], ["sass", "default"]);
});

gulp.task("clean", function () {
  del(dist + "*", {force: true});
});

gulp.task("mrproper", ["clean"], function () {
  del("build/*");
});

gulp.task("nuke", ["mrproper"], function () {
  del("src/libs/*");
});

gulp.task("fonts-custom", function () {
  return gulp.src("src/fonts/*")
    .pipe(plugins.newer(dist + "fonts"))
    .pipe(gulp.dest(dist + "fonts"));
});

gulp.task("fonts-bootstrap", function () {
  return gulp.src("src/libs/bootstrap-sass/assets/fonts/bootstrap/*")
    .pipe(plugins.newer(dist + "fonts/bootstrap"))
    .pipe(gulp.dest(dist + "fonts/bootstrap"));
});

gulp.task("fonts", ["fonts-bootstrap", "fonts-custom"]);

gulp.task("pack-svg", function () {
  return gulp.src(["src/img/*.svg"])
    .pipe(plugins.newer(dist + "img"))
    .pipe(plugins.if(["**/*.svg", "!**/diffy.svg"], plugins.svgmin()))
    //.pipe(plugins.svgstore())
    //.pipe(plugins.rename("all.svg"))
    .pipe(gulp.dest(dist + "img"));
});

gulp.task("video", function () {
    return gulp.src("src/video/*")
        .pipe(plugins.newer(dist + "video"))
        .pipe(gulp.dest(dist + "video"));
});

gulp.task("images", function () {
    return gulp.src(["src/img/*.png", "src/img/*.jpg"])
        .pipe(plugins.newer(dist + "img"))
        .pipe(plugins.imagemin({
            multipass: true,
            progressive: true,
            optimizationLevel: 6,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dist + "img"));
});

gulp.task("media", ["images", "pack-svg", "video"]);

gulp.task("watch-media", function () {
  gulp.watch(["src/img/*"], ["media"]);
});

gulp.task("browserify", function () {
  return gulp.src("src/js/*.js")
    .pipe(plugins.newer("build/js"))
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, {debug: true})
        .transform(babelify)
        .bundle(function (err, res) {
          if (err) {
            return next(err);
          }
          file.contents = res;
          next(null, file);
        });
    }))
    // Super ugly fix for missing semicolon preventing from concatting
    .pipe(plugins.replace("},{}]},{},[1])", "},{}]},{},[1]);"))
    .pipe(gulp.dest("build/js"))
});

gulp.task("watch-browserify", function () {
  gulp.watch(["src/js/*.js"], ["default"]);
});

gulp.task("viewerjs-images", ["bower"], function () {
    return gulp.src("src/libs/viewerjs/images/*")
        .pipe(plugins.newer(dist + "viewerjs/images"))
        .pipe(gulp.dest(dist + "viewerjs/images"));
});

gulp.task("viewerjs-html", ["bower"], function () {
    return gulp.src("src/libs/viewerjs/index.html")
        .pipe(plugins.newer(dist + "viewerjs"))
        .pipe(plugins.minifyHtml({empty: true, loose: true}))
        .pipe(gulp.dest(dist + "viewerjs"));
});

gulp.task("viewerjs-css", ["bower"], function () {
    return gulp.src("src/libs/viewerjs/*.css")
        .pipe(plugins.newer(dist + "viewerjs"))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dist + "viewerjs"));
});

gulp.task("viewerjs-js", ["bower"], function () {
    return gulp.src("src/libs/viewerjs/*.js")
        .pipe(plugins.newer(dist + "viewerjs"))
        .pipe(plugins.uglify({ie_proof: false}))
        .pipe(gulp.dest(dist + "viewerjs"));
});

gulp.task("samplepdf", function () {
    return gulp.src("src/sample.pdf")
        .pipe(plugins.newer(dist))
        .pipe(gulp.dest(dist));
});

gulp.task("viewerjs", ["viewerjs-images", "viewerjs-html", "viewerjs-css",
                       "viewerjs-js", "samplepdf"]);

var deps = ["fonts", "media", "landing-en", "viewerjs"];

gulp.task("landing-en", ["sass", "browserify"], function () {
  var assets = plugins.useref.assets({}, assets_pipeline);
  return gulp.src("src/slanding.html")
      .pipe(plugins.nunjucksHtml({locals: {lang: "en"}}).on("error", plugins.util.log))
      .pipe(assets)
      .pipe(plugins.if(["**/*.js", "!**/jquery.min.js"],
          plugins.uglify({ie_proof: false}).on("error", plugins.util.log)))
      .pipe(plugins.if("*.css", lazypipe()
          //.pipe(plugins.shorthand)
          .pipe(plugins.autoprefixer)
          .pipe(plugins.minifyCss,
          {roundingPrecision: -1, keepSpecialComments: 0})()))
      .pipe(plugins.sourcemaps.write("maps"))
      .pipe(assets.restore())
      .pipe(plugins.useref())
      .pipe(plugins.if("*.html", lazypipe()
          .pipe(plugins.minifyHtml, {empty: true, loose: true})
          .pipe(plugins.rename, "slanding-en.html")()))
      .pipe(gulp.dest(dist));
});

for (var li in languages) {
  var lang = languages[li];
  deps.push("landing-" + lang);
  (function(lang) {
    gulp.task("landing-" + lang, ["sass", "browserify", "landing-en"], function () {
      return gulp.src("src/slanding.html")
          .pipe(plugins.nunjucksHtml({locals: {lang: lang}}).on("error", plugins.util.log))
          .pipe(plugins.useref())
          .pipe(plugins.if("*.html", lazypipe()
              .pipe(plugins.minifyHtml, {empty: true, loose: true})
              .pipe(plugins.rename, "slanding-" + lang + ".html")()))
          .pipe(gulp.dest(dist));
    });
  })(lang);
}

gulp.task("default", deps);
