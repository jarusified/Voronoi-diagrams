rm -rf $1/bundle.js $1/bundle.min.js \
    && cp ./base/index.html $1/index.html \
    && ./node_modules/.bin/budo $1/index.js:$1/bundle.js -v -d --live | garnish -v
