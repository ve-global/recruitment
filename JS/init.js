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
	service.init = function () {
        // Create DataCollectors and bind them to the page
        //try {
            var visualiser = new KLEPTO.Visualiser(document);
            var data_reporters = [];
            data_reporters.push(new KLEPTO.DataReporter());
            // data_reporters.push(new KLEPTO.DataReporterAccumulator(document))
            data_reporters.push(new KLEPTO.DataReporterAccumulator(visualiser, "000"))
            //collector_pool = [];
            var collectors =
                service.create_collectors(mappings, data_reporters);
        //} catch (excep) {
        //    process_exception(excep);
        //}
	}

    function process_exception(excep) {
        if (excep instanceof DataCollectionSecurityException) {
            console.log(excep.message);
        } else if (excep instanceof InvalidMappingException) {
            console.log(excep.message);
        } else {
            throw excep;
        }
    }

    service.create_collectors = function (array_of_mappings, data_reporters) {
        var collectors = [];
        for (let m = 0; m < array_of_mappings.length; ++m) {
            let mapping_entry = array_of_mappings[m];
            // How to create multiple DataCollector-s when more than one DOM element matches?
            let collector = new KLEPTO.DataCollector(mapping_entry, []);
            for (let i in data_reporters) {
                collector.attach(document, data_reporters[i]);
            }
            /*
            collector.attach(document, data_reporters[0]);
            collector.attach(document, data_reporters[1]);
            */
            collectors.push(collector);
        }
        return collectors;
    }

	document.addEventListener('DOMContentLoaded', service.init, false);

    return service;
}(KLEPTO, document));


if ( typeof exports !== 'undefined'  && typeof module !== 'undefined' ) {
    module.exports = KLEPTO;
}
