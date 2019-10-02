#!/bin/bash

mkdir -p tmp

node index.js config.test.js > tmp/out.txt 2>&1 & 
PID=$!

sleep 0.5

node test.js

kill $PID
