var KLEPTO = KLEPTO || {};

/*
 * The DataReporterMock is similar to DataReporter in this
 * version, because DataReporter is essentially a mock class;
 * It doesn't send anything across http.
 */

(function(win, KLEPTO){
	'use strict';

	var DataReporterMock = function (visualiser, viauslisation_id) {
		this.data = {};
		this.transmitted_data = [];  // keeps track of what would have been transmitted, as strings, given it was not a mock.
		this._tick = -1;
	}


	/**
	 * This method is storing the new data in the class' instance property "data" and returning wherever the data has changed or not.
	 *
	 * @name store
	 * @param {number} id - Id of the data to store.
	 * @param {string} data - data to store in the data property.
	 * @returns {boolean} If the value has changed or not.
	 */
	DataReporterMock.prototype.store = function (id, data) {
		var valueChanged = false;
		if (!this.data[id] || this.data[id] !== data) {
			valueChanged = true;
			this.data[id] = data;
		}
		return valueChanged;
	};

	/**
	 * This method is making the request to send the new data to the Back-end.
	 * In this exercise, this method will only be printing the captured data in the console.
	 *
	 * @name makeRequest
	 * @param {number} id - Id of the data to send.
	 * @param {string} data - data to send to the Back-end.
	 */
	DataReporterMock.prototype.makeRequest = function (id, data) {
		// win.console.log('dataCaptured: mapping id: ' + id + ' - data: ' + data);
		// var encoded = id + " : " + JSON.stringify(data);

		// var dict = {id:data};  // will not work! --> {"id":data}
		var dict = {}; dict[id] = data;
		var encoded = JSON.stringify(dict);
		this.transmitted_data.push(encoded);
	};


	/**
	 * This method is called in order to store and send the data to the Back-end.
	 * The data will be sent only if it has changed, this is why we are using ids to identify and store them.
	 *
	 * @name send
	 * @param {number} id - Id of the data to send/store.
	 * @param {string} data - data to send to the Back-end.
	 */
	DataReporterMock.prototype.send = function (id, data) {
		var valueChanged = this.store(id, data);

		if (valueChanged) {
			this.makeRequest(id, data);
		}
	};


    // *************
	// Various ways of interrogating about the (recently) sent data.
	// *************

	/** Check if the very last submitted data is exactly equal to the given content. */
	DataReporterMock.prototype.checkLastSubmitted = function (id, data) {
		var dict = {}; dict[id] = data;
		var encoded = JSON.stringify(dict);
		if (this.transmitted_data.length == 0)
			return false;
		var sent = this.transmitted_data[this.transmitted_data.length-1];
		return sent == encoded;
	};

	/** Get the last data sent, in form of a {id: data} key-value */
	DataReporterMock.prototype.getLastSubmittedKeyVal = function () {
		if (this.transmitted_data.length == 0)
			return false;
		var sent_keyval = this.transmitted_data[this.transmitted_data.length-1];
		return sent_keyval;
	}

	/*
	//
	DataReporterMock.prototype.getLastSubmittedData = function () {
		var keyval_json = this.getLastSubmittedKeyVal();
		var keyval = JSON.parse(keyval_json);

		// Exactly one key-value pair
		const MAGIC = "@M@G1(C)";
		var sentdata = MAGIC;
		var sentkey = MAGIC;
		for (var _key in keyval) {
			// must iterated exactly once
			if (sentdata !== MAGIC) {
				throw new Error("cannot have more than one key-value pair sent.");
			}
			sentdata = keyval[_key];
			sentkey = _key;
		}
		if (sentdata === MAGIC) {
			return null;  // controlled behaviour, which works even if "null" is intended to be sent
		}

		if (getkey) {
			return sentkey;
		} else {
			return sentdata;
		}
	};
	*/

	/** Looks in the very last submission only to see if specifically a data bound to id/key has been sent. */
	DataReporterMock.prototype.getLastSubmittedData = function (key) {
		var keyval_json = this.getLastSubmittedKeyVal();
		var keyval = JSON.parse(keyval_json);
		if (key) {
			return keyval[key];
		}

		for (var _key in keyval) {
			// must iterated exactly once
			return keyval[_key];
		}
		return undefined;  // key or data does not exist
	};

	/** Sets the tick cursor to the current position (end of the current buffer) */
	DataReporterMock.prototype.tick = function () {
		this._tick = this.transmitted_data.length-1;  // index of the last element
		// return this._tick;
	};

	/** Checks if data since "a given point in past" has been sent for key (id).
	 Returns null if not such data is sent recently since the "since" point. */
	DataReporterMock.prototype.anyDataSentSinceLastTickGivenIdSince = function (id, since_idx) {
		// since_idx = this._tick;
		// if (since_idx == -1) since_idx = 0;
		var begin = since_idx;
		if (begin < 0) begin = 0;
		var last = this.transmitted_data.length-1;  // index of the last element
		for (var i = begin; i <= last; ++i) {
			var sent = this.transmitted_data[last];
			var dict = JSON.parse(sent);
			console.log(dict);
			if (dict[id] !== undefined) {
				console.log("FOUND: " + dict[id]);
				return dict[id];
			}
		}
		return null;  // item sent as 'id' does not exist
	};

	/** Checks if data since last .tick() exist for key (id). Returns null if nothing is sent since then. */
	DataReporterMock.prototype.anyDataSentSinceLastTickGivenId = function (id) {
		return this.anyDataSentSinceLastTickGivenIdSince(id, this._tick);
		/*
		// if (this._tick == -1)
		//	return false;
		var begin = this._tick;
		if (begin < 0) begin = 0;
		var last = this.transmitted_data.length-1;  // index of the last element
		for (var i = begin; i <= last; ++i) {
			var sent = this.transmitted_data[last];
			var dict = JSON.parse(sent);
			console.log(dict);
			if (dict[id] !== undefined) {
				console.log("FOUND: " + dict[id]);
				return dict[id];
			}
		}
		return null;  // item sent as 'id' does not exist
		*/
	};

	/** Whether any data is sennt since last tick(). */
	DataReporterMock.prototype.anyDataSentSinceLastTick = function () {
		/*
		if (this._tick == -1)
			return false;
		*/
		var since = this._tick;
		if (this._tick == -1)  since = 0;
		var current = this.transmitted_data.length-1;  // index of the last element
		// return current > since;  // ?
		return current >= since;
	};

	/** Returns how many data is sennt since last tick(). */
	DataReporterMock.prototype.countChunksSentSinceLastTick = function () {
		if (this._tick == -1)
			throw new Error("No tick found");
		var current = this.transmitted_data.length-1;  // index of the last element
		return current - this._tick;
	};



	KLEPTO.DataReporterMock = DataReporterMock;
	// var z = new KLEPTO.DataReporterMock();

}(window, KLEPTO));
