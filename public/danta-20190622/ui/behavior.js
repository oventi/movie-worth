danta.ui.behavior = {
    _get_affected: function (o, b) {
        var selector = o._behaviors[b];
        var affected = null;
        
        if(selector === null) {
            affected = o.element.children().first();
        }
        else {
            affected = $(selector, o.element);
        }
        
        //affected.off();
        
        return affected;
    },
    
    progressable: function (o) {
        if($(".progress", o.element).length <= 0) {
            o.element.addClass("progressable");
            
            o.start_progress = function () { $(".progress", o.element).show(); }
            o.stop_progress  = function () { $(".progress", o.element).hide(); }
            
            var progress_bar = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>');
            o.element.prepend(progress_bar);
        }
    },
    
    typeable: function (o, params) { /* should really fix this, does not make much sense */
        /*
        altGraphKey: false | altKey: false | charCode: 0
        ctrlKey: false | keyCode: 8 | metaKey: false
        shiftKey: false | which: 8
        */
        
        var affected = danta.ui.behavior._get_affected(o, "typeable");
        
        affected.addClass("typeable");
        if(params.delay && params.action) {
            affected.keydown(_.debounce(params.action, params.delay));
        }
        else if(!params.delay && params.action) {
            affected.keydown(params.action);
        }
    },
    
    clickable: function (o, params) {
        var affected = danta.ui.behavior._get_affected(o, "clickable");
        
        affected.addClass("clickable");
        affected.click(function () { params.action($(this)); });
    },
    
    selectable: function (o, params) {
        var affected = danta.ui.behavior._get_affected(o, "selectable");
        var css = { selectable: "selectable", selected: "selectable_selected" };
        
        affected.addClass(css.selectable);
        
        if(params.multiple) {}
        else { /* single select */
            affected.click(function () {
                affected.removeClass(css.selected);
                $(this).addClass(css.selected);
                
                o.selected = $(this);
            });
        }
    }
}
