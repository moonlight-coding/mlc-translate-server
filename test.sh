#!/bin/bash

mkdir -p tmp

rm -f context/db.test.sqlite3

node index.js server config.test.js > tmp/out.txt 2>&1 & 
PID=$!

sleep 0.5

npm run test

kill $PID
