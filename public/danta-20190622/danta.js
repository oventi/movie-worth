var danta = {
    Base: { _type: "danta.Base",
        _init: function () {}
    },
    
    /* implements multiple inheritance */
    platypus: function (_o) {
        var o = Object.create(_o);
        var pool = {};
        
        if("_parts" in o) {
            o._parts.forEach(function (part) { $.extend(pool, danta.platypus(part)); });
            delete o._parts;
            
            return $.extend(pool, o);
        }
        else {
            return o;
        }
    },
    o: function (_o, properties) {
        var o = Object.create(_o);
        
        if(!("_parts" in o)) { o._parts = []; }
        o._parts.push(danta.Base);
        
        var n = danta.platypus(o);
        if(typeof properties === "object") { $.extend(n, properties); }
        n._is_danta_object = true;
        n._init(n);
        
        if("_parts" in n) {
            delete n._parts; // fix, why is it not being deleted in danta.platypus?
        }
        
        return n;
    },
    
    app: function (app) {
        this.helper.init();
        
        $(document).ready(function () {
            /* setting the layout and loading widgets */
            danta.ui.set_layout();
            danta.ui.load_widgets();
            
            var _app = new app();
            _app.init();
        });
    }
};
