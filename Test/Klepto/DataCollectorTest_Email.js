/*
 * Unit tests for DataCollector.js
 */

describe('DataCollector:CheckBox', function() {

    // Accessed throughout the tests
    var reporter_mock = new KLEPTO.DataReporterMock();

    var fixture =
    `<div id="fixture">

        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="eml8" placeholder="Enter email">
        </div>

    </div>`;

    var mappings = [
        {
            id: 8,
            selector: '#eml8',
            attribute: 'value',
            event: 'onChange',
            isEmail: true,
            isPhoneNumber: false
        },
    ];

    // todo: repeated code. D.R.Y

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
        var collector_pool = KLEPTO.create_collectors(mappings, data_reporters);
    });

    // todo: repeated code. D.R.Y

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

    it('Enter a valid email and get it reported back.', function(done) {
        reporter_mock.tick();
        var e = document.getElementById('eml8');
        e.click();
        const EXAMPLE_EMAIL = "jack@jack.com";
        e.value = EXAMPLE_EMAIL;
        var event = new Event('change');
        e.dispatchEvent(event);

        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick()).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(8, "first")).toBe(EXAMPLE_EMAIL);
            done();
          }, 20
        );
    });  // it


    it('Enter an invalid email and check invalid-ness.', function(done) {
        reporter_mock.tick();
        var e = document.getElementById('eml8');
        const  GOODS = 0;
        const  BADS = 1;
        const EXAMPLE_EMAILS = [
            ["jack@jack.com", "a@b.com"],  // good
            ["a@b.c om", "q.q.q"]  // bad
        ];
        for (var goodbad = 0 ; goodbad < 2; ++goodbad) {
            for (var i = 0; i < EXAMPLE_EMAILS[goodbad].length; ++i) {
                e.value = EXAMPLE_EMAILS[goodbad][i];
                var event = new Event('change');
                e.dispatchEvent(event);
            }
        }
        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick()).toBe(true);
            var vl = reporter_mock.anyDataSentSinceLastTickGivenId(8, "list");
            console.error(reporter_mock.countChunksSentSinceLastTick())
            console.error(vl)
            expect(reporter_mock.countChunksSentSinceLastTick()).toBe(EXAMPLE_EMAILS[GOODS].length);

            // ogdds and bads are appended and are collected here:
            var ctr = 0;
            for (var goodbad = 0 ; goodbad < 2; ++goodbad) {
                for (var i = 0; i < EXAMPLE_EMAILS[goodbad].length; ++i) {
                    // console.log("i", i, "[] ", vl[i]);
                    if (goodbad == GOODS) {
                        expect(vl[ctr]).toBe(EXAMPLE_EMAILS[goodbad][i]);
                    } else if (goodbad == BADS){
                        expect(vl[ctr]).toBe(null);  // EXAMPLE_EMAILS[goodbad][i]
                    }

                    ctr ++;
                }
                // if (goodbad == BADS)
            }
            done();
          }, 20
        );

    });  // it

    it('Enter an valid email and check its validity.');
    it('Enter a range of invalid emails. (and make sure they are not sent)');
    it('Enter a range of valid emails.');
    it('Enter an email that is not changed, and make sure it is not sent.');



});  // describe
