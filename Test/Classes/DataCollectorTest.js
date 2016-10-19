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

    it('should return male after click of a radio button', function() {
        //document.getElementById('x').value = 1;
        document.getElementById('male').click();
        // document.getElementById('female').click();
        // console.log(reporter_mock);
        reporter_mock.tick();
        /*
            Uncaught Error: 'expect' was used when there was no current spec, this could be because an asynchronous test timed out

            How to wait just enough for event listener to process this?
        */
        setTimeout(function(){
          // not done yet.
          //expect(reporter_mock()).toBe('third');
          expect(reporter_mock.checkLastSubmitted(4, 'male')).toBe(true);
          expect(reporter_mock.getLastSubmittedData(4)).toBe('male');
          console.log("submitted: "+reporter_mock.getLastSubmittedData(4));  // not yet
        }, 100);
    });

});
