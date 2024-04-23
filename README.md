# ajaxhelper
jQuery AJAX Helper Plugin provides convenient methods for making AJAX requests in jQuery with customizable options and callback functions. It simplifies the process of sending AJAX requests and handling responses.

This plugin consists of two main functions:
- `ajaxFireOnEvent`: Initiates an AJAX request on a specific event for the selected element.
- `ajaxFire`: Initiates an AJAX request on form submission and provides customization options and callbacks.

## Features

- Simplified AJAX request handling.
- Support for customizing AJAX options such as URL, caching, and response handling.
- Callback functions for different stages of the AJAX request (e.g., beforeSend, onSuccess, onError).
- Compatible with forms and other HTML elements.

## Usage

### Loading the Plugin

Make sure you have loaded jQuery before loading this plugin.

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="jquery.ajaxHelper.js"></script>
```
## Using the Plugin

### ajaxFire()
```javascript
$(document).ready(function() {
    $("#form").ajaxFire({
        options: {
            route: "example.com", // URL to send the AJAX request
            cache: true,           // If set to true, allows caching of the AJAX response
            loadHtmlTo: $("#result"), // jQuery element where the HTML response will be loaded
            logEvents: true,       // If true, logs AJAX events to the console
            isEncoded: true,       // If true, uses FormData for serialized form data; otherwise, uses serialize()
            freezeControls: true,  // If true, freezes form controls during AJAX request
            parseJson: true        // If true, parses the response as JSON
        },
        callbacks: {
            onWait: function() {   // Callback function to be executed before the AJAX request is sent
                // Custom code here
            },
            onDone: function(res) { // Callback function to be executed on successful completion of the AJAX request
                // Custom code here
            },
            onError: function() {   // Callback function to be executed if there is an error in the AJAX request
                // Custom code here
            }
        }
    });
});
```

### ajaxFireOnEvent()
```javascript
$(document).ready(function() {
    $("#element").ajaxFireOnEvent({
        data: { key: value },     // Data to be sent in the AJAX request
        options: {
            route: "example.com", // URL to send the AJAX request
            cache: true,           // If set to true, allows caching of the AJAX response
            loadHtmlTo: $("#result"), // jQuery element where the HTML response will be loaded
            logEvents: true        // If true, logs AJAX events to the console
        },
        callbacks: {
            onWait: function() {   // Callback function to be executed before the AJAX request is sent
                // Custom code here
            },
            onDone: function(res) { // Callback function to be executed on successful completion of the AJAX request
                // Custom code here
            },
            onError: function() {   // Callback function to be executed if there is an error in the AJAX request
                // Custom code here
            }
        }
    });
});
```

## Parameters
`data`: Data to be sent in the AJAX request.
`options`: Additional options for configuring the AJAX request.
`callbacks`: Callback functions for different stages of the AJAX request.
