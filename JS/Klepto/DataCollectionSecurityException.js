function DataCollectionSecurityException(message) {
    // arg: source_info
    this.timestamp_received = new Date();  // moment received
    this.message = message;

    // ?
    var last_part = new Error().stack.match(/[^\s]+$/);
    this.stack = `${this.name} at ${last_part}`;
}

Object.setPrototypeOf(DataCollectionSecurityException, Error);
DataCollectionSecurityException.prototype = Object.create(Error.prototype);
DataCollectionSecurityException.prototype.name = "DataCollectionSecurityException";
DataCollectionSecurityException.prototype.message = "";
DataCollectionSecurityException.prototype.constructor = DataCollectionSecurityException;
