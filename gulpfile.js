var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("gulp-webserver");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var clean = require("gulp-clean-css");
var concat = require("gulp-concat");
var minImg = require("gulp-imagemin");
var minHtml = require("gulp-htmlmin");
var path = require("path");
var fs = require("fs");
var url = require("url");
var list = require("./data.json");
gulp.task("minScss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(concat("all.css"))
        .pipe(gulp.dest("./src/css/"))
})
gulp.task("devJs", function() {
    return gulp.src("./src/js/*.js")
        .pipe(concat("all.js"))
        .pipe(gulp.dest("./src/js/"))
})
gulp.task("server", function() {
    return gulp.src("./src")
        .pipe(server({
            post: 3000,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return;
                } else if (pathname === "/api/list") {
                    res.end(JSON.stringify({
                        code: 0,
                        data: list
                    }))
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));
                }
            }
        }))

})
gulp.task("watch", function() {
    gulp.watch("./src/scss/*.scss", gulp.series("minScss"))
    gulp.watch("./src/js/*.js", gulp.series("devJs"))
})
gulp.task("dev", gulp.series("minScss", "server", "watch"))
    //压缩js
gulp.task("uglify", function() {
        return gulp.src("./src/js/*.js")
            .pipe(babel({
                presets: "es2015"
            }))
            .pipe(uglify())
            .pipe(gulp.dest("./build/js/"))
    })
    //copy
gulp.task("copyCss", function() {
    return gulp.src("./src/css/*.css")
        .pipe(gulp.dest("./build/css/"))
})
gulp.task("copyJs", function() {
        return gulp.src("./src/js/common/*.js")
            .pipe(gulp.dest("./build/js/common/"))
    })
    //压缩html
gulp.task("minHtml", function() {
        return gulp.src("./src/index.html")
            .pipe(minHtml({
                collapseWhitespace: true
            }))
            .pipe(gulp.dest("./build/"))
    })
    //压缩img
gulp.task("minImg", function() {
    return gulp.src("./src/img/*.{jpg,PNG}")
        .pipe(minImg({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest("./build/img/"))
})