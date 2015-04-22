(function() {
  'use strict';

  var gulp = require('gulp-help')(require('gulp'));
  var plug = require('gulp-load-plugins')({ lazy: false });

  var env = plug.util.env;
  var log = plug.util.log;

  var browserSync = require('browser-sync');
  var del         = require('del');
  var mergeStream = require('merge-stream');
  var modRewrite  = require('connect-modrewrite');
  var runSequence = require('run-sequence');

  var config = require('./config');

  /**
   * Bump the version
   * @return {stream}
   */
  gulp.task('bump', 'Bump the version', function() {
    var options = {};

    if (env.version) {
      options.version = env.version;
    } else {
      options.type = env.type;
    }

    return gulp
      .src(['./bower.json', './package.json'])
      .pipe(plug.bump(options))
      .pipe(gulp.dest('./'));
  }, {
    options: {
      'type prerelease': 'will bump the prerelease version *.*.*-x',
      'type patch': 'or no flag will bump the patch version *.*.x',
      'type minor': 'will bump the minor version *.x.*',
      'type major': 'will bump the major version x.*.*',
      'version x.x.x': 'will bump to a specific version and ignore other flags'
    }
  });

  /**
   * Clean the existing output of any previous build
   */
  gulp.task('clean', 'Clean the existing output of any previous build', function(callback) {
    del([config.path.dist, config.path.docs, config.path.coverage], function(err, deletedFiles) {
      deletedFiles.forEach(function(file) {
        log('File deleted:', file);
      });

      callback(err);
    });
  });

  /**
   * Generate the API documentation
   * @returns {stream}
   */
  gulp.task('docs', 'Generate the API documentation', function() {
    return gulp
      .src(config.path.js.src + '**/*.js')
      .pipe(plug.jsdoc(
        config.path.docs, {
          path: __dirname + '/node_modules/angular-jsdoc/template'
        }, {
          plugins: [
            __dirname + '/node_modules/gulp-jsdoc/node_modules/jsdoc/plugins/markdown',
            __dirname + '/node_modules/angular-jsdoc/plugins/ngdoc'
          ]
        }, {
          cleverLinks: true,
          monospaceLinks: true
      }));
  });

  /**
   * Submit code coverage to Coveralls
   * @returns {stream}
   */
  gulp.task('coveralls', 'Submit code coverage to Coveralls', function() {
    return gulp
      .src(config.path.coverage + 'report-lcov/lcov.info')
      .pipe(plug.coveralls());
  });

  /**
   * Rev and tarball the existing output
   * @returns {stream}
   */
  gulp.task('rev-tarball', 'Rev and tarball the existing output', function() {
    var pakage = require('./package.json');
    var revAll = new plug.revAll({
      dontRenameFile: ['index.html'],
      dontGlobal: ['.map']
    });

    return gulp
      .src(config.path.dist + '**/*')
      .pipe(revAll.revision())
      .pipe(plug.tar(pakage.name + '-' + pakage.version + '.tar'))
      .pipe(plug.gzip())
      .pipe(gulp.dest(config.path.dist));
  });

  /**
   * Serve the build environment
   */
  gulp.task('serve', 'Serve the build environment', ['watch'], function(callback) {
    browserSync({
      server: {
        baseDir: config.path.dist,
        middleware: [
          modRewrite([
            '!\\.\\w+$ /index.html [L]'
          ])
        ]
      }
    }, callback);
  });

  /**
   * Watch any changes to files and run predefined tasks on them
   */
  gulp.task('watch', 'Watch any changes to files and run predefined tasks on them', ['build'], function() {
    gulp
      .watch(config.path.img.src + '**/*.{gif,jpg,jpeg,png,svg}', ['images'])
      .on('change', logWatch);

    gulp
      .watch(config.path.css.src + '**/*.css', ['css'])
      .on('change', logWatch);

    gulp
      .watch(config.path.js.src + '**/*.js', function() {
        runSequence('test', 'js');
      })
      .on('change', logWatch);

    gulp
      .watch(config.path.template.src + '**/*.html', ['templatecache'])
      .on('change', logWatch);

    gulp
      .watch(config.path.translation.src + '**/locale-*.json', ['translationcache'])
      .on('change', logWatch);

    gulp
      .watch('./bower.json', ['vendor'])
      .on('change', logWatch);

    function logWatch(event) {
      log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
  });

  /**
   * Run build
   */
  gulp.task('build', 'Run build', function(callback) {
    runSequence(
      ['test'],
      ['vendor', 'images', 'css', 'js', 'templatecache', 'translationcache'],
      ['index'],
      callback
    );
  });

  /**
   * Run specs
   * @returns {stream}
   */
  gulp.task('test', 'Run specs', function() {
    return mergeStream(
      gulp.src(config.path.vendor.jsDev.src, { read: false }),
      gulp.src([config.path.js.src + '**/*.js', config.path.spec.src + '**/*.spec.js']).pipe(plug.angularFilesort())
    )
    .pipe(plug.karma({
      configFile: __dirname + '/karma.conf.js',
      action: env.tdd ? 'watch' : 'run'
    }));
  }, {
    options: {
      'tdd': 'Test-driven development'
    }
  });

  /**
   * Bundle and minify dependencies
   * @returns {stream}
   */
  gulp.task('vendor', 'Bundle and minify dependencies', function() {
    return mergeStream(
      gulp
        .src(config.path.vendor.css.src)
        .pipe(plug.newer(config.path.vendor.css.dist + 'vendor.min.css'))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendor.css'))
        .pipe(gulp.dest(config.path.vendor.css.dist))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(config.path.vendor.css.dist))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src(config.path.vendor.js.src)
        .pipe(plug.newer(config.path.vendor.js.dist + 'vendor.min.js'))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendor.js'))
        .pipe(gulp.dest(config.path.vendor.js.dist))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(config.path.vendor.js.dist))
        .pipe(browserSync.reload({ stream: true }))
      );
  });

  /**
   * Compress images
   * @returns {stream}
   */
  gulp.task('images', 'Compress images', function() {
    return gulp
      .src(config.path.img.src + '**/*.{gif,jpg,jpeg,png,svg}')
      .pipe(plug.newer(config.path.img.dist))
      .pipe(plug.bytediff.start())
      .pipe(plug.imagemin())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(gulp.dest(config.path.img.dist));
  });

  /**
   * Bundle and minify the CSS
   * @returns {stream}
   */
  gulp.task('css', 'Bundle and minify the CSS', ['lint-css'], function() {
    return gulp
      .src(config.path.css.src + '**/*.css')
      .pipe(plug.newer(config.path.css.dist + 'app.min.css'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.concat('app.css'))
      .pipe(plug.autoprefixer())
      .pipe(plug.csscomb())
      .pipe(gulp.dest(config.path.css.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.minifyCss())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.css.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Lint the CSS
   * @returns {stream}
   */
  gulp.task('lint-css', 'Lint the CSS', function() {
    return gulp
      .src(config.path.css.src)
      .pipe(plug.newer(config.path.css.dist + 'app.min.css'))
      .pipe(plug.csslint())
      .pipe(plug.csslint.reporter());
  });

  /**
   * Bundle and minify JS
   * @returns {stream}
   */
  gulp.task('js', 'Bundle and minify JS', ['lint-js'], function() {
    return gulp
      .src(config.path.js.src + '**/*.js')
      .pipe(plug.newer(config.path.js.dist + 'app.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.angularFilesort())
      .pipe(plug.concat('app.js'))
      .pipe(plug.ngAnnotate())
      .pipe(gulp.dest(config.path.js.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.js.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Lint the JS
   * @returns {stream}
   */
  gulp.task('lint-js', 'Lint the JS', function() {
    return gulp
      .src(config.path.js.src + '**/*.js')
      .pipe(plug.newer(config.path.js.dist + 'app.min.js'))
      .pipe(plug.jshint())
      .pipe(plug.jshint.reporter('jshint-stylish'))
      .pipe(plug.jscs());
  });

  /**
   * Bundle, minify and register HTML templates in the $templateCache service
   * @returns {stream}
   */
  gulp.task('templatecache', 'Bundle, minify and register HTML templates in the $templateCache service', function() {
    return gulp
      .src(config.path.template.src + '**/*.html')
      .pipe(plug.newer(config.path.template.dist + 'templatecache.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.minifyHtml())
      .pipe(plug.angularTemplatecache('templatecache.js', {
        module: 'app.core',
        standalone: false,
        root: 'app/'
      }))
      .pipe(gulp.dest(config.path.template.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.template.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Bundle, minify and register translations in the $translate service
   * @returns {stream}
   */
  gulp.task('translationcache', 'Bundle, minify and register translations in the $translate service', function() {
    return gulp
      .src(config.path.translation.src + '**/locale-*.json')
      .pipe(plug.newer(config.path.translation.dist + 'translationcache.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.angularTranslate('translationcache.js', {
        module: 'app.core',
        standalone: false
      }))
      .pipe(gulp.dest(config.path.translation.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.translation.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Inject all the files into the new index.html
   * @returns {stream}
   */
  gulp.task('index', 'Inject all the files into the new index.html', function() {
    return gulp
      .src(config.path.src + 'index.html')
      .pipe(plug.inject(
        gulp.src([
            'assets/css/vendor.min.css',
            'assets/css/app.min.css'
          ], {
            cwd: config.path.dist,
            read: false
          }
        )
      ))
      .pipe(plug.inject(
        gulp.src([
          'assets/js/vendor.min.js',
          'assets/js/app.min.js',
          'assets/js/templatecache.min.js',
          'assets/js/translationcache.min.js'
          ], {
            cwd: config.path.dist,
            read: false
          }
        )
      ))
      .pipe(plug.bytediff.start())
      .pipe(plug.minifyHtml())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(gulp.dest(config.path.dist));
  });

  ////////////////

  /**
   * Formatter for bytediff to display the size changes after processing
   * @param  {Object} data - byte data
   * @return {String} Difference in bytes, formatted
   */
  function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from '
      + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB'
      + ' and is ' + ((1 - data.percent) * 100).toFixed(2) + '%' + difference;
  }
})();
