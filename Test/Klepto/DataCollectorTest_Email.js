/*
 * Unit tests for DataCollector.js
 */

describe('DataCollector:Email', function() {

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
        var dom_elem = document.getElementById('eml8');
        dom_elem.click();
        const EXAMPLE_EMAIL = "jack@jack.com";
        dom_elem.value = EXAMPLE_EMAIL;
        var event = new Event('change');
        dom_elem.dispatchEvent(event);

        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick()).toBe(true);
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(8, "first")).toBe(EXAMPLE_EMAIL);
            done();
          }, 20
        );
    });  // it


    it('Enter invalid and valid emails and check their [in]validity.', function(done) {
        reporter_mock.tick();
        var dom_elem = document.getElementById('eml8');
        const  GOODS = 0;
        const  BADS = 1;
        const EXAMPLE_EMAILS = [
            ["jack@jack.com", "a@b.com"],  // good
            ["a@b.c om", "q.q.q",'@','.','aa.@aa.com','aa@.aa.com','@.com','a@.com','a@c.','a@.',
                '',' ','..','a@goo..com','a@..com',
                'a @goo.com', 'خ@goo.com'
            ]  // bad
        ];
        for (var goodbad = 0 ; goodbad < 2; ++goodbad) {
            for (var i = 0; i < EXAMPLE_EMAILS[goodbad].length; ++i) {
                dom_elem.value = EXAMPLE_EMAILS[goodbad][i];
                var event = new Event('change');
                dom_elem.dispatchEvent(event);
            }
        }
        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick()).toBe(true);
            var vl = reporter_mock.anyDataSentSinceLastTickGivenId(8, "list");
            expect(reporter_mock.countChunksSentSinceLastTick()).toBe(EXAMPLE_EMAILS[GOODS].length);

            // goods and bads are appended and are collected here:
            var ctr = 0;
            for (var goodbad = 0 ; goodbad < 2; ++goodbad) {
                for (var i = 0; i < EXAMPLE_EMAILS[goodbad].length; ++i) {
                    // console.log("i", i, "[] ", vl[i]);
                    if (goodbad == GOODS) {
                        expect(vl[ctr]).toBe(EXAMPLE_EMAILS[goodbad][i]);
                    } else if (goodbad == BADS){
                        expect(vl[ctr]).toBe(undefined);  // out of range
                    }

                    ctr ++;
                }
                // if (goodbad == BADS)
            }
            done();
          }, 20
        );

    });  // it

    /**
     * Checks whether one email is correctly "refined".
     * If refined_email is not specified, the email is already refined and is acceptable as it is (and validated)
     * However, if refined_email is null or false, it means the given email is expected to be rejected.
     *
     * @param      {Function}  done           The done object (used to indicate finishing of the test, as it is async programming)
     * @param      {boolean}   email          The given email string (can be valid, invalid, or refinable)
     * @param      {boolean}   refined_email  (optional): ommited if valid & acceptable. false or null if not acceptable, any other string, to impose a certain form of the email string (the main usecase).
     *
     *    Usage: test_email(done, valid_email)
     *    Usage: test_email(done, invalid_email, null)
     *    Usage: test_email(done, valid_unrefined_email, refined_email)
     */
    function test_email(done, email, arg2, mark) {
        //setTimeout(function() {
        let _correct_email = "not";
        if (arg2 === undefined) {
        // Usage: test_email(done, valid_email)
            console.error("T1 ", JSON.stringify(email), JSON.stringify(arg2), mark);
            _correct_email = email;
        } else if (arg2 === null || arg2 === false) {
        // Usage: test_email(done, invalid_email, null)
            console.error("T2", JSON.stringify(email), JSON.stringify(arg2), mark);
            _correct_email = null;
        } else {
        // Usage: test_email(done, valid_unrefined_email, _correct_email)
            console.error("T3", JSON.stringify(email), JSON.stringify(arg2), mark);
            _correct_email = arg2;
        }
        console.log("--", JSON.stringify(email), JSON.stringify(_correct_email), mark);

        reporter_mock.tick();

        var dom_elem = document.getElementById('eml8');
        dom_elem.value = email;
        var event = new Event('change');
        dom_elem.dispatchEvent(event);

        // console.info(email, _correct_email);
        setTimeout(function(_correct_email) {
            if (mark=="this")
               console.info(em, _correct_email, mark);
            var em = reporter_mock.anyDataSentSinceLastTickGivenId(8, "first");
            expect(em).toBe(_correct_email); // note: arg2 cannot be used here because an argument cannot be in the clusure.
            done();
          }(_correct_email), 20
        );
        //},2);
        // http://brackets.clementng.me/post/24150213014/example-of-a-javascript-closure-settimeout-inside
        // setTimeout(function(x) { return function() { console.log(x); }; }(i), 1000*i);
        // setTimeout(function(x) { }(i), 1000*i);

    }

    it('Trimming spaces around emails.', function(done) {
        //  test_email(done, '  a@gOo.cOm   ', 'a@goo.com');
        //test_email(done, 'a @goo.com', null);
        test_email(done, 'ab@gool.com');
        test_email(done, ' ab@go.com ', 'ab@go.com', "this");  // bug: uses the previous one
    });

    it('Enter an valid email and check its validity.');
    it('Enter a range of invalid emails. (and make sure they are not sent)');
    it('Enter a range of valid emails.');
    it('Enter an email that is not changed, and make sure it is not sent.');



});  // describe
