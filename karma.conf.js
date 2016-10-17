// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        files: [
            'JS/KLEPTO.js',
            'JS/Classes/DataReporter.js',
            "JS/Classes/DataCollector.js",
            "JS/Classes/DataReporterAccumulator.js",
            "JS/Classes/Visualiser.js",

            "JS/Classes/DataReporterMock.js",

            'Test/**',
            //'Test/Classes/DataReporterTest.js',
            //'spec/sohail/my1Spec.js',


        ],

        plugins : [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          // 'karma-phantomjs-launcher',
          'karma-jasmine',
          'karma-jasmine-html-reporter'   // didnt install properly
        ],

        browsers: [ //'PhantomJS',
            'Chrome',
            'FireFox'],


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