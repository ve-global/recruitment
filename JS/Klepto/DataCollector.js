var KLEPTO = KLEPTO || {};

(function(win, KLEPTO){

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
    // let dom_elements = [document_.querySelector(this.map_entry.selector)];
    let dom_elements = document_.querySelectorAll(this.map_entry.selector);
    // must use document.querySelectorAll. Otherwise will not capture ...
    // What about multiple seectors sending through the same channel?
    // How can we check for this?
    // // todo: unit test that checks the problem with the radio-button.

    // console.log(dom_elements);

    if (!dom_elements || dom_elements.length == 0) {
        // Not found
        throw new Error("DOM element(s) not found by selector");
        //return this;
    }

    // console.error(dom_elements);
    for (let eid = 0; eid < dom_elements.length; ++eid) {
        let dom_elem = dom_elements[eid];
        // todo: use jQuery - style binding of events to listeners.
        var that = this;
        //console.log("dom_elem", dom_elem, "event", this.getEventName());
        dom_elem.addEventListener(
            this.getEventName(),
            (e) => {
                // console.error("EVENT: ", e, " to ", dom_elem);
                that.process_event(e, dom_elem, reporter);
            }
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
/*
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

        let dom_element_array = document_.getElementsByClassName(name_tail)
        return dom_element_array;

    } else if (code == '?') {

        let dom_element_array = document_.getElementsByTagName("...")
        return dom_element_array;

    } else {
        return false;
        // bas usage
        throw new InvalidMappingException("selector_name = " + selector_name, "selector", null);

    }
}
*/
KLEPTO.DataCollector.prototype.process_event = function (event, dom, reporter) {
    // console.log('Event process', event);
    if (! reporter instanceof KLEPTO.DataReporter) {
        console.error("bug!");
    }
    var v = this.extractData(dom, event);
    // problem: if not found, just leave it
    if (v !== undefined && v !== null) {
        var pair = this.validateData(this.id, v, this.map_entry);
        var refined = pair[1];  // can be undefined
        var valid = pair[0];
        if (valid) {
            reporter.send(this.id, refined );
        }
    }
}

// static
KLEPTO.DataCollector.prototype.validateData = function (id, value, mapping) {
    if (mapping.isEmail) {
        var polished = this.validate_and_refine_email_address(value);
        if (polished) {
            return [true, polished];
        } else {
            return [false];
        }
    }
    //console.error("=======================", mapping.isPhoneNumber, mapping)
    if (mapping.isPhoneNumber) {
        var polished = this.validate_phone_number(value);
        if (polished) {
            return [true, polished];
        } else {
            return [false];
        }
    }
    return [true, value];
}

KLEPTO.DataCollector.prototype.validate_and_refine_email_address = function (email) {
    var e1 = JSON.stringify(email);
    email = email.trim().toLowerCase();
    var e2 = JSON.stringify(email);
    var at = email.indexOf('@');
    if (at < 0)
        return false;
    if (at < 1)
        return false;
    if (email.length-1 - at <= 0)
        return false;

    var last_at = email.lastIndexOf('@');
    if (last_at !== at)
        return false;

    var dot = email.lastIndexOf('.');
    if (dot < 0)
        return false;
    if (dot < 1)
        return false;
    if (email.length-1 - dot <= 0)
        return false;

    if (dot < at)
        return false;

    if (dot == at+1)
        return false;

    var ddot = email.indexOf('..');
    if (ddot !== -1)
        return false;

    if (email.indexOf('@.') !== -1) return false;
    if (email.indexOf('.@') !== -1) return false;

    var space = email.lastIndexOf(' ');
    if (space !== -1)
        return false;

    // new RegExp("$[a-z]*^").test(email);
    // "..";
    //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var re = /^[a-zA-Z\@\.0-9_\.\+]+$/;
    // console.error(email, re.test(email));
    if (!re.test(email))
        return false;

    return email;
}


KLEPTO.DataCollector.prototype.validate_phone_number = function (pno) {
    //console.error(pno);

    //var digits_only = pno.reduce(  (ac,b)=>(ac+(b>='0' && b<=9)?b:""), "");
    var digits_only = "";
    for (var i = 0; i < pno.length; ++i) {
        var c = pno[i];
        if (c>='0' && c<=9) {
            digits_only = digits_only + c;
        }
    }
    var digits_only = digits_only;
    //console.error(JSON.stringify(pno), JSON.stringify(digits_only));
    var l = pno.length;
    if (l < 4)
        return false;
    if (digits_only.length > 16)
        return false;
    if (digits_only.length < 4)
        return false;
    // todo: parantheses balance
    // + in beginnig only
    // US/UK/country-specific rules
    // more than two 0 in beginning
    // avoid -- ++, etc
    // at least 4 digits (after removing non-digits)

    var re = /^[0-9\(\)\ \+\-]+$/;
    if (!re.test(pno))
        return false;

    return pno;
}


/*
    The data that is sent to the reporter
    Important: if undefined or null is returned, it will NOT be reported.
    However, 0 or "" are reported.
*/
KLEPTO.DataCollector.prototype.extractData = function(dom, event) {

    //console.log("todo: extractData(dom)", this.map_entry, dom);
    // attribute can be text, value, radio, checkbox
    var val = null;
    switch (this.attribute) {
        case "text":
            // to do: What if dom_array has more than one element?
            val = dom["text"]
            return val;
            break;

        case "value":
            val = dom["value"]
            return val;
            break;

        case "radio":
            // Also accesible through: event.target.value;
            val = dom["value"];  // value is static, but once it receives a "change", it (the *.value, i.e. the label) is the content.
            // No point in checking for "undefined". If undefined, it will NOT be reported.
            return val;

        case "checkbox":
            // true: checked, false: unchecked, null: any error.
            /*
            var onoff = dom['value'];
            console.error("onoff", onoff, dom, dom.checked);
            if (onoff == "on") {
                return true;
            } else if (onoff == "off") {
                return false;
            }
            */
            if (dom.checked) {
                return true;
            } else {
                return false;
            }
            return null;

        default:
            throw new Error("Trying to collect unknown attribute type. Attribute error or not implemented: "+this.attribute, this.attribute); // todo: unit test the expected behaviour
    }
    /*
    // var val = dom[this.attribute];
    console.log("val: "+this.attribute + " -> " + val);
    // todo: check never null
    return val;
    */
}

/*
    More valifdation duting 'attach'ing, etc.
*/
KLEPTO.DataCollector.pre_validate_mapping = function (mapping) {
    if (mapping.id !== 0 && !mapping.id) {
        throw new InvalidMappingException("Mapping validation failed", "id", mapping);
    }
}

}(window, KLEPTO));
