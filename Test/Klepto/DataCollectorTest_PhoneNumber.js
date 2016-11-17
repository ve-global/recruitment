/**
 *
 */

var describe2 = function(testName, fixture_, mapping_, do_tests_callback) {
    describe(testName, function() {

    // Accessed throughout the tests
    var reporter_mock = new KLEPTO.DataReporterMock();

    var fixture = fixture_  ,  mapping = mapping_;  // set the closure

    /** Inject the DOM elements for the tests */
    beforeEach(function() {
        document.body.insertAdjacentHTML('afterbegin', fixture );
    });
    /** remove the html fixture from the DOM when finished. */
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    /** Register DOM elements and attach to the collector/reporter with the given mapping. */
    beforeEach(function() {
        var data_reporters = [];
        data_reporters.push(reporter_mock);
        var collector_pool = KLEPTO.create_collectors([mapping], data_reporters);
    });

    /** Operations for timeout. Useful for predictable async. */
    var originalTimeout = -1;
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;  // it is already 5000, but just for future compatiblity.

    });
    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    beforeEach(function() {
        reporter_mock.resetChangeCaches();
    });

    var test_domelement_reported_data = function (domElemId, prepare_callback1, test_callback2) {
        return function(done) {
            expect(typeof domElemId).toBe("string");  // self testing the test
            expect(typeof prepare_callback1).toBe("function");  // self test
            expect(typeof test_callback2).toBe("function");  // self test

            var dom_elem = document.getElementById(domElemId);

            // Part 1: prepare
            var arg = prepare_callback1(dom_elem);

            // Part 2: test
            // arg = data passed (shared) from prepare_callback1() to test_callback2()
            setTimeout(function(dom_elem_, test_callback2_, done_, arg_) {
                test_callback2_(dom_elem_, arg_);
                done_();
              }(dom_elem, test_callback2, done, arg), 200
            );
        };
    }

    var it1_ = it;

    var it2 = function (title, id, f1, f2) {
        it1_(title, test_domelement_reported_data(id, f1, f2));
    }

    do_tests_callback(it2, reporter_mock);

});  // describe

};


describe2(
    'DataCollector:PhoneNumber',
    `<div id="fixture">
        <div class="form-group">
            <label for=hphone">Phone no</label>
            <input type="text" class="form-control" id="phono99" placeholder="Enter phone no">
        </div>
    </div>`,
    {
        id: 99,
        selector: '#phono99',
        attribute: 'value',  // 'text'  or  'value' ??
        //event: 'onLoad',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: true,
    },
    function(it2, reporter_mock) {

        it2('Enter a valid phone no and get it reported back.',
            'phono99',
            (dom_elem) => {
                // reporter_mock.tick();
                dom_elem.click();
                const EXAMPLE_PHONENO = "07719689428";
                dom_elem.value = EXAMPLE_PHONENO;
                var event = new Event('change');
                dom_elem.dispatchEvent(event);
                // reporter_mock.reportAll();
                return EXAMPLE_PHONENO;
            },
            (dom_elem, EXAMPLE_PHONENO) => {
                // console.error(dom_elem.value);
                // reporter_mock.reportAll();
                expect(reporter_mock.anyDataSentSinceLastTick()).toBe(true);
                expect(reporter_mock.anyDataSentSinceLastTickGivenId(99, "first")).toBe(EXAMPLE_PHONENO);
            }
        );  // it2

    }
);