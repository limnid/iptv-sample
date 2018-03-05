var lr = require('tiny-lr'), // server for livereload
    gulp = require('gulp'),
    livereload = require('gulp-livereload'), // Live reload
    myth = require('gulp-myth'), // http://www.myth.io/
    csso = require('gulp-csso'), // MinifyCSS
    imagemin = require('gulp-imagemin'), // Image optimizations
    uglify = require('gulp-uglify'), // MinifyJS
    concat = require('gulp-concat'), // Merge files
    connect = require('connect'), // Webserver
	htmlbuild = require('gulp-htmlbuild'),
    server = lr();

var $ = require('gulp-load-plugins')();

gulp.task('build', function() {
	// css
	gulp.src([
		'css/release.css'
		])
		.pipe(concat('release.css'))
		.pipe(csso()) // minify css
		.pipe(gulp.dest('prod/css')); // save css

    // js
    gulp.src([
		'js/libs/hmac-sha256.js', 
		'js/libs/enc-base64.js', 
		'js/libs/jq.js', 
		'js/core.js',
		'js/config.js',
		'js/store.js',
		'js/components/navigation.js',
		'js/components/toolbar.js',
		'js/components/grid.js',
		'js/components/watch.js',
		'js/providers/main.js',
		'js/providers/info.js',
		'js/providers/watch.js',
		'js/main.js',
        'js/stb.js'
    ])
		.pipe(concat('release.js'))
		.pipe(uglify())
		.pipe(gulp.dest('prod/js'));

	// Static files
	gulp.src([
            'lang/**/*.csv',
            'lang/**/*.json'])
        .pipe(gulp.dest('prod/lang'));
		
	// Fonts
    gulp.src(['media/*.*'])
		.pipe(gulp.dest('prod/css/media'));

	// images
	gulp.src('img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('prod/img'));

	gulp.src(['index.html'])
		.pipe(htmlbuild({
			// build js with preprocessor 
			js: htmlbuild.preprocess.js(function(block) {
				// read paths from the [block] stream and build them
				// then write the build result path to it 
				block.write('js/release.js');
				block.end();
			}),
			css: htmlbuild.preprocess.css(function (block) {
				// read paths from the [block] stream and build them 
				// then write the build result path to it
				block.write('css/release.css');
				block.end();
			}),
			remove: function (block) {
				block.end();
			}
		}))
		.pipe(gulp.dest('prod'));
});