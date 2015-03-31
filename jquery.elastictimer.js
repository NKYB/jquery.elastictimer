/*!
 * jQuery.ElasticTimer v1.0.0
 * A plugin that adjusts it's ajax polling to the frequeuncy that data is 
 * available
 *
 * Author: ApplyContext.com
 * 
 * Example Usage
 * 
 *       var elasticTimer = jQuery.elastictimer({minPollTime: 10, maxPollTime: 600, fireEvent: function(){
 *               console.log('magic event');
 *       }});
 */

;(function ( $, window, document, console, undefined ) {
    var pluginName = "elastictimer";
    
    if(typeof(console) === 'undefined') {
        var console = {}
        console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
    }

    function Plugin( element, options, pluginName ) {
        this._interval = 10;
        this.timer = {};
        var defaults = {
            debug: false,
            debugSelector: null,
            minPollTime: 10, //seconds
            maxPollTime: 60, //seconds
            fireEvent: function(){}
        };
        this.options = $.extend(defaults, options);
        
        $.proxy(this._init(),this);
        return this;
    }
    
    Plugin.prototype = {
        _init: function(){
            this._debug('init');
            this._interval = this.options.minPollTime;
        },
        start: function(){
            this._debug('start interval:' + this._secondsT0Milliseconds(this._interval));
            this.timer = setInterval($.proxy(this._event, this), this._secondsT0Milliseconds(this._interval));
            return this;
        },
        stop: function(){
            this._debug('stop');
            window.clearInterval(this.timer);
            return this;
        },
        pause: function(){
            this._debug('pause');
            this.stop();
            return this;
        },
        trigger: function(){
            this._debug('trigger');
            this._event();
            this.stop();
            this.start();
            return this;
        },
        adjustFreq: function(dataFoundFlag){
            if (dataFoundFlag){
                this._interval = parseInt(this._interval / 2);
                if (this._interval < this.options.minPollTime)
                    this._interval = this.options.minPollTime;
            } else {
                this._interval = this._interval * 2;
                if (this._interval > this.options.maxPollTime)
                    this._interval = this.options.maxPollTime;
            }
            this.stop();
            this.start();
            this._debug('adjustFreq interval:' + this._interval);
        },
        _event: function(){
            this._debug('event');
            this.adjustFreq(this.options.fireEvent());
        },
        _debug: function(msg){
            if (this.options.debug){
                console.log(msg);
                if (this.options.debugSelector)
                    $(this.options.debugSelector).html(Date.now() + ': ' + msg + '<br >' + $(this.options.debugSelector).html());
            }
        },
        _secondsT0Milliseconds: function(seconds){
            return seconds * 1000;
        }
    };

    $.fn[pluginName] = function ( options ) {
        return new Plugin( this, options, pluginName );
    };
})( jQuery, window, document, console );