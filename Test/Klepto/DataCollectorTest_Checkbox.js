/*
 * Unit tests for DataCollector.js
 */

describe('DataCollector:CheckBox', function() {

    // Accessed throughout the tests
    var reporter_mock = new KLEPTO.DataReporterMock();

    var fixture =
    `<div id="fixture">

          <div class="checkbox">
            <label>
              <input type="checkbox" id="termsAndConditions">I Agree To The Terms & Conditions</label>
          </div>

          <div class="checkbox">
            <label>
              <input type="checkbox" id="another">Another</label>
          </div>

    </div>`;

    var mappings = [
        {
            id: 6,
            selector: '#termsAndConditions',
            attribute: 'checkbox',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 60,
            selector: '#another',
            attribute: 'checkbox',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
    ];

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

    /** Operations for timeout. Useful for predictable async. */
    var originalTimeout = -1;
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;  // it is already 5000, but just for future compatiblity.
    });
    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });


    /**
    The test plan:
        Check distinction between multiple checkboxes.
        Use one checkbox initially checked.
        Click each.
        Toggle one by a third click.
    */
    it('click the first one, then see if the right one is reported not the other one', function(done) {
        reporter_mock.tick();
        document.getElementById('termsAndConditions').click();
        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            console.log( document.getElementById('termsAndConditions')    ['value'] );
            console.log("**************1a", reporter_mock.anyDataSentSinceLastTickGivenId(6)); // null
            console.log("**************1b", reporter_mock.anyDataSentSinceLastTickGivenId(60)); // true
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6)).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(60)).toBe(null);  // does not exist
            done();
          }, 20
        );
    });  // it



    it('click the second one, then see if the right one is reported not the previous one', function(done) {
        reporter_mock.tick();
        document.getElementById('termsAndConditions').click();
        // reporter_mock.tick();
        document.getElementById('another').click();
        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            // reporter_mock.reportSinceLastTick();
            console.log("2 ", document.getElementById('another')    ['value'] );
            console.log("**************2a", reporter_mock.anyDataSentSinceLastTickGivenId(6)); // null
            console.log("**************2b", reporter_mock.anyDataSentSinceLastTickGivenId(60)); // true
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(60)).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6)).toBe(true);
            //expect(reporter_mock.anyDataSentSinceLastTickGivenId(6)).toBe(null);  // does not exist
            done();
          }, 20  // 20: not portable
        );
    });  // it

    /*
    it('click the first one again to Toggle. Then see if the right one is reported with the correct value (i.e. false)', function(done) {
        reporter_mock.tick();
        document.getElementById('termsAndConditions').click();
        // reporter_mock.tick();
        // how to wait before the tick() is applied here?
        document.getElementById('termsAndConditions').click();
        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            console.log("3 "+ document.getElementById('termsAndConditions') ['value']);
            console.log("**************3a", reporter_mock.anyDataSentSinceLastTickGivenId(6)); // null
            console.log("**************3b", reporter_mock.anyDataSentSinceLastTickGivenId(60)); // true
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6)).toBe(false);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(60)).toBe(null);  // does not exist
            done();
          }, 20
        );
    });  // it
    */

});  // describe
