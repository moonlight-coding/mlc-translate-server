#!/bin/bash

mkdir -p tmp

node index.js config.test.js > tmp/out.txt 2>&1 & 
PID=$!

sleep 0.5

node tests/00-basic.js
node tests/01-versions.js

kill $PID
