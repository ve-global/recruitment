# Ve Interactive recruitment JavaScript test

The goal of this test is to capture data present on a page in order to report them to an API.

In order to do that, the test you are about to start is split in 2 different parts:
  1. Programming
  2. Unit testing


----- package.json with npm install

## 1. Programming

You got an HTML page (*index.html*) that contains a form and some other information about what is the customer buying.
The goal is to capture all those information and to send them using the DataReporter class which in this test prints all the captured data in the console.
In order for you to be able to capture and identify all those data, you have been given a "mappings" array (*mappings.js*) that contains an array of data to be captured.

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
	* ***text:*** relate to the innerText of your element - e.g. your element: <div>example</div>, you would get: "example".
	* ***value:*** relate to the value of your element - e.g. your element: <input type="text" value="my value" />, you would get: "my value".
	* ***radio:*** relate to the value of the selected radio button.
	* ***checkbox:*** if your checkbox is checked, it must return 'Checked', 'Unchecked' otherwise.
* **event:** Specifies when you will be capturing the data you need  
	* ***onLoad:*** When the page is loaded
	* ***onChange:*** When the DOM element will have changed
* **isEmail:** If this value is true, the value should only get stored/send when the captured value is a valid email.
* **isPhoneNumber:** If this value is true, the value should only get stored/send when the captured value is a valid UK phone number.


## 2. Unit testing

Use your favorite unit test framework to unit test the class(es) you have created.

Hints:
  * We are using Jasmine