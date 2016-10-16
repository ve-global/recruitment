var KLEPTO = KLEPTO || {};

'use strict';

/*
Note: Two collectors can have the same ID.
*/
KLEPTO.DataCollector = function (map_entry, collector_pool) {
    /*
    id: 1,
    selector: '#email',
    attribute: 'value',
    event: 'onChange',
    isEmail: true,
    isPhoneNumber: false
    */

    /*
    this.id = map_entry.id;
    this.selector = //DataCollector._parse_selector(map_entry.selector);
    */
    this.map_entry = map_entry;

    KLEPTO.DataCollector.pre_validate_mapping(map_entry);  // can throw exceptions

    /*
    if (!pre_validate_mapping(mapping_entry)) {  // for security
        // report back, or fail
        throw new Error("Security: invalid mapping was rejected.");
    }
    */
    this.id = map_entry.id;
    this.attribute = map_entry.attribute;
    // check for security?
}

/*
    attach to HTML page
*/
KLEPTO.DataCollector.prototype.attach = function (document_, reporter) {
    // var elem = document_.getElementById('email');
    // let dom_elements = KLEPTO.DataCollector._parse_selector(this.map_entry.selector, document_);
    let dom_elements = [document_.querySelector(this.map_entry.selector)];

    if (!dom_elements) {
        console.log("Nothing to do");
        return this;
    }

    // console.error(dom_elements);
    for (let eid in dom_elements) {
        let dom_elem = dom_elements[eid];
        // todo: use jQuery - style binding of events to listeners.
        var that = this;
        //console.log("dom_elem", dom_elem, "event", this.getEventName());
        dom_elem.addEventListener(this.getEventName(),
            (e) => {that.process_event(e, dom_elem, reporter);}
        );
    }

    return this;  // enable builder pattern
}

KLEPTO.DataCollector.prototype.getEventName = function() {
    const mapevent_to_event_map = {
        'onChange': 'change',
        'onLoad': 'load',
        'onClick': 'click',
        // add more
    };
    var event_name_in_mappings = this.map_entry.event;
    let html5_name = mapevent_to_event_map[event_name_in_mappings];
    if (!html5_name) {
        throw new InvalidMappingException("Invalid event type " + event_name_in_mappings, "event", map_entry);
    }
    return html5_name;
}

/*
    mimics jQuery-style selector.
    returns an array of DOM elements.

    refactor: get dom elements
*/
KLEPTO.DataCollector._parse_selector = function(selector_name, document_) {
    if (typeof selector_name === "undefined"  || typeof selector_name === "null") {
        throw new InvalidMappingException("selector_name", "selector", null);
    }
    if (selector_name.length < 1) {
        throw new InvalidMappingException("selector_name", "selector", null);
    }
    let code = selector_name[0];
    let name_tail = selector_name.substr(1);
    //let type = "";
    if (code == '#') {

        //type = element_id;
        let dom_element = document_.getElementById(name_tail);
        return [dom_element];

    } else if (code == '.') {

        let dom_element_array = document.getElementsByClassName(name_tail)
        return dom_element_array;

    } else if (code == '?') {

        let dom_element_array = document.getElementsByTagName("...")
        return dom_element_array;

    } else {
        return false;
        // bas usage
        throw new InvalidMappingException("selector_name = " + selector_name, "selector", null);

    }
}

KLEPTO.DataCollector.prototype.process_event = function (event, dom, reporter) {
    console.log('Event process', event);
    if (! reporter instanceof KLEPTO.DataReporter) {
        // console.error("bug!");
    }
    reporter.send(this.id, this.extractData(dom, event) );
}

/*
    The data that is sent to the reporter
*/
KLEPTO.DataCollector.prototype.extractData = function(dom) {
    console.error("todo: extractData(dom)", this.map_entry, dom);
    // todo:
    return dom[this.attribute];
}

/*
    More valifdation duting 'attach'ing, etc.
*/
KLEPTO.DataCollector.pre_validate_mapping = function (mapping) {
    if (mapping.id !== 0 && !mapping.id) {
        throw new InvalidMappingException("Mapping validation failed", "id", mapping);
    }
}
