'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var getJSPath = require('../utils/js_path');

var EmberGenerator = module.exports = function EmberGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  if (this.appname.match(/^[Ee]mber$/)) {
    this.appname += '_app';
  }

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // hook for CoffeeScript
  this.options.coffee = options.coffee;

  // hook for karma test runner
  this.options.karma = options.karma;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  // this holds the list of scripts we want to include in components.js
  this.bowerScripts = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/handlebars/handlebars.js',
    '@@ember',
    '@@ember_data',
    'bower_components/ember-simple-auth/ember-simple-auth.js'
  ];
};

util.inherits(EmberGenerator, yeoman.generators.Base);

EmberGenerator.prototype._getJSPath = getJSPath;

EmberGenerator.prototype.welcome = function welcome() {
  // welcome message
  console.log(this.yeoman);
};

EmberGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = []; // no questions asked! install all needed cool stuff!

  this.prompt(prompts, function (props) {
    this.compassBootstrap = true;

    cb();
  }.bind(this));
};

EmberGenerator.prototype.createDirLayout = function createDirLayout() {
  this.mkdir('app/templates');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/models');
  this.mkdir('app/scripts/components');
  this.mkdir('app/scripts/controllers');
  this.mkdir('app/scripts/routes');
  this.mkdir('app/scripts/views');
};

EmberGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

EmberGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

EmberGenerator.prototype.packageFile = function packageFile() {
  this.copy('_package.json', 'package.json');
};

EmberGenerator.prototype.jshint = function jshint() {
  this.copy('_jshintrc', '.jshintrc');
};

EmberGenerator.prototype.tests = function tests() {
  if (this.options.karma) {
    this.mkdir('test');
    this.mkdir('test/support');
    this.mkdir('test/integration');
    this.copy('karma.conf.js', 'karma.conf.js');

    this.template(this._getJSPath('test/_initializer'), this._getJSPath('test/support/initializer'));
    this.template(this._getJSPath('test/integration/_index'), this._getJSPath('test/integration/index'));
  }
};

EmberGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

EmberGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

EmberGenerator.prototype.templates = function templates() {
  this.copy('hbs/application.hbs', 'app/templates/application.hbs');
  this.copy('hbs/index.hbs', 'app/templates/index.hbs');
};

EmberGenerator.prototype.writeIndex = function writeIndex() {
  var mainCssFiles = [];
  if (this.compassBootstrap) {
    mainCssFiles.push('styles/style.css');
  } else {
    mainCssFiles.push('styles/normalize.css');
    mainCssFiles.push('styles/style.css');
  }

  this.indexFile = this.appendStyles(this.indexFile, 'styles/main.css', mainCssFiles);

  this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/components.js', this.bowerScripts, null, 'app');

  this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/templates.js', ['scripts/compiled-templates.js'], null, '.tmp');
  this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/main.js', ['scripts/combined-scripts.js'], null, '.tmp');
};

EmberGenerator.prototype.bootstrapJavaScript = function bootstrapJavaScript() {
  if (!this.compassBootstrap) {
    return;  // Skip if disabled.
  }
  // Wire Bootstrap plugins //it should be appendScripts but its bugged in yeoman-generator 0.16.0
  this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/plugins.js', [
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-core.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-alert.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-badge.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-basic.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-button.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-growl-notifications.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-items-action-bar.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-label.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-list-group.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-modal.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-nav.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-notifications.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-progressbar.max.js',
    'bower_components/ember-addons.bs_for_ember/dist/js/bs-wizard.max.js',
    'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js'
  ], null, 'app');
};

EmberGenerator.prototype.all = function all() {
  this.write('app/index.html', this.indexFile);

  if (this.compassBootstrap) {
    this.copy('styles/style_bootstrap.scss', 'app/styles/style.scss');
    this.copy('styles/stamplink.scss', 'app/styles/stamplink.scss');
    this.copy('styles/hovereffects.scss', 'app/styles/hovereffects.scss');
  } else {
    this.copy('styles/normalize.css', 'app/styles/normalize.css');
    this.copy('styles/style.css', 'app/styles/style.css');
  }

  this.copy(this._getJSPath('scripts/app'), this._getJSPath('app/scripts/app'));
  this.copy(this._getJSPath('scripts/store'), this._getJSPath('app/scripts/store'));
  this.copy(this._getJSPath('scripts/router'), this._getJSPath('app/scripts/router'));
  this.copy(this._getJSPath('scripts/routes/application_route'), this._getJSPath('app/scripts/routes/application_route'));
  this.copy(this._getJSPath('scripts/controllers/application_controller'), this._getJSPath('app/scripts/controllers/application_controller'));
};

EmberGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
