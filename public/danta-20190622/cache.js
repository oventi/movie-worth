danta.cache = {
    _stack: {},
    
    get: function (key) {
        if(danta.cache._stack[key]) {
            return danta.cache._stack[key];
        }
    },
    
    set: function (key, value) {
        danta.cache._stack[key] = value;
    }
};
