#clear

CSS="danta.min.css.tmp"
JS="danta.min.js.tmp"

echo "Building danta"

mkdir lib 2> /dev/null

################################################################################

if [ ! -f lib/bootstrap.min.css ]
    then
        echo "-- Getting bootstrap css"
        wget "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" -qO lib/bootstrap.min.css
fi

if [ ! -f lib/underscore.min.js ]
    then
        echo "-- Getting underscore js"
        wget "http://underscorejs.org/underscore-min.js" -qO lib/underscore.min.js
fi

if [ ! -f lib/zepto.min.js ]
    then
        echo "-- Getting zepto js"
        wget "http://zeptojs.com/zepto.min.js" -qO lib/zepto.min.js
fi

################################################################################

echo "-- Building css"
cat lib/bootstrap.min.css >> $CSS
cat danta.css >> $CSS

echo '"use strict";' >> $JS

echo "-- Building js"
cat lib/underscore.min.js >> $JS
cat lib/zepto.min.js >> $JS

cat danta.js >> $JS
cat adt.js >> $JS
cat cache.js >> $JS
cat config.js >> $JS
cat data.js >> $JS
cat helper.js >> $JS
cat remote.js >> $JS
cat ui.js >> $JS
cat ui/behavior.js >> $JS
cat ui/widget.js >> $JS

if [ "$#" -gt "0" ]
    then
        if [ $1 == "--dev" ]
            then
                mv danta.min.js.tmp danta.min.js
                mv danta.min.css.tmp danta.min.css
                echo "Done"
            else
                rm danta.min.js.tmp -f
                rm danta.min.css.tmp -f
                echo "ERROR, please try again"
        fi
    else
        jsmin < danta.min.js.tmp > danta.min.js
        #jsmin < danta.min.css.tmp > danta.min.css
        cat danta.min.css.tmp > danta.min.css
        rm danta.min.js.tmp -f
        rm danta.min.css.tmp -f
        echo "Done"
fi
