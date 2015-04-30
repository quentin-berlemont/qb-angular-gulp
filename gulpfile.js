(function() {
  'use strict';

  var gulp  = require('gulp-help')(require('gulp'));
  var plug  = require('gulp-load-plugins')({ lazy: false });
  var shell = require('gulp-shell');

  var env = plug.util.env;
  var log = plug.util.log;

  var browserSync = require('browser-sync');
  var del         = require('del');
  var karma       = require('karma').server;
  var mergeStream = require('merge-stream');
  var modRewrite  = require('connect-modrewrite');
  var runSequence = require('run-sequence');

  var config = require('./config');

  /**
   * Bump the version.
   *
   * @return {stream}
   */
  gulp.task('bump', 'Bump the version.', function() {
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
   * Clean the existing output of any previous build.
   */
  gulp.task('clean', 'Clean the existing output of any previous build.', function(callback) {
    del([config.path.dist, config.path.docs, config.path.coverage], function(error, deletedFiles) {
      deletedFiles.forEach(function(file) {
        log('File deleted:' + file);
      });

      callback(error);
    });
  });

  /**
   * Generate the API documentation.
   *
   * @returns {stream}
   */
  gulp.task('docs', 'Generate API documentation.', shell.task([
    'jsdoc -c node_modules/angular-jsdoc/conf.json -t node_modules/angular-jsdoc/template -d ' + config.path.docs + ' -r ' + config.path.scripts.src
  ]));

  /**
   * Rev and tarball the existing output.
   *
   * @returns {stream}
   */
  gulp.task('rev-tarball', 'Rev and tarball the existing output.', function() {
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
   * Serve the build environment.
   */
  gulp.task('serve', 'Serve the build environment.', ['watch'], function(callback) {
    browserSync({
      server: {
        baseDir: config.path.dist,
        middleware: [
          modRewrite([
            '^[^\\.]*$ /index.html [L]'
          ])
        ]
      }
    }, callback);
  });

  /**
   * Watch any changes to files and run predefined tasks on them.
   */
  gulp.task('watch', 'Watch any changes to files and run predefined tasks on them.', ['build'], function() {
    gulp
      .watch('./bower.json', ['vendors'])
      .on('change', logWatch);

    gulp
      .watch(config.path.images.src + '**/*.{gif,jpg,jpeg,png,svg}', ['images'])
      .on('change', logWatch);

    gulp
      .watch(config.path.styles.src + '**/*.css', ['styles'])
      .on('change', logWatch);

    gulp
      .watch(config.path.scripts.src + '**/*.js', function() {
        runSequence('test', 'scripts');
      })
      .on('change', logWatch);

    gulp
      .watch(config.path.templates.src + '**/*.html', ['templates'])
      .on('change', logWatch);

    gulp
      .watch(config.path.translations.src + '**/i18n-*.json', ['translations'])
      .on('change', logWatch);

    gulp
      .watch(config.path.src + 'index.html', ['index'])
      .on('change', logWatch);

    function logWatch(event) {
      log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
  });

  /**
   * Run build.
   */
  gulp.task('build', 'Run build.', function(callback) {
    runSequence(
      ['test'],
      ['vendors', 'images', 'styles', 'scripts', 'templates', 'translations'],
      ['index'],
      callback
    );
  });

  /**
   * Run specs.
   *
   * @returns {stream}
   */
  gulp.task('test', 'Run specs.', function(callback) {
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: env.tdd ? false : true
    }, callback);
  }, {
    options: {
      'tdd': 'Test-driven development'
    }
  });

  /**
   * Submit code coverage to Coveralls.
   *
   * @returns {stream}
   */
  gulp.task('coveralls', 'Submit code coverage to Coveralls.', function() {
    return gulp
      .src(config.path.coverage + 'report-lcov/lcov.info')
      .pipe(plug.coveralls());
  });

  /**
   * Concatenate and minify vendors.
   *
   * @returns {stream}
   */
  gulp.task('vendors', 'Concatenate and minify vendors.', function() {
    return mergeStream(
      gulp
        .src(config.path.vendors.styles.src)
        .pipe(plug.newer(config.path.vendors.styles.dist + 'vendors.min.css'))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendors.css'))
        .pipe(gulp.dest(config.path.vendors.styles.dist))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(config.path.vendors.styles.dist))
        .pipe(plug.filter('vendors.min.css'))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src(config.path.vendors.scripts.src)
        .pipe(plug.newer(config.path.vendors.scripts.dist + 'vendors.min.js'))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('vendors.js'))
        .pipe(gulp.dest(config.path.vendors.scripts.dist))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(config.path.vendors.scripts.dist))
        .pipe(browserSync.reload({ stream: true }))
      );
  });

  /**
   * Minify images.
   *
   * @returns {stream}
   */
  gulp.task('images', 'Minify images.', function() {
    return gulp
      .src(config.path.images.src + '**/*.{gif,jpg,jpeg,png,svg}')
      .pipe(plug.newer(config.path.images.dist))
      .pipe(plug.bytediff.start())
      .pipe(plug.imagemin({optimizationLevel: 4}))
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(gulp.dest(config.path.images.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Concatenate and minify styles.
   *
   * @returns {stream}
   */
  gulp.task('styles', 'Concatenate and minify styles.', ['lint-styles'], function() {
    return gulp
      .src(config.path.styles.src + '**/*.css')
      .pipe(plug.newer(config.path.styles.dist + 'app.min.css'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.concat('app.css'))
      .pipe(plug.autoprefixer())
      .pipe(plug.csscomb())
      .pipe(gulp.dest(config.path.styles.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.minifyCss())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.styles.dist))
      .pipe(plug.filter('app.min.css'))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Lint styles.
   *
   * @returns {stream}
   */
  gulp.task('lint-styles', 'Lint styles.', function() {
    return gulp
      .src(config.path.styles.src)
      .pipe(plug.cached('lint-styles'))
      .pipe(plug.csslint())
      .pipe(plug.csslint.reporter());
  });

  /**
   * Concatenate and minify scripts.
   *
   * @returns {stream}
   */
  gulp.task('scripts', 'Concatenate and minify scripts.', ['lint-scripts'], function() {
    return gulp
      .src(config.path.scripts.src + '**/*.js')
      .pipe(plug.newer(config.path.scripts.dist + 'app.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.angularFilesort())
      .pipe(plug.concat('app.js'))
      .pipe(plug.ngAnnotate())
      .pipe(gulp.dest(config.path.scripts.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.scripts.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Lint scripts.
   *
   * @returns {stream}
   */
  gulp.task('lint-scripts', 'Lint scripts.', function() {
    return gulp
      .src(config.path.scripts.src + '**/*.js')
      .pipe(plug.cached('lint-scripts'))
      .pipe(plug.jshint())
      .pipe(plug.jshint.reporter('jshint-stylish'))
      .pipe(plug.jshint.reporter('fail'))
      .pipe(plug.jscs());
  });

  /**
   * Concatenate, minify and register templates for the $templateCache service.
   *
   * @returns {stream}
   */
  gulp.task('templates', 'Concatenate, minify and register templates for the $templateCache service.', function() {
    return gulp
      .src(config.path.templates.src + '**/*.html')
      .pipe(plug.newer(config.path.templates.dist + 'templates.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.minifyHtml())
      .pipe(plug.angularTemplatecache('templates.js', {
        module: 'app.core',
        standalone: false,
        root: 'app/'
      }))
      .pipe(gulp.dest(config.path.templates.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.templates.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Concatenate and register translations in the $translate service.
   *
   * @returns {stream}
   */
  gulp.task('translations', 'Concatenate and register translations in the $translate service.', function() {
    return gulp
      .src(config.path.translations.src + '**/i18n-*.json')
      .pipe(plug.newer(config.path.translations.dist + 'translations.min.js'))
      .pipe(plug.sourcemaps.init())
      .pipe(plug.angularTranslate('translations.js', {
        module: 'app.core',
        standalone: false
      }))
      .pipe(gulp.dest(config.path.translations.dist))
      .pipe(plug.rename({suffix: '.min'}))
      .pipe(plug.bytediff.start())
      .pipe(plug.uglify())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(plug.sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.translations.dist))
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Inject all the files into the new index.html.
   *
   * @returns {stream}
   */
  gulp.task('index', 'Inject all the files into the new index.html.', function() {
    var sources = [
      config.path.vendors.styles.dist + 'vendors.min.css',
      config.path.vendors.scripts.dist + 'vendors.min.js',
      config.path.styles.dist + 'app.min.css',
      config.path.scripts.dist + 'app.min.js',
      config.path.scripts.dist + 'templates.min.js',
      config.path.scripts.dist + 'translations.min.js'
    ];

    return gulp
      .src(config.path.src + 'index.html')
      .pipe(plug.inject(gulp.src(sources, { read: false }), {
        ignorePath: config.path.dist
      }))
      .pipe(plug.bytediff.start())
      .pipe(plug.minifyHtml())
      .pipe(plug.bytediff.stop(bytediffFormatter))
      .pipe(gulp.dest(config.path.dist));
  });

  ////////////////

  /**
   * Formatter for bytediff to display the size changes after processing.
   *
   * @param  {object} data - Byte data
   *
   * @return {string} Difference in bytes, formatted
   */
  function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';

    return data.fileName + ' went from '
      + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB'
      + ' and is ' + ((1 - data.percent) * 100).toFixed(2) + '%' + difference;
  }
})();
