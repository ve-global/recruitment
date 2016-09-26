// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        files: [
            'JS/Classes/DataReporter.js',
            'Test/**',
            'Test/Classes/DataReporterTest.js',
            'spec/sohail/my1Spec.js',
        ],

        plugins : [
          'karma-chrome-launcher',
          //'karma-firefox-launcher',
          // 'karma-phantomjs-launcher',
          'karma-jasmine',
          //'karma-jasmine-html-reporter'
        ],

        browsers: [ //'PhantomJS',
            'Chrome'],


            // new:
        reporters: [
            // 'html',  //cannot load 'html' it is not regitered.
            'progress',
            //'junit',
            //'coverage',
             ],

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

    });
};