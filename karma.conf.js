// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'JS/Classes/DataReporter.js',
            'Test/**'
        ],
    });
};