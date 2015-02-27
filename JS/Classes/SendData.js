(function(classes){

	function SendData () {
		this.data = {};
	}

	SendData.prototype.storeData = function (id, data) {
		var valueChanged = false;

		if(!this.data[id] || this.data[id] !== data) {
			valueChanged = true;
			this.data[id] = data;
		}
	};

	SendData.prototype.makeRequest = function (mapping, data) {
		console.log('dataCaptured: mapping id: ' + mapping.id + ' - data: ' + data);
	};

	SendData.prototype.sendData = function (mapping, data) {
		var valueChanged = null;

		valueChanged = this.storeData(mapping.id, data);
		if(valueChanged){
			this.makeRequest(mapping, data);
		}
	};

	classes.SendData = SendData;
}(classes));