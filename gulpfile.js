var gulp = require('gulp');


var static_root = "reddit_coding/static/"


gulp.task('copy-js', function() {
	return gulp
		.src([
			"bower_components/angular/angular.*",
			"bower_components/angular-resource/angular-resource*.*",
			"bower_components/angular-spinner/angular-spinner.*",
			"bower_components/angular-ui-router/release/*.js",
			"bower_components/bootstrap/dist/bootstrap.*",
			"bower_components/jquery/dist/*.*"
		])
		.pipe(gulp.dest(static_root + 'js/vendor/'))
});

gulp.task('copy-css', function() {
	return gulp
		.src("bower_components/bootstrap/dist/css/*")
		.pipe(gulp.dest(static_root + "css/vendor/"))
})

gulp.task('copy-fonts', function() {
	return gulp
		.src("bower_components/bootstrap/dist/fonts/*")
		.pipe(gulp.dest(static_root + "fonts/vendor/"))
})


gulp.task('copy', ['copy-js', 'copy-css', 'copy-fonts'])

gulp.task('default', ['copy']);