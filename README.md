# HOWTO : Offline test

To test the WebApp without an actual Marcel robot,
do the following :
* open a terminal and launch
````bash
cd ./server
./server
````
* In another terminal launch (NOTE: this requires python to be installed)
````bash
cd ./client
./offline-test
````
* Then, open a web browser and go to http://localhost:8000

In the first terminal (server), you'll see the command that are directly sent to the MCU's tty.
