exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'endtoend/shopProtractorSpec.js',
        'endtoend/homeProtractorSpec.js'
    ]
}