# Ve Interactive recruitment JavaScript test

The goal of this test is to capture data present on a page in order to report them to an API.

In order to do that, the test you are about to start is split in 2 different parts:
  1. Programming
  2. Unit testing

## 1. Programming

You have an HTML page (*index.html*) which contains a form and some information about what the customer is buying. The goal is to capture all of that information and to send it using the *DataReporter* class. In this test the *DataReporter* class prints all the captured data in the console.


You will find all information related to the *DataReporter* class in available code.

In order for you to be able to capture and identify all those pieces of data, you have been given a 'mappings' array (*mappings.js*) that contains information on how to capture them.

e.g. Let's take the mapping 1:
```javascript
{
    id: 1,
    selector: '#email',
    attribute: 'value',
    event: 'onChange',
    isEmail: true,
    isPhoneNumber: false
}
```
* **id:** The id is the identifier of the data you will be capturing. It will help you not to send the same data over and over again if it didn't chage + it will allow the Back-end to identify what data you are sending.
* **selector:** A css selector helping you getting the DOM element you need data from.
* **attribute:** The attributes relate to the type of data you will have to get from your DOM element.
	* ***text:*** relate to the innerText of your element - e.g. your element: *&lt;div&gt;example&lt;/div&gt;*, you would get: '*example*'.
	* ***value:*** relate to the value of your element - e.g. your element: *&lt;input type="text" value="my value" /&gt;*, you would get: '*my value*'.
	* ***radio:*** relate to the value of the selected radio button.
	* ***checkbox:*** if your checkbox is checked, it should return '*Checked*', otherwise it should return '*Unchecked*'.
* **event:** Specifies when you will be capturing the data you need  
	* ***onLoad:*** When the page is loaded
	* ***onChange:*** When the DOM element will have changed
* **isEmail:** If this value is true, the captured value should only get stored/send when it is a valid email.
* **isPhoneNumber:** If this value is true, the captured value should only get stored/send when it is a valid UK phone number.


## 2. Unit testing

You are to unit test the JavaScript code you have written.

You can use *Jasmine* framework to do that.
Example of unit tests for the *DataReporter* can be found in *Test* folder.
You need *node.js* installed to perform tests.
You can use *npm install* command to install required packages that will run tests. The command should be executed in the command prompt in the directory with the *package.json*.
After that you have to add created files in *karma.conf.js* and run *karma start* command in your project folder. Once you do that follow the instruction seen on terminal.
