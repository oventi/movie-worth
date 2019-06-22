danta.ui = {
    Base: { _type: "danta.ui.Base",
        _behave: null,
        _behaviors: {},
        _attach_behaviors: function () {
            this._behave = this._behave || [];
            
            this._behave.forEach(function (e) {
                var behavior = danta.ui.behavior[e.behavior];
                behavior(this, e.params);
            }, this);
        },
        
        behave: function (behavior, params) {
            this._behave = this._behave || [];
            if(typeof params === "undefined") { params = {}; }
            
            if(behavior in this._behaviors) {
                this._behave.push({ behavior: behavior, params: params });
            }
            else {
                throw this._id + " cannot behave " + behavior;
            }
            
            this.render();
        },
        
        _render: function () {},
        
        hide: function () { this.element.hide(); },
        show: function () { this.element.show(); },
        append: function (o) {
            if(typeof o === "object" && "element" in o) { o = o.element; }
            this.element.append(o);
        },
        
        on: function (ev, fn) { this.element.on(ev, fn); },
        trigger: function (ev) { this.element.trigger(ev); }
    },
    
    /* user ui objects ****************************************************** */
    
    /* ui functions ********************************************************* */
    
    w: function (o, properties) {
        var jo = null;
        var proto = null;
        
        if(typeof properties !== "object") { properties = {}; }
        
        if($.zepto.isZ(o)) { // danta widget from html declaration
            if(o.data("widget") in danta.ui.widget) {
                jo = o;
                proto = danta.ui.widget[o.data("widget")];
            }
        }
        else {
            if(typeof o === "string" && o in danta.ui.widget) { // danta widget from js
                jo = $("<div/>").attr("id", _.uniqueId("widget"));
                jo.data("widget", o);
                proto = danta.ui.widget[o];
            }
            if(typeof o === "object") { // custom widget from js
                jo = $("<div/>").attr("id", _.uniqueId("widget"));
                jo.data("widget", "Custom");
                proto = o;
            }
        }
        
        if(jo === null || jo.length <= 0) {
            console.log(o, properties);
            throw "danta.ui._widget: cannot create widget";
            return false;
        }
        else {
            jo.addClass("widget");
            
            _.extend(properties, jo[0].dataset);
            delete properties["widget"];
        }
        
        return danta.ui._make_widget(jo, proto, properties);
    },
    
    _make_widget: function (jo, proto, properties) { // jo: Zepto/jQuery object
        var o = Object.create(proto);
        
        if(!("_parts" in o)) { o._parts = []; }
        o._parts.push(danta.ui.Base);
        
        _.extend(properties, { element: jo, _is_danta_widget: true });
        var wo = danta.o(o, properties);
        
        /*
         * until Proxy is a standard this functionality is disabled
         */
        /*
        if("_methods" in wo) {
            wo = new Proxy(wo, {
                get: function (proxy, name) {
                    if(name in proxy._methods) {
                        return function () { proxy._methods._get(wo, name, arguments); }
                    }

                    return proxy[name];
                }
            });

        }
        */
        
        if(!("_render" in wo) && !("render" in wo)) {
            var ex = "danta.ui._make_widget: ";
            ex += wo._id + " needs to have a render method";
            
            throw ex;
            return null;
        }
        else {
            if(!("render" in wo)) {
                wo.render = function () {
                    wo.element.empty();
                    wo._render();
                    wo._attach_behaviors();
                }
            }
        }
        
        wo.render();
        
        return wo;
    },
    
    set_layout: function () { /* Using Bootstrap for default layout */
        var container = null;
        var row = null;
        
        container = $("<div />").addClass("container-fluid");
        row = $('<div class="row"></div>');
        
        $("header").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
        
        row.append($("header").detach());
        container.append(row);
        
        row = $('<div class="row"></div>');
        
        /*$("section").each(function (i, card) {
            if(!$(card).hasClass("no_autoload")) {
                i+=1;
                
                // Default stacking of cards:
                //  mobile: one
                //  tablet: two
                //  desktop: four
                
                //$(card).addClass("jumbotron col-xs-12 col-sm-6 col-md-6 col-lg-3");
                
                if(i%2 == 0) { $(card).addClass("m2"); }
                if(i%4 == 0) { $(card).addClass("m4"); }
            }
        });*/
        
        row.append($("section").detach());
        container.append(row);
        
        row = $('<div class="row"></div>');
        
        $("footer").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
        
        row.append($("footer").detach());
        container.append(row);
        
        $("body").append(container);
    },
    
    load_widgets: function () {
        /* 
         * danta.$w.x: access declared widgets html
         * danta.$w(): creates widget
         */
        danta.$w = danta.ui.w;
        
        $("[data-widget]").each(function () {
            danta.$w[$(this).attr("id")] = danta.ui.w($(this));
        });
    }
}
