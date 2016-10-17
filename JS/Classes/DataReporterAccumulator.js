var KLEPTO = KLEPTO || {};

// todo: rename DataReporterAccumulator -> DataReporterForVisualiser

(function(win, KLEPTO){
	'use strict';

	/**
	 * This class is managing the data by storing and showing them.
	 *
	 * @constructs DataReporterAccumulator
	 */
	function DataReporterAccumulator(visualiser, viauslisation_id) {
		this.data = {};
		this.viauslisation_id = viauslisation_id || "reporter0";
		// show error if already exists
		this.visualiser = visualiser;
		// this.visualiser.register(this);
		this.visualiser.update(this.viauslisation_id, this.data);  // initialise
	}


	/**
	 * This method is storing the new data in the class' instance property "data" and returning wherever the data has changed or not.
	 *
	 * @name store
	 * @param {number} id - Id of the data to store.
	 * @param {string} data - data to store in the data property.
	 * @returns {boolean} If the value has changed or not.
	 */
	DataReporterAccumulator.prototype.store = function (id, data) {
		var valueChanged = false;

		if (!this.data[id] || this.data[id] !== data) {
			valueChanged = true;
			this.data[id] = data;
		}
		this.visualiser.update(this.viauslisation_id, this.data);

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
	DataReporterAccumulator.prototype.makeRequest = function (id, data) {
		// win.console.log('dataCaptured: mapping id: ' + id + ' - data: ' + data);
		this.visualiser.update(this.viauslisation_id, this.data);
	};

	/**
	 * This method is called in order to store and send the data to the Back-end.
	 * The data will be sent only if it has changed, this is why we are using ids to identify and store them.
	 *
	 * @name send
	 * @param {number} id - Id of the data to send/store.
	 * @param {string} data - data to send to the Back-end.
	 */
	DataReporterAccumulator.prototype.send = function (id, data) {
		var valueChanged = this.store(id, data);

		if (valueChanged) {
			this.makeRequest(id, data);
		}

		this.visualiser.update(this.viauslisation_id, this.data);
	};

	KLEPTO.DataReporterAccumulator = DataReporterAccumulator;

}(window, KLEPTO));
