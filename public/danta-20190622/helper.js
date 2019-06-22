danta.helper = {
    Math: {
        get_random_int: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    
    Array: { // http://stackoverflow.com/a/10142256
        shuffle: function () {
            for(
                var j, x, i = this.length; i;
                j = Math.floor(Math.random() * i),
                x = this[--i], this[i] = this[j], this[j] = x
            );
            
            return this;
        },
        
        empty: function() {
            while (this.length > 0) { this.pop(); }
        }
    },
    
    string: function (o) {
        if(typeof o === "object" && !("toString" in o)) {
            return JSON.stringify(o);
        }
        
        return String(o);
    },
    
    init: function () {
        $.extend(Array.prototype, danta.helper.Array);
        $.extend(Math, danta.helper.Math);
    }
}
