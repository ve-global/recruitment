# Ve Interactive recruitment JavaScript test

The JavaScript test you are about to start is splitted in 2 different parts:
* The creation of a ProcessMapping class
* The unit testing of your ProcessMapping class

## 1. The creation of a ProcessMapping class

You got an HTML page (index.html) that contains a form and some other information about what is the customer buying.
The goal is to capture all those information and to send them using the SendData class which in this test prints all the captured data to the console.
In order for you to be able to capture and identify all those data, you have been given a "mappings" array (mappings.js) that contains an array of data to be captured.
The data are getting captured using 2 different events:
  * onLoad: capture the data when the page gets loaded.
  * onChange: capture the data when an input has been changed.

Hints:
  * This ProcessMapping class needs to use the mappings array in order to capture the data and use the SendData classe in order to send them.
  * Try not to send data if it is invalid - e.g. when an email is not a valid email
  * The ProcessMapping class can also be using other classes that you would have created.


## 2. The unit testing of your ProcessMapping class:

Use your favorite unit test framework to unit test the class(es) you have created.

Hints:
  * We are using Jasmine