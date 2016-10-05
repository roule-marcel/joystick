#!/bin/bash

while true; do
	inotifywait .
	rsync -r . 192.168.1.1:~/joystick
	echo "done"
done
