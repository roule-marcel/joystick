# Marcel Joystick (Server-side)

A server that listen for motor commands from the web to control a Marcel robot.
This server listens for WebSocket connections on port 10000 and forward
motor commands directly via the UART connection to the MCU.

Provides a *joystick* systemd service (automatically launched at startup)

Compile on amd64 and armhf architectures

# Dependencies

* libwebsocket
````bash
sudo apt-get install libwebsockets-dev
````
