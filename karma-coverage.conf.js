// Karma configuration
module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['mocha','chai'],


        // list of files / patterns to load in the browser
        files: [
            'tests/js/unit/mock.js',
            'src/*.js',
            'tests/js/unit/*.js'
        ],


        // list of files to exclude
        exclude: [
            '*_bak_*'
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress','html','junit','coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        //browsers: ['Chrome', 'Firefox', 'Safari'],
        browsers: ['Firefox'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,
        htmlReporter: {
            outputDir: 'reports/karma_html'
        },
        junitReporter: {
            outputFile: 'reports/junit/junit-report.xml',
            suite: 'unit' // suite will become the package name attribute in xml testsuite element
        },
        preprocessors: {
            'src/**.js': 'coverage'
        },
        coverageReporter: {
            type: 'html',
            dir: 'reports/coverage'
        }
    });
};