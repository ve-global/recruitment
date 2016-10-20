// UsageException
function InvalidMappingException(message, field, mapping_specs) {
    this.timestamp_received = new Date();  // moment received
    this.mapping_specs = mapping_specs;

    this.message = message;
    this.problem_field = field;

    // ?
    var last_part = new Error().stack.match(/[^\s]+$/);
    this.stack = `${this.name} at ${last_part}`;

}

Object.setPrototypeOf(InvalidMappingException, Error);
InvalidMappingException.prototype = Object.create(Error.prototype);
InvalidMappingException.prototype.name = "InvalidMappingException";
InvalidMappingException.prototype.message = "";
InvalidMappingException.prototype.problem_field = "";
InvalidMappingException.prototype.constructor = InvalidMappingException;

