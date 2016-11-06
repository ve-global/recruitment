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
              <input type="checkbox" id="termsAndConditions6">I Agree To The Terms & Conditions</label>
          </div>

          <div class="checkbox">
            <label>
              <input type="checkbox" id="anotherCheckbox55">Another</label>
          </div>
          <div class="checkbox">
            <label>
              <input checked type="checkbox" id="on_by_default7">on_by_default</label>
          </div>

    </div>`;

    var mappings = [
        {
            id: 6,
            selector: '#termsAndConditions6',
            attribute: 'checkbox',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 55,
            selector: '#anotherCheckbox55',
            attribute: 'checkbox',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 7,
            selector: '#on_by_default7',
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

    beforeEach(function() {
        // resets the cached values so to keep reporting, because the DOM elements are new, otherwise it may incorrectly report as "not changed".
        // This test actually helped finding bugs.
        // When removed, it correctly broke some tests. Try commenting the following line and see some tests breaking. How to automatically do this in a TDD framework? (i.e. to test whether a line makes a difference in the tests).
        reporter_mock.resetChangeCaches();
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
        // moved to beforeach():
        // reporter_mock.resetChangeCaches();   // resets the cached values so to keep reporting, because the DOM elements are new, otherwise it may incorrectly report as "not changed".
        reporter_mock.tick();
        document.getElementById('termsAndConditions6').click();
        setTimeout(function() {
            console.log("data after one clicks: 6");
            // reporter_mock.reportAll();
            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            //
            // alternative way of testing: check if it is "on":
            //    document.getElementById('termsAndConditions6')    ['value']
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(55, "first")).toBe(null);  // should not exist
            done();
          }, 20
        );
    });  // it



    it('click the second one, then see if the right one is reported not the previous one', function(done) {
        // moved to beforeach():
        // reporter_mock.resetChangeCaches();
        reporter_mock.tick();
        document.getElementById('termsAndConditions6').click();
        // reporter_mock.tick();
        document.getElementById('anotherCheckbox55').click();
        setTimeout(function() {
            console.log("data after 2 clicks: 6,55");
            // reporter_mock.reportAll();

            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            // reporter_mock.reportSinceLastTick();
            // Another way of testing would be to compare based on:
            //      document.getElementById('anotherCheckbox55') ['value']
            //console.log("**************2a", reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")); // null
            //console.log("**************2b", reporter_mock.anyDataSentSinceLastTickGivenId(55, "first")); // true
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(55, "first")).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(7, "first")).toBe(null);  // should not exist
            done();
          }, 20  // 20: not portable
        );
    });  // it


    it('click the first one again to Toggle. Then see if the right one is reported with the correct value (i.e. false)', function(done) {
        // moved to beforeach():
        // reporter_mock.resetChangeCaches();
        reporter_mock.tick();
        document.getElementById('termsAndConditions6').click();
        // reporter_mock.tick();
        // how to wait before the tick() is applied here?
        document.getElementById('termsAndConditions6').click();
        setTimeout(function() {
            console.log("data after 2 clicks: 6,6");
            // reporter_mock.reportAll();
            expect(reporter_mock.anyDataSentSinceLastTick());
            // true = checked, false = unchecked, null = not sent (no update)
            // console.log("3 "+ document.getElementById('termsAndConditions6') ['value']);
            // console.log("**************3a", reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")); // null
            // console.log("**************3b", reporter_mock.anyDataSentSinceLastTickGivenId(55, "first")); // true
            // reporter_mock.reportAll();
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6, "last")).toBe(false);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")).toBe(true);
            // reporter_mock.reportAll();
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(55, "first")).toBe(null);  // should not exist

            // second test
            expect(document.getElementById('termsAndConditions6').checked).toBe(false);
            expect(document.getElementById('anotherCheckbox55').checked).toBe(false);
            expect(document.getElementById('on_by_default7').checked).toBe(true);
            done();
          }, 20
        );
    });  // it

    it('click a checkbox that is initially (by default) on', function(done) {
        // moved to beforeach():
        // reporter_mock.resetChangeCaches();
        reporter_mock.tick();

        document.getElementById('on_by_default7').click();
        setTimeout(function() {
            // reporter_mock.reportAll();
            //expect(reporter_mock.anyDataSentSinceLastTick());
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(7, "first")).toBe(false);
            done();
          }, 20
        );
    });  // it

    /*
    This is not possible to be tested using checkbox.
    it('Make sure it doesn\'t send unchanged data', function(done) {
        reporter_mock.resetChangeCaches();
        reporter_mock.tick();
        document.getElementById('termsAndConditions6').click();  // on
        document.getElementById('termsAndConditions6').checked = false;  // the problem is, this does not trgger listeners.
        setTimeout(function() {
            reporter_mock.reportAll();
            // nothing should be sent
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(6, "first")).toBe(null);
            done();
          }, 20
        );
    });  // it
    */

    it('If not clicked since last tick(), should not report anything. (tests the tick)', function(done) {
        // moved to beforeach():
        // reporter_mock.resetChangeCaches();
        document.getElementById('on_by_default7').click();
        reporter_mock.tick(); // note that this is AFTER the click()
        setTimeout(function() {
            // reporter_mock.reportAll();
            expect(reporter_mock.anyDataSentSinceLastTick());
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(7, "first")).toBe(null);
            done();
          }, 20
        );
    });  // it


});  // describe
