all: server

install: server
	sudo systemctl stop joystick.service
	sudo cp server /usr/bin/marcel-joystick-server
	sudo cp marcel-joystick /usr/bin/marcel-joystick
	sudo cp joystick.service /etc/systemd/system/
	sudo chmod a+x /usr/bin/marcel*
	sudo chmod a+rx /etc/systemd/system/joystick.service
	sudo chown root /etc/systemd/system/joystick.service
	sudo systemctl daemon-reload
	sudo systemctl restart joystick.service
	sudo systemctl enable joystick.service

clean:
	@rm -rf bin

server: bin/server.o
	g++ -std=c++11 -g -DDEBUG -o $@ $< -pthread -lwebsockets -lpubsub

bin/%.o: src/%.cpp src/*.h
	@mkdir -p bin
	g++ -std=c++11 -g -DDEBUG -c -o $@ $<
