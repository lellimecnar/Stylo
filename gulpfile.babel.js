import gulp from 'gulp';
import plugins from 'gulp-load-plugins';

var $ = plugins();

gulp.task('build', function() {
	return gulp.src([
		'StylusLint.js',
		'StylusLintRule.js',
		'rules/*.js'
	], {
		cwd: './src'
	})
		.pipe($.concat('index.js'))
		.pipe($.babel({
			stage: 0
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', ['build'], function(done) {

	gulp.watch('./src/**/*.js', ['build']);

	return done();
});
