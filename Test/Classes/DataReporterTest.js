(function(win, classes){
	describe('DataReporter', function () {
		var DataReporter = classes.DataReporter,
			dataReporterInstance;

		describe('constructor', function () {
			beforeEach(function () {
				dataReporterInstance = new DataReporter();
			});

			it('initalizes the data property', function () {
				expect(dataReporterInstance.data).toEqual({});
			});
		});

		describe('store', function () {
			var result;

			beforeEach(function () {
				dataReporterInstance = new DataReporter();
			});

			describe('the id has never been stored', function () {
				beforeEach(function () {
					result = dataReporterInstance.store(1, 'data');
				});

				it('returns true as the data has been stored', function () {
					expect(result).toEqual(true);
				});
				it('stores the new data in the data object', function () {
					expect(dataReporterInstance.data).toEqual({1: 'data'});
				});
				it('adds new data into the object it not already present', function () {
					result = dataReporterInstance.store(2, 'someData');
					expect(dataReporterInstance.data).toEqual({
						1: 'data',
						2: 'someData'
					});
				});
			});

			describe('the id has already been stored so we change the data assigned to it', function () {
				beforeEach(function () {
					dataReporterInstance.data = {
						1: 'data'
					};
					result = dataReporterInstance.store(1, 'someData');
				});

				it('returns true as the data has been changed', function () {
					expect(result).toEqual(true);
				});
				it('changes the stored data', function () {
					expect(dataReporterInstance.data).toEqual({
						1: 'someData'
					});
				});
			});

			describe('the id has already been stored and the data we try to store is the same', function () {
				beforeEach(function () {
					dataReporterInstance.data = {
						1: 'data'
					};
					result = dataReporterInstance.store(1, 'data');
				});

				it('returns false as the data was the same and has not changed', function () {
					expect(result).toEqual(false);
				});
				it('the stored data has not changed', function () {
					expect(dataReporterInstance.data).toEqual({
						1: 'data'
					});
				});
			});
		});

		describe('makeRequest', function () {
			beforeEach(function () {
				dataReporterInstance = new DataReporter();
				spyOn(win.console, 'log');

				dataReporterInstance.makeRequest(1, 'data');
				dataReporterInstance.makeRequest(2, 'someData');
			});

			it('calls the console.log using the given parameters', function () {
				expect(win.console.log).toHaveBeenCalledWith('dataCaptured: mapping id: 1 - data: data');
				expect(win.console.log).toHaveBeenCalledWith('dataCaptured: mapping id: 2 - data: someData');
			});
		});

		describe('send', function () {
			beforeEach(function () {
				dataReporterInstance = new DataReporter();
				spyOn(dataReporterInstance, 'store').and.returnValue(true);
				spyOn(dataReporterInstance, 'makeRequest');
			});

			it('calls the store method to get if the value have changed or not', function () {
				dataReporterInstance.send(1, 'data');

				expect(dataReporterInstance.store).toHaveBeenCalledWith(1, 'data');
			});
			it('calls the makeRequest method if the store one returns true', function () {
				dataReporterInstance.send(1, 'data');

				expect(dataReporterInstance.makeRequest).toHaveBeenCalledWith(1, 'data');
			});
			it('does not call the makeRequest method if the store one returns false', function () {
				dataReporterInstance.store.and.returnValue(false);
				dataReporterInstance.send(1, 'data');

				expect(dataReporterInstance.makeRequest).not.toHaveBeenCalledWith(1, 'data');
			});
		});
	});
}(window, classes));