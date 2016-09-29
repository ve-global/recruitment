(function () {
	'use strict';

    var data_reporters = [];
    var collector_pool = [];  // do we need this here?

	/**
	 * This function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	function init () {
        // Create DataCollectors and bind them to the page
        //try {
            data_reporters.push(new classes.DataReporter());
            create_collectors(mappings, collector_pool);
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

    function create_collectors(array_of_mappings, collectorcollector_pool_pool) {
        // collector_pool is not used
        for (let m = 0; m < array_of_mappings.length; ++m) {
            let mapping_entry = array_of_mappings[m];
            // How to create multiple DataCollector-s when more than one DOM element matches?
            let collector = new DataCollector(mapping_entry, []);
            collector.attach(document, data_reporters[0]);
        }
    }

	document.addEventListener('DOMContentLoaded', init, false);

}());
