#!/bin/bash

mkdir -p tmp

node index.js server config.test.js > tmp/out.txt 2>&1 & 
PID=$!

sleep 0.5

npm run test

kill $PID
