

var KLEPTO = KLEPTO || {};

(function (KLEPTO, document) {
    'use strict';


    KLEPTO.process_exception = function (excep) {
        if (excep instanceof DataCollectionSecurityException) {
            console.log(excep.message);
        } else if (excep instanceof InvalidMappingException) {
            console.log(excep.message);
        } else {
            throw excep;
        }
    }

    KLEPTO.create_collectors = function (array_of_mappings, data_reporters) {
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

    return KLEPTO;
}(KLEPTO, document));


if ( typeof exports !== 'undefined'  && typeof module !== 'undefined' ) {
    module.exports = KLEPTO;
}
