all:

clean:

install:
	sudo systemctl stop joystick-app.service
	sudo rm -rf /usr/lib/marcel-joystick
	sudo mkdir -p /usr/lib/marcel-joystick/
	sudo cp marcel-joystick-app /usr/bin/
	sudo chmod a+x /usr/bin/marcel-joystick-app
	sudo cp -r src /usr/lib/marcel-joystick/
	sudo cp camera-server /usr/lib/marcel-joystick/
	sudo cp joystick-app.service /etc/systemd/system/joystick-app.service
	sudo systemctl daemon-reload
	sudo systemctl restart joystick-app.service
	sudo systemctl enable joystick-app.service
