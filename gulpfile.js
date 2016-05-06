var gulp = require('gulp');


var static_root = "reddit_coding/static/"


gulp.task('copy-js', function() {
	return gulp
		.src([
			"bower_components/angular/angular.*",
			"bower_components/angular-resource/angular-resource*.*",
			"bower_components/angular-spinner/angular-spinner.*",
			"bower_components/angular-ui-router/release/*.js",
			"bower_components/bootstrap/dist/js/bootstrap.*",
			"bower_components/jquery/dist/*.*",
			"bower_components/angular-spinner.*",
			"bower_components/spin.js/spin.*",
			"bower_components/toastr/toastr.js*",
			"bower_components/toastr/toastr.min.js",
			"bower_components/angular-toastr/dist/*.js",
			"bower_components/angular-animate/angular-animate.*",
			"bower_components/angular-sanitize/angular-sanitize.*",
			"bower_components/showdown/dist/showdown.*",
			"bower_components/moment/min/moment*.js",
			"bower_components/angular-moment/angular-moment.*js*",
			"bower_components/ng-showdown/dist/*.*",
			"bower_components/he/he.js"
		])
		.pipe(gulp.dest(static_root + 'js/vendor/'))
});

gulp.task('copy-css', function() {
	return gulp
		.src([
			"bower_components/bootstrap/dist/css/*",
			"bower_components/normalize-css/normalize.css",
			"bower_components/toastr/toastr*.css",
			"bower_components/angular-toastr/dist/*.css"
		])
		.pipe(gulp.dest(static_root + "css/vendor/"))
})

gulp.task('copy-fonts', function() {
	return gulp
		.src("bower_components/bootstrap/dist/fonts/*")
		.pipe(gulp.dest(static_root + "fonts/vendor/"))
})


gulp.task('copy', ['copy-js', 'copy-css', 'copy-fonts'])

gulp.task('default', ['copy']);