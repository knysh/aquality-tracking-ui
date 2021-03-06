// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const path = require('path');
const downloadsPath = path.resolve(__dirname, './e2e/data/downloads/');

exports.config = {
  specs: [
    './e2e/**/*.spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      prefs: {
        'download': {
          'prompt_for_download': false,
          'default_directory': downloadsPath,
        }
      }
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    allScriptsTimeout: 30000,
    print: function () { }
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter());
    jasmine.getEnv().afterEach(function (done) {
      browser.takeScreenshot().then(function (png) {
        allure.createAttachment('Screenshot', function () {
          return new Buffer(png, 'base64')
        }, 'image/png')();
        done();
      })

      browser.manage().logs().get('browser').then(function(browserLog) {
        allure.createAttachment('log', function () {
          return require('util').inspect(browserLog)
        }, 'text/plain')();
        done();
      });
    });
  }
};
