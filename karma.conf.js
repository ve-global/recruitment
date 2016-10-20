// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        files: [
            'JS/KLEPTO.js',
            'JS/Klepto/DataReporter.js',
            "JS/Klepto/DataCollector.js",
            "JS/Klepto/DataReporterAccumulator.js",
            "JS/Klepto/Visualiser.js",

            "Test/Klepto/DataReporterMock.js",
            'Test/**',
            //'Test/Klepto/DataReporterTest.js',
            //'spec/sohail/my1Spec.js',


        ],

        plugins : [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine',
          'karma-jasmine-html-reporter'   // didnt install properly
        ],

        browsers: [
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