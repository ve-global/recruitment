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

    function test_domelement_reported_data(domElemId, prepare_callback1, test_callback2) {
        return function(done) {
            expect(typeof domElemId).toBe("string");  // self testing the test
            expect(typeof prepare_callback1).toBe("function");  // self test
            expect(typeof test_callback2).toBe("function");  // self test
            var dom_elem = document.getElementById(domElemId);
            prepare_callback1(dom_elem);
            setTimeout(function(dom_elem_, test_callback2_, done_) {
                test_callback2_(dom_elem_);
                done_();
              }(dom_elem, test_callback2, done), 20
            );
        };
    }



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


    it('Enter invalid and valid emails and check their [in]validity. Make sure invalids are not sent.', function(done) {
        reporter_mock.tick();
        var dom_elem = document.getElementById('eml8');
        const  GOODS = 0;
        const  BADS = 1;
        const EXAMPLE_EMAILS = [
            ["jack@jack.com", "a@b.com"],  // good
            ["a@b.c om", "q.q.q",'@','.','aa.@aa.com','aa@.aa.com','@.com','a@.com','a@c.','a@.',
                '',' ','..','a@goo..com','a@..com',
                'a @goo.com', 'خ@goo.com', 'a@go o.com', 'a@goo.co m'
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
    function test_email(done, email, arg2) {
        let correct_email = "not";
        if (arg2 === undefined) {
        // Usage: test_email(done, valid_email)
            correct_email = email;
        } else if (arg2 === null || arg2 === false) {
        // Usage: test_email(done, invalid_email, null)
            correct_email = null;
        } else {
        // Usage: test_email(done, valid_unrefined_email, correct_email)
            correct_email = arg2;
        }

        reporter_mock.tick();

        var dom_elem = document.getElementById('eml8');
        dom_elem.value = email;
        var event = new Event('change');
        dom_elem.dispatchEvent(event);

        setTimeout(function(_correct_email) {
            var em = reporter_mock.anyDataSentSinceLastTickGivenId(8, "first");
            //console.error(em, _correct_email);
            expect(em).toBe(_correct_email); // note: arg2 cannot be used here because an argument cannot be in the clusure.
            done();
          }(correct_email), 20
        );

    }

        // You cannot use 'done' more than once
    it('Trimming spaces around emails.', function(done) {
        test_email(done, ' ab@gOo.cOm ', 'ab@goo.com');
    });
    it('Valid emails with unusual characters.', function(done) {
        test_email(done, 'a__b.1++@g.uk');
    });
    it('Fine email.', function(done) {
        test_email(done, 'ab@gool.com');
    });
    it('Invalid email using test_email(). Make sure invalids are not sent.', function(done) {
        test_email(done, 'a @goo.com', null);
    });
    it('Empty email.', function(done) {
        test_email(done, '', null);
    });



    it('DRY/Refactored version: Enter an email that is not changed, and make sure it is not sent.',
        test_domelement_reported_data('eml8',
            function (dom_elem){
                dom_elem.click(); // not needed really.
                const EXAMPLE_EMAIL = "jack@jack.com";
                dom_elem.value = EXAMPLE_EMAIL;

                for (var rep = 0; rep < 2; ++rep) {
                    var event = new Event('change');
                    dom_elem.dispatchEvent(event);
                    reporter_mock.tick();
                }
            },
            function (dom_elem){
                expect(reporter_mock.anyDataSentSinceLastTick()).toBe(false); // fails
                expect(reporter_mock.anyDataSentSinceLastTickGivenId(8, "first")).toBe(null);
            }
        )
    );  // it


    it('Enter an email that is not changed, and make sure it is not sent. Non-DRY version.', function(done) {
        var dom_elem = document.getElementById('eml8');

        dom_elem.click(); // not needed really.
        const EXAMPLE_EMAIL = "jack@jack.com";
        dom_elem.value = EXAMPLE_EMAIL;

        for (var rep = 0; rep < 2; ++rep) {
            var event = new Event('change');
            dom_elem.dispatchEvent(event);
            reporter_mock.tick();
        }

        setTimeout(function() {
            expect(reporter_mock.anyDataSentSinceLastTick()).toBe(false); // fails
            expect(reporter_mock.anyDataSentSinceLastTickGivenId(8, "first")).toBe(null);
            done();
          }, 20
        );
    });  // it


});  // describe
