danta.adt = { /* abstract data type */
    List: { _type: "danta.adt.List",
        _init: function () {
            this._items = [];
        },
        
        is_empty: function () { return this._items.length == 0; },
        empty: function () { this._items.empty(); },
        size: function () { return this._items.length; },
        
        prepend: function (o) { this._items.unshift(o); },
        append: function (o) { this._items.push(o); },
        concat: function (array) { this._items = this._items.concat(array); },
        
        remove: function (i) { this._items.splice(i, 1); },
        
        get: function (i) {
            if(arguments.length == 1) { return this._items[i]; }
            return this._items;
        },
        set: function (i, item) { this._items[i] = item; },
        
        has: function (item) {
            var has = false;
            
            this._items.forEach(function (e) {
                var o1 = JSON.stringify(e);
                var o2 = JSON.stringify(item);
                
                if(o1 === o2) { has = true; }
            });
            
            return has;
        }
    }
};
