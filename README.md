# jquery.elastictimer
A plugin that adjusts it's ajax polling to the frequency that data is available

Example Usage
```
var elasticTimer = jQuery.elastictimer({minPollTime: 10, maxPollTime: 600, fireEvent: function(){
    console.log('magic event');
}});
```
