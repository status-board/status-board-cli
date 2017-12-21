var path = require('path');
var logicCli = require('./commands-logic');
var sanitize = require('sanitize-filename');

var DEFAULT_PACKAGE_FOLDER = 'default';

require('colors');

module.exports = {

  /**
   * Generates an Atlasboard component
   *
   * @params args[0] item type: job, dashboard or widget
   * @params args[1] item name
   */

  generate: {

    descr: "generates a basic component of type widget, dashboard or job",
    example: "atlasboard generate widget mywidget",

    run: function (args, cb) { // check for the right arguments

           if (args.length < 2) {
              cb && cb('Missing arguments. Please use "atlasboard generate widget <mywidget>"');
              return;
           }

           var packageFolder = DEFAULT_PACKAGE_FOLDER;

           var itemType = args[0];
           var itemName = args[1];
           if (itemName.indexOf('#') > -1){ //package namespacing
             packageFolder = itemName.split('#')[0];
             itemName = itemName.split('#')[1];
           }
           return logicCli.generate(process.cwd(), packageFolder, itemType, itemName, function(err){
             cb && cb(err);
           });
         }
  },

  /**
   * Creates a new dashboard
   *
   * @params args[0] dashboard directory
   */

  new: {

    descr: "generates a new dashboard project",
    example: "atlasboard new mywallboard",

    run: function (args, cb) {

           if (args.length < 1) {
              cb && cb('Missing arguments. Please use "atlasboard new <mywallboard>"');
              return;
           }
           var newDirectory = sanitize(args[0]);
           var srcDir = path.join(__dirname, "../..", "templates", "new-components", "project");
           var destDir = path.join(process.cwd(), newDirectory);
           return logicCli.newProject (srcDir, destDir, function(err){
             if (err){
               cb && cb(err);
               return;
             }

             process.chdir(newDirectory);
             var isWindows = /^win/.test(process.platform);
             var npmCommand = isWindows ? "npm.cmd" : "npm";
             var childProcess = require('child_process');
             var child = childProcess.spawn(npmCommand, ["install", "--production"], {stdio: 'inherit'});
             console.log ('  Installing npm dependencies...');
             child.on('error', function () {
               console.log('\n  Error installing dependencies. Please run "npm install" inside the dashboard directory');
               cb && cb('Error installing dependencies');
             });
             child.on('exit', function () {
               console.log([
                 '\n  SUCCESS !!'.green + '\n',
               '  New project "' +  newDirectory.yellow + '" successfully created. Now you can:\n',
                 ('   1. cd ' + newDirectory).gray,
               '   2. npm install'.gray,
               '   3. start your server with `atlasboard start` (or `node start.js`)'.gray,
               '   4. browse http://localhost:3000'.gray + '\n',
               '   Optionally: import the Atlassian package (or any other package) by running:\n',
               '   git init'.gray,
               '   git submodule add https://bitbucket.org/atlassian/atlasboard-atlassian-package packages/atlassian\n'.gray
               ].join('\n'));

               cb && cb();
             });
          });
        }
  },

  /**
   * List of all Atlasboard components (widgets or jobs) within all available packages
   */

  list: {

    descr: "lists all available components (widgets or jobs) among all packages",
    example: "atlasboard list",

    run: function (args, cb) {

           function parse(package){
             console.log('        Package "' + path.basename(package.dir) + '":');
             package.items.forEach(function(item){
               console.log('          - ' + path.basename(item, '.js').gray);
             });
           }

           var packagesLocalFolder = path.join(process.cwd(), "/packages");
           var packagesAtlasboardFolder = path.join(__dirname, "../../packages");
           return logicCli.list([packagesLocalFolder, packagesAtlasboardFolder], function(err, packages){
             if (err){
               cb && cb('Error reading package folder');
               return;
             }

             packages.forEach(function(package){
               console.log('Path: ' + package.package + ':\n');
               console.log('  - Widgets:'.yellow);
               package.widgets.forEach(parse);

               console.log('  - Jobs:'.yellow );
               package.jobs.forEach(parse);
             });
             console.log('');
             cb && cb();
           });
         }
  },

  /**
   * When run in a project's base directory, starts the AtlasBoard server.
   *
   * @params args[0] port (optional)
   * @params args --jobFilter filter by job (optional)
   * @params args --dashboardFilter filter by dashboard (optional)
   */

  start: {

    descr: "starts AtlasBoard's server",
    example: "atlasboard start 3333                    # runs atlasboard in port 3333" +
             "\n        atlasboard start --noinstall             # skips npm package install (faster startup)" +
             "\n        atlasboard start --job myjob             # runs only jobs matching 'myjob'" +
             "\n        atlasboard start --dashboard \\bdash      # loads only dashboards matching \\bdash regex",

    run: function (args, cb) {
          var port = isNaN(args[0]) ? 3000 : args[0];
          var options = {port: port, filters: {}, install: true};

          var argsOptimistic = require('optimist')(args).argv;

          if (argsOptimistic.noinstall) {
            options.install = false;
          }

          if (argsOptimistic.job) {
            console.log('Loading jobs matching ' + argsOptimistic.job.yellow + " only");
            options.filters.jobFilter = argsOptimistic.job;
          }

          if (argsOptimistic.dashboard) {
            console.log('Loading dashboards matching ' + argsOptimistic.dashboard.yellow + " only");
            options.filters.dashboardFilter = argsOptimistic.dashboard;
          }
          console.log('\nStarting server...'.gray);

          logicCli.start(options, function(err){
            cb && cb(err);
          });
         }
  },

  /**
   * Install the packages dependencies
   */

  install: {

    descr: "install package dependencies",
    example: "atlasboard install",

    run: function (args, cb) { // check for the right arguments
           return logicCli.install({}, function(err){
             cb && cb(err);
           });
    }
  }
};
