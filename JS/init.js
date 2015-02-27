var classes = {};

function init () {
	var sendDataInstance,
		processMapping;

	sendDataInstance = new classes.SendData();
	processMappingInstance = new classes.ProcessMapping(mappings, sendDataInstance.sendData.bind(sendDataInstance));
	
	processMappingInstance.init();
}

document.addEventListener('DOMContentLoaded', init, false);