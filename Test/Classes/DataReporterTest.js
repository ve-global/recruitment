(function(win, classes){
  'use strict';

  describe('DataReporter', function () {
    var DataReporter = classes.DataReporter,
      dataReporterInstance;

    describe('constructor', function () {
      beforeEach(function () {
        dataReporterInstance = new DataReporter();
      });

      it('initalizes the stored data object as empty', function () {
        expect(dataReporterInstance.data).toEqual({});
      });
    });

    describe('store', function () {
      var hasBeenStored;

      beforeEach(function () {
        dataReporterInstance = new DataReporter();
      });

      describe('the mapping has never been stored', function () {
        beforeEach(function () {
          dataReporterInstance.data = {};
        });

        it('stores the data in the data object', function () {
          dataReporterInstance.store(1, 'data');

          expect(dataReporterInstance.data).toEqual(jasmine.objectContaining({
            1: 'data'
          }));
        });       
        it('returns that the data has been stored successfully', function () {
          hasBeenStored = dataReporterInstance.store(1, 'data');

          expect(hasBeenStored).toEqual(true);
        });
        it('does not remove the data stored previously', function () {
          dataReporterInstance.data = {
            1: 'data'
          };

          hasBeenStored = dataReporterInstance.store(2, 'more-data');

          expect(dataReporterInstance.data).toEqual(jasmine.objectContaining({
            1: 'data'
          }));
        });
      });

      describe('the id has already been stored so we change the data assigned to it', function () {
        beforeEach(function () {
          dataReporterInstance.data = {
            1: 'data'
          };

        });

        it('changes the stored data', function () {
          dataReporterInstance.store(1, 'new-data');

          expect(dataReporterInstance.data).toEqual({
            1: 'new-data'
          });
        });
        it('returns that the data has been stored successfully', function () {
          hasBeenStored = dataReporterInstance.store(1, 'new-data');
          
          expect(hasBeenStored).toEqual(true);
        });
      });

      describe('the id has already been stored and the data we try to store is the same', function () {
        beforeEach(function () {
          dataReporterInstance.data = {
            1: 'data'
          };
        });

        it('does not change the stored data', function () {
          dataReporterInstance.store(1, 'data');
          
          expect(dataReporterInstance.data[1]).toEqual('data');
        });
        it('returns that the data was the same and has not been stored', function () {
          hasBeenStored = dataReporterInstance.store(1, 'data');

          expect(hasBeenStored).toEqual(false);
        });
      });
    });

    describe('makeRequest', function () {
      beforeEach(function () {
        dataReporterInstance = new DataReporter();
        spyOn(win.console, 'log');
      });

      it('logs that the data has been sent to the server', function () {
        dataReporterInstance.makeRequest(1, 'data');

        expect(win.console.log).toHaveBeenCalledWith('dataCaptured: mapping id: 1 - data: data');
      });
    });

    describe('send', function () {
      beforeEach(function () {
        dataReporterInstance = new DataReporter();
        spyOn(dataReporterInstance, 'store');
        spyOn(dataReporterInstance, 'makeRequest');
      });

      it('stores the captured value in memory', function () {
        dataReporterInstance.send(1, 'data');

        expect(dataReporterInstance.store).toHaveBeenCalledWith(1, 'data');
      });
      it('does the request to the server if the value has changed', function () {
        dataReporterInstance.store.and.returnValue(true);

        dataReporterInstance.send(1, 'data');

        expect(dataReporterInstance.makeRequest).toHaveBeenCalledWith(1, 'data');
      });
      it('does not do the request to the server if the value has not changed', function () {
        dataReporterInstance.store.and.returnValue(false);
        
        dataReporterInstance.send(1, 'data');

        expect(dataReporterInstance.makeRequest).not.toHaveBeenCalled();
      });
    });
  });
}(window, classes));