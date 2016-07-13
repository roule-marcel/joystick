all:

clean:

install:
	sudo mkdir -p /usr/lib/marcel-joystick
	sudo cp marcel-joystick-app /usr/bin/
	sudo chmod a+x /usr/bin/marcel-joystick-app
	sudo cp *.html /usr/lib/marcel-joystick/
	sudo cp joystick-app.service /etc/systemd/system/joystick-app.service
	sudo systemctl restart joystick-app.service
