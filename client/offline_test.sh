#!/bin/bash

cd ./src
echo "Now, browse to http://localhost:8000"
python -m SimpleHTTPServer 8000 > /dev/null
