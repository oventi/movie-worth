danta.ui.widget = {
    Group: { _type: "danta.ui.widget.Group",
        render: function () {
            var items = this.element.children();
            var width = 100 / items.length;
            
            items.css("width", width + "%");
        }
    },
    
    Label: { _type: "danta.ui.widget.Label",
        text: "",
        
        _render: function () {
            if(String(this.text) !== "") {
                var span = $('<span class="label label-default">');
                this.element.append(span.text(this.text));
            }
        }
    },
    
    Textbox: { _type: "danta.ui.widget.Textbox",
        _behaviors: { typeable: "input", progressable: null },
        
        blur: function () { $("input", this.element).blur(); },
        clear: function () { $("input", this.element).val(""); },
        value: function () { return $("input", this.element).val(); },
        
        _render: function () {
            var label = this.label || "";
            var textbox = $('<input type="text" />').addClass("form-control");
            textbox.attr("placeholder", label);
            
            this.element.append(textbox);
        }
    },
    
    Button: { _type: "danta.ui.widget.Button",
        _behaviors: { progressable: null },
        
        click: function (fn) {
            $("button", this.element).off();
            $("button", this.element).click(fn);
        },
        
        _render: function () {
            var button = $("<button />").addClass("btn btn-default");
            
            if(!this.icon) {
                button.text(this.label);
            }
            else {
                var icon = $('<span class="glyphicon"></span>');
                icon.addClass("glyphicon-" + this.icon);
                button.append(icon);
            }
            
            this.element.append(button);
        }
    },
    
    List: { _type: "danta.ui.widget.List",
        _parts: [danta.adt.List],
        store: null,
        type: null,
        
        /*_methods: {
            append: function (o, list) { list._items.push(o); },
            concat: function (array, list) { list._items = list._items.concat(array); },
            remove: function (i, list) { list._items.splice(i, 1); },
            
            _get: function (o, method, args) {
                o._methods[method](args[0], o);
                o.render();
            }
        },*/
        
        append: function (o) {
            this._items.push(o);
            this.trigger("change");
        },
        concat: function (array) { 
            this._items = this._items.concat(array); 
            this.trigger("change");
        },
        remove: function (i) {
            this._items.splice(i, 1);
            this.trigger("change");
        },
        
        _behaviors: { clickable: "ul > li", selectable: "ul > li" },
        _init: function () {
            this._items = []; // code repetition from danta.adt.List
            var that = this;
            
            if(this.store !== null) {
                this.store = danta.o(danta.data.Store, { id: this.store });
                
                this.store.find().forEach(function (o) {
                    if(this.type) {
                        var proto = eval(this.type);
                        var item = danta.ui.w(proto, o);
                        this._items.push(item);
                    }
                    else {
                        this._items.push(o);
                    }
                }, this);
            }
            
            this.on("change", function () {
                that.render();
                if(that.store !== null) {
                    that.store.remove({});
                    that.get().forEach(function (e) { that.store.insert(e); });
                }
            });
        },
        
        /* ****************************************************************** */
        
        _items: null,
        
        _render: function () {
            if(!this.is_empty()) {
                var ul = $("<ul />").addClass("list-unstyled list-group");
                
                this._items.forEach(function (e) {
                    var item = $("<li />").addClass("list-group-item");
                    
                    if(typeof e === "object" && "render" in e) {
                        e.render();
                        item.append(e.element);
                    }
                    else { item.append(danta.helper.string(e)); }
                    
                    ul.append(item);
                });
                
                this.element.append(ul);
            }
        }
    },
    
    Alert: {
        message: "",
        type: "",
        first_render: true,
        
        display: function (_message, _type) {
            this.message = _message || "";
            this.type = _type || "info";
            
            this.render();
        },
        
        _init: function () {
            this.hide();
        },
        
        render: function () {
            this.element.empty();
            
            var msg = $("<div />").addClass("alert alert-" + this.type).text(this.message);
            this.element.append(msg);
            
            if(!this.first_render) { this.show(); }
            this.first_render = false;
        }
    },
    
    /* ********************************************************************** */
    /* ********************************************************************** */
    
    Textbox2: {
        value: function () {
            return $("input", this.element).val();
        },

        render: function () {
            var label = this.label || "";
            var textbox = $('<input type="text" />').addClass("form-control");
            //textbox.attr("placeholder", label);

            this.element.addClass("form-horizontal");
            this.element.empty();
            this.element.append($("<label />").addClass("col-sm-2 control-label").text(label));
            this.element.append(textbox);
            this._attach_behaviors();
        }
    },
    
    Buttons: {
        actions: {},
        render: function () {
            var o = this;

            o.element.addClass("btn-group");

            $("#" + o.id).find("button").each(function () {
                $(this).addClass("btn btn-default");

                var id = $(this).text().replace(" ", "_");
                if(typeof o.actions[id] === "function") {
                    $(this).click(o.actions[id]);
                }
            });

            //this._attach_behaviors();
        }
    },
    
    ListOld: {
        _behaviors: {
            Clickable: function (w) {
                return {
                    collection: $("ul > li", w.element)
                };
            },
            Selectable: function (w) {
                w.selected_index = -1;
                w.get_selected = function () { return null; };

                return {
                    collection: $("ul > li", w.element),
                    action: function (params) {
                        if(params.multiple) {}
                        else {
                            var index = $("ul > li.behavior_Selectable_selected", w.element).index();
                            w.selected_index = index;
                            w.get_selected = function () {
                                return w._list[w.selected_index];
                            }
                        }
                    }
                };
            }
        }
    },
    
    View: { _type: "danta.ui.widget.View",
        _behaviors: { progressable: null },
        _data: null,

        load: function (data) {
            this._data = data;
            this.render();
        },
        
        hide: function (only_container) { 
            var e = only_container ? $(".container", this.element) : this.element;
            e.hide();
        },
        show: function (only_container) { 
            var e = only_container ? $(".container", this.element) : this.element;
            e.show();
        },

        render: function () {
            var e = this.element;
            if(this._data) {
                for(var i in this._data) {
                    $("#" + i, e).text(this._data[i]);
                }
            }

            this._attach_behaviors();
        }
    }   
}
