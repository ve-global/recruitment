/*
 * Unit tests for DataCollector.js
 */

describe('DataCollector:Radio', function() {

    //todo: checkbox

    var reporter_mock = new KLEPTO.DataReporterMock();

    // inject the DOM elements for the tests
    beforeEach(function() {
    var fixture = `<div id="fixture">
          <div class="radio-inline">
            <label>
              <input type="radio" name="sex" id="male" value="male">Male</label>
          </div>
          <div class="radio-inline">
            <label>
              <input type="radio" name="sex" id="female" value="female">Female</label>
          </div>
          <div class="radio-inline">
            <label>
              <input type="radio" name="sex" id="third" value="third">Third</label>
          </div>
    </div>`;

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  });

  // For the class to to register DOM elements
  beforeEach(function() {
    console.log("BEFORE EACH");
    // this would be for the integration  test:
    // window.KLEPTO.init();
    /*
            data_reporters.push(new KLEPTO.DataReporter());
            data_reporters.push(new KLEPTO.DataReporterAccumulator(visualiser, "000"))
            create_collectors(mappings, collector_pool);
    */
    var mappings = [
        {
            id: 4,
            selector: 'input[name="sex"]',
            attribute: 'radio',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
    ];
    // var reporter_mock = new KLEPTO.DataReporterMock();
    var data_reporters = [];
    data_reporters.push(reporter_mock);
    var collector_pool = KLEPTO.create_collectors(mappings, data_reporters);
  });

    /*
    Requires: https://github.com/billtrik/karma-fixture

    beforeEach(function() {
        fixture.load('some.fixture.html');
    });
    // remove the html fixture from the DOM
    afterEach(function() {
        fixture.cleanup();
    });
    */

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

    var originalTimeout = -1;

    beforeEach(function() {
      // the default value was 5000
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;  // it is already 5000, but just for future compatiblity.
    });
    afterEach(function() {
      if (jasmine.DEFAULT_TIMEOUT_INTERVAL != 6000) {
          console.error("Error (un)setting Jasmine's asyc timeout. originalTimeout=" + originalTimeout + "  jasmine.DEFAULT_TIMEOUT_INTERVAL = "+jasmine.DEFAULT_TIMEOUT_INTERVAL);
      }
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should return male after click of a radio button', function(done) {
        // Note the mysterious argument "done". Specifying this will change the behaviour of Jasmine. See below.
        //document.getElementById('x').value = 1;
        document.getElementById('male').click();
        // document.getElementById('female').click();
        // console.log(reporter_mock);
        reporter_mock.tick();
        var tick_time = new Date();
        /*
            Uncaught Error: 'expect' was used when there was no current spec, this could be because an asynchronous test timed out

            How to wait just enough for event listener to process this?
            Promise, async/await, etc.

            setTimeout is not a good practice.
            https://github.com/jasmine/jasmine/issues/694
            http://jasmine.github.io/2.0/introduction.html#section-Mocking_the_JavaScript_Timeout_Functions

            //if jasmine.DEFAULT_TIMEOUT_INTERVAL is passed:
            debug.html:37 Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
        */
        // console.error(jasmine.DEFAULT_TIMEOUT_INTERVAL);  // by default, it is 5000!
        setTimeout(function() {
            // not done yet.
            //expect(reporter_mock()).toBe('third');
            console.log("delay: ", new Date() - tick_time);
            // console.error(jasmine.DEFAULT_TIMEOUT_INTERVAL);  // by default, it is 5000!
            expect(reporter_mock.checkLastSubmitted(4, 'male')).toBe(true);
            expect(reporter_mock.getLastSubmittedData(4)).toBe('male');
            console.log("submitted: "+reporter_mock.getLastSubmittedData(4));  // not yet
            done();
          }, 20
          /* 10 ms? Just enough to let event sink in eventListener. Hopefully this is enough in the test server.
           * But how much is enough?
           * 10 ms =good, but probably for fast PCs.
           * 110 ms =maximum that works (most of times), if done is not used. (INTERVAL1)
           * 5950+ ms = If (done) arg is used, this number can be as big as jasmine.DEFAULT_TIMEOUT_INTERVAL. This is not the same unterval used in case of "without done"
          */
        );
    });

});
