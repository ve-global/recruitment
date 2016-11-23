var KLEPTO = KLEPTO || {};

//var KLEPTO =
(function (service, document) {
	'use strict';

    // var service = {};  // function () {};

    // static
    // var data_reporters = [];
    // var collector_pool = [];  // do we need this here?

	/**
	 * This static function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	var my_init = function () {
        // Create DataCollectors and bind them to the page
        //try {
            var visualiser = new KLEPTO.Visualiser(document);
            var data_reporters = [];
            data_reporters.push(new KLEPTO.DataReporter());
            // data_reporters.push(new KLEPTO.DataReporterAccumulator(document))
            data_reporters.push(new KLEPTO.DataReporterAccumulator(visualiser, "000"))
            //collector_pool = [];
            var collectors =   // var collector_pool =
                service.create_collectors(mappings, data_reporters);
        //} catch (excep) {
        //    service.process_exception(excep);
        //}
	}

	document.addEventListener('DOMContentLoaded', my_init, false);

    return service;
}(KLEPTO, document));

